import { AccessProvider, SSOExpiredError } from "../ports/accessProvider";
import { ConfigManager } from "../ports/configManager";
import {
  ListAccountRolesCommand,
  ListAccountsCommand,
  SSOClient,
} from "@aws-sdk/client-sso";
import { Browser, SsoAuthoriser, uniq } from "cloudcanvas-aws-sso-api";
import {
  Access,
  Account,
  InvalidConfigurationError,
  Organisation,
  PermissionSet,
  AwsRegion,
  SSOSession,
  AccessPair,
} from "cloudcanvas-types";
import "isomorphic-fetch";

type Config = {
  cachedFile?: string;
  configFile?: string;
  ssoSessionFolder?: string;
};

type Ports = {
  authoriser: SsoAuthoriser;
  configManager: ConfigManager;
  browser: Browser;
};

const fetchAllAccountsAndRoles = async (session: SSOSession) => {
  const sso = new SSOClient({
    region: session.region,
  });

  const accountsResponses = await sso.send(
    new ListAccountsCommand({
      accessToken: session.accessToken,
    })
  );

  const accounts: Account[] = (accountsResponses.accountList || []).map(
    (a) => ({
      accountId: a.accountId!,
      name: a.accountName,
      defaultRegion: session.region,
      roles: [],
    })
  );

  const roles = await Promise.all(
    accounts
      .filter((a) => !!a.accountId)
      .map((a) =>
        sso.send(
          new ListAccountRolesCommand({
            accountId: a.accountId!,
            accessToken: session.accessToken,
          })
        )
      )
  );

  const accountRoles: PermissionSet[] = roles
    .map((r) => r.roleList || [])
    .flatMap((roleList) =>
      roleList.map((role) => ({
        name: role.roleName!,
        accountId: role.accountId!,
      }))
    )
    .filter((r) => !!r);

  const accountsWithRoles: Account[] = accounts.map((a) => ({
    ...a,
    roles: accountRoles
      .filter((x) => x.accountId === a.accountId)
      .map((x) => x.name),
  }));

  return {
    accounts: accountsWithRoles,
    roles: uniq(
      accountsWithRoles.flatMap((r) => r.name).filter((r) => !!r) as string[]
    ),
  };
};

export const makeSsoAccessProvider = ({
  authoriser,
  cachedFile,
  configFile,
  configManager,
  browser,
}: Ports & Config): AccessProvider => {
  let accessScope: Access = { organisations: [] };

  const updateAccessScope = async (scope: Access): Promise<Access> => {
    accessScope = scope;
    await configManager.writeAccessCacheFile(accessScope);

    return scope;
  };

  const refreshOrgs = async (): Promise<Access> => {
    // Fetch orgs from Cloud Canvas cache file
    const cachedOrgs = await configManager.readAccessCacheFile(cachedFile);

    // Fetch orgs from ~/.aws/config
    const awsConfigOrgs = await configManager.readYamlConfigFile(configFile);

    // And any new orgs
    const missingOrgs = awsConfigOrgs.organisations.filter(
      (s) =>
        !cachedOrgs.organisations.some((c) => c.ssoStartUrl === s.ssoStartUrl)
    );

    const blendedCacheAndConfigScope = [
      ...cachedOrgs.organisations,
      ...missingOrgs,
    ];

    return {
      organisations: blendedCacheAndConfigScope,
    };
  };

  const refreshOrg = async (org: Organisation) => {
    const federatedAccess = await authoriser.getFederatedAccessToken(
      org.ssoStartUrl,
      org.ssoRegion,
      false
    );

    const details = await fetchAllAccountsAndRoles(federatedAccess);

    const updatedOrg: Organisation = {
      ...org,
      roles: details.roles,
      accounts: details.accounts,
      accountsSyncedAtIso: new Date().toISOString(),
    };

    const newAccess = accessScope.organisations.map((o) => {
      if (o.ssoStartUrl === org.ssoStartUrl) {
        return {
          authorisedUntil: federatedAccess.expiresAt,
          ...updatedOrg,
        };
      }

      return o;
    });

    return {
      updatedOrg,
      access: await updateAccessScope({
        organisations: newAccess,
      }),
    };
  };

  const getAccess = async (access: AccessPair) => {
    const authOrg = accessScope?.organisations.find((o) =>
      o.accounts.some((a) => a.accountId === access?.accountId)
    );

    if (!access?.permissionSet || !access?.accountId || !authOrg) {
      throw new InvalidConfigurationError(
        `Invalid AWS Configuration. Account: ${access?.accountId}, Role: ${access?.permissionSet}.`
      );
    }

    /**
     * The authoriser should manage caching these so we always call and let it handle that complexity.
     */
    const federatedAccess = await authoriser.getFederatedAccessTokenIfExists(
      authOrg.ssoStartUrl
    );

    if (!federatedAccess) {
      throw new SSOExpiredError("SSO credentials have expired.");
    }

    const accountAccess = await authoriser.getAccountAccessToken(
      federatedAccess,
      {
        accountId: access?.accountId,
        permissionSet: access?.permissionSet,
      }
    );

    return {
      accountAccess,
      authOrg,
      expiration: federatedAccess.expiresAt,
    };
  };

  return {
    init: async () => {
      // Ensure we have the latest access scope and an authoriser with the latest sessions
      const [orgs, sessions] = await Promise.all([
        refreshOrgs(),
        authoriser.init(),
      ]);

      const withSessionData = orgs.organisations.map((o) => {
        const matchingSession = sessions?.find(
          (s) => s.startUrl === o.ssoStartUrl
        );
        if (matchingSession) {
          return { ...o, authorisedUntil: matchingSession.expiresAt };
        }

        return o;
      });

      return updateAccessScope({
        organisations: withSessionData,
      });
    },
    addOrganisation: async (org) => {
      const withoutLogicallyDeleted = accessScope.organisations.filter(
        (o) => !o.logicallyDeleted
      );

      if (
        withoutLogicallyDeleted.some((o) => o.ssoStartUrl === org.ssoStartUrl)
      ) {
        // nothing to do, already added
        return accessScope;
      }

      const updatedAccessScope: Access = {
        organisations: [...withoutLogicallyDeleted, org],
      };

      return updateAccessScope(updatedAccessScope);
    },
    deleteOrganisation: async (ssoStartUrl) => {
      const newAccess = accessScope.organisations.map((o) => {
        if (o.ssoStartUrl === ssoStartUrl) {
          return {
            ...o,
            logicallyDeleted: true,
          };
        }

        return o;
      });

      const updatedAccessScope = { organisations: newAccess };

      return updateAccessScope(updatedAccessScope);
    },
    access: async () => {
      return accessScope!;
    },
    authorise: async (access) => {
      const { accountAccess, authOrg, expiration } = await getAccess(access);

      const defaultRegion = (authOrg.accounts.find(
        (a) => a.accountId === access.accountId
      )!.defaultRegion || authOrg.ssoRegion) as AwsRegion;

      await updateAccessScope({
        organisations: accessScope.organisations.map((o) => {
          if (o.ssoStartUrl === authOrg.ssoStartUrl) {
            return { ...o, authorisedUntil: expiration };
          }

          return o;
        }),
      });

      return {
        credentials: accountAccess,
        defaultRegion,
      };
    },
    lightAuthorise: async (access) => {
      const { accountAccess, authOrg } = await getAccess(access);

      const defaultRegion = (authOrg.accounts.find(
        (a) => a.accountId === access?.accountId
      )!.defaultRegion || authOrg.ssoRegion) as AwsRegion;

      return {
        credentials: accountAccess,
        defaultRegion,
      };
    },
    authoriseOrg: async (ssoUrl) => {
      let authOrg = accessScope?.organisations.find(
        (o) => o.ssoStartUrl === ssoUrl
      );

      if (!authOrg) {
        throw new InvalidConfigurationError(
          `Invalid AWS Configuration. No org for url: ${authOrg}.`
        );
      }

      // Ensure we have a valid session
      const federatedAccess = await authoriser.getFederatedAccessToken(
        authOrg.ssoStartUrl,
        authOrg.ssoRegion,
        false
      );

      if (!federatedAccess) {
        throw new SSOExpiredError("SSO credentials have expired.");
      }

      await updateAccessScope({
        organisations: accessScope.organisations.map((o) => {
          if (o.ssoStartUrl === authOrg?.ssoStartUrl) {
            return { ...o, authorisedUntil: federatedAccess.expiresAt };
          }

          return o;
        }),
      });

      // If we've already sync'ed accounts do not do it again.
      if (authOrg.accountsSyncedAtIso) {
        console.info(`Already sync'ed accounts so skipping`);
        return accessScope;
      } else {
        console.info(`SYNCING ACCOUNT`);
      }

      const { access } = await refreshOrg(authOrg);

      return access;
    },
    refreshOrg: async (ssoUrl) => {
      let authOrg = accessScope?.organisations.find(
        (o) => o.ssoStartUrl === ssoUrl
      );

      if (!authOrg) {
        throw new InvalidConfigurationError(
          `Invalid AWS Configuration. No org for url: ${authOrg}.`
        );
      }

      const { access } = await refreshOrg(authOrg);

      return access;
    },
    provideNickname: async (nickname, ssoStartUrl) => {
      const updatedOrgs = accessScope.organisations.map((o) => {
        if (o.ssoStartUrl === ssoStartUrl) {
          return {
            ...o,
            nickname: nickname,
          };
        }

        return o;
      });

      return updateAccessScope({ organisations: updatedOrgs });
    },
    navigateTo: async (destUrl, access) => {
      const { accountAccess } = await getAccess(access);

      const accessObj = {
        sessionId: accountAccess.accessKeyId,
        sessionKey: accountAccess.secretAccessKey,
        sessionToken: accountAccess.sessionToken,
      };

      const session = encodeURIComponent(JSON.stringify(accessObj));

      const result = await fetch(
        `https://signin.aws.amazon.com/federation?Action=getSigninToken&Session=${session}`
      ).then((x) => x.json());

      const dest = encodeURIComponent(destUrl);

      console.log("result.SigninToken");
      console.log(result.SigninToken);

      const loginUrl = `https://signin.aws.amazon.com/federation?Action=login&Destination=${dest}&Issuer=&SigninToken=${result.SigninToken}`;
      // const logoutAndLoginUrl = `https://signin.aws.amazon.com/federation?Action=logout&redirect_uri=${encodeURIComponent(
      //   loginUrl
      // )}&Issuer=&SigninToken=${result.SigninToken}`;
      const logoutAndLoginUrl = `https://signin.aws.amazon.com/federation?Action=logout`;

      browser.open(logoutAndLoginUrl);
    },
  };
};

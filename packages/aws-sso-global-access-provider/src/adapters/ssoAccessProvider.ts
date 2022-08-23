import {
  ListAccountRolesCommand,
  ListAccountsCommand,
  SSOClient,
} from "@aws-sdk/client-sso";
import {
  AwsRegion,
  SsoAuthoriser,
  SSOSession,
  uniq,
} from "@cloudcanvas/aws-sso-api";
import {
  Access,
  Account,
  InvalidConfigurationError,
  Organisation,
  PermissionSet,
} from "../domain/aws";
import { AccessProvider, SSOExpiredError } from "../ports/accessProvider";
import { ConfigManager } from "../ports/configManager";

type Config = {
  cachedFile?: string;
  configFile?: string;
  ssoSessionFolder?: string;
};

type Ports = {
  authoriser: SsoAuthoriser;
  configManager: ConfigManager;
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
}: Ports & Config): AccessProvider => {
  let accessScope: Access = { organisations: [] };

  const updateAccessScope = async (scope: Access): Promise<Access> => {
    accessScope = scope;
    await configManager.writeAccessCacheFile(accessScope);

    return scope;
  };

  const refreshOrgs = async (): Promise<Access> => {
    const cachedOrgs = await configManager.readAccessCacheFile(cachedFile);
    const awsConfigOrgs = await configManager.readYamlConfigFile(configFile);

    // Ensure we pickup any new additions to the config file
    const withNewDataAdded = cachedOrgs.organisations.map((cachedOrg) => {
      // Pickup the org in credentials if it has not been deleted.
      const matchingOrg = awsConfigOrgs.organisations.find(
        (s) =>
          s.ssoStartUrl === cachedOrg.ssoStartUrl && !cachedOrg.logicallyDeleted
      );

      // The ones that are in matching org not in cachedOrg
      const missingRoles = (matchingOrg?.roles || []).filter(
        (r) => !cachedOrg.roles.some((x) => x === r)
      );
      const missingAccs = (matchingOrg?.accounts || []).filter(
        (r) => !cachedOrg.accounts.some((x) => x.name === r.name)
      );

      const newAccounts = [...cachedOrg.accounts, ...missingAccs];
      const uniqueAccounts = newAccounts.reduce((sum, acc) => {
        // If no entry for this accountId add it
        if (!sum[acc.accountId]) {
          sum[acc.accountId] = acc;
          return sum;
        } else if (acc.name) {
          // If one exists already only add if there is a name for it
          sum[acc.accountId] = acc;
        }

        return sum;
      }, {} as { [key: string]: Account });

      return {
        ...cachedOrg,
        accounts: Object.values(uniqueAccounts),
        roles: [...cachedOrg.roles, ...missingRoles],
      } as Organisation;
    });

    // And any new orgs
    const missingOrgs = awsConfigOrgs.organisations.filter(
      (s) =>
        !cachedOrgs.organisations.some((c) => c.ssoStartUrl === s.ssoStartUrl)
    );

    const blendedCacheAndConfigScope = [...withNewDataAdded, ...missingOrgs];

    return {
      organisations: blendedCacheAndConfigScope,
    };
  };

  const refreshOrg = async (org: Organisation) => {
    const federatedAccess = await authoriser.getFederatedAccessToken(
      org.ssoStartUrl,
      org.ssoRegion
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
      const authOrg = accessScope?.organisations.find((o) =>
        o.accounts.some((a) => a.accountId === access.accountId)
      );

      if (!authOrg) {
        throw new InvalidConfigurationError(
          `Invalid AWS Configuration. Account: ${access.accountId}, Role: ${access.permissionSet}.`
        );
      }

      /**
       * The authoriser should manage caching these so we always call and let it handle that complexity.
       */
      const federatedAccess = await authoriser.getFederatedAccessToken(
        authOrg.ssoStartUrl,
        authOrg.ssoRegion
      );

      const accountAccess = await authoriser.getAccountAccessToken(
        federatedAccess,
        {
          accountId: access.accountId,
          permissionSet: access.permissionSet,
        }
      );

      const defaultRegion = (authOrg.accounts.find(
        (a) => a.accountId === access.accountId
      )!.defaultRegion || authOrg.ssoRegion) as AwsRegion;

      await updateAccessScope({
        organisations: accessScope.organisations.map((o) => {
          if (o.ssoStartUrl === authOrg.ssoStartUrl) {
            return { ...o, authorisedUntil: federatedAccess.expiresAt };
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
        authOrg.ssoRegion
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
  };
};

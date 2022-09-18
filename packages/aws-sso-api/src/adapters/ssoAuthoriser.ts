import { GetRoleCredentialsCommand, SSOClient } from "@aws-sdk/client-sso";
import {
  CreateTokenCommand,
  CreateTokenCommandOutput,
  RegisterClientCommand,
  SSOOIDCClient,
  StartDeviceAuthorizationCommand,
} from "@aws-sdk/client-sso-oidc";
import { AccessPair, AWSCredentials, SSOSession } from "@cloudcanvas/types";
import { Browser } from "../ports/browser";
import { ConfigManager } from "../ports/configManager";
import { SsoAuthoriser } from "../ports/ssoAuthoriser";

type Ports = {
  configManager: ConfigManager;
  browser: Browser;
};

/**
 * Used to fetch tokens
 *
 * @param ports
 * @returns
 */
export const makeSsoAuthoriser = (ports: Ports): SsoAuthoriser => {
  let accountAccessDict: {
    [accountAndRole: string]: undefined | Promise<AWSCredentials>;
  } = {};

  let federatedAccessDict: {
    [federatedUrl: string]: undefined | Promise<SSOSession>;
  } = {};

  const sessionIsValid = (access: SSOSession): boolean => {
    return access.expiresAt.getTime() > Date.now();
  };

  const credentialIsValid = (credentials: AWSCredentials): boolean => {
    return (
      !!credentials?.expiration && credentials.expiration.getTime() > Date.now()
    );
  };

  return {
    init: async () => {
      const ssoSessions = await ports.configManager.readSessionJson();

      const validSessions = ssoSessions.filter((s) => sessionIsValid(s));

      for (const session of validSessions) {
        federatedAccessDict[session.startUrl] = Promise.resolve(session);
      }

      return validSessions;
    },
    getFederatedAccessTokenIfExists: async (federatedUrl) => {
      const existing = federatedAccessDict[federatedUrl];

      if (existing !== undefined && sessionIsValid(await existing)) {
        return existing;
      } else {
        return undefined;
      }
    },
    getFederatedAccessToken: async (federatedUrl, region, force) => {
      // Don't think I need this
      // if (force) {
      //   federatedAccessDict[federatedUrl] = undefined;
      // }

      const existing = federatedAccessDict[federatedUrl];

      if (existing !== undefined && sessionIsValid(await existing)) {
        return existing;
      }

      // Handle the case of multiple calls by populating with promise and awaiting it
      federatedAccessDict[federatedUrl] = fetchFederatedAccessToken(
        federatedUrl,
        region,
        ports.browser
      ).then(async (x) => {
        // Ensure session is cached
        ports.configManager.writeSsoSessionFile({
          accessToken: x.accessToken,
          expiresAt: x.expiresAt,
          region: region,
          startUrl: federatedUrl,
        });

        return x;
      });

      const access = await federatedAccessDict[federatedUrl];

      return access!;
    },
    getAccountAccessToken: async (session, accessPair) => {
      const key = `${accessPair.accountId}/${accessPair.permissionSet}`;
      const existing = accountAccessDict[key];

      if (existing !== undefined && credentialIsValid(await existing)) {
        return existing;
      } else {
        console.info("no existing account session");
      }

      // Handle the case of multiple calls by populating with promise and awaiting it
      accountAccessDict[key] = fetchAccountCredentials(
        session,
        accessPair
      ).then(async (x) => {
        return x;
      });

      const access = await accountAccessDict[key];

      return access!;
    },
  };
};

const fetchFederatedAccessToken = async (
  federatedUrl: string,
  region: string,
  browser: Browser
): Promise<SSOSession> => {
  const ssoOidcClient = new SSOOIDCClient({
    region: region,
  });

  const client = await ssoOidcClient.send(
    new RegisterClientCommand({
      clientName: "easy",
      clientType: "public",
    })
  );

  const authorization = await ssoOidcClient.send(
    new StartDeviceAuthorizationCommand({
      clientId: client.clientId!,
      clientSecret: client.clientSecret,
      startUrl: federatedUrl,
    })
  );

  await browser.open(authorization.verificationUriComplete!);

  let token: CreateTokenCommandOutput | undefined = undefined;

  // const expiresIn = +new Date() + (authorization.expiresIn || 30) * 1000;
  // We limit to 90 seconds instead of the usual 600
  const expiresIn = +new Date() + 90 * 1000;
  do {
    try {
      token = await ssoOidcClient.send(
        new CreateTokenCommand({
          clientId: client.clientId!,
          clientSecret: client.clientSecret,
          grantType: `urn:ietf:params:oauth:grant-type:device_code`,
          deviceCode: authorization.deviceCode,
          code: authorization.userCode,
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 250));
    } catch (err) {}
  } while (expiresIn > +new Date() && !token);

  if (!token) {
    throw new Error("Unauthorized");
  }

  const session: SSOSession = {
    startUrl: federatedUrl,
    region: region,
    accessToken: token.accessToken!,
    expiresAt: new Date(+new Date() + token!.expiresIn! * 1000),
  };

  return session;
};

const fetchAccountCredentials = async (
  session: SSOSession,
  accessPair: AccessPair
): Promise<AWSCredentials> => {
  const ssoClient = new SSOClient({
    region: session.region,
  });

  const resp = await ssoClient.send(
    new GetRoleCredentialsCommand({
      roleName: accessPair.permissionSet,
      accountId: accessPair.accountId,
      accessToken: session.accessToken,
    })
  );

  const freshCreds: AWSCredentials = {
    accessKeyId: resp.roleCredentials?.accessKeyId!,
    secretAccessKey: resp.roleCredentials?.secretAccessKey!,
    sessionToken: resp.roleCredentials?.sessionToken!,
    expiration: new Date(resp.roleCredentials?.expiration!),
  };

  return freshCreds;
};

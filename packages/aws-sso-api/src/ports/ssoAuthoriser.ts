import { AccessPair, AWSCredentials, SSOSession } from "@cloudcanvas/types";

export interface SsoAuthoriser {
  init: () => Promise<SSOSession[]>;
  getFederatedAccessTokenIfExists: (
    startUrl: string
  ) => Promise<SSOSession | undefined>;
  getFederatedAccessToken: (
    startUrl: string,
    region: string
  ) => Promise<SSOSession>;
  getAccountAccessToken: (
    session: SSOSession,
    accessPair: AccessPair
  ) => Promise<AWSCredentials>;
}

import { Credentials } from "@aws-sdk/types";

export const regions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "af-south-1",
  "ap-east-1",
  "ap-southeast-3",
  "ap-south-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ca-central-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
];

export type AwsRegion =
  | "us-east-1"
  | "us-east-2"
  | "us-west-1"
  | "us-west-2"
  | "af-south-1"
  | "ap-east-1"
  | "ap-southeast-3"
  | "ap-south-1"
  | "ap-northeast-3"
  | "ap-northeast-2"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-northeast-1"
  | "ca-central-1"
  | "eu-central-1"
  | "eu-west-1"
  | "eu-west-2";

// AWS
export type AWSCredentials = Credentials & {
  identityId?: string;
};

export type AccessProvider = {
  /**
   * Fetch configurations to display full access suite the user has.
   *
   * On first call iit will pull from the local config file and from then on it
   * only uses the cache.
   */
  init: () => Promise<Access>;
  addOrganisation: (organisation: Organisation) => Promise<Access>;
  deleteOrganisation: (ssoStartUrl: string) => Promise<Access>;
  /**
   * Will authorise requests if there is a valid SSO session but will not invoke the SSO login.
   *
   * If no federated access exists it throws an SSOExpiredError
   *
   * @throws SSOExpiredError
   */
  lightAuthorise: (
    access: AccessPair
  ) => Promise<{ credentials: AWSCredentials; defaultRegion: AwsRegion }>;
  /**
   * Ensures there is a valid federated access token and AWS key pair for the access pair
   */
  authorise: (
    access: AccessPair
  ) => Promise<{ credentials: AWSCredentials; defaultRegion: AwsRegion }>;
  /**
   * Authorises a customer for an SSO Start URL ensuring a valid session exists. Will not refresh accounts if there
   * is an existing session or accounts were fetched previously.
   */
  authoriseOrg: (ssoUrl: string) => Promise<Access>;
  /**
   * Force refreshes all accounts for an organisation
   */
  refreshOrg: (ssoUrl: string) => Promise<Access>;
  /**
   * Force refreshes all accounts for an organisation
   */
  provideNickname: (nickname: string, ssoStartUrl: string) => Promise<Access>;
  /**
   * Return the full access scope we have for the customer
   */
  access: () => Promise<Access>;
};

// Duplicated in api-access used for ipcrenderer
export type Access = {
  organisations: Organisation[];
};

export type Organisation = {
  logicallyDeleted?: boolean;
  ssoStartUrl: string;
  ssoRegion: string;
  defaultRegion?: string;
  nickname?: string; // added by user
  accounts: Account[];
  roles: string[];
  accountsSyncedAtIso?: string;
  authorisedUntil?: Date;
};

export type Account = {
  accountId: string;
  name?: string;
  defaultRegion?: string;
  roles: string[];
};

export type AccessPair = {
  accountId: string;
  permissionSet: string;
};

export type AccessCard = AccessPair & {
  region: AwsRegion;
};

export type PermissionSet = {
  accountId: string;
  name: string;
};

export type AwsSsoConfig = {
  alias: string;
  sso_start_url: string;
  sso_region: string;
  sso_account_id: string;
  sso_role_name: string;
  region?: string;
};

// SSO

export type SSOSession = {
  startUrl: string;
  region: string;
  accessToken: string;
  expiresAt: Date;
};

import { AwsRegion, AccessPair } from "@cloudcanvas/aws-sso-api";
export class UnauthorisedError extends Error {
  constructor(msg: string) {
    super(msg);

    this.name = "UnauthorisedError";

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnauthorisedError.prototype);
  }
}
export class InvalidConfigurationError extends Error {
  constructor(msg: string) {
    super(msg);

    this.name = "InvalidConfigurationError";

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidConfigurationError.prototype);
  }
}

export type AwsSsoConfig = {
  alias: string;
  sso_start_url: string;
  sso_region: string;
  sso_account_id: string;
  sso_role_name: string;
  region?: string;
};

// Duplicated in api used for ipcrenderer
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

export type AccessCard = AccessPair & {
  region: AwsRegion;
};

export type PermissionSet = {
  accountId: string;
  name: string;
};

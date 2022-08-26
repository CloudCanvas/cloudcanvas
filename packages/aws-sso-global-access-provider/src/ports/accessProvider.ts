/**
 * Wraps all services with an authoriser (SSO by default)
 * Manages the overall access scope available to the user and ensuring calls to AWS
 * accounts are authorised through the injected authoriser
 */
import {
  AccessPair,
  AWSCredentials,
  AwsRegion,
  Access,
  Organisation,
} from "@cloudcanvas/types";

export class SSOExpiredError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "SSOExpiredError";
    Object.setPrototypeOf(this, SSOExpiredError.prototype);
  }
}

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

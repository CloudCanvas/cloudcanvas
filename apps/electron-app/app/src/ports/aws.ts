import { createAWSClient } from "@cloudcanvas/aws-sso-sdk-wrapper";
import {
  Access,
  AccessPair,
  AWSCredentials,
  AwsRegion,
  Organisation,
} from "@cloudcanvas/types";

/**
 * Injected into the window in preload.js
 *
 * We hide the AWS Library from the browser for now as we don't want to expose
 * the file system to it.
 *
 * In future we'll rearchitect this so that federated stuff happens in main and
 * the rest can happen purely in here as we can then build web components.
 */
export interface LocalAwsBridge {
  access: () => Promise<Access>;
  authoriseOrg: (ssoUrl: string) => Promise<Access>;
  lightAuthorise: (accessPair: AccessPair) => Promise<{
    credentials: AWSCredentials;
    defaultRegion: AwsRegion;
  }>;
  refreshOrg: (ssoUrl: string) => Promise<Access>;
  provideNickname: (nickname: string, ssoStartUrl: string) => Promise<Access>;
  addOrganisation: (organisation: Organisation) => Promise<Access>;
  deleteOrganisation: (ssoStartUrl: string) => Promise<Access>;
}

export type AwsClient = ReturnType<typeof createAWSClient>;

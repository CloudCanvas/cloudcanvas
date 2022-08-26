import { createAWSClient } from "@cloudcanvas/aws-sso-sdk-wrapper";
import { AccessProvider } from "@cloudcanvas/types";
import { LocalAwsBridge } from "../ports/aws";

export const ssoBridge: LocalAwsBridge = (window as any).api.aws;

export const aws = createAWSClient({
  accessProvider: ssoBridge as Partial<AccessProvider> as AccessProvider,
});

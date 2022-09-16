import { createAWSClient } from "@cloudcanvas/aws-sso-sdk-wrapper";
import { AccessProvider } from "@cloudcanvas/types";
import {
  ConfigManager,
  makeFileConfigManager,
} from "@cloudcanvas/configuration-manager";
import { LocalAwsBridge } from "../ports/aws";
import { Config } from "../domain/config";

export const homeDir: string = (window as any).api.homeDir;
export const ssoBridge: LocalAwsBridge = (window as any).api.aws;

export const aws = createAWSClient({
  accessProvider: ssoBridge as Partial<AccessProvider> as AccessProvider,
});

export const configManager: ConfigManager = (window as any).api.configManager;

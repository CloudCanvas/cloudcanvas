import os from "os";
import {
  makeAwsConfigManager as makeAccessConfigManager,
  makeSsoAccessProvider,
} from "@cloudcanvas/aws-sso-global-access-provider";
import {
  makeAwsConfigManager as makeAuthoriserConfigManager,
  makeSsoAuthoriser,
} from "@cloudcanvas/aws-sso-api";
import { AccessProvider } from "@cloudcanvas/types";

export const getDevAccessProvider = async (): Promise<AccessProvider> => {
  const accessConfigManager = makeAccessConfigManager({
    homeDir: os.homedir(),
  });
  const authConfigManager = makeAuthoriserConfigManager({
    homeDir: os.homedir(),
  });

  const ssoAuthoriser = makeSsoAuthoriser({
    browser: {
      open: async (path) => {
        open(path);
      },
    },
    configManager: authConfigManager,
  });

  const provider = makeSsoAccessProvider({
    authoriser: ssoAuthoriser,
    configManager: accessConfigManager,
  });

  await provider.init();

  return provider;
};

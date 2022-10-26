import {
  Browser,
  makeAwsConfigManager as makeAuthoriserConfigManager,
  makeSsoAuthoriser,
} from "cloudcanvas-aws-sso-api";
import {
  makeAwsConfigManager as makeAccessConfigManager,
  makeSsoAccessProvider,
} from "cloudcanvas-aws-sso-global-access-provider";
import { AccessProvider } from "cloudcanvas-types";
import os from "os";

export const getDevAccessProvider = async (): Promise<AccessProvider> => {
  const accessConfigManager = makeAccessConfigManager({
    homeDir: os.homedir(),
  });
  const authConfigManager = makeAuthoriserConfigManager({
    homeDir: os.homedir(),
  });

  const browser: Browser = {
    open: async (path) => {
      open(path);
    },
  };
  const ssoAuthoriser = makeSsoAuthoriser({
    browser: browser,
    configManager: authConfigManager,
  });

  const provider = makeSsoAccessProvider({
    authoriser: ssoAuthoriser,
    configManager: accessConfigManager,
    browser,
  });

  await provider.init();

  return provider;
};

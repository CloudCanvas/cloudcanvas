import os from "os";
import {
  makeSsoAuthoriser,
  makeAwsConfigManager as ssoConfigManager,
} from "@cloudcanvas/aws-sso-api";
import open from "open";

import { makeAwsConfigManager } from "../src/adapters/awsConfigManager";
import { makeSsoAccessProvider } from "../src/adapters/ssoAccessProvider";

export const exec = async () => {
  const accessProvider = makeSsoAccessProvider({
    configManager: makeAwsConfigManager({
      homeDir: os.homedir(),
    }),
    authoriser: makeSsoAuthoriser({
      configManager: ssoConfigManager({
        homeDir: os.homedir(),
      }),
      browser: {
        open: async (url) => {
          await open(url);
        },
      },
    }),
  });

  const access = await accessProvider.init();
  console.log(access);

  await accessProvider.authoriseOrg(access.organisations[0].ssoStartUrl);
  await accessProvider.authoriseOrg(access.organisations[0].ssoStartUrl);

  await accessProvider.lightAuthorise({
    accountId: access.organisations[0].accounts[0].accountId,
    permissionSet: access.organisations[0].accounts[0].roles[0],
  });
  await accessProvider.lightAuthorise({
    accountId: access.organisations[0].accounts[0].accountId,
    permissionSet: access.organisations[0].accounts[0].roles[0],
  });
  await accessProvider.lightAuthorise({
    accountId: access.organisations[0].accounts[0].accountId,
    permissionSet: access.organisations[0].accounts[0].roles[0],
  });
};

// exec();

import os from "os";
import { ListTimeSeriesCommand } from "@aws-sdk/client-iotsitewise";
import {
  makeAwsConfigManager as makeAuthoriserConfigManager,
  makeSsoAuthoriser,
} from "@cloudcanvas/aws-sso-api";
import {
  makeAwsConfigManager as makeAccessConfigManager,
  makeSsoAccessProvider,
} from "@cloudcanvas/aws-sso-global-access-provider";
import open from "open";
import { createAWSClient } from "../src/adapters/awsManager";

// This will all happen on ipcMain in an electron app and will be
// bridged through preload.js to this library in ipcRenderer so as
// not to expose the filesystem
const getAccessProvider = async () => {
  const accessConfigManager = makeAccessConfigManager({
    homeDir: os.homedir(),
  });
  const authConfigManager = makeAuthoriserConfigManager({
    homeDir: os.homedir(),
  });

  const ssoAuthoriser = makeSsoAuthoriser({
    browser: {
      open: async (path) => {
        await open(path);
      },
    },
    configManager: authConfigManager,
  });

  return makeSsoAccessProvider({
    authoriser: ssoAuthoriser,
    configManager: accessConfigManager,
  });
};

export const exec = async () => {
  const devAccessProvider = await getAccessProvider();

  await devAccessProvider.init();

  const { aws } = createAWSClient({
    accessProvider: devAccessProvider,
  });

  const access = await aws.accessProvider.access();

  await aws.accessProvider.authoriseOrg(access.organisations[2].ssoStartUrl);

  const response = await aws
    .account("356937276118")
    .role("AWSAdministratorAccess")
    .region("ap-southeast-2")
    .iotsitewise.send(
      new ListTimeSeriesCommand({
        aliasPrefix: "/DustMonitoring",

        // nextToken: marker,
      })
    );

  console.log(response);
};

// exec();

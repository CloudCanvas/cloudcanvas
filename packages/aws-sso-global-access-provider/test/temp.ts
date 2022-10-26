import { makeAwsConfigManager } from "../src/adapters/awsConfigManager";
import { makeSsoAccessProvider } from "../src/adapters/ssoAccessProvider";
import {
  makeSsoAuthoriser,
  makeAwsConfigManager as ssoConfigManager,
  Browser,
} from "cloudcanvas-aws-sso-api";
import open from "open";
import os from "os";

export const exec = async () => {
  const browser: Browser = {
    open: async (url) => {
      await open(url);
    },
  };
  const accessProvider = makeSsoAccessProvider({
    configManager: makeAwsConfigManager({
      homeDir: os.homedir(),
    }),
    authoriser: makeSsoAuthoriser({
      configManager: ssoConfigManager({
        homeDir: os.homedir(),
      }),
      browser: browser,
    }),
    browser,
  });

  const access = await accessProvider.init();

  const urlAccess = await accessProvider.navigateTo(
    "https://ap-southeast-2.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-2#alarmsV2:alarm/dustmonitoring-DustMonitorDataFetcher_error-ap-southeast-2-accId",
    {
      accountId: "",
      permissionSet: "AWSAdministratorAccess",
    }
  );

  console.log("urlAccess");
  console.log(urlAccess);
  // console.log(access.organisations[2].accounts.length);
  // const access2a = await accessProvider.authoriseOrg(
  //   access.organisations[2].ssoStartUrl
  // );
  // console.log(access2a.organisations[2].accounts.length);

  // const access2b = await accessProvider.refreshOrg(
  //   access.organisations[2].ssoStartUrl
  // );
  // console.log(access2b.organisations[2].accounts.length);

  // await accessProvider.lightAuthorise({
  //   accountId: access.organisations[0].accounts[0].accountId,
  //   permissionSet: access.organisations[0].accounts[0].roles[0],
  // });
  // await accessProvider.lightAuthorise({
  //   accountId: access.organisations[0].accounts[0].accountId,
  //   permissionSet: access.organisations[0].accounts[0].roles[0],
  // });
  // await accessProvider.lightAuthorise({
  //   accountId: access.organisations[0].accounts[0].accountId,
  //   permissionSet: access.organisations[0].accounts[0].roles[0],
  // });
};

// exec();

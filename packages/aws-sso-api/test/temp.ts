// @ts-ignore
import { makeAwsConfigManager } from "../src/adapters/awsConfigManager";
import { makeSsoAuthoriser } from "../src/adapters/ssoAuthoriser";
import open from "open";
import os from "os";

export const exec = async () => {
  const authoriser = makeSsoAuthoriser({
    configManager: makeAwsConfigManager({
      homeDir: os.homedir(),
    }),
    browser: {
      open: async (url) => {
        await open(url);
      },
    },
  });

  const existingSessions = await authoriser.init();

  const newSession = await authoriser.getFederatedAccessToken(
    existingSessions[0].startUrl,
    "us-east-1"
  );

  console.log("New session");

  return newSession;
};

// exec();

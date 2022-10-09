import fs from "fs";
// @ts-ignore
import { SSOSession } from "@cloudcanvas/types";
import glob from "glob";
// @ts-ignore
import sha1 from "sha-1";
import { ConfigManager } from "../ports/configManager";

const defaultSsoLocation = `/.aws/sso/cache/*.json`;

export const makeAwsConfigManager = ({
  homeDir,
}: {
  homeDir: string;
}): ConfigManager => {
  return {
    readSessionJson: async (sessionFolder) => {
      const allFiles: string[] = await new Promise((resolve) => {
        glob(
          sessionFolder || `${homeDir}${defaultSsoLocation}`,
          {},
          (err, files) => {
            if (err) {
              console.error(err);
              resolve([]);
            }
            resolve(files);
          }
        );
      });

      const ssoFiles = allFiles.filter((f) => f.indexOf("botocore") === -1);

      const sessions: (SSOSession | null)[] = ssoFiles.map((f) => {
        try {
          const config = JSON.parse(fs.readFileSync(f, "utf8"));
          return {
            startUrl: config.startUrl,
            region: config.region,
            accessToken: config.accessToken,
            expiresAt: new Date(config.expiresAt),
          } as SSOSession;
        } catch (e) {
          // console.error(e);
          return null;
        }
      });

      return sessions.filter((s) => s !== null) as SSOSession[];
    },
    writeSsoSessionFile: (session) => {
      const fileName = `${sha1(session.startUrl)}.json`;
      const fileHandle = `${homeDir}/.aws/sso/cache/${fileName}`;

      fs.writeFileSync(fileHandle, JSON.stringify(session));
    },
  };
};

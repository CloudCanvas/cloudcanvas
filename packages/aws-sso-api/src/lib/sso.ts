// @ts-ignore
import fs from "fs";
import { SSOSession } from "@cloudcanvas/types";
// @ts-ignore
import sha1 from "sha-1";

export const writeSSOFile = async (
  session: SSOSession,
  homeDir: string
): Promise<string> => {
  const fileName = `${sha1(session.startUrl)}.json`;
  const fileHandle = `${homeDir}/.aws/sso/cache/${fileName}`;

  fs.writeFileSync(fileHandle, JSON.stringify(session));

  return fileHandle;
};

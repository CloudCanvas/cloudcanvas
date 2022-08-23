import fs from "fs";
import os from "os";
// @ts-ignore
import sha1 from "sha-1";
import { SSOSession } from "../domain/aws";

export const writeSSOFile = async (
  session: SSOSession,
  homeDir: string
): Promise<string> => {
  const fileName = `${sha1(session.startUrl)}.json`;
  const fileHandle = `${homeDir}/.aws/sso/cache/${fileName}`;

  fs.writeFileSync(fileHandle, JSON.stringify(session));

  return fileHandle;
};

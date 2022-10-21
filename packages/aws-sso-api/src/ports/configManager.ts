import { SSOSession } from "cloudcanvas-types";

export interface ConfigManager {
  /**
   * Read the ~/.aws/sso/cache/*.json yaml files and parse them into SSO Configuration's
   */
  readSessionJson: (sessionFolder?: string) => Promise<SSOSession[]>;
  /**
   * Write a fresh session to the ~/.aws/sso/cache/*.json folder for other apps to uses
   */
  writeSsoSessionFile: (session: SSOSession) => void;
}

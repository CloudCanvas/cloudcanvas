import { Access } from "../domain";

export interface ConfigManager {
  /**
   * A cache of all SSO Url's and the accounts and roles contained within them
   */
  readAccessCacheFile: (cacheFile?: string) => Promise<Access>;
  /**
   * Save latest access scope
   */
  writeAccessCacheFile: (access: Access) => Promise<void>;
  /**
   * Read the ~/.config yaml file and parse it into SSO Configuration's
   */
  readYamlConfigFile: (configFile?: string) => Promise<Access>;
}

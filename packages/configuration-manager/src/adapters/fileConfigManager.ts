import fs from "fs";
import { retry } from "ts-retry-promise";
import { ConfigManager } from "../ports";

type Ports = {
  homeDir: string;
};

export const makeFileConfigManager = ({ homeDir }: Ports): ConfigManager => {
  return {
    saveConfig: async (config) => {
      const fileHandle = `${homeDir}/.cloudcanvas/cache/config.json`;

      fs.writeFileSync(fileHandle, config);
    },
    fetchConfig: async () => {
      const fileHandle = `${homeDir}/.cloudcanvas/cache/config.json`;

      const exists = fs.existsSync(fileHandle);

      if (!exists) {
        return null;
      }

      try {
        const configStr = await retry(async () => {
          const config = fs.readFileSync(fileHandle, "utf8");
          return config;
        });

        return configStr;
      } catch (err) {
        return null;
      }
    },
  };
};

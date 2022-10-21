export interface ConfigManager {
  saveConfig: (config: string) => Promise<void>;
  fetchConfig: () => Promise<string | null>;
}

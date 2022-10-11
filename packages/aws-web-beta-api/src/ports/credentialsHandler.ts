export interface CredentialsHandler {
  isValidCredentials: (credentialsInput?: string) => boolean;
  getAccountIdFromCredentials: (
    credentialsInput?: string
  ) => Promise<string | undefined>;
  securelyStoreCredentials: (credentialsInput?: string) => Promise<void>;
}

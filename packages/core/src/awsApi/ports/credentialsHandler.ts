import { Credentials } from "@aws-sdk/types";

export interface CredentialsHandler {
  isValidCredentials: (credentialsInput?: string) => boolean;
  getAccountIdFromCredentials: (
    credentialsInput?: string
  ) => Promise<string | undefined>;
  securelyStoreCredentials: (
    credentialsInput?: string
  ) => Promise<{ accountId: string }>;
  securelyFetchCredentials: (id: string) => Promise<Credentials | undefined>;
}

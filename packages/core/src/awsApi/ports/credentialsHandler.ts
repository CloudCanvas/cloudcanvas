import { Credentials } from "@aws-sdk/types";

export interface CredentialsHandler {
  isValidCredentials: (credentialsInput?: string) => boolean;
  getAccountIdFromCredentials: (
    credentialsInput?: string
  ) => Promise<string | undefined>;
  valdiateCredentials: (credentialsInput?: string) => Credentials | undefined;
  securelyStoreCredentials: (
    credentials: Credentials
  ) => Promise<{ accountId: string }>;
  securelyFetchCredentials: (id: string) => Promise<Credentials | undefined>;
}

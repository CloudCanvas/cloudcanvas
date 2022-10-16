import { makeCredentialsHandler } from "./adapters";
import { CredentialsHandler } from "./ports";

export class AwsApi {
  constructor() {
    this.credentialsHandler = makeCredentialsHandler();
  }

  saveCredentials = async (credentialsInput: string) => {
    const { accountId } =
      await this.credentialsHandler.securelyStoreCredentials(credentialsInput);
    return accountId;
  };

  credentialsHandler: CredentialsHandler;
}

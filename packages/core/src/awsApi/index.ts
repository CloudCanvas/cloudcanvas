import { makeAwsResourceIndexer, makeCredentialsHandler } from "./adapters";
import { CredentialsHandler, ResourceIndexer } from "./ports";
import { AwsRegion } from "cloudcanvas-types";
import { Credentials } from "components/TopPanel/AddAccountDialog";

export class AwsApi {
  constructor() {
    this.credentialsHandler = makeCredentialsHandler();
    this.resourceIndexer = makeAwsResourceIndexer();
  }

  indexAccount = async (accountId: string, region: AwsRegion) => {
    const credentials = await this.credentialsHandler.securelyFetchCredentials(
      accountId
    );

    if (!credentials) return;

    await this.resourceIndexer.index(credentials, region);
  };

  saveCredentialsString = async (credentialsInput: string) => {
    const credentials =
      this.credentialsHandler.valdiateCredentials(credentialsInput);

    if (!credentials) {
      window.alert("Invalid credentials");
      return;
    }

    const { accountId } =
      await this.credentialsHandler.securelyStoreCredentials(credentials);

    return accountId;
  };

  saveCredentials = async (credentials: Credentials) => {
    const { accountId } =
      await this.credentialsHandler.securelyStoreCredentials(credentials);

    return accountId;
  };

  credentialsHandler: CredentialsHandler;
  resourceIndexer: ResourceIndexer;
}

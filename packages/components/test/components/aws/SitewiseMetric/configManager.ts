import { customDataFetcher } from "../../../../src/components/aws/SitewiseMetric/configManager";
import { getDevAccessProvider } from "../../../devAccessProvider";
import { createAWSClient } from "@cloudcanvas/aws-sso-sdk-wrapper";

const exec = async () => {
  const awsClient = createAWSClient({
    accessProvider: await getDevAccessProvider(),
  })
    .aws.account("897386833887")
    .role("AdministratorAccess")
    .region("eu-central-1");

  const data = await customDataFetcher(awsClient);

  console.log(data);
};

exec();

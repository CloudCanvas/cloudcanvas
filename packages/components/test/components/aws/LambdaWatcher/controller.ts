import { makeLambdaStreamController } from "../../../../src/components/aws/LambdaWatcher/controller";
import { getDevAccessProvider } from "../../../devAccessProvider";
import { createAWSClient } from "cloudcanvas-aws-sso-sdk-wrapper";

const exec = async () => {
  const awsClient = createAWSClient({
    accessProvider: await getDevAccessProvider(),
  })
    .aws.account("897386833887")
    .role("AdministratorAccess")
    .region("eu-central-1");

  const controller = makeLambdaStreamController({
    config: {
      customData: {
        value: "analyticsv2",
        label: "analyticsv2",
      },
      initialData: [],
    },
    ports: { aws: awsClient },
  });

  while (true) {
    const logs = await controller.fetch();
    console.log(logs.length + " logs found");
    for (const log of logs) {
      console.log(log);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
};

exec();

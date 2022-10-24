import { makeCloudTrailController } from "../../../../src/components/aws/CloudTrail/controller";
import { getDevAccessProvider } from "../../../devAccessProvider";
import { createAWSClient } from "cloudcanvas-aws-sso-sdk-wrapper";

const exec = async () => {
  const awsClient = createAWSClient({
    accessProvider: await getDevAccessProvider(),
  })
    .aws.account("356937276118")
    .role("AWSAdministratorAccess")
    .region("ap-southeast-2");

  const controller = makeCloudTrailController({
    config: {
      customData: {
        label: "hello",
        value: "hello",
      },
      initialData: [],
    },
    ports: { aws: awsClient },
  });

  const logs = await controller.fetch();
  console.log(logs.length + " logs found");
};

exec();

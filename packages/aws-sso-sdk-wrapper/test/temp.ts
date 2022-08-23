import os from "os";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import {
  makeAwsConfigManager as makeAuthoriserConfigManager,
  makeSsoAuthoriser,
} from "@cloudcanvas/aws-sso-api";
import {
  makeAwsConfigManager as makeAccessConfigManager,
  makeSsoAccessProvider,
} from "@cloudcanvas/aws-sso-global-access-provider";
import open from "open";
import { createAWSClient } from "../src/adapters/awsManager";
import { constructTree } from "../src/domain/s3";

// This will all happen on ipcMain in an electron app and will be
// bridged through preload.js to this library in ipcRenderer so as
// not to expose the filesystem
const getAccessProvider = async () => {
  const accessConfigManager = makeAccessConfigManager({
    homeDir: os.homedir(),
  });
  const authConfigManager = makeAuthoriserConfigManager({
    homeDir: os.homedir(),
  });

  const ssoAuthoriser = makeSsoAuthoriser({
    browser: {
      open: async (path) => {
        await open(path);
      },
    },
    configManager: authConfigManager,
  });

  return makeSsoAccessProvider({
    authoriser: ssoAuthoriser,
    configManager: accessConfigManager,
  });
};

export const exec = async () => {
  const devAccessProvider = await getAccessProvider();

  await devAccessProvider.init();

  const { aws, s3Helper } = createAWSClient({
    accessProvider: devAccessProvider,
  });

  const access = await aws.accessProvider.access();

  await aws.accessProvider.authoriseOrg(access.organisations[1].ssoStartUrl);

  await aws.accessProvider.refreshOrg(access.organisations[0].ssoStartUrl);
  await aws.accessProvider.refreshOrg(access.organisations[1].ssoStartUrl);

  const response = await s3Helper.listAllObjects({
    access: {
      accountId: "433121571808",
      permissionSet: "AdministratorAccess",
    },
    bucket: "a-bucket-in-another-region",
  });

  // console.log("response");
  // console.log(response);

  // await aws.setActiveAccess({
  //   accountId: "532747402531",
  //   permissionSet: "AdministratorAccess",
  // });

  // console.log("listing buckets...");

  // const buckets = await aws
  //   .account("838606223797")
  //   .role("AdministratorAccess")
  //   .s3.send(new ListBucketsCommand({}));
  // console.log(buckets);

  const tables = await aws
    .account("897386833887")
    .role("AdministratorAccess")
    .region("eu-central-1")
    .dynamodb.send(new ListTablesCommand({}));
  console.log("tables");
  console.log(tables);

  // const feedbackStreamManager = createDynamoStreamManager({
  //   accountId: "897386833887",
  //   region: "eu-central-1",
  //   permissionSet: "AdministratorAccess",
  //   tableName: "Notes",
  // });

  // do {
  //   let start = +new Date();
  //   const records = await feedbackStreamManager.fetchRecords();

  //   let end = +new Date();

  //   console.log(`TOok ${(end - start) / 1000} seconds`);
  //   if (records.length) {
  //     console.log(`${records.length} records fetched`);
  //     for (const record of records) {
  //       console.log(JSON.stringify(record, null, 2));
  //     }
  //   }
  // } while (true);

  await s3Helper.listBuckets({
    access: {
      accountId: "433121571808",
      permissionSet: "AdministratorAccess",
    },
  });

  const objects = await s3Helper.listAllObjects({
    access: {
      accountId: "433121571808",
      permissionSet: "AdministratorAccess",
    },
    bucket: "wow-this-is-a-great-bucket",
  });

  const tree = constructTree(objects);

  // console.log("tree");
  // console.log(JSON.stringify(tree, null, 2));

  const otherRegionObjects = await s3Helper.listAllObjects({
    access: {
      accountId: "433121571808",
      permissionSet: "AdministratorAccess",
    },
    bucket: "a-bucket-in-another-region",
  });

  const tree2 = constructTree(otherRegionObjects);

  // console.log("tree2");
  // console.log(JSON.stringify(tree2, null, 2));
};

// exec();

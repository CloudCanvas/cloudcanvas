const { typescript } = require("projen");

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "cloudcanvas-aws-sso-sdk-wrapper",
  releaseToNpm: true,
  majorVersion: 1,
  tsconfig: {
    compilerOptions: {
      strictPropertyInitialization: false,
      noUnusedLocals: false,
      lib: ["es2019", "dom"],
      skipLibCheck: true,
    },
  },
  eslintOptions: {
    prettier: true,
  },
  prettierOptions: {},
  jestOptions: {
    jestConfig: {},
  },
  scripts: {
    integration: "npx jest -c jest.integration.js --runInBand",
    clean: "rm -rf .turbo && rm -rf node_modules && rm -rf lib",
  },
  devDeps: [
    "@types/aws-lambda",
    "cloudcanvas-aws-sso-api@*",
    "cloudcanvas-aws-sso-global-access-provider@*",
    "open",
  ],
  deps: [
    "@aws-sdk/client-cloudwatch",
    "@aws-sdk/client-cloudwatch-logs",
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/client-dynamodb-streams",
    "@aws-sdk/client-lambda",
    "@aws-sdk/client-iotsitewise",
    "@aws-sdk/client-s3",
    "@aws-sdk/lib-dynamodb",
    "@aws-sdk/util-dynamodb",
    "@aws-sdk/smithy-client",
    "@aws-sdk/types",
    "@aws-sdk/s3-request-presigner",
    "cloudcanvas-types@*",
    "aws-lambda",
    "aws-sdk",
    "ts-retry-promise",
  ],
});

project.synth();

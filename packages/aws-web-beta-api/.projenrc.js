const { typescript } = require("projen");

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "@cloudcanvas/aws-web-beta-api",
  releaseToNpm: true,
  majorVersion: 1,
  tsconfig: {
    compilerOptions: {
      strictPropertyInitialization: false,
      noUnusedLocals: false,
      lib: ["es2019", "dom"],
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
  devDeps: [],
  deps: [
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/client-lambda",
    "@aws-sdk/types",
    "aws-sdk",
    "yaml",
  ],
});

project.synth();

const { typescript } = require("projen");

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "@cloudcanvas/aws-sso-global-access-provider",
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
  devDeps: ["open"],
  deps: [
    "@aws-sdk/client-sso",
    "aws-sdk",
    "@cloudcanvas/aws-sso-api@*",
    "@cloudcanvas/types@*",
    "yaml",
  ],
});

project.synth();

const { typescript } = require("projen");

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  version: "0.0.1",
  name: "cloudcanvas-aws-sso-global-access-provider",
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
    ignorePatterns: ["*"],
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
    "cloudcanvas-aws-sso-api@*",
    "cloudcanvas-types@*",
    "yaml",
  ],
});

project.synth();

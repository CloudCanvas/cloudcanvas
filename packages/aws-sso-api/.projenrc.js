const { typescript } = require("projen");

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  version: "0.0.1",
  name: "cloudcanvas-aws-sso-api",
  releaseToNpm: true,
  majorVersion: 1,
  tsconfig: {
    compilerOptions: {
      strictPropertyInitialization: false,
      noUnusedLocals: false,
      skipLibCheck: true,
      lib: ["es2019", "dom"],
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
  devDeps: ["@types/crypto-js", "@types/glob", "open"],
  deps: [
    "@aws-sdk/client-sso",
    "@aws-sdk/client-sso-oidc",
    "@aws-sdk/types",
    "cloudcanvas-types@*",
    "aws-sdk",
    "crypto-js",
    "glob",
    "sha-1",
    "yaml",
  ],
});

project.synth();

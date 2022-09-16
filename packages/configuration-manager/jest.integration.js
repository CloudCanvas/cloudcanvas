module.exports = {
  testTimeout: 100000,
  testMatch: ["**.integration.ts"],
  clearMocks: true,
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "clover", "text"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  testPathIgnorePatterns: ["/node_modules/"],
  watchPathIgnorePatterns: ["/node_modules/"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "test-reports",
      },
    ],
  ],
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.dev.json",
    },
  },
};

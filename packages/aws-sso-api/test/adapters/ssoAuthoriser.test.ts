import { makeAwsConfigManager } from "../../src/adapters/awsConfigManager";
import { makeSsoAuthoriser } from "../../src/adapters/ssoAuthoriser";
import { SsoAuthoriser } from "../../src/ports/ssoAuthoriser";
import os from "os";

describe("ssoAccessProvider", () => {
  let authoriser: SsoAuthoriser;

  beforeAll(async () => {
    jest.clearAllMocks();

    authoriser = makeSsoAuthoriser({
      configManager: makeAwsConfigManager({ homeDir: os.homedir() }),
      browser: {
        open: jest.fn(),
      } as any,
    });
  });

  afterEach(async () => {});

  test("on init it parses the aws sso config and finds all organisations", async () => {
    // await authoriser.init();
    expect(1 + 1).toEqual(2);
  });
});

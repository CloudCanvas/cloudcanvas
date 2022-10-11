import os from "os";
import { SsoAuthoriser } from "cloudcanvas-aws-sso-api";
import { makeAwsConfigManager } from "../../src/adapters/awsConfigManager";
import { makeSsoAccessProvider } from "../../src/adapters/ssoAccessProvider";
import { AccessProvider } from "../../src/ports/accessProvider";

describe("ssoAccessProvider", () => {
  let ssoAccessProvider: AccessProvider;
  let startUrlOrgOne = "https://d-90677e2e6d.awsapps.com/start";
  let federatedAccess = { a: 1 };
  let federatedAccessMock = jest.fn().mockResolvedValue(federatedAccess);
  let accountAccessMock = jest.fn();
  let authoriser: SsoAuthoriser = {
    init: jest.fn(),
    getFederatedAccessToken: federatedAccessMock,
    getFederatedAccessTokenIfExists: federatedAccessMock,
    getAccountAccessToken: accountAccessMock,
  };

  beforeAll(async () => {
    jest.clearAllMocks();

    ssoAccessProvider = makeSsoAccessProvider({
      cachedFile: `${process.cwd()}/test/adapters/testAccess.json`,
      configFile: `${process.cwd()}/test/adapters/testConfigFile`,
      ssoSessionFolder: `${process.cwd()}/test/adapters/testSessionJson.json`,
      authoriser,
      configManager: makeAwsConfigManager({ homeDir: os.homedir() }),
    });
  });

  test("on init it parses the aws sso config and finds all organisations", async () => {
    const access = await ssoAccessProvider.init();
    expect(access.organisations.length).toEqual(2);
    expect(access.organisations[0].accounts.length).toEqual(2);
    expect(access.organisations[1].accounts.length).toEqual(1);
  });

  test("on init it fetches all accounts and roles for the given accounts", async () => {
    const access = await ssoAccessProvider.init();
    expect(access.organisations.length).toEqual(2);
  });

  test("on authorise, it uses the supplied account if supplied", async () => {
    await ssoAccessProvider.authorise({
      accountId: "532747402531",
      permissionSet: "AdministratorAccess",
    });

    expect(federatedAccessMock).toHaveBeenCalledTimes(1);
    expect(federatedAccessMock.mock.calls[0][0]).toEqual(startUrlOrgOne);
    expect(accountAccessMock).toHaveBeenCalledTimes(1);
    expect(accountAccessMock.mock.calls[0][0]).toEqual(federatedAccess);
    expect(accountAccessMock.mock.calls[0][1].accountId).toEqual(
      "532747402531"
    );
  });
});

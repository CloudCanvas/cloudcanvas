import { Command, Flags, CliUx } from "@oclif/core";
import {
  makeSsoAuthoriser,
  makeAwsConfigManager as ssoConfigManager,
  Browser,
} from "cloudcanvas-aws-sso-api";
import {
  makeAwsConfigManager,
  makeSsoAccessProvider,
} from "cloudcanvas-aws-sso-global-access-provider";
import * as os from "node:os";
import open from "open";

const LCERROR = "\x1b[31m%s\x1b[0m"; // red
const LCWARN = "\x1b[33m%s\x1b[0m"; // yellow
const LCINFO = "\x1b[36m%s\x1b[0m"; // cyan
const LCSUCCESS = "\x1b[32m%s\x1b[0m"; // green

// eslint-disable-next-line unicorn/no-static-only-class
const logger = class {
  static error(message: string) {
    console.error(LCERROR, message);
  }

  static warn(message: string) {
    console.warn(LCWARN, message);
  }

  static info(message: string) {
    console.info(LCINFO, message);
  }

  static success(message: string) {
    console.info(LCSUCCESS, message);
  }
};

// inquirier gave me shit so this will do
const List = require("prompt-list");

const regions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "af-south-1",
  "ap-east-1",
  "ap-southeast-3",
  "ap-south-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ca-central-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
];

const orgList = (orgs: string[]) =>
  new List({
    name: "organisation",
    message: "Choose your organisation",
    choices: orgs.map((o) => ({
      name: o,
      value: o,
    })),
  });

const accountList = (accs: string[]) =>
  new List({
    name: "account",
    message: "Choose your account",
    choices: accs.map((a) => ({
      name: a,
      value: a,
    })),
  });

const perrmissionList = (permissions: string[]) =>
  new List({
    name: "permission",
    message: "Choose which permission set to use",
    choices: permissions.map((p) => ({
      name: p,
      value: p,
    })),
  });

const regionList = (selectedRegion?: string) =>
  new List({
    name: "region",
    message: "Choose your region",
    choices: (selectedRegion
      ? [
          selectedRegion,
          ...regions
            .sort((a, b) => a.localeCompare(b))
            .filter((r) => r !== selectedRegion),
        ]
      : regions
    ).map((r) => ({
      name: r,
      value: r,
    })),
  });

const askList = async (list: any): Promise<string> => {
  return new Promise((res) => {
    list.ask(function (answer: string) {
      res(answer);
    });
  });
};

export default class Sketch extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Sketch);

    const browser: Browser = {
      open: async (url) => {
        open(url);
      },
    };
    const authoriser = makeSsoAuthoriser({
      configManager: ssoConfigManager({
        homeDir: os.homedir(),
      }),
      browser: browser,
    });

    const accessProvider = makeSsoAccessProvider({
      configManager: makeAwsConfigManager({
        homeDir: os.homedir(),
      }),
      authoriser,
      browser,
    });

    let access = await accessProvider.init();

    const orgs = access.organisations.map((o) => o.ssoStartUrl);

    const selectedOrg = await askList(orgList(orgs));
    let selectedOrgDetail = access.organisations.find(
      (o) => o.ssoStartUrl === selectedOrg
    );

    if (
      !selectedOrgDetail?.authorisedUntil ||
      selectedOrgDetail?.authorisedUntil < new Date()
    ) {
      logger.info("Launching an SSO verification...");

      await new Promise((res) => setTimeout(res, 500));
    }

    access = await accessProvider.refreshOrg(selectedOrg);

    selectedOrgDetail = access.organisations.find(
      (o) => o.ssoStartUrl === selectedOrg
    );

    const accounts = selectedOrgDetail!.accounts.sort((a, b) =>
      a.name!.localeCompare(b.name!)
    );

    const accountAliases = accounts
      .map((a) => a.name || a.accountId)
      .sort((a, b) => a.localeCompare(b));

    const selectedAccName = await askList(accountList(accountAliases));
    const selectedAcc = accounts.find((a) => a.name === selectedAccName)!;

    const selectedPermissionSet = await askList(
      perrmissionList(selectedAcc.roles.sort((a, b) => a.localeCompare(b)))
    );

    const selectedRegion = await askList(
      regionList(selectedAcc?.defaultRegion || selectedOrgDetail?.ssoRegion)
    );

    const session = await authoriser.getFederatedAccessToken(
      selectedOrg,
      selectedRegion
    );

    const credentials = await authoriser.getAccountAccessToken(session, {
      accountId: selectedAcc.accountId,
      permissionSet: selectedPermissionSet,
    });

    // Why do none of these damn tools work. Exits after a single character
    // const name = await CliUx.ux.prompt("Let's give your sketch a name");

    const params = new URLSearchParams();
    params.append("accessKeyId", credentials.accessKeyId);
    params.append("secretAccessKey", credentials.secretAccessKey);
    if (credentials.sessionToken) {
      params.append("sessionToken", credentials.sessionToken);
    }
    params.append("region", selectedRegion);
    params.append("name", selectedAccName);

    await open(`http://127.0.0.1:5421?${params.toString()}`);

    console.log(`
    ${selectedOrg}
    ${selectedAcc}
    ${selectedRegion}
    ${name}
    `);
  }
}

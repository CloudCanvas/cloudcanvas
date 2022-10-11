import { Command, CliUx, Flags } from "@oclif/core";
import {
  makeAwsConfigManager,
  makeSsoAccessProvider,
} from "cloudcanvas-aws-sso-global-access-provider";
import {
  makeSsoAuthoriser,
  makeAwsConfigManager as ssoConfigManager,
} from "cloudcanvas-aws-sso-api";
import * as os from "os";
import open from "open";

const LCERROR = "\x1b[31m%s\x1b[0m"; //red
const LCWARN = "\x1b[33m%s\x1b[0m"; //yellow
const LCINFO = "\x1b[36m%s\x1b[0m"; //cyan
const LCSUCCESS = "\x1b[32m%s\x1b[0m"; //green

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

import { Organisation } from "cloudcanvas-types";

// inquirier gave me shit so this will do
var List = require("prompt-list");

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

var orgList = (orgs: string[]) =>
  new List({
    name: "organisation",
    message: "Choose your organisation",
    choices: orgs.map((o) => ({
      name: o,
      value: o,
    })),
  });
var accountList = (accs: string[]) =>
  new List({
    name: "account",
    message: "Choose your account",
    choices: accs.map((a) => ({
      name: a,
      value: a,
    })),
  });

var regionList = (selectedRegion?: string) =>
  new List({
    name: "region",
    message: "Choose your region",
    choices: (selectedRegion
      ? [selectedRegion, ...regions.filter((r) => r !== selectedRegion)]
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

    const accessProvider = makeSsoAccessProvider({
      configManager: makeAwsConfigManager({
        homeDir: os.homedir(),
      }),
      authoriser: makeSsoAuthoriser({
        configManager: ssoConfigManager({
          homeDir: os.homedir(),
        }),
        browser: {
          open: async (url) => {
            open(url);
          },
        },
      }),
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
      await accessProvider.authoriseOrg(selectedOrg);
    }

    access = await accessProvider.refreshOrg(selectedOrg);

    selectedOrgDetail = access.organisations.find(
      (o) => o.ssoStartUrl === selectedOrg
    );

    const accounts = selectedOrgDetail!.accounts;

    const accountAliases = accounts
      .map((a) => a.name || a.accountId)
      .sort((a, b) => a.localeCompare(b));

    const selectedAcc = await askList(accountList(accountAliases));

    const region = await askList(regionList(selectedOrgDetail?.defaultRegion));

    // Why do none of these damn tools work. Exits after a single character
    // const name = await CliUx.ux.prompt("Let's give your sketch a name");
    const name = selectedAcc;

    // TODO Launch the Url with the encoded credentials, region and name

    console.log(`
    ${selectedOrg}
    ${selectedAcc}
    ${region}
    ${name}
    `);
  }
}

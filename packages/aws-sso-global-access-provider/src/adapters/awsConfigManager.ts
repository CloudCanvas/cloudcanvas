import fs from "fs";
import { uniq } from "@cloudcanvas/aws-sso-api";
import { Access, Account, Organisation } from "../domain/aws";
import { ConfigManager } from "../ports/configManager";

const defaultConfigLocation = `/.aws/config`;
const s3oCacheDir = `/.cloudcanvas/cache/`;
const s3oCacheFile = `${s3oCacheDir}access.json`;

const EMPTY_ACCESS: Access = { organisations: [] };

type AwsSsoConfig = {
  sso_start_url: string;
  sso_region: string;
  sso_account_id: string;
  sso_role_name: string;
  region?: string;
  alias: string;
};

/**
 * Regular Expression to match section headers.
 * @type {RegExp}
 * @private
 */
const SECTION = new RegExp(/\s*\[([^\]]+)]/);

/**
 * Regular expression to match key, value pairs.
 * @type {RegExp}
 * @private
 */
const KEY = new RegExp(/\s*(.*?)\s*[=:]\s*(.*)/);

/**
 * Regular expression to match comments. Either starting with a
 * semi-colon or a hash.
 * @type {RegExp}
 * @private
 */
const COMMENT = new RegExp(/^\s*[;#]/);

function parseLines(lines: string[]) {
  let profiles: any = {};

  let curSec: any | null = null;

  lines.forEach((line) => {
    if (!line || line.match(COMMENT)) return;
    let res = SECTION.exec(line);
    if (res) {
      const header = res[1];
      curSec = {};
      profiles[header] = curSec;
    } else if (!curSec) {
      throw new Error("MissingSectionHeaderError");
    } else {
      res = KEY.exec(line);
      if (res) {
        const key = res[1];
        curSec[key] = res[2];
      } else {
        throw new Error("ParseError");
      }
    }
  });

  const aliases = Object.keys(profiles);
  const validAliases = aliases.filter((a) => a.startsWith("profile"));

  const potentialProfiles = validAliases.map((a) => ({
    sso_start_url: profiles[a].sso_start_url,
    sso_region: profiles[a].sso_region,
    sso_account_id: profiles[a].sso_account_id,
    sso_role_name: profiles[a].sso_role_name,
    region: profiles[a].region,
    alias: a.replace("profile ", ""),
  }));

  const validProfiles = potentialProfiles.filter(
    (p) => !!p.sso_start_url && !!p.sso_region && !!p.sso_account_id
  );

  return validProfiles;
}

export const makeAwsConfigManager = ({
  homeDir,
}: {
  homeDir: string;
}): ConfigManager => {
  return {
    readAccessCacheFile: async (cacheFile) => {
      const fileHandle = cacheFile || `${homeDir}${s3oCacheFile}`;

      const exists = fs.existsSync(fileHandle);

      if (!exists) {
        console.log(`${fileHandle} does not exist`);
        return EMPTY_ACCESS;
      }

      const data = fs.readFileSync(fileHandle, "utf8");

      try {
        let maybeOrgs = JSON.parse(data);

        if (!maybeOrgs || !maybeOrgs.organisations) {
          console.info(
            "Cached file is not expected Access format (no organisations), discarding..."
          );
          return EMPTY_ACCESS;
        }

        if (!Array.isArray(maybeOrgs.organisations)) {
          console.info(
            "Cached file is not expected Access format (no organisations array), discarding..."
          );
          return EMPTY_ACCESS;
        }

        if (
          !maybeOrgs.organisations.every((o: Organisation) => !!o.ssoStartUrl)
        ) {
          console.info(
            "Cached file array items are not expected format, discarding..."
          );
          return EMPTY_ACCESS;
        }

        return maybeOrgs as Access;
      } catch (err) {
        console.error(err);
        return EMPTY_ACCESS;
      }
    },
    writeAccessCacheFile: async (organisations) => {
      const fileHandle = `${homeDir}${s3oCacheFile}`;

      const dirHandle = `${homeDir}${s3oCacheDir}`;
      if (!fs.existsSync(dirHandle)) {
        fs.mkdirSync(dirHandle, {
          recursive: true,
        });
      }

      fs.writeFileSync(fileHandle, JSON.stringify(organisations));
    },
    readYamlConfigFile: async (file) => {
      const handle = file || `${homeDir}${defaultConfigLocation}`;
      const exists = fs.existsSync(handle);

      if (!exists) {
        console.log(`${handle} does not exist`);
        return EMPTY_ACCESS;
      }
      const yaml = fs.readFileSync(
        file || `${homeDir}${defaultConfigLocation}`,
        "utf8"
      );

      const profiles = parseLines(yaml.split("\n")) as AwsSsoConfig[];

      const startUrls = uniq(profiles.map((p) => p.sso_start_url));

      const organisations = startUrls.map((s) => {
        const accounts = accountsForStartUrl(profiles, s);
        return {
          ssoStartUrl: s,
          ssoRegion: profiles.find((p) => p.sso_start_url === s)!.sso_region,
          defaultRegion: profiles.find((p) => p.sso_start_url === s)?.region,
          accounts: accounts,
          roles: uniq(accounts.flatMap((a) => a.roles)),
        } as Organisation;
      });

      return { organisations };
    },
  };
};

const accountsForStartUrl = (
  profiles: AwsSsoConfig[],
  ssoStartUrl: string
): Account[] => {
  const accountIds = profiles
    .filter((p) => p.sso_start_url === ssoStartUrl)
    .map((p) => p.sso_account_id);
  const uniqAccountIds = uniq(accountIds);

  return uniqAccountIds.map(
    (a) =>
      ({
        accountId: a,
        name: profiles.find((p) => p.sso_account_id === a)?.alias,
        defaultRegion: profiles.find((p) => p.sso_account_id === a)?.region,
        roles: rolesForAccount(profiles, a),
      } as Account)
  );
};

const rolesForAccount = (
  profiles: AwsSsoConfig[],
  accountId: string
): string[] => {
  const roles = profiles
    .filter((p) => p.sso_account_id === accountId)
    .map((p) => p.sso_role_name);

  const uniqRolesForAccount = uniq(roles);

  return uniqRolesForAccount.map((p) => p);
};

import { CredentialsHandler } from "../ports";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { Credentials } from "@aws-sdk/types";

const getCredentialsDetail = async (credentialsInput?: string) => {
  const credentials = createCredentials(credentialsInput);

  console.log("credentials");
  console.log(credentials);
  if (!credentials) return undefined;

  const stsClient = new STSClient({
    credentials,
    region: "us-east-1",
  });

  const identity = await stsClient.send(new GetCallerIdentityCommand({}));

  console.log("identity");
  console.log(identity);

  return {
    credentials,
    accountId: identity.Account,
  };
};

/**
 * Plucks the relevant fields out
 *
 * @param input
 */
const parseCredentialsInput = (
  input: string
): Record<string, string | undefined> => {
  let checks: Record<string, string | undefined> = {
    AWS_ACCESS_KEY_ID: undefined,
    AWS_SECRET_ACCESS_KEY: undefined,
    AWS_SESSION_TOKEN: undefined,
  };
  const lines = input.split("\n");

  for (const line of lines) {
    const awsIndex = line.indexOf("AWS_");
    if (!awsIndex) continue;
    const [key, value] = line.substring(awsIndex, line.length).split("=");
    checks[key] = value.replaceAll('"', "");
  }

  return checks;
};

/**
 * Checks that the input is a valid one
 * i.e. contains AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and optionally AWS_SESSION_TOKEN
 * export AWS_ACCESS_KEY_ID="ASIA6FNMRAWIQF6KODAQ"
 * export AWS_SECRET_ACCESS_KEY="aXuwJaM9jFFQ5pYWjTWZcLWPi8HMqaahVbEBuGdY"
 * export AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEIv//////////wEaDmFwLXNvdXRoZWFzdC0yIkcwRQIhAJWSoO/AqIPPzjgQt9TN9FMLxrNRzLVeS43qr/NLXVkJAiAdqekmEhF7YMr8wq3YTM9PvbQbiTSiysM5sznjZeu2WCqWAwhUEAAaDDk3MzcwODc4OTEzNyIMQ//hq4VQeEmMVLkGKvMCM1BdztHAqpYMQShYSr3wiupZwACqV5tUfagXDLpzB+YwRiilqJ63STRQj7DfyLc0C+qyvGgXRSGiANThqneXZ1sM5OesIgZNg+uxXl/ubOHK8gI6CkfZJPwH5j/D2rhnIpd41e+6Xswb5hdo+KzzSLDfiuFYlW8xH0FAjpnt+/psoGzl7KsLfWluRfGGmi3b69cejp2pJtWC7xWfn6dXiB1fKbTwNW8ChDp47XcnDhrP/u0pCZkeb46rLCZ8DXKkZ0vt83xRaUWYtaBa8JxSka2WOkFNRpXa90xmAF7hiAvCIejj1amLFF633kxcPMbOOSRBQYltKaNQ5BdkFYsywuHJkcZtuJHSnd337K4Y3JQ50b028bIp6gXjNJqkO7Ih6aO9lnwItn5+yYXww8pswRmoJ3HqZg3TZdiki6xWQjxR0zkT3YRNPlvDtVu98RRRjZjnOVk3/pfsOn3qEJXDP+9Rr7zvgwNt4gBNfb0OqdtT9XMw65mOmgY6pgGEPz84PFyUKIItB+WLWYFnFHmjfUFhXe1LyiM9hA4CYkD+1dBOpUcbbpHQMmXxpQbvMwDCTj2BWGn9PyxPzl58sJADzkkTKF74yy30Fsqekt4v++nUkm/1H9uRK/LWoTdf1bDitvS4SpOpHoz25r9ATb/snB1cSXfOPWGJzJBk6HiU+aW7R+oWsnMWecop+NieacHraD6SwBxToKWG+hZqiaMamvpW"
 *
 * @param input
 */
const isValidCredentials = (input?: string): boolean => {
  if (!input) return false;

  const checks = parseCredentialsInput(input);

  const hasValidAccessKeyId = !!checks.AWS_ACCESS_KEY_ID;
  const hasValidSecretKey = !!checks.AWS_SECRET_ACCESS_KEY;
  const hasValidSessionToken = !!checks.AWS_SESSION_TOKEN;

  return hasValidAccessKeyId && hasValidSecretKey;
};

const createCredentials = (input?: string): Credentials | undefined => {
  if (!input) return undefined;
  if (!isValidCredentials(input)) return undefined;

  const parsed = parseCredentialsInput(input);

  return {
    accessKeyId: parsed.AWS_ACCESS_KEY_ID!,
    secretAccessKey: parsed.AWS_SECRET_ACCESS_KEY!,
    sessionToken: parsed.AWS_SESSION_TOKEN,
  } as Credentials;
};

export const makeCredentialsHandler = (): CredentialsHandler => {
  return {
    isValidCredentials: isValidCredentials,
    getAccountIdFromCredentials: async (creds) => {
      const detail = await getCredentialsDetail(creds);
      return detail?.accountId;
    },
    securelyStoreCredentials: async (credentialsInput?: string) => {
      const detail = await getCredentialsDetail(credentialsInput);
      if (!detail?.accountId) throw new Error("Invalid credentials");

      // TODO Improve
      window.localStorage.setItem(
        detail.accountId,
        JSON.stringify(detail.credentials)
      );

      return { accountId: detail.accountId };
    },
    securelyFetchCredentials: async (accountId: string) => {
      const detail = window.localStorage.getItem(accountId);
      if (!detail) return undefined;

      const obj = JSON.parse(detail);
      return {
        accessKeyId: obj.accessKeyId,
        secretAccessKey: obj.secretAccessKey,
        sessionToken: obj.sessionToken,
      } as Credentials;
    },
  };
};

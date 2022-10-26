# AWS SSO Authorisation Wrapper

Utility library that allows for easily refreshing AWS SSO sessions and fetching SDK access tokens using them.

It reads existing sessons from AWS cache locaton and writes new sessons back to there to integrate with other AWS tools

# AWS Client

You can create an AWS client easily. All you need to pass in is the home directory locaton and a utilty to open a browser window.

This makes it easy to use between web, mobile, desktop and local scripts.

```
const authoriser = makeSsoAuthoriser({
  configManager: makeAwsConfigManager({
    homeDir: os.homedir(),
  }),
  browser: {
    open: async (url) => {
      await open(url);
    },
  },
});

const existingSessions = await authoriser.init();

const newSession = await authoriser.getFederatedAccessToken(
 s existingSessions[0].startUrl,
  "us-east-1"
);

await authoriser.getAccountAccessToken(sessions[0], {
  accountId: "123456789012",
  permissionSet: "AdministratorAccess",
});
```

# SSO Aware

The SDK is immediately aware of your SSO access by reading your /.aws/sso/cache/\*.json file.

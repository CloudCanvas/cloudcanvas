# AWS SSO Global Access Provider

Utility library that manages a customers global view of AWS.

It initiall reads the ~/.aws/config file to fetch all organisations and accounts.

After first authentication session it will retrieve all accounts for that organisation and store them.

It also provides utilities to add new organisations and delete ones added or detected from config.

It stores all config in ~/.cloudcanvas/cache/access.json

# AWS Client

You can create an AWS client easily. All you need to pass in is a service for local storage.

This makes it easy to use between web, mobile and your local desktop.

```
const { aws, access } = await createAWSClient();
```

# SSO Aware

The SDK is immediately aware of your SSO access by reading your ~/.aws/config file.

```
const ssoUrls = access.organisations.map(o => o.ssoStartUrl)
const ssoProviders = access.organisations.map(o => o.name)
const accounts = access.organisations.flatMap((o) => o.accounts);
```

# Deploy

npx projen release
npm run publish:npm

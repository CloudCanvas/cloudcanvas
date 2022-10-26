# CloudCanvas

An interactive canvas to help you manage your cloud resources.

This was a fun project and I'm keen to get peoples feedback. I find it really useful in my work.

I created CloudCanvas to make working with the cloud a little more fun.

Rather than jumping around consoles I hope to bring your favourite services to you, across accounts, regions and organisations. And hopefully make your day a little more enjoyable.

It is a Mac App that runs with your local credentials and only works with AWS IAM Identity Center (SSO) for security and peace of mind. No credentials ever leave your local machine. I've open sourced the code as my guarantee to you.

Download, run and it should pick up your SSO credentials from your ~/.aws/config file. It will not look in your credentials file.

I've released five components for five services as part of this beta. Mostly because I was working with them while developing this!

## What's inside?

This monorepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager and turborepo to manage the mono.

It includes the following packages/apps:

## Some things I'd change

Rather than each component having a controller I'll probably have a separate package manage all that and operate like a local graphql service with separate resolvers. That way the components can be simply taking in props.

I'll also explore a web version as Electron's a bit of a pain to work with.

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org) app
- `electron`: the cloudcanvas electron app
- `aws-sso-api`: a utility liibrary for interacting with AWS SSO OIIDCm refreshing SSO access and getting account access credentials.
- `aws-sso-global-access-provider`: a utility liibrary for managing a users global view of AWS across organisations
- `aws-sso-sdk-wrapper`: a utility liibrary to wrap the AWS SDK with functions to make it easy to invoke across accounts and organisations
- `components`: a React component library used by the electron application
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Compile

To compile all apps and packages during, run the following command:

```
yarn compile
```

### Build

To build all apps and packages, run the following command:

```
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
yarn run dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turborepo.org/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/core-concepts/pipelines)
- [Caching](https://turborepo.org/docs/core-concepts/caching)
- [Remote Caching](https://turborepo.org/docs/core-concepts/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/core-concepts/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)

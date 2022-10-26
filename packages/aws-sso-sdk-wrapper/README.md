# AWS SSO SDK Wrapper

This is a library for calling AWS services dynamically across orgs, accounts and services.

It takes in an access provider which will handle refreshing SSO creds, fetching account access creds and managing the organsations you work with.

It has been designed to work in the ipcRenderer part of an electron app.

You should NEVER import aws-sso-api or aws-sso-global-access-provider src/ in this package.

These are provided as devDeps to test the library by directly connecting the accessProvider.

In an electron app this will be divided through message passing in preload.js so as not to expose the file system.

# Helper libraries

It also provides helper libraries for things like listing all items in an S3 bucket as a tree, listening to a dynamo tables updates etc...

# AWS Client

You can create an AWS client easily. All you need to pass in is a service for local storage.

This makes it easy to use between web, mobile and your local desktop.

```
const { aws, s3Client } = await createAWSClient();
```

# AWS Wrapper

The `aws` variable returned can be used to move between accounts and roles dynamically.

For example, here we can scan a Dynamo table in one account and insert into another.

```
const item = await aws.account("Account1").role("DevAccess").dynamo.getItem({
  TableName: "table-name",
  Key: {
    id: { S: "id" }
  }
})

await aws.account("Account2").role("DevAccess").dynamo.putItem({
  TableName: "table-name",
  Item: item
})
```

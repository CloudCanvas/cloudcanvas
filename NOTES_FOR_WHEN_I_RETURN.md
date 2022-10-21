I was refactoring how components are laid out to make it easier.
They will mostly just retrieve the data through props in futuire rather than polling themselves and I'll have a central "graphql" server which will basically be a local aggregator of all data.

Steps to take when I come back

1. Delete components/src/domain/components.tsx and replace with components/src/domain/components_new.tsx
2. Delete components/aws/DynamoWatcher etc... and replace with components/aws/new by bringing up one level
3. Move components/form/v1/new up one level by deletiing old one

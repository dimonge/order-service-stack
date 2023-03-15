# Welcome to your CDK JavaScript project!

This is a blank project for JavaScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app. The build step is not required when using JavaScript.

## Useful commands

- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Outputs:

OrderServiceStack.GraphQLAPIKey = da2-eexmusa67bf2dcqcw2r63iso4q
OrderServiceStack.GraphQLAPIURL = https://3yoo2w3wxzerfcepz7utgef3pa.appsync-api.eu-west-1.amazonaws.com/graphql

## Architecture

### Notifies the graphql onCreateOrder mutation

    DynamoDBStream --> Lambda function --> App Sync (Resolver) --> Mutation onGetOrder --> UI

Hello everyone, I'm looking for a cold van to rent for 2 hours.

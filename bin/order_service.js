#!/usr/bin/env node

const cdk = require("@aws-cdk/core");
const { OrderServiceStack } = require("../lib/order_service-stack");

const app = new cdk.App();

new OrderServiceStack(app, "OrderServiceStack", {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
    resourceStage: process.env.CDK_DEPLOY_RESOURCE_STAGE || "dev",
    stage: process.env.CDK_DEPLOY_STAGE || "dev",
  },
});

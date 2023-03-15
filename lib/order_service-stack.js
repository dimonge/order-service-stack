const cdk = require("@aws-cdk/core");
const appsync = require("@aws-cdk/aws-appsync");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
const { Fn } = require("@aws-cdk/core");
const { MappingTemplate } = require("@aws-cdk/aws-appsync");
const DynamoDbEventSource = require("@aws-cdk/aws-lambda-event-sources").DynamoEventSource;
const SqlDlq = require("@aws-cdk/aws-lambda-event-sources").SqsDlq;
const DURATION_DAYS = 365;

class OrderServiceStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create the AppSync API
    const stage = props.resourceStage; 
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "orders-api",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(DURATION_DAYS)),
          },
        },
      },
      xrayEnabled: true,
    });
    
    new cdk.CfnOutput(this, "GraphQlArn", {
      value: api.arn,
      exportName: stage + "-api-graphQlApiArn"
    })

    new cdk.CfnOutput(this, "GraphQlUrl", {
      value: api.graphqlUrl,
      exportName: stage + "api-graphQlUrl"
    })
    
    const ordersTable = dynamodb.Table.fromTableAttributes(this, "OrdersTable", {
      tableName: Fn.importValue(props.env.resourceStage + "-ExtOrdersTable"),
      tableStreamArn: Fn.importValue(props.env.resourceStage + "-ExtOrdersStreamArn"),
    });

    const ordersLambda = new lambda.Function(this, "OrderLambdaHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "order.handler",
    });

    const orderStreamLambda = new lambda.Function(this, "OrderStreamHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "orderStream.handler",
    });

    const ordersLambdaDs = api.addLambdaDataSource("OrderDs", ordersLambda);

    ordersLambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getOrdersByShopAndOrderId",
    });

    ordersLambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getOrdersByShop",
    });

    ordersLambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "getOrder",
    });

    ordersLambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateOrder"
    })

    ordersTable.grantFullAccess(orderStreamLambda);
    ordersTable.grantFullAccess(ordersLambda);

    orderStreamLambda.addEnvironment("REGION", props.env.region);
    orderStreamLambda.addEnvironment("API_KEY", api.apiKey);
    orderStreamLambda.addEnvironment("GRAPHQL_URL", api.graphqlUrl);

    ordersLambda.addEnvironment("REGION", props.env.region);
    ordersLambda.addEnvironment("ORDERS_TABLE", ordersTable.tableName);

    orderStreamLambda.addEventSource(
      new DynamoDbEventSource(ordersTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        batchSize: 5,
        bisectBatchOnError: true,
        // onFailure: new SqlDlq(deadletterQueue)
        // retryAttempts: 10
      })
    );
  }
}

module.exports = { OrderServiceStack };

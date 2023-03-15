/**
 * Get the data from Dynamodb stream
 */

const _ = require("lodash");
const AWS = require("aws-sdk");
const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const SHOPIFY_ORDER = require("@modeliver_admin/models-util").SHOPIFY_ORDER;

const { print } = graphql;
const AWSAppSyncClient = require("aws-appsync").default;
require("isomorphic-fetch");

const onGetOrder = gql`
  mutation getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      orderId
      id
      shop
      email
      closed_at
      created_at
      updated_at
      number
      note
      token
      total_price
      subtotal_price
      total_tax
      currency
      total_weight
      confirmed
      name
      line_items
      fulfillment_status
      contact_email
      shipping_address
      total_line_items_price
      total_price
      user_id
      location_id
      phone
      customer_locale
      order_number
      note_attributes
      customer
    }
  }
`;

module.exports.handler = (event) => {
  try {
    console.log(JSON.stringify(event, null, 2));
    let records = [];
    if (_.has(event, "Records")) {
      records = _.get(event, "Records");
    }

    if (!!records && _.size(records) > 0) {
      records.forEach(async (record) => {
        const dynamodb = record && record.dynamodb;
        const newImage = dynamodb.NewImage;
        const orderObj = AWS.DynamoDB.Converter.unmarshall(newImage);
        // dispatch to onGetOrder subscription
        // shop
        const keys = AWS.DynamoDB.Converter.unmarshall(dynamodb.Keys);

        const { shop, orderId } = keys;

        console.log(JSON.stringify({ ...orderObj, shop, orderId }, null, 2));

        try {
          const client = new AWSAppSyncClient({
            url: process.env.GRAPHQL_URL,
            region: process.env.REGION,
            auth: {
              type: "API_KEY",
              apiKey: process.env.API_KEY,
            },
            disableOffline: true,
          });

          const getClient = await client.hydrated();

          const getData = SHOPIFY_ORDER.buildOrderStreamData(orderObj);
          const shopInput = {
            ...getData,
            shop,
          };
          console.log("shopInput, ", shopInput);
          const data = await getClient.mutate({ mutation: onGetOrder, variables: { input: shopInput } });
          console.log("order is sent to client, ", data);
          return data;
        } catch (error) {
          console.log("An error has occurred", shop, orderId);
          console.log(error);
          return;
        }
      });
    } else {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Not found." }),
      };
    }
    console.log(JSON.stringify(orders, null, 2));

    return {
      statusCode: 404,
      message: JSON.stringify({ message: "Not found." }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: JSON.stringify({ message: "Error occurred." }),
    };
  }
};

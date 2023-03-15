const DynamoDB = require("@modeliver_admin/sls-utils").DYNAMO_DB;
const Log = require("@modeliver_admin/sls-utils").LOG
const _ = require("lodash");

async function getOrdersByShop(shop) {
  try {
    console.log("getOrdersByShop: shop ", shop);
    Log.info(`GetOrdersByShop params: `, {shop})
    const result = await DynamoDB.query({
      TableName: process.env.ORDERS_TABLE,
      KeyConditionExpression: "#shop = :s",
      ExpressionAttributeNames: {
        "#shop": "shop",
      },
      ExpressionAttributeValues: {
        ":s": shop,
      },
    });

    Log.info("GetOrdersByShop succeeded", {shop})

    if (!!result.Items && _.size(result.Items) > 0) {
      return result.Items.map((item) => {
        return {
          ...item,
          id: _.get(item, "id"),
          orderId: _.get(item, "orderId"),
        };
      });
    } else {
      return [];
    }
  } catch (error) {
    Log.error("GetOrdersByShop failed", {shop}, error)
  }
}

module.exports = getOrdersByShop;

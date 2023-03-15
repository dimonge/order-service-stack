const {LOG, DYNAMO_DB} = require("@modeliver_admin/sls-utils")
const _ = require("lodash");

async function getOrdersByShopAndOrderId(shop, orderId) {
  try {
    const { Items } = await DYNAMO_DB.query({
      TableName: process.env.ORDERS_TABLE,
      KeyConditionExpression: "#shop = :s and #orderId = :oId",
      ExpressionAttributeNames: {
        "#shop": "shop",
        "#orderId": "orderId",
      },
      ExpressionAttributeValues: {
        ":s": shop,
        ":oId": toNumber(orderId),
      },
    });
    LOG.info("GetOrderByShopAndOrderId succeeded", { shop, orderId });

    if (!!Items && _.size(Items) > 0) {
      return {
        ...Items[0],
        shop,
        orderId,
      };
    } else {
      return [];
    }
  } catch (error) {
    LOG.error("GetOrderByShopAndOrderId failed ", {shop, orderId}, error);
  }
}

const toNumber = (value) => {
  return typeof value === "string" ? Number(value) : value;
};

module.exports = getOrdersByShopAndOrderId;

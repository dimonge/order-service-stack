const _ = require("lodash");

const Log = require("@modeliver_admin/sls-utils").LOG
const DynamoDB = require("@modeliver_admin/sls-utils").DYNAMO_DB;

async function updateOrder(shop, orderId, input) {

  let params = {
    TableName: process.env.ORDERS_TABLE,
    Key: {
      shop,
      orderId: orderId && Number(orderId),
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW",
  };
  let prefix = "set ";
  let attributes = Object.keys(input);

  for (let index = 0; index < attributes.length; index++) {
    let attribute = attributes[index];
    if (attribute !== "id") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = input[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
  }
  try {
    Log.info("Params", {params})
    const data = await DynamoDB.update(params);
    Log.info(`Order ${orderId} for shop ${shop} is updated`, { input, result: data });
    return data.Attributes;
  } catch (error) {
    Log.error(`Error has occurred when updating order ${orderId} for ${shop}`, { input }, error);    
  }
}

module.exports = updateOrder
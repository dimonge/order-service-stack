/**
 * GraphQl Resolver for the Order Api
 */
/**
 * 
 * {
    "arguments": {
        "shop": "modeliver-shop.myshopify.com",
        "orderId": 2916892704931
    },
    "identity": null,
    "source": null,
    "request": {
        "headers": {
            "x-forwarded-for": "3.250.159.1, 64.252.133.79",
            "cloudfront-viewer-country": "IE",
            "cloudfront-is-tablet-viewer": "false",
            "via": "1.1 cb342f3b88a84fbd5ec716e3cbcd7d77.cloudfront.net (CloudFront)",
            "cloudfront-forwarded-proto": "https",
            "content-type": "application/json;charset=utf-8",
            "x-api-key": "da2-eexmusa67bf2dcqcw2r63iso4q",
            "x-amzn-trace-id": "Root=1-5fa87539-514136f42aa91deb14fe71e1",
            "x-amz-cf-id": "t4MlAL-71UUSsNOe4j-JXIKQOksxgpiPAYk-LOGCsPq0g3LuwX1KCA==",
            "content-length": "445",
            "x-forwarded-proto": "https",
            "host": "3yoo2w3wxzerfcepz7utgef3pa.appsync-api.eu-west-1.amazonaws.com",
            "user-agent": "axios/0.21.0",
            "cloudfront-is-desktop-viewer": "true",
            "cloudfront-is-mobile-viewer": "false",
            "accept": "application/json, text/plain, *",
            "x-forwarded-port": "443",
            "cloudfront-is-smarttv-viewer": "false"
        }
    },
    "prev": null,
    "info": {
        "selectionSetList": [
            "orderId",
            "id",
            "shop",
            "email",
            "closed_at",
            "created_at",
            "updated_at",
            "number",
            "note",
            "token",
            "total_price",
            "subtotal_price",
            "total_tax",
            "currency",
            "total_weight",
            "confirmed",
            "name",
            "line_items"
        ],
        "selectionSetGraphQL": "{\n  orderId\n  id\n  shop\n  email\n  closed_at\n  created_at\n  updated_at\n  number\n  note\n  token\n  total_price\n  subtotal_price\n  total_tax\n  currency\n  total_weight\n  confirmed\n  name\n  line_items\n}",
        "parentTypeName": "Mutation",
        "fieldName": "onGetOrder",
        "variables": {
            "shop": "modeliver-shop.myshopify.com",
            "orderId": 2916892704931
        }
    },
    "stash": {}
} 
 */

const getOrdersByShop = require("./getOrdersByShop");
const getOrdersByShopAndOrderId = require("./getOrdersByShopAndOrderId");
const updateOrder = require("./updateOrder")

module.exports.handler = async (event, context) => {
  console.log("EVENT", JSON.stringify(event, null, 2));
  console.log("CONTEXT: ", JSON.stringify(context, null, 2));
  const {
    info: { fieldName },
    arguments,
  } = event;
  switch (fieldName) {
    case "getOrder":
      return await arguments.input;
    case "getOrdersByShop":
      return await getOrdersByShop(arguments.shop);
    case "getOrdersByShopAndOrderId":
      return await getOrdersByShopAndOrderId(arguments.shop, arguments.orderId);
    case "updateOrder":
      return await updateOrder(arguments.shop, arguments.orderId, arguments.input)
    default:
      return null;
  }
};

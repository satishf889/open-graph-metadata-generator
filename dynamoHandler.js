const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
var documentClient = new AWS.DynamoDB.DocumentClient();
require("dotenv").config();
const TABLE_NAME = process.env.TABLE_NAME;

var checkDynamoEntry = async (url) => {
  let params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "Requested_URL = :url",
    ExpressionAttributeValues: {
      ":url": url,
    },
  };

  documentClient
    .query(params)
    .promise()
    .then((res) => {
      var response;
      console.log(res);
      if (res.Items.length > 0) {
        reponse = {
          record_found: true,
          previous_record: res.Items[0],
        };
      } else {
        rsponse = {
          record_found: false,
        };
      }
      return response;
    });
};

// let data = {
//   Requested_URL:
//     "http://dl.flipkart.com/dl/noise-air-buds-truly-wireless-bluetooth-headset/p/itmcae5428d2bee1?pid=ACCFWGGWEF9V66A3&cmpid=product.share.pp",
//   Open_Graph_Reponse: JSON.stringify(
//     {
//       title:
//         "Noise Air Buds Truly Wireless Bluetooth Headset Price in India - Buy Noise Air Buds Truly Wireless Bluetooth Headset Online - Noise : Flipkart.com",
//       description:
//         "Buy Noise Air Buds Truly Wireless Bluetooth Headset for Rs.5999 Online, Also get Noise Air Buds Truly Wireless Bluetooth Headset Specs & Features. Only Genuine Products. 30 Day Replacement Guarantee. Free Shipping. Cash On Delivery!",
//       canonical:
//         "https://www.flipkart.com/noise-air-buds-truly-wireless-bluetooth-headset/p/itmcae5428d2bee1",
//       "og:url":
//         "https://www.flipkart.com/noise-air-buds-truly-wireless-bluetooth-headset/p/itmcae5428d2bee1",
//       "og:site_name": "Flipkart.com",
//       "og:title":
//         "Noise Air Buds Truly Wireless Bluetooth Headset Price in India - Buy Noise Air Buds Truly Wireless Bluetooth Headset Online - Noise : Flipkart.com",
//       "og:description":
//         "Buy Noise Air Buds Truly Wireless Bluetooth Headset for Rs.5999 Online, Also get Noise Air Buds Truly Wireless Bluetooth Headset Specs & Features. Only Genuine Products. 30 Day Replacement Guarantee. Free Shipping. Cash On Delivery!",
//       "og:type": "website",
//       "article:publisher": "",
//       "article:section": "",
//       "article:tag": "",
//       "og:image": "",
//       "og:image:secure_url": "",
//       "og:image:width": "",
//       "og:image:height": "",
//       "twitter:card": "app",
//       "twitter:image": "",
//       "twitter:site": "@flipkart",
//       "og:locale": "en_US",
//       "fb:app:id": "",
//       "og:video": "",
//       "fb:admins": "658873552,624500995,100000233612389",
//     },
//     null,
//     2
//   ),
// };

var createDynamoEntry = async (data) => {
  var datetime = new Date();
  data["LastUpdate"] = `${datetime}`;
  let params = {
    TableName: TABLE_NAME,
    Item: data,
  };

  await documentClient
    .put(params)
    .promise()
    .then((res) =>
      console.log(
        `Successful Insertion. Reponse is ${JSON.stringify(res, null, 2)}`
      )
    );
};

module.exports = { createDynamoEntry, checkDynamoEntry };

const axios = require("axios");
const url_parse = require("url-parse");
const tag_parser = require("./tagParser");
const { createDynamoEntry, checkDynamoEntry } = require("./dynamoHandler");

//Get the URL Data for processing
const getURLData = async (request_url) => {
  try {
    let structured_url = url_parse(request_url);
    let origin = structured_url.origin;
    let required_cookies;
    let preflight_config = {
      method: "get",
      url: origin,
    };
    //Performing pre-flight request
    var pre_request = await axios(preflight_config).then((res) => {
      return res.headers;
    });

    //Setting required cookies
    try {
      let cookies = pre_request["set-cookie"].map(
        (cookie) => cookie.split(";")[0]
      );
      console.log(cookies);
      required_cookies = cookies.join(";");
    } catch {
      required_cookies = "";
    }
    console.log(`Setting following required Cookies : ${required_cookies}`);

    //Requesting actual URL
    let config = {
      method: "get",
      url: request_url,
      headers: {
        Cookie: required_cookies,
      },
    };

    //Returning Data
    let response = await axios(config).then((res) => res);
    // console.log(response.headers);
    response = {
      web_metadata: response.data,
      status: response.status,
    };
    console.log(`Website metadata extracted`);
    return response;
  } catch (err) {
    // console.log(err);

    let response = {
      web_metadata: "Something went wrong",
      status: 400,
    };
    console.log(`Aborting the process, found folowing error ${err}`);
    console.log(`Error : ${JSON.stringify(response, null, 2)}`);
    return response;
  }
};

exports.handler = async (event) => {
  let body = JSON.parse(event.body);
  let URL = body.url;
  console.log(`Running crawler for ${URL}`);
  let initial_check = await checkDynamoEntry(URL);
  if (initial_check.record_found) {
    console.log(`Record previously searched`);
    let { Open_Graph_Reponse, LastUpdate } = initial_check.previous_record;
    Open_Graph_Reponse["LastUpdate"] = LastUpdate;
    let response = {
      statusCode: 200,
      body: JSON.stringify({ Open_Graph_Reponse }, null, 2),
    };
    console.log(`Sending response as ${JSON.stringify(response, null, 2)} `);
    return response;
  }

  let page_metadata = await getURLData(URL);
  const { status, web_metadata } = page_metadata;
  if (status === 400) {
    let response = {
      statusCode: status,
      body: JSON.stringify("The URL you provided does not exists"),
    };
    console.log(`Sending response as ${JSON.stringify(response, null, 2)} `);
    return response;
  } else {
    let parsedData = tag_parser(web_metadata);
    let data_toSend = { Open_Graph_Reponse: parsedData };
    const response = {
      statusCode: 200,
      body: JSON.stringify(data_toSend, null, 2),
    };
    let data_ToStore = {
      Requested_URL: URL,
      Open_Graph_Reponse: parsedData,
    };
    console.log(`Adding entry in dynamo for future reference`);
    await createDynamoEntry(data_ToStore);
    console.log(`Sending response as ${JSON.stringify(response, null, 2)} `);

    return response;
  }
};

// handler("https://www.amazon.in/gp/product/B07L4JDX4F/");
// handler(
//   "http://dl.flipkart.com/dl/mivi-roam2-5-w-bluetooth-speaker/p/itme55aaa9cc60bd?pid=ACCFXESJGGGT3DHC&cmpid=product.share.pp"
// );

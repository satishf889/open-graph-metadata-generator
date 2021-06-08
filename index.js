const tag_parser = require("./tagParser");
const { createDynamoEntry, checkDynamoEntry } = require("./dynamoHandler");
const getURLData = require("./getURLData");

exports.handler = async (event) => {
  console.log(`Event received as : ${JSON.stringify(event, null, 2)}`);
  let body = JSON.parse(event.body);
  let { request_url, refresh_existing } = body;
  console.log(`Running crawler for ${request_url}`);

  //We would check weather user has requested for hard refresh of data in our database
  if (refresh_existing === false) {
    //We will check for similar request in past
    let initial_check = await checkDynamoEntry(request_url);

    //If same request with same URL exists we would return the data
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
  }

  //If we do not have existing request we move ahead with fetching new record

  //Fetching website data in HTML format
  let page_metadata = await getURLData(request_url);
  const { status, web_metadata } = page_metadata;

  //If there is any error fetching HTML data we would exit
  if (status === 400) {
    let response = {
      statusCode: status,
      body: JSON.stringify("The URL you provided does not exists"),
    };
    console.log(`Sending response as ${JSON.stringify(response, null, 2)} `);
    return response;
  }

  //If we get successful HTML response we would parse the HTML
  else {
    let parsedData = tag_parser(web_metadata);
    let data_toSend = { Open_Graph_Reponse: parsedData };
    const response = {
      statusCode: 200,
      body: JSON.stringify(data_toSend, null, 2),
    };
    let data_ToStore = {
      Requested_URL: request_url,
      Open_Graph_Reponse: parsedData,
    };
    console.log(`Adding entry in dynamo for future reference`);

    //After successful Parsing and response creation we would store data in DynamoDB Table
    await createDynamoEntry(data_ToStore);
    console.log(`Sending response as ${JSON.stringify(response, null, 2)} `);

    return response;
  }
};

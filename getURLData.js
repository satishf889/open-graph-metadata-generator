const axios = require("axios");
const url_parse = require("url-parse");

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

module.exports = getURLData;

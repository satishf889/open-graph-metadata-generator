const axios = require("axios");
const url_parse = require("url-parse");

//Get the URL Data for processing
const getURLData = async (request_url) => {
  try {
    let structured_url = url_parse(request_url);
    let origin = structured_url.origin;
    let required_cookies;

    //Performing pre-flight request
    var pre_request = await axios.get(origin).then((res) => {
      return res.headers;
    });

    //Setting required cookies
    try {
      required_cookies = pre_request["set-cookie"].join(";");
    } catch {
      required_cookies = "";
    }
    console.log(`Setting following required Cookies : ${required_cookies}`);

    //Requesting actual URL
    let config = {
      method: "get",
      url: request_url,
      Cookie: required_cookies,
    };
    let response = await axios(config).then((res) => {
      return res.data;
    });
    return response;
  } catch (err) {
    console.log(`Aborting the process, found folowing error ${err}`);
    throw new Error(err);
  }
};

handler = async (url) => {
  console.log(`Running crawler for ${url}`);
  let page_metadata = await getURLData(url);
  console.log(page_metadata);
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify("Hello from Lambda!"),
  // };
  // return response;
};

handler("https://www.amazon.in/gp/product/B07L4JDX4F/");
// handler(
//   "http://dl.flipkart.com/dl/mivi-roam2-5-w-bluetooth-speaker/p/itme55aaa9cc60bd?pid=ACCFXESJGGGT3DHC&cmpid=product.share.pp"
// );

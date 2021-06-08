// let fs = require("fs");
// let xml = fs.readFileSync("test.html", "utf8");
var generateTags = (xml) => {
  let cheerio = require("cheerio");
  let $ = cheerio.load(xml);

  let title = $("head>title").text();
  let canonical =
    $("head>link[rel=canonical]").attr("href") !== undefined
      ? $("head>link[rel=canonical]").attr("href")
      : "";
  let og_url =
    $(`head>meta[property="og:url"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:url"]`).attr("content")
      : "";
  let og_type =
    $(`head>meta[property="og:type"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:type"]`).attr("content")
      : "";
  let og_site_name =
    $(`head>meta[property="og:site_name"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:site_name"]`).attr("content")
      : "";
  let og_title =
    $(`head>meta[property="og:title"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:title"]`).attr("content")
      : "";
  let og_description =
    $(`head>meta[property="og:description"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:description"]`).attr("content")
      : "";
  let description =
    $("head>meta[name=description]").attr("content") !== undefined
      ? $("head>meta[name=description]").attr("content")
      : og_description;

  //Creating image Source
  let image_array = [];
  $(`body`)
    .find("*")
    .children("img")
    .each(function () {
      imgsrc = $(this).attr("src");
      if (
        !imgsrc.includes("https") ||
        imgsrc.includes("locale") ||
        imgsrc.includes("pixel")
      ) {
        console.log(`Skipping ${imgsrc}`);
      } else {
        image_array.push(imgsrc);
      }
    });
  let og_image =
    $(`head>meta[property="og:image"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:image"]`).attr("content")
      : "";

  let og_locale =
    $(`head>meta[property="og:locale"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:locale"]`).attr("content")
      : "en_US";

  let og_video =
    $(`head>meta[property="og:video"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:vedio"]`).attr("content")
      : "";
  let fb_app_id =
    $(`head>meta[property="fb:app_id"]`).attr("content") !== undefined
      ? $(`head>meta[property="fb:app_id"]`).attr("content")
      : "";
  let og_mage_secure_url =
    $(`head>meta[property="og:image:secure_url"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:image:secure_url"]`).attr("content")
      : "";
  let og_image_width =
    $(`head>meta[property="og:image:width"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:image:width"]`).attr("content")
      : "";
  let og_image_height =
    $(`head>meta[property="og:image:height"]`).attr("content") !== undefined
      ? $(`head>meta[property="og:image:height"]`).attr("content")
      : "";

  let twitter_card =
    $(`head>meta[name="twitter:card"]`).attr("content") !== undefined
      ? $(`head>meta[name="twitter:card"]`).attr("content")
      : "";
  let twitter_image =
    $(`head>meta[name="twitter:image"]`).attr("content") !== undefined
      ? $(`head>meta[name="twitter:image"]`).attr("content")
      : "";
  let twitter_site =
    $(`head>meta[name="twitter:site"]`).attr("content") !== undefined
      ? $(`head>meta[name="twitter:site"]`).attr("content")
      : "";
  let article_publisher =
    $(`head>meta[property="article:publisher"]`).attr("content") !== undefined
      ? $(`head>meta[property="article:publisher"]`).attr("content")
      : "";
  let article_section =
    $(`head>meta[property="article:section"]`).attr("content") !== undefined
      ? $(`head>meta[property="article:section"]`).attr("content")
      : "";
  let article_tag =
    $(`head>meta[property="article:tag"]`).attr("content") !== undefined
      ? $(`head>meta[property="article:tag"]`).attr("content")
      : "";
  let fb_admins =
    $(`head>meta[property="fb:admins"]`).attr("content") !== undefined
      ? $(`head>meta[property="fb:admins"]`).attr("content")
      : [];

  let response = {
    title,
    description,
    canonical,
    images: image_array,
    "og:url": og_url,
    "og:site_name": og_site_name,

    "og:title": og_title,
    "og:description": og_description,
    "og:type": og_type,
    "article:publisher": article_publisher,
    "article:section": article_section,
    "article:tag": article_tag,
    "og:image": og_image,
    "og:image:secure_url": og_mage_secure_url,
    "og:image:width": og_image_width,
    "og:image:height": og_image_height,
    "twitter:card": twitter_card,
    "twitter:image": twitter_image,
    "twitter:site": twitter_site,
    "og:locale": og_locale,
    "fb:app:id": fb_app_id,
    "og:video": og_video,
    "fb:admins": fb_admins,
  };
  return response;
};

module.exports = generateTags;

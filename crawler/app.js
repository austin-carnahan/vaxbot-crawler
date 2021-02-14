const config = require("./config.js");
const Crawler = require("./modules/crawler.js");
const walgreens_map = require("./maps/walgreens-map.js");

let spider = new Crawler(walgreens_map);

spider.crawl();

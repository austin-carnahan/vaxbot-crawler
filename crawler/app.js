const Crawler = require("./crawler.js");
const walgreens_map = require("./maps/walgreens-map.js");

let spider = new Crawler(walgreens_map);

spider.crawl();

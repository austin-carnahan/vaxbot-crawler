const config = require("./config.js");
const Crawler = require("./modules/crawler.js");


for(let i=0; i< config.length; i++) {
	try {
		let spider = new Crawler(config[i].map, config[i].Target);
		console.log(spider.crawl());
	} catch (err) {
		console.error(`ERROR: crawler for ${config[i].map.name} has failed. \n ${err}`);
		continue;
	}	
}

const config = require("./config.js");
const Crawler = require("./modules/crawler.js");


for(let i=0; i< config.length; i++) {
	try {
		let spider = new Crawler(config[i]);
		spider.crawl();
	} catch (err) {
		console.error(`ERROR: crawler for ${config[i].name} has failed. \n ${err}`);
		continue;
	}	
}

const config = require("./config.js");
const Crawler = require("./modules/crawler.js");

async function launch_crawler(map, target_class) {
	let data;
	try {
		let spider = new Crawler(map, target_class);
		data = await spider.crawl();
		await console.log("SPIDER FINISHED");
		await console.log(data);
	} catch (err) {
		console.error(`ERROR: crawler for ${map.name} has failed. \n ${err}`);
	}
}


for(let i=0; i< config.length; i++) {
	launch_crawler(config[i].map, config[i].Target);	
}



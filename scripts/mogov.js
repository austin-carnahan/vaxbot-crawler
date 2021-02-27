const Crawler = require("../modules/crawler.js");
const settings = require("../settings");


let map = {
	name: "MO Dept. of Health",
	base_url: "https://covidvaccine.mo.gov",
	signup_url: "https://covidvaccine.mo.gov/events",
	start_url: "https://covidvaccine.mo.gov/events",
	target_url: "https://covidvaccine.mo.gov/events",

	pages: {
		"https://covidvaccine.mo.gov/events": [
			{
				element: "div",
				type: null,
				id: "region_c",
				for_each: true,
				full_target: true,
				target: "set_event",
				process: { method: "textContent", value: "" },
				descendant: "div",
				d_class: "card",
			},

		],
	}
}

class Target {
	constructor(map){
		this.name;
		this.source_url = "https://covidvaccine.mo.gov/events";
		this.source_name = "MO Dept. of Health";
		this.address1;
		this.address2;
		this.city;
		this.state = "MO";
		this.zip;
		this.tags = ["Event"];
		this.dates = [];
		this.contact_url= "https://covidvaccine.mo.gov/events";
		this.vaccine_available = false;
		this.vaccine_tags = [];
	}
	
	set_event(text) {
		if(text.includes("OPEN")) {
			this.vaccine_available = true;
		}
		if(text.includes("BOOSTER ONLY")) {
			this.vaccine_available = true;
			this.vaccine_tags.push("Booster Only");
		}
		// Chop off everything after 'MO'
		let idx = text.search(/MO/m);
		let msg = text.slice(0, idx+2)
		//Remove 'Site Information:' 
			.replace(/Site Information:/m, "")
		// Remove anything in parenthesis
			.replace(/\(.*\)/mg, "")
			.replace(/Date and Time:/m, "")
		// Remove empty lines
			.replace(/^\s*[\r\n]/gm, "")
		// Remove leading whitespaces
			.replace(/^\s*/gm, "")
		// Remove trailing whitespaces
			.replace(/\s*$/gm, "")
		
		let arr = msg.split("\n");
		this.city = arr.pop().replace(/,.*$/, "");		
		this.address1 = arr.pop().replace(/,.*$/, "");		
		this.name = arr.pop();	
		//not used
		let county = arr.shift();
		
		// Now all we have left are dates
		const now = new Date(Date.now());
		const year = now.getFullYear();
		
		for(let str of arr) {
			try {
				let formatted_str = str.replace(/from.*$/, year)
				let date = new Date(formatted_str);
				this.dates.push(date);
			} catch(err) {
				console.log(`COULD NOT PARSE: ${err}`); // this doesnt actually catch anything for invalid Date() params
			}
		}

	}
}



async function mogov() {
	let data;
	const crawler = new Crawler(map, Target);
	data = await crawler.crawl();
	return data;	
}

module.exports = mogov;

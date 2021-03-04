const user = require("../user.js")
const settings = require("../settings.js")
const Crawler = require("../modules/crawler.js");

let map = {
	name: "walmart",
	base_url: "https://www.walmart.com/",
	start_url: "https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled?imzType=covid",
	target_url: "https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled",

	pages: {
		"https://www.walmart.com/account/login": [
			{
				element: "input",
				type: "text",
				id: "email",
				value: user.walmart.username,
			},
			{
				element: "input",
				type: "text",
				id: "password",
				value: user.walmart.password,
			},
			{
				element: "button",
				type: "submit",
				id: null,
				value: null,
				nearest_ancestor_id: "sign-in-widget",
				classes: [ "button"],
				navigation : true,
			},
		],
		'https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled': [
			{
				element: "button",
				type: "button",
				id: null,
				value: null,
				data_automation_id: "change-location",
			},
			{
				element: "input",
				type: "text",
				id: null,
				value: settings.location.zip,
				data_automation_id: "zipcode-form-input",
			},
			{
				element: "button",
				type: "button",
				id: null,
				data_automation_id: "find-stores",
				classes: ["button--link"],
				
			},
			{
				element: "div",
				type: null,
				id: null,
				data_automation_id: "store-list-container",
				classes: ["store-list-container"],
				for_each: true,
				descendant: "input",
				d_type: "radio",
				loop: true,
			},
			{
				element: "button",
				id: null,
				type: "button",
				data_automation_id: "imz-select-store-continue-button",
				classes: ["button"],
			},
			{
				element: "input",
				type: "checkbox",
				id: "PHASE-1B-TIER-1-3",
			},
			{
				element: "button",
				type: "button",
				data_automation_id: "button",
				classes: ["button--primary"],
			},
			{
				element: "button",
				type: "button",
				data_automation_id: "button",
				classes: ["button--primary"],
			},
			//~ {
				//~ element: "div",
				//~ data_automation_id: "text-pickup-location",
				//~ classes: ["index__address__block__container___1ISwy"],
				//~ target: "set_address",
				//~ process: {method: "textContent", value: ""},
			//~ },
			{
				element: "div",
				data_automation_id: "book-slot-slotDates",
				classes: ["index__slot__dates___1d3-l"],
				for_each : true,
				descendant : "button",
				d_type: null,
				
			},
				//~ subcrawl: true,
				//~ subcrawl_elements : [
					//~ {
						//~ element: "div",
						//~ id: "appointment-available",
						//~ target: "set_datetime",
					//~ }
				//~ ],
			//~ },
		],
	},
}

class Target {
	constructor(map){
		this.name;
		this.source_id;
		this.source_name = map.name;
		this.source_url = map.base_url; 
		this.address1;
		this.city;
		this.state;
		this.zip;
		this.lat;
		this.lon;
		this.vaccine_available = false;
		this.dates = [];
	}
	
	set_temp_date(str) {
		this.temp_date = str;
	}
	
	add_datetime() {
		let time_string;
		let max_index = Math.floor(Math.random() * 18);
		for(let i=0; i < max_index; i++) {
			time_string = `${Math.floor(Math.random() * 12)}:00PM`;
			console.log(`generated timestring: ${time_string}`);
		}
	}
	
	set_address(str) {
		this.address = str;
	}
	
	set_name(str) {
		this.name = str;
	}
	
	intercept_storefinder(response, index, url) {
		console.log("RECIEVED STORE DATA:")
		console.log(response);
		console.log(index);
		console.log(response.data.storesData.stores[index])
		let newUrl = new URL(url);
		if(newUrl.searchParams.get('searchString') == settings.location.zip.toString()) {
			console.log("VERIFY RESPONSE DATA: ZIP IN URL = TRUE");
			if(response.data.storesData.stores[index].address.state == settings.location.state) {
				console.log("VERIFY RESPONSE DATA: CORRECT STATE = TRUE");
				this.name = response.data.storesData.stores[index].displayName;
				this.source_id = response.data.storesData.stores[index].id;
				this.address1 = response.data.storesData.stores[index].address.address1;
				this.city = response.data.storesData.stores[index].address.city;
				this.state = response.data.storesData.stores[index].address.state;
				this.zip = response.data.storesData.stores[index].address.postalCode;
				this.lat = response.data.storesData.stores[index].geoPoint.latitude;
				this.lon = response.data.storesData.stores[index].geoPoint.longitude;
			}
		}
	}
	
	intercept_timeslots(response) {
		console.log("RECIEVED APPOINTMENT DATA:")
		response.data.slotDays.map( item => {
			console.log(item);
			if(item.slots.length > 0) {
				this.dates.push(item);
			}
		});
		
		this.vaccine_available = this.dates.length > 0;
	}
}

async function walmart() {
	let data;
	const crawler = new Crawler(map, Target);
	data = await crawler.crawl();
	return data;	
}

module.exports = walmart;

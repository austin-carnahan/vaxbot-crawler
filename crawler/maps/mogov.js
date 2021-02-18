const user = require("../.USER.js")

let map = {
	name: "mogov",
	base_url: "https://covidvaccine.mo.gov/",
	start_url: "https://covidvaccine.mo.gov/events/",
	target_url: "https://covidvaccine.mo.gov/events/",

	pages: {
		"https://covidvaccine.mo.gov/events/": [
			{
				element: "div",
				type: null,
				id: "region_c",
				for_each: true,
				target: "set_event",
				process: { method: "textContent", value: "" };
				descendant: "div",
				d_class: "card",
			},

		],
	}
}

class Target {
	constructor(source){
		this.name;
		this.store_id;
		this.location_type = source;
		this.address1;
		this.city;
		this.state;
		this.zip;
		this.appointment_dates = [];
		this.appointments_available = false;
	}
	
	set_event(text) {
		
	}
}

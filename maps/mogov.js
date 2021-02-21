const user = require("../.USER.js")

let map = {
	name: "Missouri Stronger Together",
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
		this.store_id;
		this.location_type = map.name;
		this.signup_url = map.signup_url;
		this.address1;
		this.city;
		this.state;
		this.zip;
		this.appointment_dates = [];
		this.appointments_available = false;
		this.data_blob;
		this.blob_format = true;
	}
	
	set_event(text) {
		if(text.includes("OPEN")) {
			this.appointments_available = true;
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
		console.log(msg)
		
		this.data_blob = msg;
	}
}

exports.map = map;
exports.Target = Target;

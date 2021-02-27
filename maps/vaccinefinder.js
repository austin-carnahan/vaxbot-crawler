const user = require("../USER.js")

let map = {
	name: "vaccinefinder",
	source_url: "https://vaccinefinder.org",
	start_url: "https://vaccinefinder.org/search",
	target_url: "https://vaccinefinder.org/search",
	
	http_request_listener : {
		//~ url: "https://api.us.castlighthealth.com/vaccine-finder/v1/provider-locations",
		url: "https://api.us.castlighthealth.com/vaccine-finder/v1/provider-locations/search",
		target: "intercept_request",
	},

	pages: {
		"https://vaccinefinder.org/search": [
			{
				element: "input",
				type: "number",
				id: "zipCode",
				value: "{ZIP}",
			},
			{
				element: "div",  // distance dropdown unable to select
				//~ type: "text",
				id: "searchArea",
				click_type: "puppet"
			},
			{
				element: "div",  // distance dropdown unable to select
				//~ type: "text",
				id: "react-select-2-option-3",		//option 3: 25miles
				click_type: "puppet"
			},
			{
				element: "button",
				type: "submit",
				id: null,
				value: null,
				nearest_ancestor_id: "split-screen-content",
				classes: [ "sc-gKAblj"],
			},
			{
				element: "div",
				id: null,
				nearest_ancestor_id: "split-screen-content",
				classes:["search-results__list"],
				for_each: true,
				descendant: "button",
				d_class: ["search-result__link"],
				loop: true,
			},
		],
		//~ 'https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled': [

			//~ {
				//~ element: "input",
				//~ type: "text",
				//~ id: null,
				//~ value: "{ZIP}",
				//~ data_automation_id: "zipcode-form-input",
			//~ },
			//~ {
				//~ element: "button",
				//~ type: "button",
				//~ id: null,
				//~ data_automation_id: "find-stores",
				//~ classes: ["button--link"],
				
			//~ },
			//~ {
				//~ element: "div",
				//~ type: null,
				//~ id: null,
				//~ data_automation_id: "store-list-container",
				//~ classes: ["store-list-container"],
				//~ for_each: true,
				//~ descendant: "input",
				//~ d_type: "radio",
				//~ loop: true,
			//~ },
			//~ {
				//~ element: "button",
				//~ id: null,
				//~ type: "button",
				//~ data_automation_id: "imz-select-store-continue-button",
				//~ classes: ["button"],
			//~ },
			//~ {
				//~ element: "input",
				//~ type: "checkbox",
				//~ id: "PHASE-1B-TIER-1-3",
			//~ },
			//~ {
				//~ element: "button",
				//~ type: "button",
				//~ data_automation_id: "button",
				//~ classes: ["button--primary"],
			//~ },
			//~ {
				//~ element: "button",
				//~ type: "button",
				//~ data_automation_id: "button",
				//~ classes: ["button--primary"],
			//~ },
			//~ {
				//~ element: "div",
				//~ data_automation_id: "text-pickup-location",
				//~ classes: ["index__address__block__container___1ISwy"],
				//~ target: "set_address",
				//~ process: {method: "textContent", value: ""},
			//~ },
			//~ {
				//~ element: "div",
				//~ data_automation_id: "book-slot-slotDates",
				//~ classes: ["index__slot__dates___1d3-l"],
				//~ target: "set_temp_date",
				//~ process: {method: "getAttribute", value: "aria-label"},
				//~ for_each : true,
				//~ descendant : "button",
				//~ d_type: null,
				
			//~ },
				//~ subcrawl: true,
				//~ subcrawl_elements : [
					//~ {
						//~ element: "div",
						//~ id: "appointment-available",
						//~ target: "set_datetime",
					//~ }
				//~ ],
			//~ },
		//~ ],
	},
}

class Target {
	constructor(map){
		this.name;
		this.source_name = map.name;
		this.source_url = map.source_url;
		this.address1;
		this.address2;
		this.city;
		this.state;
		this.zip;
		this.vaccine_available;
		this.tags = [];
		this.vaccine_tags = [];
		this.last_updated;
		this.contact_url;

	}
	
	set_address(str) {
		this.address = str;
	}
	
	set_name(str) {
		this.name = str;
	}
	
	intercept_request(response, index = null, url = null) {
		console.log("RECIEVED STORE DATA:")
		console.log(response);
		if(response.state == user.personal.STATE_ABBR) {
			console.log("VERIFY RESPONSE DATA: CORRECT STATE = TRUE");
			this.name = response.name;
			this.address1 = response.address1;
			this.address2 = response.address2;
			this.city = response.city;
			this.state = response.state;
			this.zip = response.zip;
			this.vaccine_available = false;
			this.last_updated = response.last_updated;
			this.contact_url = response.prescreening_site;
			if(response.accepts_walk_ins){
				this.tags.push("walk-ins");
			}
			
			for (let item of response.inventory) {
				if(item.in_stock === "TRUE") {
					this.vaccine_available = true;				
					this.vaccine_tags.append(item.name.replace(/COVID Vaccine/, "").trim());					
				}
			}
		}
	}
}

exports.map = map;
exports.Target = Target;

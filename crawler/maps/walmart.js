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
				value: "{USERNAME}",
			},
			{
				element: "input",
				type: "text",
				id: "password",
				value: "{PASSWORD}",
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
				value: "{ZIP}",
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
				fork: true,
			},
			//~ {
				//~ element: "div",
				//~ classes: ["store-address"],
				//~ nearest_ancestor_da_id_element: "label",
				//~ nearest_ancestor_da_id: "store-3061",
				//~ target:  "set_address",
				//~ process: {method: "textContent", value: ""},
			//~ },
			//~ {
				//~ element: "div",
				//~ classes: ["store-address"],
				//~ nearest_ancestor_da_id_element: "label",
				//~ nearest_ancestor_da_id: "store-3061",
				//~ target:  "set_name",
				//~ process: {method: "textContent", value: ""},
			//~ },
			//~ {
				//~ element: "input",
				//~ id: "radio-tile-3061",
			//~ },
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
			{
				element: "div",
				data_automation_id: "text-pickup-location",
				classes: ["index__address__block__container___1ISwy"],
				target: "set_address",
				process: {method: "textContent", value: ""},
			},
			{
				element: "div",
				data_automation_id: "book-slot-slotDates",
				classes: ["index__slot__dates___1d3-l"],
				target: "set_temp_date",
				process: {method: "getAttribute", value: "aria-label"},
				for_each : true,
				descendant : "button",
				d_type: null,
				subcrawl: true,
				subcrawl_elements : [
					{
						element: "div",
						id: "appointment-available",
						target: "set_datetime",
					}
				],
			},
		],
	},
}

class Target {
	constructor(source){
		this.name;
		this.source = source;
		this.address ;
		this.city;
		this.datetimes = [];
		this.temp_date;
	}
	
	set_temp_date(str) {
		this.temp_date = str;
	}
	
	add_datetime(str) {
		this.datetimes.push(str);
	}
	
	set_address(str) {
		this.address = str;
	}
	
	set_name(str) {
		this.name = str;
	}
}

exports.map = map;
exports.Target = Target;

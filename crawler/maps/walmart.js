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
				element: "input",
				id: "radio-tile-3061",
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
			{
				element: "div",
				data_automation_id: "book-slot-slotDates",
				classes: ["index__slot__dates___1d3-l"],
				for_each_child : true,
				child_element : "button",
				subcrawl: true,
				subcrawl_elements : [
					{
						element: "",
						id: null,
						target: true,
						stop: true,
					}
				],
			},
		],
	},
}

module.exports = map

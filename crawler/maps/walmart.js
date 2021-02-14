let map = {
	name: "walmart",
	base_url: "https://www.walmart.com/",
	start_url: "https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled?imzType=covid",
	target_url: "",
	//pharmacy/clinical-services/immunization/scheduled?imzType=covid
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
	},
}

module.exports = map

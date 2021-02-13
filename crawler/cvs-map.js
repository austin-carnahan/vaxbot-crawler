const info = require('./vaxbot_info.js')
//~ const username= info.logins.walmart.username
//~ const password = info.logins.walmart.password

let map = {
	base_url: "https://www.cvs.com/",
	start_url: "https://www.cvs.com/vaccine/intake/store/covid-screener/covid-qns",
	target_url: "",
	//~ username: username,
	//~ password : password,

	//pharmacy/clinical-services/immunization/scheduled?imzType=covid
	page_map: {
		"https://www.walmart.com/account/login": [
			{
				element: "input",
				type: "text",
				id: "email",
				value: username,
			},
			{
				element: "input",
				type: "text",
				id: "password",
				value: password,
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

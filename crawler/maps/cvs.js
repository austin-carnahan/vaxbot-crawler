const info = require('./vaxbot_info.js')
//~ const username= info.logins.walmart.username
//~ const password = info.logins.walmart.password

let map = {
	base_url: "https://www.cvs.com/",
	start_url: "https://www.cvs.com/immunizations/covid-19-vaccine",
	target_url: "",
	//~ username: username,
	//~ password : password,

	//pharmacy/clinical-services/immunization/scheduled?imzType=covid
	pages: {
		"https://www.cvs.com/immunizations/covid-19-vaccine": [
			{
				element: "a",
				type: null,
				id: null,
				data_analytics_name: "Arkansas" // {STATE};
				value: null,
			},
			{
				element: "a",
				type: null,
				data_analytics_name: "Schedule an appointment now",
				value: null,
				navigation : true,
			},
		],
		"https://www.cvs.com/vaccine/intake/store/covid-screener/covid-qns": [
			{
				element: "input",
				type: "radio",
				id: "q7_2",
			},
			{
				element: "input",
				type: "radio",
				id: "q8_2",
			},
			{
				element: "input",
				type: "radio",
				id: "q9_2",
			},
			{
				element: "button",
				type: "button",
				id = null,
				nearest_ancestor_id: "content",
				classes: ["btn-control"],
				navigation : true,
			},
		],
		"https://www.cvs.com/vaccine/intake/store/cvd/dose-select" : [
			{
				element: "input",
				type: "radio",
				id: "customRadio_1",
			},
			{
				element: "button",
				type: "submit",
				id = null,
				nearest_ancestor_id: "content",
				classes: ["btn-control"],
				navigation : true,
			},
		],
		"https://www.cvs.com/vaccine/intake/store/eligibility-screener/eligibility-covid": [
			{
				element: "select",
				type: null,
				id: "jurisdiction",
				value = "1: EID_AR", //Arkansas
			},
			{
				element: "button",
				type: "submit",
				id = null,
				nearest_ancestor_id: "content",
				classes: ["btn-control"],
				navigation : true,
			},
		],
		"https://www.cvs.com/vaccine/intake/store/eligibility-screener/eligibility-qns": [
			{
				element: "select",
				type: null,
				id: "jurisdiction",
				value = "1: EID_AR", //Arkansas
			},
			{
				element: "input",
				type: "tel",
				id = "q1_0",
				value "82" // {AGE}
				classes: ["answer-free-input"],
			},
			{
				element: "input",
				type: "radio",
				id: "q20",
			},
			{
				element: "select",
				type: null,
				id: "qlist",
				value = "1: Age 70 or over", // 70 or over
			},
			{
				element: "input",
				type: "checkbox",
				id: "qconsent",
			},
			{
				element: "button",
				type: "submit",
				id = null,
				nearest_ancestor_id: "content",
				classes: ["btn-control"],
				navigation : true,
			},
		],
		"https://www.cvs.com/vaccine/intake/store/cvd/how-to-schedule": [
			{
				element: "button",
				type: "submit",
				id = null,
				nearest_ancestor_id: "content",
				classes: ["btn-control"],
				navigation : true,
			},	
		],
		"https://www.cvs.com/vaccine/intake/store/cvd-store-select/first-dose-select" : [
			{
				element: "input",
				type: "text",
				id: "address",
				value: "72956" // {ZIP}
				// HIT ENTER
			},
			{
				element: "button",
				type: "button",
				id = null,
				nearest_ancestor_id: "content",
				classes: ["search-icon"],
			}
		]
		
	},
}

module.exports = map

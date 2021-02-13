const info = require('./vaxbot_info.js')
const username= info.logins.walgreens.username
const password = info.logins.walgreens.password

let map = {
	start_url: "https://www.walgreens.com/findcare/vaccination/covid-19/eligibility-survey",
	target_url: "https://www.walgreens.com/findcare/vaccination/covid-19/appointment/next-available",
	username: username,
	password : password,

	page_map: {
		"https://www.walgreens.com/login.jsp": [
			{
				element: "input",
				type: "text",
				id: "user_name",
				value: username,
			},
			{
				element: "input",
				type: "text",
				id: "user_password",
				value: password,
			},
			{
				element: "button",
				id: "submit_btn",
				value: null,
				navigation: true,
			},
		],
	
		"https://www.walgreens.com/profile/verify_identity.jsp" : [
			{
				element: "input",
				type: "radio",
				id: "radio-security",
				value: null,
			},

			{
				element: "button",
				type: null,
				id: "optionContinue",
			},
			{
				element: "input",
				type: "text",
				id: "secQues",
				value: "allen"
			},
			{
				element: "button",
				type: null,
				id: "validate_security_answer",
				navigation: true,
			},												
		],
		
		"https://www.walgreens.com/findcare/vaccination/covid-19/location-screening" : [
			{
				element: "input",
				type: "text",
				id: "inputLocation",
				value: info.location,
			},
			{
				element: "button",
				type: null,
				id: null,
				value: null,
				nearest_ancestor_id: "wag-body-main-container",
				classes: ["btn"],
				navigation: false,
			},
			{
				element: "a",
				type: null,
				id: null,
				value: null,
				nearest_ancestor_id: "wag-body-main-container",
				classes: ["mt15"],
				navigation: true,
			},
		],

		"https://www.walgreens.com/findcare/vaccination/covid-19/eligibility-survey" : [
			{
				element: "input",
				type: "radio",
				id: "sq_100i_3", // I have a high risk medical condition
				value: null,
			},
			{
				element: "input",
				type: "checkbox",
				id: "eligibility-check",
				value: null,
			},
			{
				element: "input",
				type: "button",
				id: null,
				value: null,
				nearest_ancestor_id: "sp_100",
				classes: ["sv_complete_btn"],
				navigation: true,
			},
		],
	
		"https://www.walgreens.com/findcare/vaccination/covid-19/appointment/screening" : [
			{
				name: "state_auth",
				element: "input",
				type: "radio",
				id: "sq_100i_1", //No
				value: null,
			},
			{
				name: "symptoms",
				element: "input",
				type: "radio",
				id: "sq_102i_1", //No
				value: null,
			},
			{
				name: "have_covid",
				element: "input",
				type: "radio",
				id: "sq_103i_1", //No
				value: null,
			},
			{
				name: "chronic_health",
				element: "input",
				type: "radio",
				id: "sq_104i_0", //Yes
				value: null,
			},
			{
				element: "input",
				type: "button",
				id: null,
				value: null,
				nearest_ancestor_id: "sp_100",
				classes: ["sv_complete_btn"],
				navigation: true,
			},
		],
	
		"https://www.walgreens.com/findcare/vaccination/covid-19/appointment/screening/results-eligible" : [
			{
				element: "a",
				id: "hn-startVisitBlock-gb-terms",
				value: null,
				navigation: true,
			},	
		],
	
		"https://www.walgreens.com/findcare/vaccination/covid-19/appointment/patient-info" : [
			{
				element:"select",
				id: "race-dropdown",
				value: "2131-1", //other race
			},
			{
				element: "select",
				id: "ethnicity-dropdown",
				value: "UNK", //unknown ethnicity
			},
			{
				element: "input",
				type: "text",
				id: "field-email",
				value: info.email,
			},
			{
				element: "input",
				type: "text",
				id: "field-phone",
				value: info.phone,
			},
			// what type of appointment are you looking for?
			{
				element: "input",
				type: "radio",
				id: "dose1",
				value: null,
			},
			{
				element: "button",
				id: "continueBtn",
				value: null,
				navigation: true,
			},
		],
	
		"https://www.walgreens.com/findcare/vaccination/covid-19/appointment/next-available" : [
			//~ form: [
				//~ {
					//~ name: "location",
					//~ element: "input",
					//~ type: "text",
					//~ id: "search-address",
					//~ value: info.location,
				//~ },
				//~ {
					//~ // this one appears to auto-search with previously provided location. may not need to use submit. the click doesnt seem to work...
					//~ name: "search",
					//~ element: "a",
					//~ id: null,
					//~ value: null,
					//~ nearest_ancestor_id: "wag-body-main-container",
					//~ classes: ["storeSearch"],
				//~ },
			//~ ],

		],
	},
}

module.exports = map

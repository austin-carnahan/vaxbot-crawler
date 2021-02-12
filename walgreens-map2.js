const info = require('./vaxbot_info.js')
const username= info.logins.walgreens.username
const password = info.logins.walgreens.password

let walgreens = {
	base_url: "https://www.walgreens.com",
	departure_url: "https://www.walgreens.com/login.jsp",
	terminus_url: "https://www.walgreens.com/findcare/vaccination/covid-19/appointment/next-available",
	username: username,
	password : password,
	// NEEDS WORK, not currently functional
	security_question: {
		"home": "allen",
		"car": "jeep",
	},
	
	page_map: {
		"https://www.walgreens.com/login.jsp": {
			name: "login",
			form: [
				{
					name: "username",
					element: "input",
					type: "text",
					id: "user_name",
					value: username,
				},
				{
					name: "password",
					element: "input",
					type: "text",
					id: "user_password",
					value: password,
				},
			],
			next:	{
				element: "button",
				id: "submit_btn",
				value: null,
			},
		},
	
		"https://www.walgreens.com/profile/verify_identity.jsp" : {
			name: "security redirect",
			form: [
				{
					name: "security question",
					element: "input",
					type: "radio",
					id: "radio-security",
					value: null,
				},
			],
			next: {
				element: "button",
				type: null,
				id: "optionContinue",
			}				
		},
	
		"https://www.walgreens.com/youraccount/default.jsp" : {
			name: "homepage",
			form: null,
			next: {
				element: null,
				type: null,
				id: null,
				url: "https://www.walgreens.com/findcare/vaccination/covid-19/location-screening",
			},
		},

		"https://www.walgreens.com/findcare/vaccination/covid-19/location-screening" : {
			name: "location screening",
			form: [
				{
					name: "location",
					element: "input",
					type: "text",
					id: "inputLocation",
					value: info.location,
				},
			],
			next: {
				// NO ID on button element! Need to test other selectors
				element: "button",
				type: null,
				id: null,
				value: null,
				nearest_ancestor_id: "wag-body-main-container",
				classes: ["btn"],
			},
		},

		"https://www.walgreens.com/findcare/vaccination/covid-19/eligibility-survey" : {
			name: "eligibility survey",
			form: [
				{
					name: "survey",
					element: "input",
					type: "radio",
					id: "sq_100i_3", // I have a high risk medical condition
					value: null,
				},
				{
					name: "confirm",
					element: "input",
					type: "checkbox",
					id: "eligibility-check",
					value: null,
				},
			],
			next: {
				// NO ID on button element! Need to test other selectors
				element: "input",
				type: "button",
				id: null,
				value: null,
				nearest_ancestor_id: "sp_100",
				classes: ["sv_complete_btn"],
			},
		},
	
		"https://www.walgreens.com/findcare/vaccination/covid-19/appointment/screening" : {
			name: "screening questions",
			form: [
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
			],
			next: {
				// NO ID on button element! Need to test other selectors
				element: "input",
				type: "button",
				id: null,
				value: null,
				nearest_ancestor_id: "sp_100",
				classes: ["sv_complete_btn"]
			},
		},
	
		"https://www.walgreens.com/findcare/vaccination/covid-19/appointment/screening/results-eligible" : {
			name:"results eligible",
			form: null,
			next: {
				element: "a",
				id: "hn-startVisitBlock-gb-terms",
				value: null,
			},	
		},
	
		"https://www.walgreens.com/findcare/vaccination/covid-19/appointment/patient-info" : {
			name: "patient info",
			form: [
				{
					name: "race",
					element:"select",
					id: "race-dropdown",
					value: "2131-1", //other race
				},
				{
					name: "ethnicity",
					element: "select",
					id: "ethnicity-dropdown",
					value: "UNK", //unknown ethnicity
				},
				{
					name: "email",
					element: "input",
					type: "text",
					id: "field-email",
					value: info.email,
				},
				{
					name: "phone",
					element: "input",
					type: "text",
					id: "field-phone",
					value: info.phone,
				},
				// what type of appointment are you looking for?
				{
					name: "dose1",
					element: "input",
					type: "radio",
					id: "dose1",
					value: null,
				},
				//~ {
					//~ name: "dose2",
					//~ element: "input",
					//~ type: "radio",
					//~ id: "dose2",
					//~ value: null,
				//~ },
			],
			next: {
				element: "button",
				id: "continueBtn",
				value: null,
			},
		},
	
		"https://www.walgreens.com/findcare/vaccination/covid-19/appointment/next-available" : {
			name: "appointment search",
			form: null,
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
			next: null,	
		},
	},
}

module.exports = walgreens

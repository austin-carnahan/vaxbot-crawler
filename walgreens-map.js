const info = require('./vaxbot_info.js')
const username= info.logins.walgreens.username
const password = info.logins.walgreens.password

let walgreens = {
	url: "https://www.walgreens.com",
	username: username,
	password : password,
	
	pages: [
		{
			name: "login",
			url: "https://www.walgreens.com/login.jsp",
			next: false,
			form: {
				elements: [
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
				submit:	{
					type: "button",
					id: "submit_btn",
					value: null,
				},
			},
		},
		
		{
			name: "2fa verification",
			url: "https://www.walgreens.com/profile/verify_identity.jsp",
			terminus: false,
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
		
		{
			name: "homepage",
			url: "https://www.walgreens.com/youraccount/default.jsp"
			terminus: false,
			form: null,
			next: {
				element: null,
				type: null,
				id: null,
				url: "https://www.walgreens.com/findcare/vaccination/covid-19/location-screening",
			},
		},
	
		{
			name: "location screening",
			url: "https://www.walgreens.com/findcare/vaccination/covid-19/location-screening",
			next: false,
			form: {
				elements: [
					{
						name: "location",
						element: "input",
						type: "text",
						id: "inputLocation",
						value: info.location,
					},
				],
				submit: {
					// NO ID on button element! Need to test other selectors
					type: "button",
					id: null,
					value: null,
					nearest_ancestor_id: "wag-body-main-container",
					classes: ["btn"],
				},
			},
		},
	
		{
			name: "eligibility survey",
			url: "https://www.walgreens.com/findcare/vaccination/covid-19/eligibility-survey",
			next: false,
			form: {
				elements: [
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
				submit: {
					// NO ID on button element! Need to test other selectors
					element: "input",
					type: "button",
					id: null,
					value: null,
					nearest_ancestor_id: "sp_102",
					classes: ["sv_complete_btn"],
				},
			},
		},
		
		{
			name: "screening questions",
			url: "https://www.walgreens.com/findcare/vaccination/covid-19/appointment/screening",
			next: false,
			form: {
				elements: [
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
				submit: {
					// NO ID on button element! Need to test other selectors
					element: "input",
					type: "button",
					id: null,
					value: null,
					nearest_ancestor_id: "sp_100",
					classes: ["sv_complete_btn"]
				},
			},
		},
		
		{
			name:"results eligible",
			url: "https://www.walgreens.com/findcare/vaccination/covid-19/appointment/screening/results-eligible/",
			next: {
				element: "a",
				id: "hn-startVisitBlock-gb-terms",
				value: null,
			},
			form: null,
		},
		
		{
			name: "patient info",
			url: "https://www.walgreens.com/findcare/vaccination/covid-19/appointment/patient-info",
			next: false,
			form: {
				elements: [
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
					{
						name: "dose2",
						element: "input",
						type: "radio",
						id: "dose2",
						value: null,
					},
				],
				submit: {
					element: "button",
					id: "continueBtn",
					value: null,
				},
			},
		},
		
		{
			name: "appointment search",
			url: "https://www.walgreens.com/findcare/vaccination/covid-19/appointment/next-available",
			next: false,
			form: {
				elements: [
					{
						name: "location",
						element: "input",
						type: "text",
						id: "search-address",
						value: info.location,
					},
				],
				submit: {
					// this one appears to auto-search with previously provided location. may not need to use submit
					element: "a",
					id: null,
					value: null,
					nearest_ancestor_id: "wag-body-main-container",
					classes: ["storeSearch"],
				},
			},
			
		},
	],
}

module.exports = walgreens

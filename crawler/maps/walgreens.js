
const map = {
	name: "walgreens",
	start_url: "https://www.walgreens.com/findcare/vaccination/covid-19/eligibility-survey",
	target_url: "https://www.walgreens.com/findcare/vaccination/covid-19/appointment/next-available",
	pages: {
		"https://www.walgreens.com/login.jsp": [
			{
				element: "input",
				type: "text",
				id: "user_name",
				value: "{USERNAME}",
			},
			{
				element: "input",
				type: "text",
				id: "user_password",
				value: "{PASSWORD}",
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
				value: "{SECURITY_ANSWER}"
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
				value: "{ZIP}",
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
				id: "sq_100i_3",
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
				id: "sq_100i_1",
				value: null,
			},
			{
				name: "symptoms",
				element: "input",
				type: "radio",
				id: "sq_102i_1",
				value: null,
			},
			{
				name: "have_covid",
				element: "input",
				type: "radio",
				id: "sq_103i_1",
				value: null,
			},
			{
				name: "chronic_health",
				element: "input",
				type: "radio",
				id: "sq_104i_0",
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
				value: "2131-1",
			},
			{
				element: "select",
				id: "ethnicity-dropdown",
				value: "UNK",
			},
			{
				element: "input",
				type: "text",
				id: "field-email",
				value: "{EMAIL}",
			},
			{
				element: "input",
				type: "text",
				id: "field-phone",
				value: "{PHONE}",
			},
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

		],
	},
}

module.exports = map;

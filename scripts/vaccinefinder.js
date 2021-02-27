const settings = require("../settings.js");
const vaxfinder_cdc = require("../modules/vaxfinder_cdc.js");

async function vaccinefinder() {
	/* get data from from the CDC API:
	 * 
	 * parameters: ({location}, search_radius (default=25))
	 * 
	 * location = {
	 * 		address1: (String, required), 
	 * 		address2: (optional), 
	 * 		city: (String, required), 
	 * 		state: (String, required, 2 Char State abbreviation), 
	 * 		zip: (String || Number, required)
	 * }
	 * 
	 * returns: an array of CDC provided data formatted for submission to the vaxbot api
	 * */
	let data = await vaxfinder_cdc({
	address1: settings.location.address1,
	address2: settings.location.address2,
	city: settings.location.city,
	state: settings.location.state,
	zip: settings.location.zip,
	}, 
	settings.search_radius
	)

	return data
}

module.exports = vaccinefinder;

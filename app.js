require('dotenv').config();
const fetch = require('node-fetch');

const settings = require("./settings");
const vaccinefinder = require("./scripts/vaccinefinder");
const mogov = require("./scripts/mogov.js");

const url = process.env.VAXBOT_API_URL

// where we'll store data as it arrives.
let results = [];


//scripts to run
const scripts = [
	vaccinefinder,
	mogov,
]


function concat_arrays(arr1, arr2) {
	let temp = arr1.concat(arr2);
	return temp
}


async function send_data() {								// NO SUPPORT FOR MULTIPLE CHANNELS RN
	const channel = await fetch(url + "/v1/channels")
		.then(async res => await res.json())
		//~ .then(json => console.log(json))
		.then(json => json.filter(channel => channel.name === settings.channel))
		.then(channel => channel[0])
	
	for(let item of results) {
		item.channels = [];
		item.channels.push(channel._id);
	}
	
	console.log(results);
	
	await fetch(url + "/v1/locations/batch", {
		method: 'POST',
		body: JSON.stringify(results),
		headers: { 'Content-Type': 'application/json' }
	})
		//~ .then(async res => await res.json())
		.then(json => console.log(json))
		
}


async function start_crawler() {
	for(let script of scripts) {
		try {
			let data = await script();
			results = concat_arrays(results, data);
		} catch(err) {
			console.log(`FAILURE. Aborting script... \n ${err}`);
		}
	}
	try {
		send_data()
	} catch (err) {
		console.log(`ERROR. Unable to send data: \n ${err}`)
	}
}

start_crawler();









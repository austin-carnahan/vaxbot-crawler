require('dotenv').config();
const fetch = require('node-fetch');
const request = require('request');

const settings = require("./settings");
const get_access_token = require('./scripts/vaxbot-authenticate.js')

const vaccinefinder = require("./scripts/vaccinefinder");
const mogov = require("./scripts/mogov.js");
const walmart = require("./scripts/walmart.js")

const url = process.env.VAXBOT_API_URL

// where we'll store data as it arrives.
let results = [];


//scripts to run. Dont forget to import new ones!
const scripts = [
	//~ vaccinefinder,
	mogov,
	//~ walmart
]


function concat_arrays(arr1, arr2) {
	let temp = arr1.concat(arr2);
	return temp
}


async function send_data(err, ACCESS_TOKEN) {
	if(err) {
		throw new Error("Authentication Error: " + err)
	}
	
	console.log(ACCESS_TOKEN)
	
	const channel = await fetch(url + "/v1/channels")
		.then(async res => await res.json())
		.then(json => json.filter(channel => channel.name === settings.channel))
		.then(channel => channel[0])
	
	for(let item of results) {
		item.channel = channel._id;
	}
	
	console.log(results);
	
	await fetch(url + "/v1/providers/batch", {
		method: 'POST',
		body: JSON.stringify(results),
		headers: { 'Content-Type': 'application/json', 'authorization' : `Bearer ${ACCESS_TOKEN}` },
		
	})
		//~ .then(async res => await res.json())
		.then(res => console.log(res))
		
}


async function start_crawler() {
	for(let script of scripts) {
		try {
			let data = await script();
			console.log(data);
			results = concat_arrays(results, data);
		} catch(err) {
			console.log(`FAILURE. Aborting script... \n ${err}`);
		}
	}
	try {
		// mixing in Auth0 boilerplate callback syntax bc still cant get a fetch version to work
		get_access_token(send_data);
	} catch (err) {
		console.log(`ERROR. Unable to send data: \n ${err}`)
	}
}

start_crawler();









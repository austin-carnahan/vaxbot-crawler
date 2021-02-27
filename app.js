require('dotenv').config();
const settings = require("./settings");

const vaccinefinder = require("./scripts/vaccinefinder");
const mogov = require("./scripts/mogov.js");


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

async function start_crawler() {
	for(let script of scripts) {
		try {
			let data = await script();
			results = concat_arrays(results, data);
		} catch(err) {
			console.log(`FAILURE. Aborting script... \n ${err}`);
		}
	}
	
	for(let item of results) {
		item.channels = [settings.channel];
	}
	
	console.log(results);
}

start_crawler();









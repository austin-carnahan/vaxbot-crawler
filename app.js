require('dotenv').config();
const settings = require("./settings")

const vaccinefinder = require("./scripts/vaccinefinder");

// where we'll store data as it arrives.
let results = [];

//scripts to run
const scripts = [
	vaccinefinder,
]

function concat_arrays(arr1, arr2) {
	let temp = arr1.concat(arr2);
	return temp
}

async function start_finder() {
	for(let script of scripts) {
		let data = await script();
		results = concat_arrays(results, data);
	}
	
	for(let item of results) {
		item.channels = [settings.channel];
	}
	
	console.log(results);
}

start_finder();









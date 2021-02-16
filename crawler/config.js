const user = require("./.USER.js")

// json site maps
const walgreens = require("./maps/walgreens.js");
const walmart = require("./maps/walmart.js");


console.log(walmart);

// register crawler targets
const TARGETS = [
	//walgreens,
	walmart
]


// insert site credentials and user info into target maps
TARGETS.forEach(function(item, index) {
	try {
		let data = JSON.stringify(item.map);
		for(let obj in user.personal) {
			let placeholder = "{" + obj + "}";
			let replacer = new RegExp(placeholder, 'g');
			data = data.replace(replacer, user.personal[obj]);
		};
		if (user.logins[item.map.name]) {
			for(let obj in user.logins[item.map.name]){
				let placeholder = "{" + obj + "}";
				let replacer = new RegExp(placeholder, 'g');
				data = data.replace(replacer, user.logins[item.map.name][obj]);
			}
		}
		TARGETS[index].map = JSON.parse(data);
	} catch (err) {
		console.error(`ERROR: failed to parse target map: ${TARGETS[index].map.name}. Removing map from TARGETS.\n ${err}`);
		TARGETS.splice(index, 1);
		return;
	}
})

let map_names = TARGETS.map( item => item.map.name);
console.log(`The following target maps were successfully prepared: ${map_names}`);

module.exports = TARGETS;

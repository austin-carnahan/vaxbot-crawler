const user = require("./.USER.js")

// json site maps
const walgreens = require("./maps/walgreens.js");
const walmart = require("./maps/walmart.js");


// register crawler targets
const TARGETS = [
	//walgreens,
	walmart,
]


// insert site credentials and user info into target maps
TARGETS.forEach(function(map, index) {
	try {
		let data = JSON.stringify(map);
		for(let item in user.personal) {
			let placeholder = "{" + item + "}";
			let replacer = new RegExp(placeholder, 'g');
			data = data.replace(replacer, user.personal[item]);
		};
		if (user.logins[map.name]) {
			for(let item in user.logins[map.name]){
				let placeholder = "{" + item + "}";
				let replacer = new RegExp(placeholder, 'g');
				data = data.replace(replacer, user.logins[map.name][item]);
			}
		}
		TARGETS[index] = JSON.parse(data);
	} catch (err) {
		console.error(`ERROR: failed to parse target map: ${TARGETS[index].name}. Removing map from TARGETS.\n ${err}`);
		TARGETS.splice(index, 1);
		return;
	}
})

let map_names = TARGETS.map( item => item.name);
console.log(`The following target maps were successfully prepared: ${map_names}`);
//~ console.log(TARGETS[0].pages['https://www.walgreens.com/login.jsp']);


module.exports = TARGETS;

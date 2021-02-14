const user = require("./.USER.js")

// json site maps
const walgreens = require("./maps/walgreens.js");
const walmart = require("./maps/walmart.js");


// register as crawler targets
const TARGETS = [
	walgreens,
	//walmart,
]


// insert site credentials and user info into maps
TARGETS.forEach(function(map, index) {
	let data = JSON.stringify(map);
	for(let item in user.personal) {
		let placeholder = "{" + item + "}";
		let replacer = new RegExp(placeholder, 'g');
		data = data.replace(replacer, user.personal[item]);
	};
	for(let item in user.logins[map.name]){
		let placeholder = "{" + item + "}";
		let replacer = new RegExp(placeholder, 'g');
		data = data.replace(replacer, user.logins[map.name][item]);
	}
	TARGETS[index] = JSON.parse(data);
})

//~ console.log(TARGETS[0].pages['https://www.walgreens.com/login.jsp']);


module.exports = TARGETS;

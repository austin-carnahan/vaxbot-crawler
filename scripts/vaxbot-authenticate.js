require('dotenv').config();
const fetch = require('node-fetch');
const request = require('request');

// this should ideally use the fetch syntax and not callback. Plus request is deprecated. Not ideal.
// After trying a bunch of different ways, stuck with this biolerplate bc keep getting 400 with fetch. No message explaining

var get_access_token = function(callback) {
	if (!process.env.AUTH0_DOMAIN) {
		callback(new Error('The AUTH0_DOMAIN is required in order to get an access token (verify your configuration).'));
	}

	console.log('Fetching access token from https://' + process.env.AUTH0_DOMAIN + '/oauth/token');

	var options = {
		method: 'POST',
		url: 'https://' + process.env.AUTH0_DOMAIN + '/oauth/token',
		headers: {
			'cache-control': 'no-cache',
			'content-type': 'application/json'
		},
		body: {
		audience: "https://api.vaxbot.org",
		grant_type: 'client_credentials',
		client_id: process.env.AUTH0_CLIENT_ID,
		client_secret: process.env.AUTH0_CLIENT_SECRET,
		},
		json: true
	};

	request(options, function(err, res, body) {
		if (err || res.statusCode < 200 || res.statusCode >= 300) {
			console.log("ERROR")
			return callback(res && res.body || err);
		}
		console.log("NO ERROR")
		callback(null, body.access_token);
	});
}


module.exports = get_access_token

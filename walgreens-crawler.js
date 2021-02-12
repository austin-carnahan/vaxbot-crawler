//ummm this is new. Hello World.
const request = require('request-promise');
const $ = require('cheerio');
const puppeteer = require('puppeteer');
const walgreens = require("./walgreens-map.js")

let url = walgreens.pages[0].url

request(url)
	.then(html => console.log(html))
	.catch(err => console.error(err))

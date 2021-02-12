//ummm this is new. Hello World.
const request = require('request-promise');
const $ = require('cheerio');
const puppeteer = require('puppeteer');
const url = require('url');
const walgreens = require("./walgreens-map2.js");

let departure_url = walgreens.departure_url;
let terminus_url = walgreens.terminus_url;


function stripURL(url_string){
	let result = new URL(url_string);
	return result.origin + result.pathname.replace(/\/$/, '');	
}


(async () => {
	
	// great info on how to keep headless chrome from being blocked:
	// https://jsoverson.medium.com/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
	// STATUS: still being blocked  
	
	const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser',
											headless: false});
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(50000);
	
	// Trying to hide the fact that we're headless and automated
	await page.setUserAgent('Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.197 Safari/537.36');
	await page.setExtraHTTPHeaders({'Accept-Language': 'en-US,en;q=0.9'});
	
	
	await page.goto(departure_url);
	
	// Make sure we have a map for the page we are on
	let view_url = stripURL(page.url());
	if(walgreens.page_map[view_url]){
		let view = walgreens.page_map[view_url];
	} else {
		console.log("ERROR: view URL not in map. You may have been redirected.");
		await page.screenshot({ path: 'screenshots/URL_not_in_map.png' });
		await browser.close();
		process.exit()
	}
	
	// Fill out the form
	for(let i=0; i< view.form.length; i++){
		
		const selector = view.form[i].element + "[id=" + view.form[i].id + "]";
		const data = view.form[i].value;
		
		// this gives our bot a lil more human touch
		await page.focus(selector)
		await page.click(selector);
		
		// if an option, typing helps keep us undetected and unblocked
		if(view.form[i].type == "text") {
			await page.type(selector, data); 
		} else {
			await page.$eval(selector, (elem, value) => elem.value = value, data);
		}	
	}
	
	// Navigate to the next page
	let selector = view.next.element + "[id=" + view.next.id + "]";
	
	// puppeteer docs suggest this combined promise syntax to avoid race conditions when clicks trigger navigation
	const [response] = await Promise.all([
	  page.waitForNavigation(),
	  page.click(selector)
	]);
	
	
})();


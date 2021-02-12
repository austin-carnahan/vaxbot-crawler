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

function buildSelector(element) {
	let selector = null;
	if(element.id) {
		selector = `${element.element}[id="${element.id}"]`;
	} else if(element.nearest_ancestor_id && element.classes && element.element){
		// this takes the form of #id * element[type=example].classname OR #id * element.classname
		selector = `#${element.nearest_ancestor_id} * ${element.element}${element.type ? `[type=${element.type}]` : ``}.${element.classes[0]}`; 
	}
	console.log(`generated selector: ${selector}`);
	return selector;
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
	let count = 0;
	
	while (count < 7) {
		
		// Make sure we have a map for the page we are on
		let view_url = stripURL(page.url());
		let view = {};
		
		if(walgreens.page_map[view_url]){
			view = walgreens.page_map[view_url];
		} else {
			console.log(`ERROR: view URL: ${view_url} not found in map. You may have been redirected.`);
			await page.screenshot({ path: 'screenshots/URL_not_in_map.png' });
			await browser.close();
			process.exit()
		}
		
		// Fill out the form
		if(view.form) {
			for(let i=0; i< view.form.length; i++){
				
				const selector = buildSelector(view.form[i]);
				//~ const selector = view.form[i].element + "[id=" + view.form[i].id + "]";
				const data = view.form[i].value;
				
				/*
				* if this is a text input or a select element, nothing happens here,
				* but clicking them before manipulating gives a lil more human feel
				* for some reason page.click() works poorly on radio buttons, docs here:
				* https://github.com/puppeteer/puppeteer/issues/3347
				*/
				
				await page.waitForSelector(selector);				
				await page.$eval(selector, elem => elem.click());
				
				if(view.form[i].type == "text") {
					//clear pre-filled text
					// if an option, typing helps keep us undetected and unblocked
					//can maybe do this better by triple clicking and hitting backspace
					await page.$eval(selector, (elem) => elem.value = "");
					await page.type(selector, data); 
				} else if (view.form[i].type == "select"){
					await page.$eval(selector, (elem, value) => elem.value = value, data);
				}	
			}
		}
		
		// Navigate to the next page
		const selector = buildSelector(view.next);	
		if (selector) {
			// puppeteer docs suggest this combined promise syntax to avoid race conditions when clicks trigger navigation
			await page.waitForSelector(selector);
			const [response] = await Promise.all([
				page.click(selector),
				page.waitForNavigation()
			]);
			
		} else if (view.next.url) {
			await page.goto(view.next.url);
		
		} else {
			console.log("ERROR: Nowhere to go")
		}
		
		count += 1;
	}
})();


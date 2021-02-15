const puppeteer = require('puppeteer');
const url = require('url');

function stripURL(url_string){
	// remove query parameters and trailing '/'
	let result = new URL(url_string);
	return result.origin + result.pathname.replace(/\/$/, '');	
}

function buildSelector(element) {
	let selector = null;
	if(element.id && element.element) {
		selector = `${element.element}[id="${element.id}"]`;
	} else if(element.data_automation_id && element.element) {
		selector = `${element.element}[data-automation-id="${element.data_automation_id}"]${ element.classes ? '.'+element.classes[0] : '' }`;
	} else if(element.nearest_ancestor_id && element.classes && element.element){
		// this takes the form of #id * element[type=example].classname OR #id * element.classname
		selector = `#${element.nearest_ancestor_id} * ${element.element}${element.type ? `[type=${element.type}]` : ``}.${element.classes[0]}`; 
	} else {
		throw new Error(`Not enough information to build selector.`);
	}
	console.log(`generated element selector: ${selector}`);
	return selector;
}

class Crawler {
	constructor(map) {
		this.map = map;
		this.start_url = map.start_url;
		this.target_url = map.target_url;
	}
	
	async crawl() {
		// great info on how to keep headless chrome from being blocked:
		// https://jsoverson.medium.com/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
		// STATUS: still being blocked
		
		try {  
			console.log("Launching puppet Chromium browser...");
			const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser',
													headless: false});
			const page = await browser.newPage();
			await page.setDefaultNavigationTimeout(50000);
			
			// Trying to hide the fact that we're headless and automated
			await page.setUserAgent('Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.197 Safari/537.36');
			await page.setExtraHTTPHeaders({'Accept-Language': 'en-US,en;q=0.9'});
			
			// Start
			console.log(`navigating to start url: ${this.start_url}`);
			
			await page.goto(this.start_url);
			let view_url = this.start_url;
			
			while (view_url != this.target_url) {
				view_url = stripURL(page.url());
				let elements = [];
				console.log(`initializing page crawl on: ${view_url}`);
				
				if (this.map.pages[view_url]) {
					elements = this.map.pages[view_url];
					console.log("SUCCESS: current view located in map.pages");
				} else {
					throw new Error(`View URL: ${view_url} not found in map. You may have been redirected.`);
				}
				
				console.log("searching for elements...")
				for(let i=0; i< elements.length; i++){
					const selector = buildSelector(elements[i]);
					const data = elements[i].value;
					
					await page.waitForSelector(selector);
					console.log("element located with matching selector");
					
					if(elements[i].navigation){!
						console.log("navigating to new url...");
						const [response] = await Promise.all([
							page.click(selector),
							page.waitForNavigation()
						]);
						break;
					}
					
					/*
					* if this is a text input or a select element, nothing happens with the first click,
					* but clicking before manipulating gives a lil more human feel.
					* page.click() works poorly on radio buttons, docs here:
					* https://github.com/puppeteer/puppeteer/issues/3347
					*/						
					await page.$eval(selector, item => item.click());
					
					if(elements[i].type == "text") {
						// if it's an option, typing helps keep us undetected and unblocked
						// can also clear text by triple clicking and hitting backspace
						if(!data) {
							throw new Error(`ERROR: No value provided for input element: ${elements[i]}`);
						}
						await page.$eval(selector, (item) => item.value = "");
						await page.type(selector, data); 
					} else if (elements[i].type == "select"){
						await page.$eval(selector, (item, value) => item.value = value, data);
					}	
				}
			}
			return 5;
		} catch (err) {
			console.error(err);
			try {
				await page.screenshot({ path: 'debug/screenshots/URL_not_in_map.png' });
				await browser.close();
			} catch (err) {
				console.error(err);
			}
			throw err;
		}
	}
	
}

module.exports = Crawler;

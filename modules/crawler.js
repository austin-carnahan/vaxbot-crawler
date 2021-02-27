//~ const puppeteer = require('puppeteer');

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const url = require('url');

function stripURL(url_string){
	// remove query parameters and trailing '/'
	let result = new URL(url_string);
	return result.origin + result.pathname.replace(/\/$/, '');	
}

function buildSelector(element, descendants = false) {
	let selector = null;

	if(element.id && element.element) {
		selector = `${element.element}[id="${element.id}"]`;
	} else if(element.data_automation_id && element.element) {
		selector = `${element.element}[data-automation-id="${element.data_automation_id}"]${ element.classes ? '.'+element.classes[0] : '' }`;
	} else if(element.nearest_ancestor_id && element.classes && element.element){
		// this takes the form of #id * element[type=example].classname OR #id * element.classname
		selector = `#${element.nearest_ancestor_id} * ${element.element}${element.type ? `[type=${element.type}]` : ``}.${element.classes[0]}`;
	} else if(element.nearest_ancestor_da_id_element && element.nearest_ancestor_da_id && element.element && element.classes) {
		selector = `${element.nearest_ancestor_da_id_element}[data-automation-id="${element.nearest_ancestor_da_id}"] ${element.element}${ element.classes ? '.'+element.classes[0] : '' }`;
	} else {
		throw new Error(`Not enough information to build selector.`);
	}

	if(descendants){
		selector += ` ${element.descendant}${element.d_type ? `[type=${element.d_type}]` : ``}${element.d_class ? `.${element.d_class}` : ``}`;
	}
		
	console.log(`generated element selector: ${selector}`);
	return selector;
}

class Crawler {
	constructor(map, Target) {
		this.map = map;
		this.start_url = map.start_url;
		this.target_url = map.target_url;
		this.Target = Target;
		this.targets = [];
		this.looping = false;
		this.loop = 0,
		this.crawl = this.crawl.bind(this); //bind context for recursive crawler calls
	}
	
	async crawl(existing_target=null, sub_crawl=false, current_page=null, current_url=null, elements_list=null) {
		// great info on how to keep headless chrome from being blocked:
		// https://jsoverson.medium.com/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
		
		//let crawling = true;
		let page;
		let view_url;
		let target;
		let elements;
		let browser;
		
		try {

			if(!sub_crawl) {
				target = new this.Target(this.map)
				elements = null;
				view_url = this.start_url;
				  
				console.log("Launching puppet Chromium browser...");
				browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser',
														headless: false});
				page = await browser.newPage();
				await page.setDefaultNavigationTimeout(50000);
				
				// Trying to hide the fact that we're headless and automated
				//await page.setUserAgent('Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.197 Safari/537.36');
				//await page.setExtraHTTPHeaders({'Accept-Language': 'en-US,en;q=0.9'});
				await page.setCacheEnabled(false);
				
				//// TEST CODE FOR INTERCEPTION ////
				await page._client.send('Network.setBypassServiceWorker', {bypass: true})
				await page.setRequestInterception(true);
				let index = null;
				if(this.looping) {
				 index = this.loop;
				}
				
				page.on('request', async (request) => {
					if(this.map.http_request_listener) {
						let url = this.map.http_request_listener.url;
						//~ let skip = this.map.http_request_listener.ignore;
						if(request.url().includes(url) ) {
							console.log("URL MATCH!");
							console.log('>>', request.method(), request.url(), request.headers())			
						}
					}
					request.continue()
				})
				
				page.on('response', async (response) => {
					
					if(this.map.http_request_listener) {
						let url = this.map.http_request_listener.url
						//~ let skip = this.map.http_request_listener.ignore;
						if(response.url().includes(url)) {
							console.log('<<', response.status(), response.url());
							console.log("URL MATCH!");
							await page.waitForTimeout(3000);
							let r_url = response.url()
							console.log(response);
							let data = response.body;
							console.log(data)
							let json = await response.json();
							
							console.log(data)
							//~ await response.json().then(response => target[map.http_request_listener.target](response, index, r_url));			
						}
					}
				});	
				
				// Start
				console.log(`navigating to start url: ${this.start_url}`);			
				await page.goto(view_url);			
				
			} else {
				console.log("starting sub crawl...")
				page = current_page;
				view_url = current_url;
				this.target_url = current_url;
				elements = elements_list;
				target = existing_target;
			}
				
			do {
				console.log(view_url);
				console.log(this.target_url);

				if(!sub_crawl) {
					view_url = stripURL(page.url());
					console.log(`initializing page crawl on: ${view_url}`);
					
					if (this.map.pages[view_url]) {
						elements = this.map.pages[view_url];
						console.log("SUCCESS: current view located in map.pages");
					} else {
						throw new Error(`View URL: ${view_url} not found in map. You may have been redirected. \n
										Also, check for trailing slashes in map URLS`);
					}
				};
								
				console.log("searching for elements...")
				for(let i=0; i< elements.length; i++){
					//~ if(elements[i].data_automation_id == "store-list-container"){
						//~ await page.waitForTimeout(240000);					
						 //~ i--;
					//~ }
					// FOR EACH DESCENDANT ELEMENT LOGIC	//TO DO: MAKE SURE THIS FAILS CORRECTLY!							
					if(elements[i].for_each) {
						const selector = buildSelector(elements[i], true);
						await page.waitForSelector(selector + ":nth-child(1)"); // one of the elements in the list
						
						//page.eval evaluates the given function in the BROWSER context!!! Not node
						let elems_count = await page.$$eval(selector, elems => elems.length);
						
						// LOOP LOGIC
						// This whole thing seems dangerous and sloppy;
						if(elements[i].loop){
							this.looping = true;
							
							console.log("LOOPING! Count at: " + this.loop);
							
							if(elements[i].target) {
								console.log(`searching for target...in loop block`);
								let data;
								data = await page.$$eval(selector, (items, index, process) =>
									(process.method == "getAttribute") ? items[index].getAttribute(process.value) : items[index].textContent, this.loop, elements[i].process);
								console.log(`target retrieved: ${data}`);
								target[elements[i].target](data);
							}
							
							console.log("clicking loop selection");
							await page.$$eval(selector, (items, index) =>
								items[index].click(), this.loop)
								
							this.loop += 1;
						
							if(this.loop >= elems_count) {
								this.looping = false;
								this.loop = 0;
							};
							
							continue;
						}	
						
						for(let j=0; j < elems_count; j++) {
							
							// EACH DESCENDANT IS A DATA TARGET												
							if(elements[i].target) {
								console.log(`searching for target ${j}...`);
								let data;
								data = await page.$$eval(selector, (items, j, process) => 
									(process.method == "getAttribute") ? items[j].getAttribute(process.value) : items[j].textContent, j, elements[i].process);							
								console.log(`target retrieved: ${data}`);
								target[elements[i].target](data);
								
								// EACH DESCENDANT IS AN ENTIRE TARGET
								if(elements[i].full_target && !(j == elems_count -1)) {
									this.targets.push(target);
									target = new this.Target(this.map);
								}						
							}		
							
							// START A RECURSIVE SUBCRAWL ON EACH DESCENDANT
							if(elements[i].subcrawl_elements) {
								console.log("subcrawl elements found...");
								await page.$$eval(selector, (items, j) => items[j].click(), j);
								// pause for visual inspection
								await page.waitForTimeout(200);
								target = await this.crawl(target, true, page, view_url, elements[i].subcrawl_elements);								
							
							// OR JUST CLICK EACH DESCENDANT ELEMENT
							} else {
								await page.$$eval(selector, (items, j) => items[j].click(), j);
							}
						
						}		
						continue;
					}
					
					const selector = buildSelector(elements[i]);
					const data = elements[i].value;
					
					// ELEMENT IS DATA TARGET
					if(elements[i].target) {
						try{
							console.log("searching for target...")
							await page.waitForSelector(selector, { timeout : 9000 });
						} catch (err) {
							console.log("Failed to identify target. Skipping \n" + err);
							continue;
						}
						
						console.log("target identified, extracting data...");
						let data;
						if(elements[i].process.method == "textContent") {
							data = await page.$eval(selector, results => results.textContent);
						} else if(elements[i].process.method == "getAttribute") {
							data = await page.$eval(selector, results => results.getAttribute(elements[i].process.value));
						} else {
							console.log( "unable to process target");
						}
						target[elements[i].target](data);
						
						console.log(target);
						continue;
						
					}
					try{
						await page.waitForSelector(selector);
					} catch(err) {
						console.error(`UNABLE TO LOCATE SELECTOR: Dumping target data! \n ${err}`);
						target = null;
						break;
					}
					console.log("element located");
					
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
					* page.click() works poorly on radio buttons, use $eval instead, docs here:
					* https://github.com/puppeteer/puppeteer/issues/3347
					*/						
					console.log("clicking...");
					if(elements[i].click_type == "puppet") {
						await page.click(selector);
					} else {
						await page.$eval(selector, item => item.click());
					}
					
					if(elements[i].type == "text" || elements[i].type == "number") {
						// if it's an option, typing helps keep us undetected and unblocked
						// can also clear text by triple clicking and hitting backspace
						console.log("typing...");
						if(!data) {
							throw new Error(`ERROR: No value provided for input element: ${elements[i]}`);
						}
						let existing_text = await page.$eval(selector, (item) => item.value)
						await page.focus(selector);
						for(let i=0; i<existing_text.length; i++){
							await page.keyboard.press('Backspace');
						}
						await page.$eval(selector, (item) => item.value = "");
						await page.type(selector, data); 
						
					} else if (elements[i].type == "select"){
						console.log("selecting...");
						await page.$eval(selector, (item, value) => item.value = value, data);
					}	
					await page.waitForTimeout(1000);
					
				}
				
				if(!sub_crawl && this.looping) {
					console.log(" RESETTING TO START. looping TRUE");
					if(target){
						this.targets.push(target);
					}
					target = new this.Target(this.map);
					view_url = this.start_url;
					await page.goto(this.start_url);
				}
			} while (view_url != this.target_url || this.looping);
			console.log("LEFT WHILE LOOP");
			console.log(sub_crawl);
			console.log(this.looping);
			
			if(sub_crawl){
				console.log("END SUBCRAWL")
				return target;
			} else {
				this.targets.push(target);
				await browser.close();
				return this.targets;
				
			}
			
		} catch (err) {
			console.error(err);
			//~ await page.screenshot({ path: 'debug/screenshots/URL_not_in_map.png' });
			//~ await browser.close();
			//throw err;
		}
	}
	
}

module.exports = Crawler;

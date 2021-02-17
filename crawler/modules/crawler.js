const puppeteer = require('puppeteer');
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
		selector += ` ${element.descendant}${element.d_type ? `[type=${element.d_type}]` : ``}`;
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
		this.forking = false;
		this.fork_count = null,
		this.crawl = this.crawl.bind(this); //bind context for recursive crawler calls
	}
	
	async crawl(existing_target=null, sub_crawl=false, current_page=null, current_url=null, elements_list=null) {
		// great info on how to keep headless chrome from being blocked:
		// https://jsoverson.medium.com/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
		// STATUS: still being blocked by walgreens
		
		//let crawling = true;
		let page;
		let view_url;
		let target;
		let elements;
		let browser;
		
		try {

			if(!sub_crawl){
				target = new this.Target(this.map.name)
				elements = null;
				view_url = this.start_url;
				  
				console.log("Launching puppet Chromium browser...");
				browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser',
														headless: false});
				page = await browser.newPage();
				await page.setDefaultNavigationTimeout(50000);
				
				// Trying to hide the fact that we're headless and automated
				await page.setUserAgent('Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.197 Safari/537.36');
				await page.setExtraHTTPHeaders({'Accept-Language': 'en-US,en;q=0.9'});
				
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
						throw new Error(`View URL: ${view_url} not found in map. You may have been redirected.`);
					}
				};
								
				console.log("searching for elements...")
				for(let i=0; i< elements.length; i++){
													
					if(elements[i].for_each) {
						const selector = buildSelector(elements[i], true);
						await page.waitForSelector(selector + ":nth-child(1)"); // one of the elements in the list
						
						//page.eval evaluates the given function in the BROWSER context!!! Not node
						let elems_count = await page.$$eval(selector, elems => elems.length);
						
						// This whole thing seems dangerous and sloppy;
						if(elements[i].fork){
							this.forking = true;
							if(!this.fork_count){
								this.fork_count = 0;
							}
							
							console.log("FORKING! Count at: " + this.fork_count);
							
							if(this.fork_count < elems_count){
								if(elements[i].target) {
									console.log(`searching for target...in fork block`);
									let data;
									data = await page.$$eval(selector, (items, index, process) =>
										(process.method == "getAttribute") ? items[index].getAttribute(process.value) : items[index].textContext, this.fork_count, elements[i].process);
									console.log(`target retrieved: ${data}`);
									target[elements[i].target](data);
								}
								
								console.log("clicking fork selection");
								await page.$$eval(selector, (items, index) =>
									items[index].click(), this.fork_count)
									
								this.fork_count += 1;
								if(this.fork_count >= elems_count) {
									this.forking = false;
									this.fork_count = null;
								}
							}
							continue;
						}
						
						console.log(`iterating over ${elems_count} child elements...`);	
						for(let j=0; j < elems_count; j++) {
							
							// browser context logic for element j						
							
							
							if(elements[i].target) {
								console.log(`searching for target...`);
								let data;
								data = await page.$$eval(selector, (items, j, process) => 
									(process.method == "getAttribute") ? items[j].getAttribute(process.value) : items[j].textContext, j, elements[i].process);							
								console.log(`target retrieved: ${data}`);
								target[elements[i].target](data);						
							}		
							
							// node context logic for element j
							
							if(elements[i].subcrawl_elements) {
								console.log("subcrawl elements found...");
								await page.$$eval(selector, (items, j) => items[j].click(), j);
								// pause for visual inspection
								await page.waitForTimeout(200);
								target = await this.crawl(target, true, page, view_url, elements[i].subcrawl_elements);								
							}
						}		
						continue;
					}
					
					const selector = buildSelector(elements[i]);
					const data = elements[i].value;
					
					// Map element is target
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
					
					await page.waitForSelector(selector);
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
					await page.$eval(selector, item => item.click());
					
					if(elements[i].type == "text") {
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
				}
				
				if(!sub_crawl && this.forking) {
					console.log(" RESETTING TO START. FORKING TRUE");
					this.targets.push(target);
					target = new this.Target(this.map.name);
					view_url = this.start_url;
					await page.goto(this.start_url);
				}
			} while (view_url != this.target_url);
			console.log("LEFT WHILE LOOP");
			console.log(sub_crawl);
			console.log(this.forking);
			
			if(sub_crawl){
				console.log("subcrawl block")
				return target;
			} else {
				this.targets.push(target);
				await browser.close();
				return this.targets;
				
			}
			
		} catch (err) {
			console.log("SOME WIERD ERROR!!!!!")
			console.error(err);
			//~ await page.screenshot({ path: 'debug/screenshots/URL_not_in_map.png' });
			//~ await browser.close();
			//throw err;
		}
	}
	
}

module.exports = Crawler;

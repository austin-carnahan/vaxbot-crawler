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
	// Currently will not work in headless mode. 
	const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser',
											headless: false});

	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(50000);
	await page.setUserAgent('Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.197 Safari/537.36');
	await page.setExtraHTTPHeaders({'Accept-Language': 'en-US,en;q=0.9'});
	await page.goto(departure_url);
	
	// great info on how to keep headless crhome from being blocked:
	// https://jsoverson.medium.com/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
	
	let view_url = stripURL(page.url());
	let view = walgreens.page_map[view_url];
	
	for(let i=0; i< view.form.length; i++){
		const selector = view.form[i].element + "[id=" + view.form[i].id + "]";
		const data = view.form[i].value;
		await page.focus(selector)
		await page.click(selector);
		if(view.form[i].type == "text") {
			await page.type(selector, data); 
		} else {
			await page.$eval(selector, (elem, value) => elem.value = value, data);
		}	
	}
	
	let selector = view.next.element + "[id=" + view.next.id + "]";
	const [response] = await Promise.all([
	  page.waitForNavigation(),
	  page.click(selector)
	]);
	
	//~ await page.type('#' + walgreens.pages[0].form.elements[0].id, walgreens.pages[0].form.elements[0].value);
	//~ await page.type('#' + walgreens.pages[0].form.elements[1].id, walgreens.pages[0].form.elements[1].value);
	
	// puppeteer docs suggest this combined promise syntax to avoid race conditions when clicks cause navigation
	//~ const [response] = await Promise.all([
	  //~ page.waitForNavigation(),
	  //~ page.click('#' + walgreens.pages[0].form.submit.id)
	//~ ]);
	
	//~ await page.goto(walgreens.pages[1].url)
	
	// await page.keyboard.press('Enter');
	// await page.waitForNavigation();
	
	//await page.screenshot({ path: 'example2.png' });
	console.log('New Page URL:', page.url());
	//~ await browser.close();
})();


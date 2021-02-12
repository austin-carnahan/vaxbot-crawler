//ummm this is new. Hello World.
const request = require('request-promise');
const $ = require('cheerio');
const puppeteer = require('puppeteer');
const walgreens = require("./walgreens-map.js");

let url = walgreens.pages[0].url;


(async () => {
	// Currently will not work in headless mode. 
	const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser',
											headless: false});

	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(50000);
	await page.setUserAgent('Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.197 Safari/537.36');
	await page.setExtraHTTPHeaders({'Accept-Language': 'en-US,en;q=0.9'});

	// great info on how to keep headless crhome from being blocked:
	// https://jsoverson.medium.com/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c

	// TEST code for debugging HTTP headers
	//~ const response = await page.goto('http://scooterlabs.com/echo.json');
	//~ console.log(await response.json());
	//~ await browser.close();

	await page.goto(url);
	await page.type('#' + walgreens.pages[0].form.elements[0].id, walgreens.pages[0].form.elements[0].value);
	await page.type('#' + walgreens.pages[0].form.elements[1].id, walgreens.pages[0].form.elements[1].value);
	
	// puppeteer docs suggest this combined promise syntax to avoid race conditions when clicks cause navigation
	const [response] = await Promise.all([
	  page.waitForNavigation(),
	  page.click('#' + walgreens.pages[0].form.submit.id)
	]);
	
	await page.goto(walgreens.pages[1].url)
	
	//~ await page.keyboard.press('Enter');
	//~ await page.waitForNavigation();
	
	//await page.screenshot({ path: 'example2.png' });
	console.log('New Page URL:', page.url());
	await browser.close();
})();


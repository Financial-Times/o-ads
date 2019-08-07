const puppeteer = require('puppeteer');

const getConfig = () => {
	const debugging_mode = {
		headless: false,
		slowMo: 250,
		devtools: true
	};

	// Once the PoC is working we can decide to return
	// different configs for different scnearios
	return debugging_mode;
};

describe('on page load', () => {
	test('h1 loads correctly', async () => {
		const browser = await puppeteer.launch(getConfig());
		const page = await browser.newPage();

		await page.goto('http://localhost:3002/demos/local/Individual-Ad.html');
		const iframeSelector = '#google_ads_iframe_/5887/test.5887.origami_0';
		const html = await page.$eval(iframeSelector, e => e.innerHTML );
		expect(html).toBe('a');
		browser.close();
	});
});

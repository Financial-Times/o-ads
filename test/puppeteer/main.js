const puppeteer = require('puppeteer');
const { checkRequestWithParams } = require('./testUtils/network-utils');

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



describe('Individual Ad', () => {
	let browser;
	let page;

	beforeAll(async () => {
		browser = await puppeteer.launch(getConfig());
		page = await browser.newPage();

		page.goto('http://localhost:3002/demos/local/Individual-Ad.html');
	}, 6000);

	test('makes a network request to DFP', async () => {
		const urlRegEx = /securepubads.g.doubleclick.net\/gampad/;
		const expectedParams = ['cust_params'];
		await checkRequestWithParams(page, urlRegEx, expectedParams);
	});

	test('loads correctly an ad correctly', async () => {
		const iframeSelector = '.o-ads__inner';
		const html = await page.$eval(iframeSelector, e => e.innerHTML );
		expect(html).toMatch('id="google_ads_iframe_/5887/test.5887.origami_0__container__"');
		browser.close();
	});
});

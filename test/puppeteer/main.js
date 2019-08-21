const puppeteer = require('puppeteer');
const parseUrl = require('parse-url');

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
		const promise = new Promise((resolve, reject) => {
			page.on('requestfinished', (request) => {
				const requestedUrl = request.url();
				// We don't look at other requests made by the same page
				if (requestedUrl.match(/securepubads.g.doubleclick.net\/gampad/)) {
					const urlObj = parseUrl(requestedUrl);
					const { query } = urlObj;
					const expectedParams = ['cust_params'];
					expectedParams.forEach( param => {
						// expect(true).toBe(true);
						try {
							expect(query).toHaveProperty(param);
						} catch(err) {
							reject(err);
						}
					});
					resolve(true);
				}
			});
		}, 10000);
		await promise;
	});

	test('loads correctly an ad correctly', async () => {
		const iframeSelector = '.o-ads__inner';
		const html = await page.$eval(iframeSelector, e => e.innerHTML );
		expect(html).toMatch('id="google_ads_iframe_/5887/test.5887.origami_0__container__"');
		browser.close();
	});
});

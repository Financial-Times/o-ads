module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Individual-Ad-with-Custom-Targeting-Values.html');
	},

	'Step 1: go to Billboard with custom targeting demo page': function (browser) {
		browser
			.waitForElementVisible('body', 8000)
			.assert.title('o-ads: Individual-Ad-with-Custom-Targeting-Values demo', 'Page title is correct');
	},
	'Step 2: verify the Billboard advert is displayed': function (browser) {
		browser
			.assert.visible('#billboard-gpt', 'Advert has been initiated and visible')
			  // give time for the advert to initialise
				.pause(8000)
				// switch focus to first iframe
				.frame('google_ads_iframe_/5887/test.5887.origami_0')
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', 15000, 'Advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/14891015459176126032')
				// switch focus back to main page
				.frame(null);
	},
	after: function (browser) {
		browser.end();
	}
};

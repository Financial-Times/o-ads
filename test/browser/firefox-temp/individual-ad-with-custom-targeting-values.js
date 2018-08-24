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
			// give time for the advert to initialise
			.pause(8000)
				.assert.visible('#billboard-gpt', 'Advert has been initiated and visible')
				// switch focus to first iframe
				.frame(1)
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', 15000, 'Advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/6935553857235402720')
				// switch focus back to main page
				.frame(null);
	}
};

const wait = 8000;

module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Responsive-Ad.html');
	},

	'Step 1: go to leaderboard demo page': function (browser) {
		browser
			.waitForElementVisible('body', wait)
			.assert.title('o-ads: Responsive-Ad demo', 'Page title is correct');
	},
	'Step 2: verify the leaderboard advert is displayed': function (browser) {
		browser
			.assert.visible('#responsive-gpt', 'Advert has been initiated and visible')
		// switch focus to first iframe
			.frame('google_ads_iframe_/5887/test.5887.origami_0')
		// wait for 1 second for advert to appear
			.waitForElementPresent('.responsive-ad', wait, 'Advert is visible')
		// switch focus back to main page
			.frame(null);
	}
};

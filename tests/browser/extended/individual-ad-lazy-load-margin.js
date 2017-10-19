const wait = 8000;

module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Individual-Ad-Lazy-Load-Margin.html');
	},

	'Step 1: go to lazy load with viewport margin demo page': function (browser) {
		browser
			.waitForElementVisible('body', wait)
			.assert.title('o-ads: Individual-Ad-Lazy-Load-Margin demo', 'Page title is correct');
	},
	'Step 2: verify the leaderboard advert is displayed right away': function (browser) {
		browser
			.assert.visible('#leaderboard-gpt', 'Advert has been initiated and visible')
		// switch focus to first iframe
			.frame('google_ads_iframe_/5887/test.5887.origami_0')
		// wait for 1 second for advert to appear
			.waitForElementPresent('img', wait, 'Advert image is visible')
		// make sure we can see the correct URL
			.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/12593654562240684097', 'Correct image is displayed for leaderboard')
		// switch focus back to main page
			.frame(null);
	}
};

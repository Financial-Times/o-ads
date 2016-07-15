const wait = 8000;

module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Individual-Ad-Lazy-Load.html');
	},

	'Step 1: go to lazy load demo page': function (browser) {
		browser
			.waitForElementVisible('body', wait)
			.assert.title('o-ads: Individual-Ad-Lazy-Load demo', 'Page title is correct');
	},
	'Step 2: verify the leaderboard advert is not displayed and scroll down': function (browser) {
		browser
			.assert.hidden('#leaderboard-gpt', 'Advert has not been initiated and is not visible')
				.moveToElement('#leaderboard-gpt', 0, 1)
				.pause(wait)
	},
	'Step 3: Verify the advert is displayed': function (browser) {
			browser
				.pause(wait)
				.assert.visible('#leaderboard-gpt', 'Advert has been initiated and visible')
				// switch focus to first iframe
				.frame(0)
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', wait, 'Advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/12593654562240684097', 'Correct image is displayed for leaderboard')
				// switch focus back to main page
				.frame(null);
	},
	after: function (browser) {
		browser.end();
	}
};

'use strict';

const timeout = 30000;
const wait = 8000;

module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Individual-Ad.html');
	},

	'Step 1: go to leaderboard demo page': function (browser) {
		browser
			.waitForElementVisible('body', wait)
			.assert.title('o-ads: Individual-Ad demo', 'Page title is correct')
	},
	'Step 2: verify the leaderboard advert is displayed': function (browser) {
		browser
			.assert.visible('#leaderboard-gpt', 'Advert has been initiated and visible')
				// switch focus to first iframe
				.frame(0)
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', wait, 'Advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/1809750796305150566', 'Correct image is displayed for leaderboard')
				// switch focus back to main page
				.frame(null)
	},
	after: function (browser) {
		browser.end();
	}
};

'use strict';

var timeout = 30000;
var wait = 8000;

module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Individual-Ad-with-Custom-Targeting-Values.html');
	},

	'Step 1: go to leaderboard with custom targeting demo page': function (browser) {
		browser
			.waitForElementVisible('body', wait)
			.assert.title('o-ads: Individual-Ad-with-Custom-Targeting-Values demo', 'Page title is correct')
	},
	'Step 2: verify the leaderboard advert is displayed': function (browser) {
		browser
			.assert.visible('#Leaderboard-gpt', 'Advert has been initiated and visible')
				// switch focus to first iframe
				.frame(0)
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', wait, 'Advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'http://com.ft.ads-static-content.s3-website-eu-west-1.amazonaws.com/ci/o-leaderboard.png')
				// switch focus back to main page
				.frame(null)
	},
	after: function (browser) {
		browser.end();
	}
};

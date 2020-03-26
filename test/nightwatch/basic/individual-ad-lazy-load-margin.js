const wait = 18000;

module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Individual-Ad-Lazy-Load-Margin.html');
	},

	'Step 1: go to lazy load with viewport margin demo page': function (browser) {
		browser
			.waitForElementVisible('body', wait);
	},
	'Step 2: verify the leaderboard advert is displayed right away': function (browser) {
		browser
			.waitForElementVisible('#leaderboard-gpt', wait, 'Advert has been initiated and visible')
			// switch focus to first iframe
			.page.ad().cleverFrame('google_ads_iframe_/5887/test.5887.origami_0')
			// wait for 1 second for advert to appear
			.waitForElementPresent('.img_ad', wait, 'Advert image is visible')
			// make sure we can see the correct URL
			.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/12593654562240684097', 'Correct image is displayed for leaderboard')
			// switch focus back to main page
			.page.ad().cleverFrameParent()
			.end();
	}
};

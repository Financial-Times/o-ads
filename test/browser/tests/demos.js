'use strict';

module.exports = function (browser) {

		'goToDemoPage': function () {
			return browser
				.url(browser.launch_url + "/Individual-Ad.html")
				.waitForElementVisible("body", 5000)
				.assert.title("o-ads: Individual-Ad demo", 'Page title is correct')
		},
		'verifyIndividualAdIsVisible': function () {
			return browser
				.assert.visible("#leaderboard-gpt", 'Advert has been initiated and visible')
					// switch focus to first iframe
					.frame(0)
					// wait for 5 seconds for advert to appear
					.wait('1000000')
					.waitForElementPresent("img", 5000, 'Advert image is visible')
					// make sure we can see the correct URL
					.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/1809750796305150566', 'Correct image is displayed for leaderboard')
					// switch focus back to main page
          .frame(null)
		},

		after: function (browser) {
			// end test
			browser.end();
		}
};

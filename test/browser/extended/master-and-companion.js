const wait = 8000;

module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Master-and-Companion.html');
	},

	'Step 1: go to master and companion demo page': function (browser) {
		browser
			.waitForElementVisible('body', wait)
			.assert.title('o-ads: Master-and-Companion demo', 'Page title is correct');
	},
	'Step 2: verify the master advert is displayed': function (browser) {
		browser
			.assert.visible('#leaderboard-gpt', 'Master advert has been initiated and visible')
				// switch focus to first iframe
				.frame('google_ads_iframe_/5887/test.5887.origami/master-companion-test_0')
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', wait, 'Master advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/9281177167350826970')
				// switch focus back to main page
				.frame(null);
	},
	'Step 3: verify the companion advert is displayed': function (browser) {
		browser
			.waitForElementPresent('[data-o-ads-loaded="MediumRectangle"]', wait)
			.assert.visible('#rectangle-gpt', 'Companion advert has been initiated and visible')
				// switch focus to second iframe
				.frame('google_ads_iframe_/5887/test.5887.origami/master-companion-test_1')
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', wait, 'Companion advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/14580659904523692186')
				// switch focus back to main page
				.frame(null);
	}
};

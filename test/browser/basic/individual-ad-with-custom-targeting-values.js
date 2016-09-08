const wait = 8000;

module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Individual-Ad-with-Custom-Targeting-Values.html');
	},

	'Step 1: go to leaderboard with custom targeting demo page': function (browser) {
		browser
			.waitForElementVisible('body', wait)
			.assert.title('o-ads: Individual-Ad-with-Custom-Targeting-Values demo', 'Page title is correct');
	},
	'Step 2: verify the leaderboard advert is displayed': function (browser) {
		browser
			.assert.visible('#SuperLeaderboard-gpt', 'Advert has been initiated and visible')
				// switch focus to first iframe
				.frame(0)
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', wait, 'Advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/pagead/imgad?id=CICAgKDL0rW70wEQygcY-gEoATIIO_E-GIVaGGw')
				// switch focus back to main page
				.frame(null);
	},
	after: function (browser) {
		browser.end();
	}
};

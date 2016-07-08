const wait = 8000;

module.exports = {

	before: function (browser) {
		browser.url(browser.launch_url + '/Responsive-Positions.html');
	},

	'Step 1: go toresponsive positions demo page': function (browser) {
		browser
			.waitForElementVisible('body', wait)
			.assert.title('o-ads: Responsive-Positions demo', 'Page title is correct');
	},

	'Step 2: Resize browser window to fit desktop break point': function (browser) {
		browser
			.resizeWindow(1000, 800);
	},

	'Step 3: verify the top slot is displaying a leaderboard': function (browser) {
		browser
			.assert.visible('#responsive-1-gpt', 'First adaptive advert is visible')
				// switch focus to first iframe
				.frame(0)
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', wait, 'First adaptive advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/12593654562240684097')
				// switch focus back to main page
				.frame(null);
	},

	'Step 4: verify the bottom slot is displaying ': function (browser) {
		browser
			.assert.visible('#responsive-2-gpt', 'Second adaptive advert is visible')
				// switch focus to second iframe
				.frame(2)
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', wait, 'Second adaptive advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/13534452929848566596')
				// switch focus back to main page
				.frame(null);
	},

	'Step 4: Resize browser window to fit mobile break point': function (browser) {
		browser
			.resizeWindow(320, 800)
			.pause(2000);
	},

	'Step 5: verify top advert is not displayed have been showed': function (browser) {
		browser
			.assert.hidden('#responsive-1-gpt', 'First adaptive advert is not visible anymoe');
	},

	'Step 6: verify bottom slot is displaying an mpu': function (browser) {
		browser
			.assert.visible('#responsive-2-gpt', 'Second adaptive advert is visible')
				// switch focus to second iframe
				.frame(2)
				// wait for 1 second for advert to appear
				.waitForElementPresent('img', wait, 'Second adaptive advert image is visible')
				// make sure we can see the correct URL
				.assert.attributeContains('img', 'src', 'https://tpc.googlesyndication.com/simgad/11544125268120182564')
				// switch focus back to main page
				.frame(null);
	},


	after: function (browser) {
		browser.end();
	}
};

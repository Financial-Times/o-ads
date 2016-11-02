'use strict';

require('isomorphic-fetch');
const notifySauceLabs = require('notify-saucelabs');
const sauceLabsUser = process.env.SELENIUM_USER;
const sauceLabsKey = process.env.SELENIUM_KEY;

const notify = (sessionId, passed, opts) =>
	notifySauceLabs(Object.assign({ sessionId, passed }, opts))
		.then(() => {
			console.info('Finished updating Sauce Labs');
		})
		.catch(err => {
			console.error('An error has occurred notifying Sauce Labs');
			return err;
		});

module.exports = {

	waitForConditionPollInterval: 300,

	waitForConditionTimeout : 60000,

	afterEach: (browser, done) => {
		const sessionId = browser.sessionId;
		const currentTest = browser.currentTest;
		const passed = !currentTest.results.failed && !currentTest.results.errors;
		const tags = [];
		if (currentTest.group) {
			tags.push(currentTest.group);
		}
		if (process.env.NODE_ENV) {
			tags.push(process.env.NODE_ENV);
		}
		const notifyOpts = { tags, username: sauceLabsUser, accessKey: sauceLabsKey };
		console.log(`Sauce Test Results at https://saucelabs.com/tests/${sessionId}`);
		browser
			.getLog('browser', logs => {
				if (!passed) {
					console.log('JS Console');
					console.log('==========');
					console.log(logs);
				}
			})
			.perform((browser, done) => {
				notify(sessionId, passed, notifyOpts)
					.then(done);
			})
			.end(done);
	}
};

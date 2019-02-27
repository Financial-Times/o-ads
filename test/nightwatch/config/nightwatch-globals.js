

require('isomorphic-fetch');

module.exports = {
	maxDuration: 1800,
	idleTimeout: 180,
	commandTimeout: 180,
	waitForConditionPollInterval: 300,
	waitForConditionTimeout : 60000,
	concurrency: 4,

	afterEach: (browser, done) => {
		const sessionId = browser.sessionId; // eslint-disable-line no-unused-vars
		const currentTest = browser.currentTest;
		const passed = !currentTest.results.failed && !currentTest.results.errors;
		const tags = [];
		if (currentTest.group) {
			tags.push(currentTest.group);
		}
		if (process.env.NODE_ENV) {
			tags.push(process.env.NODE_ENV);
		}
		const notifyOpts = { tags }; // eslint-disable-line no-unused-vars
		browser
			.getLog('browser', logs => {
				if (!passed) {
					console.log('JS Console');
					console.log('==========');
					console.log(logs);
				}
			})
			.end(done);
	}
};

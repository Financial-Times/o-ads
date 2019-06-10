#!/usr/bin/env node

const Nightwatch = require('nightwatch');
const browserstack = require('browserstack-local');
const {
	exec
} = require('child_process');

// In CircleCI, the BrowserStackLocal tunnel is loaded as a separate process
// to speed up the build
if (process.env.CI) {
	Nightwatch.cli(function (argv) {
		Nightwatch.CliRunner(argv)
			.setup()
			.runTests(function () {
				// Runs after tests complete
				console.log("Finished running nightwatch tests");
			});
	});
} else {

	require('dotenv').config();
	let bs_local;

	try {
		if (!process.env.BROWSERSTACK_KEY || !process.env.BROWSERSTACK_USER || !process.env.BROWSERSTACK_LOCAL) {
			throw new Error('Browserstack environment variables missing. Please set the following, either in a .env file or export in your shell: \n BROWSERSTACK_NAME \n BROWSERSTACK_KEY \n BROWSERSTACK_LOCAL');
		}
		// If there are any previous instances of BrowserStackLocal, kill them first.
		exec(`pkill BrowserStackLocal`, err => {
			// No Browserstack to kill
			if (err) return;
			else {
				console.log("Existing BrowserStackLocal instance found, killing it...");
			}
		})

		process.mainModule.filename = "./node_modules/.bin/nightwatch"

		// Code to start browserstack local before start of test
		console.log("Connecting BrowserStackLocal tunnel...");
		Nightwatch.bs_local = bs_local = new browserstack.Local();
		bs_local.start({
			'key': process.env.BROWSERSTACK_KEY
		}, function (error) {
			if (error) throw error;
			console.log('Connected to Browserstack. Running tests remotely...\nNB: If multiple tests running at once, output is buffered until all tests have finished running for clarity. Meanwhile, why don\'t you watch 1000 rockets being launched at 1000 rockets: https://www.youtube.com/watch?v=Jtols_QhuWw');
			Nightwatch.cli(function (argv) {
				Nightwatch.CliRunner(argv)
					.setup()
					.runTests(function () {
						// Runs after tests complete
						bs_local.stop(function () {});
						console.log("Finished running nightwatch tests");
					});
			});
		});
	} catch (ex) {
		bs_local.stop(function () {});
		console.log('There was an error while starting the test runner:\n\n');
		process.stderr.write(ex.stack + '\n');
		process.exit(2);
	}
}
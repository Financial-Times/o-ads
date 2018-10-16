#!/usr/bin/env node

const Nightwatch = require('nightwatch');
const browserstack = require('browserstack-local');
const { exec } = require('child_process');

// In CircleCI, the BrowserStackLocal tunnel is loaded as a separate process
// to speed up the build
if(process.env.CI) {
	Nightwatch.cli(function(argv) {
		Nightwatch.CliRunner(argv)
		.setup(null, function(){
			// Runs after parallel tests
			console.log("Finished running nightwatch tests.");
		})
		.runTests(function(){
			// Runs after single test
			console.log("Finished running single nightwatch test.");
		});
	});
	return;
}

require('dotenv').load();
let bs_local;

try {
	if(!process.env.BROWSERSTACK_KEY || !process.env.BROWSERSTACK_USER || !process.env.BROWSERSTACK_LOCAL) {
		throw new Error('Browserstack environment variables missing. Please set the following, either in a .env file or export in your shell: \n BROWSERSTACK_NAME \n BROWSERSTACK_KEY \n BROWSERSTACK_LOCAL');
	}
	// If there are any previous instances of BrowserStackLocal, kill them first.
	exec(`pkill BrowserStackLocal`, err => {
		// No Browserstack to kill
		if(err) return;
		else {
			console.log("Existing BrowserStackLocal instance found, killing it...");
		}
	})

	process.mainModule.filename = "./node_modules/.bin/nightwatch"

	// Code to start browserstack local before start of test
	console.log("Connecting BrowserStackLocal tunnel...");
	Nightwatch.bs_local = bs_local = new browserstack.Local();
	bs_local.start({'key': process.env.BROWSERSTACK_KEY }, function(error) {
		if (error) throw error;
		console.log('Connected to Browserstack. Now testing...');
		Nightwatch.cli(function(argv) {
			Nightwatch.CliRunner(argv)
			.setup(null, function(){
				// Runs after parallel tests
				bs_local.stop(function(){});
				console.log("Finished running nightwatch tests.");
			})
			.runTests(function(){
				// Runs after single test
				bs_local.stop(function(){});
				console.log("Finished running single nightwatch test.");
			});
		});
	});
} catch (ex) {
	bs_local.stop(function(){});
  	console.log('There was an error while starting the test runner:\n\n');
  	process.stderr.write(ex.stack + '\n');
  	process.exit(2);
}

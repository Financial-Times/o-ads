#!/usr/bin/env node

const Nightwatch = require('nightwatch');

if(process.env.NODE_ENV === 'development') {
	require('dotenv').load();
}

try {
	process.mainModule.filename = "./node_modules/.bin/nightwatch"
	Nightwatch.cli(function(argv) {
		Nightwatch.CliRunner(argv)
		.setup(null, function(){
			// Runs after parallel tests
			console.log("Finished running nightwatch tests");
		})
		.runTests(function(){
			// Runs after single test
			console.log("Finished running single nightwatch test");
		});
});
} catch (ex) {
  console.log('There was an error while starting the test runner:\n\n');
  process.stderr.write(ex.stack + '\n');
  process.exit(2);
}
/* jshint node: true */
// if you want a different local configuration create a file called karma.local.js
// the file should export a function that takes the current options object and
// returns an amended one e.g.
// module.exports = function (options) {
// 	var options.test = "it works!";
// 	return options;
// }
'use strict';

process.env['BROWSERIFYSWAP_ENV'] = 'karma';

var options = {
	basePath: '',
	autoWatch: true,
	singleRun: false,
	frameworks: ['browserify', 'qunit'],
	files: [
		'test/qunit/styles.css',
		'node_modules/qunitjs/qunit/qunit.css',
		'bower_components/jquery-1.7.2.min/index.js',
		'bower_components/jquery.cookie/index.js',
		'bower_components/sinon-1.10.3/index.js',
		'bower_components/sinon.ie.timers-1.10.3/index.js',
		'test/qunit/setup.js',
		{ pattern: 'test/qunit/mocks/*', included: false },
		'test/qunit/*.test.js'
	],
	customLaunchers: {
		Chrome_with_flags: {
			base: 'Chrome',
			flags: ['--disable-web-security', '--no-sandbox', '--no-first-run']
		}
	},
	browsers: ['Chrome_with_flags'],
	browserify: { transform: ['debowerify', 'browserify-swap'] },
	reporters: ['progress'],
	preprocessors: {
		'test/qunit/setup.js': 'browserify',
		'test/qunit/*.test.js': 'browserify'
	}
};

// add OS specific browsers
if(/^win/.test(process.platform)){
	options.browsers.push('IE');
} else if (process.platform === 'darwin') {
	//options.browsers.push('Safari');
}

// In the CI environment set an environment variable CI = 'true'
if (process.env.CI === 'true') {
	// CI options go here
	options.browsers.push('PhamtomJS');
	options.singleRun = true;
	options.autoWatch = false;
} else {
	//options for local go here
	options.browserify.debug = true;
}

if (process.env.COVERAGE) {
	// options.preprocessors = {
	// 	'**/src/**.js': 'coverage'
	// };

	// options.coverageReporter = {
	// 	type : ['html'],
	// 	dir : 'reports/'
	// };
}

if (process.env.CI_NAME === 'codeship') {
	// we can't use codeship from stash but if this goes public codeship options go here
}

if (process.env.JENKINS_URL) {
	// Jenkins options go here
	options.reporters.push('junit');
	options.junitReporter = {outputFile: './reports/test-results.xml' };
}

try {
	options = require('./karma.local.js')(options);
	console.log('Local config loaded');
} catch(err){
	if (err.code === "MODULE_NOT_FOUND") {
		console.log('No local config found');
	} else {
		console.error('%s:%s', err.code, err.toString().replace('Error:', ''));
	}
}

module.exports = function(config) {
	config.set(options);
};

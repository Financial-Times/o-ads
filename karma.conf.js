/* jshint node: true */
'use strict';

// developer options go here
// if you want to make changes run
// `git update-index --assume-unchanged karma.config.js`
// to prevent the file from being commited
// run `git update-index --no-assume-unchanged karma.config.js` to undo
var singleRun = false;
var autoWatch = true;
var browsers = ['Chrome_with_flags'];
//var browsers = ['Chrome', 'Firefox'];
var browserify = { transform: ['debowerify'] };
var junitReporter = {outputFile: './test-results.xml' };

// add OS specific browsers
if(/^win/.test(process.platform)){
	browsers.push('IE');
} else if (process.platform === 'darwin') {
	browsers.push('Safari');
}

if (process.env.CI === 'true') {
// In the CI environment set an environment variable CI = 'true'
// CI options go here
	browsers.push('Firefox');
	singleRun = true;
	autoWatch = false;
} else {
	//options for local go here
	browserify.debug = true;
}

if (process.env.TRAVIS === 'true'){
	// we can't use travis from stash but if this goes public Travis options go here
	browsers = ['PhantomJS'];
}

if (process.env.JENKINS_URL){
	// Jenkins options go here
}

module.exports = function(config) {
	config.set({
		basePath: '',
		autoWatch: autoWatch,
		frameworks: ['browserify', 'qunit'],
		files: [
			'node_modules/qunitjs/qunit/qunit.css',
			'bower_components/jquery-1.7.2.min/index.js',
			'bower_components/jquery.cookie/index.js',
			'bower_components/sinon-1.10.3/index.js',
			'bower_components/sinon.ie.timers-1.10.3/index.js',
			{pattern: 'test/mocks/gpt-mock.js', included: true},
			{pattern: 'test/mocks/rubicon-valuation-mock.js', included: true},
			/* mocks that can't be loaded dynamically must be included beofre this */
			{pattern: 'test/mocks/*', included: false},
			{pattern: 'test/fixtures/*', included: false},
			'test/js/util/test.helpers.js',
			'test/js/*.test.js'
		],

		customLaunchers: {
			Chrome_with_flags: {
				base: 'Chrome',
				flags: ['--disable-web-security', '--no-sandbox', '--no-first-run']
			}
		},

		browsers: browsers,
		browserify: browserify,
		reporters: ['progress', 'junit'],
		junitReporter: junitReporter,
		preprocessors: { 'test/js/util/test.helpers.js': ['browserify']},
		singleRun: singleRun
	});
};

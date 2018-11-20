/* eslint no-console: 0 */
/* globals process: true */

'use strict'; //eslint-disable-line

// if you want a different local configuration create a file called karma.local.js
// the file should export a function that takes the current options object and
// returns an amended one e.g.
// module.exports = function (options) {
// 	var options.test = "it works!";
// 	return options;
// }

const path = require('path');
const BowerResolvePlugin = require('bower-resolve-webpack-plugin');

let options = {
	basePath: '',
	autoWatch: true,
	singleRun: false,
	frameworks: ['qunit'],
	files: [
		'bower_components/jquery-1.7.2.min/index.js',
		'bower_components/sinon-1.10.3/index.js',
		'bower_components/sinon.ie.timers-1.10.3/index.js',
		'test/qunit/setup.js',
		{ pattern: 'test/qunit/mocks/*', included: false },
		'test/qunit/*.test.js',
	],
	customLaunchers: {
		Chrome_with_flags: {
			base: 'Chrome',
			flags: ['--disable-web-security', '--no-sandbox', '--no-first-run']
		}
	},
	browsers: ['Chrome_with_flags'],
	// We use the origami-build-tools webpack config and we
	// overwrite the `output` option.
	webpack: {
		resolve: {
			plugins: [new BowerResolvePlugin()],
			modules: ['bower_components', 'node_modules']
		}
	},
	reporters: ['progress'],
	preprocessors: {
		'main.js': ['webpack'],
		'src/**/*.js': ['webpack'],
		'test/qunit/setup.js': ['webpack'],
		'test/qunit/main.test.js': ['webpack'],
		'test/qunit/api.test.js': ['webpack'],
		'test/qunit/krux.test.js': ['webpack']
	}
};

// In the CI environment set an environment variable CI = 'true'
if (process.env.CI === 'true') {
	console.log('CI options activated');
	// CI options go here
	options.singleRun = true;
	options.autoWatch = false;
} else {
	//options for local go here
}

const coverageChecks = {
	global: {
		statements: 100,
		branches: 100,
		functions: 100,
		lines: 100
	},
	each: {
		statements: 100,
		branches: 100,
		functions: 100,
		lines: 100
	}
};

if (process.env.COVERAGE) {
	console.log('running coverage report');
	options.files.push({ pattern: 'reports/**', included: false, watched: false });
	options.reporters.push('coverage-istanbul');
	options.coverageIstanbulReporter = {
		reports: [ 'text' ],
		fixWebpackSourcePaths: true
	};
	options.webpack.module = {
		rules: [
			// instrument only testing sources with Istanbul
			{
				test: /\.js$/,
				use: { loader: 'istanbul-instrumenter-loader' },
				include: path.resolve('src/js/')
			}
		]
	};
	options.coverageIstanbulReporter = {
		reports: [ 'text' ],
		fixWebpackSourcePaths: true,
		dir: 'reports/coverage/'
	};
}

if (process.env.CIRCLECI) { } // eslint-disable-line no-empty

try {
	options = require('./karma.local.js')(options);
	console.log('Local config loaded');
} catch (err) {
	if (err.code === 'MODULE_NOT_FOUND') {
		console.log('No local config found');
	} else {
		console.error('%s:%s', err.code, err.toString().replace('Error:', ''));
	}
}

module.exports = function(config) {
	config.set(options);
};

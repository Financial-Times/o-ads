const commonCapabilities = {
	'browserstack.user': process.env.BROWSERSTACK_USER,
	'browserstack.key': process.env.BROWSERSTACK_KEY,
	'browserstack.local': process.env.BROWSERSTACK_LOCAL,
	acceptSslCerts: true
};

module.exports = {
	src_folders: ['./test/nightwatch'],
	output_folder: './test/nightwatch/reports',
	globals_path: './nightwatch-globals.js',
	page_objects_path: './test/nightwatch/page_objects',
	selenium: {
		start_process : false,
		host : 'hub-cloud.browserstack.com',
		port : 80
	},
	live_output: false,
	detailed_output: false,
	test_settings: {
		default: {
			end_session_on_fail: false,
			skip_testcases_on_fail: false,
			launch_url: "http://localhost:3002/demos/local",
			screenshots: {
				enabled: false
			},
			desiredCapabilities: {}
		},
		chrome: {
			desiredCapabilities: {
				browser: 'chrome',
				os: 'Windows',
				os_version: '7',
				// If unfamiliar with destructuring syntax, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
				...commonCapabilities
			}
		},
		firefox: {
			desiredCapabilities: {
				browser: 'firefox',
				os: 'OS X',
  				os_version: 'High Sierra',
				...commonCapabilities
			}
		},
		safari: {
			desiredCapabilities: {
				browser: 'safari',
				os: 'OS X',
  				os_version: 'High Sierra',
				...commonCapabilities
			}
		},
		ie10: {
			desiredCapabilities: {
				browser: 'IE',
				browser_version: '10.0',
				os: 'Windows',
				os_version: '7',
				...commonCapabilities
			}
		},
		ie11: {
			desiredCapabilities: {
				browser: 'IE',
				browser_version: '11.0',
				os: 'Windows',
				os_version: '8.1',
				...commonCapabilities
			}
		},
		edge: {
			desiredCapabilities: {
				browser: 'Edge',
				os: 'Windows',
				os_version: '10',
				...commonCapabilities
			}
		},
		iphone_7: {
			desiredCapabilities: {
				device: 'iPhone 7',
				realMobile: 'true',
				os_version: '10.3',
				deviceOrientation: 'portrait',
				autoAcceptAlerts: true,
				...commonCapabilities
			}
		},
		galaxy_s8: {
			desiredCapabilities: {
				device: 'Samsung Galaxy S8',
				real_mobile: 'true',
				os_version: '7.0',
				...commonCapabilities
			}
		}
	}
};

console.log("argv", process.argv);

let config = {
	src_folders: ['./test/browser'],
	output_folder: './test/browser/reports',
	globals_path: './test/browser/config/nightwatch-globals.js',
	selenium : {
		start_process : false,
		host : 'hub-cloud.browserstack.com',
		port : 80
	},
	live_output: true,
	detailed_output: false,
	test_workers: {
		enabled: true,
		workers: 'auto'
	},
	common_capabilities: {
		'browserstack.user': process.env.BROWSERSTACK_USER,
		'browserstack.key': process.env.BROWSERSTACK_KEY,
		'browserstack.local': process.env.BROWSERSTACK_LOCAL
	},
	test_settings: {
		default: {
			end_session_on_fail: false,
			skip_testcases_on_fail: false,
			launch_url: process.env.BROWSERSTACK_URL || "http://localhost:3002/demos/local",
			screenshots: {
				enabled: false
			},
			desiredCapabilities: {}
		},
		chrome: {
			desiredCapabilities: {
				browser: 'chrome',
				browser_version: '64', //TODO: there's a bug in the ChromeDriver version used by Browserstack on v66, so keep on an older version until 67 comes out
				os: 'Windows',
				os_version: '7',
				acceptSslCerts: true
			}
		},
		firefox: {
			desiredCapabilities: {
				os: 'Windows',
  				os_version: '7',
				browser: 'Firefox',
				browser_version: '61.0',
				acceptSslCerts: true
			}
		},
		safari: {
			desiredCapabilities: {
				os: 'OS X',
				os_version: 'Sierra',
				browser: 'Safari',
				browser_version: '10.1',
				acceptSslCerts: true
			}
		},
		ie10: {
			desiredCapabilities: {
				'os': 'Windows',
				'os_version': '7',
				'browser': 'IE',
				'browser_version': '10.0',
				acceptSslCerts: true
			}
		},
		ie11: {
			desiredCapabilities: {
				'os': 'Windows',
				'os_version': '8.1',
				'browser': 'IE',
				'browser_version': '11.0',
				acceptSslCerts: true
			}
		},
		edge: {
			desiredCapabilities: {
				'os': 'Windows',
				'os_version': '10',
				'browser': 'Edge',
				'browser_version': '16.0',
				acceptSslCerts: true
			}
		},
		iphone_7: {
			desiredCapabilities: {
				'device': 'iPhone 7',
				'realMobile': 'true',
				'os_version': '10.3',
				deviceOrientation: 'portrait',
				autoAcceptAlerts: true,
				acceptSslCerts: true
			}
		},
		galaxy_s8: {
			desiredCapabilities: {
				'device': 'Samsung Galaxy S8',
				'realMobile': 'true',
				'os_version': '7.0',
				acceptSslCerts: true
			}
		}
	}
};

// Code to support common capabilites
Object.values(config.test_settings).forEach(conf => {
	conf['selenium_host'] = config.selenium.host;
	conf['selenium_port'] = config.selenium.port;
	conf['desiredCapabilities'] = conf['desiredCapabilities'] || {};
	Object.keys(config.common_capabilities).forEach(commonKey => {
		conf['desiredCapabilities'][commonKey] = conf['desiredCapabilities'][commonKey] || config.common_capabilities[commonKey];
	});
});

module.exports = config;
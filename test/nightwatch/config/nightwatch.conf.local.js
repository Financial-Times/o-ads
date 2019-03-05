module.exports = {
	src_folders: ['./test/nightwatch/basic'],
	output_folder: './test/nightwatch/reports',
	globals_path: './nightwatch-globals.js',
	page_objects_path: './test/nightwatch/page_objects',
	webdriver: {
		"start_process" : true,
		"server_path": "node_modules/.bin/geckodriver",
		"cli_args": [
		  "--log", "debug"
		],
		"port": 4444
	},
	test_settings: {
		default: {
			end_session_on_fail: false,
			skip_testcases_on_fail: false,
			launch_url: "http://localhost:3002/demos/local",
			screenshots: {
				enabled: false
			},
			desiredCapabilities: {
				"browserName" : "firefox",
				"browser": "firefox",
				"acceptInsecureCerts": true
			}
		}
	}
};

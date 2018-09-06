const commands = {
	cleverFrame: function(selector) {
		const browserName = this.client.options.desiredCapabilities.browser;

		if (browserName === 'Firefox') {
			return this.api.frame(1);
		}

		return this.api.frame(selector);
	}
};

module.exports = {
	// url: function(pathname) {
	// 	console.log('pathname', pathname);
	// 	return this.api.launch_url + '/Individual-Ad.html';
	// },
	// The 'elements' property is required, even if it's empty,
	// as per this comment (https://github.com/nightwatchjs/nightwatch/issues/570#issuecomment-123085090)
	elements: {},
	commands: [commands]
};

const commands = {
	cleverFrame: function(selector) {
		const browserName = this.client.options.desiredCapabilities.browser;

		if (browserName === 'Firefox' || browserName === 'Safari') {
			return this.api.frame(1);
		}

		return this.api.frame(selector);
	}
};

module.exports = {
	// The 'elements' property is required, even if it's empty,
	// as per this comment (https://github.com/nightwatchjs/nightwatch/issues/570#issuecomment-123085090)
	elements: {},
	commands: [commands]
};

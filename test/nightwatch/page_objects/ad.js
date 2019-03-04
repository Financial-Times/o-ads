const commands = {
	cleverFrame: function(selector) {
		const browserName = this.client.options.desiredCapabilities.browserName;
		if (browserName === 'firefox' || browserName === 'safari') {
			return this.api.frame(1);
		}

		return this.api.frame(selector);
	},

	cleverFrameParent: function() {
		const browserName = this.client.options.desiredCapabilities.browserName;
		if(browserName === 'internet explorer') {
			return this.api.frame(null);
		}

		return this.api.frameParent();
	}
};

module.exports = {
	commands: [commands]
};

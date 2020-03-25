const commands = {
	cleverFrame: function(selector) {
		const browser = this.client.options.desiredCapabilities.browser;
		if (browser === 'Edge') {
			return this.api.frame(0);
		}

		if (browser === 'firefox') {
			return this.api.frame(1);
		}

		return this.api.frame(selector);
	},

	cleverFrameParent: function() {
		const browser = this.client.options.desiredCapabilities.browser;
		if(browser === 'IE') {
			return this.api.frame();
		}

		return this.api.frameParent();
	}
};

module.exports = {
	commands: [commands]
};

const commands = {
  	cleverFrame: function(selector) {
		let instance;

		// Some browsers (e.g. firefox) don't support a string as the iframe selector
		// See: https://nightwatchjs.org/api/commands/#frame
		try {
			instance = this.api.frame(selector);
		} catch (err) {
			instance = this.api.frame(1);
		}

		return instance;
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

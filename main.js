function Ads() {
	addDOMEventListener();
}

// bung all our modules on the protoype
Ads.prototype.config = require('./src/js/config');
Ads.prototype.slots = require('./src/js/slots');
Ads.prototype.gpt = require('./src/js/ad-servers/gpt');
Ads.prototype.krux = require('./src/js/data-providers/krux');
Ads.prototype.api = require('./src/js/data-providers/api');
Ads.prototype.targeting = require('./src/js/targeting');
Ads.prototype.utils = require('./src/js/utils');

/**
* Initialises the ads library and all sub modules
* @param config {object} a JSON object containing configuration for the current page
*/



Ads.prototype.init = function(options) {
	this.config.init();
	this.config(options);
	const targetingApi = this.config().targetingApi;
	const botVsHumanApi = this.config().botVsHumanApi;
	
	const targetingPromise = targetingApi ? this.api.init(targetingApi, this) : Promise.resolve();
	const botVsHumanPromise = botVsHumanApi ? fetch(botVsHumanApi) : Promise.resolve();
	
	return Promise.all([botVsHumanPromise, targetingPromise])
		.then(responses => responses[0].json())
		.then(botVsHumanResponse => {
			// TODO: Change me to whatever the API response will be
			// At the moment this works by looking at a json file with a "valid" property
			// I got some cors issues when I tried loading from a different local server on a different port
			// so what I did was I just put a file called "validate.json" in the /demos/local folder and
			// set the botVsHumanApi path to there.
			if(botVsHumanResponse.isRobot) {
				throw new Error('Invalid traffic detected');
			}
			this.initLibrary();
		})
		// If anything fails, default to load ads without targeting
		.catch(e => {
			if(e && e.message === 'Invalid traffic detected') {
				throw e;
			}
			this.initLibrary();
		});
};

Ads.prototype.updateContext = function(options, isNewPage) {
	this.config(options);

	if(options.targetingApi) {
		this.api.reset();
		return this.api.init(options.targetingApi, this)
			.then(() => {
					this.gpt.updatePageTargeting(this.targeting.get());
				/* istanbul ignore else */
					if(this.config('krux')) {
						this.krux.setAllAttributes();
						this.krux.sendNewPixel(isNewPage);
					}
			});
	} else {
		return Promise.resolve();
	}

};

Ads.prototype.initLibrary = function() {
	this.slots.init();
	this.gpt.init();
	this.krux.init();
	this.utils.on('debug', this.debug.bind(this));
	this.isInitialised = true;
	this.utils.broadcast('initialised', this);
	removeDOMEventListener();
	return this;
};

const initAll = function() {
	return ads.init().then(() => {
		const slots = Array.from(document.querySelectorAll('.o-ads, [data-o-ads-name]'));
		slots.forEach(ads.slots.initSlot.bind(ads.slots));
	})
};

Ads.prototype.debug = function (){
	let remove = true;
	if (localStorage.getItem('oAds')) {
		remove = false;
	} else {
		localStorage.setItem('oAds', true);
	}
	this.gpt.debug();
	this.krux.debug();
	this.slots.debug();
	this.targeting.debug();

	if (remove) {
		localStorage.removeItem('oAds');
	}
};

function addDOMEventListener() {
	document.addEventListener('o.DOMContentLoaded', initAll);
}
function removeDOMEventListener() {
	document.removeEventListener('o.DOMContentLoaded', initAll);
}

const ads = new Ads();
module.exports = ads;

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
* @param options {object} a JSON object containing configuration for the current page
*/
Ads.prototype.init = function(options) {
	this.config.init();
	this.config(options);

	const enableKrux = shouldEnableKrux();
	// Delete the krux data from local storage if we need to
	if (!cookieConsent().krux && localStorage.getItem('kxkuid')) {
		Object
			.keys(localStorage)
			.filter((key) => /(^kx)|(^_kx)/.test(key))
			.forEach(item => localStorage.removeItem(item));
	}

	const targetingApi = this.config().targetingApi;
	const validateAdsTrafficApi = this.config().validateAdsTrafficApi;

	// Don't need to fetch anything if no targeting or bot APIs configured.
	if(!targetingApi && !validateAdsTrafficApi) {
		return Promise.resolve(this.initLibrary({ enableKrux }));
	}

	const targetingPromise = targetingApi ? this.api.init(targetingApi, this) : Promise.resolve();
	const validateAdsTrafficPromise = validateAdsTrafficApi ? fetch(validateAdsTrafficApi).then(res => res.json()) : Promise.resolve();
	/*
		We only want to stop the oAds library from initializing if
		the validateAdsTrafficApi says the user is a robot. Otherwise we catch()
		all errors and initialise the library anyway.
	 */
	return Promise.all([validateAdsTrafficPromise, targetingPromise])
		.then(([validateAdsTrafficResponse]) => {
			if (isRobot(validateAdsTrafficResponse)) {
				this.config({"dfp_targeting": {"ivtmvt": "1"}});
			}

			return this.initLibrary({ enableKrux });
		})
		// If anything fails, default to load ads without targeting
		.catch(e => {
			return this.initLibrary({ enableKrux });
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

Ads.prototype.initLibrary = function(options = { enableKrux: false}) {
	this.slots.init();
	this.gpt.init();
	if(options.enableKrux) {
		this.krux.init();
	}
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

function isRobot(validateAdsTrafficResponse) {
	return validateAdsTrafficResponse && validateAdsTrafficResponse.isRobot;
}

let cookieConsent = function(){
		const re = new RegExp('FTConsent=([^;]+)');
		const match = document.cookie.match(re);
		let enableBehv = false;
		let enableProg = 'n';
		if (!match){
			return {
				krux : false,
				programmatic : 'n'
		}}
		else {
			const consentCookie = match[1];
			return {
				krux : !!consentCookie.split(',').find(v => v === 'behaviouralAdsOnsite:on'),
				programmatic : !!consentCookie.split(',').find(v => v === 'programmaticAdsOnsite:on')
		};
	}
}

function addDOMEventListener() {
	document.addEventListener('o.DOMContentLoaded', initAll);
}
function removeDOMEventListener() {
	document.removeEventListener('o.DOMContentLoaded', initAll);
}

const ads = new Ads();
module.exports = ads;

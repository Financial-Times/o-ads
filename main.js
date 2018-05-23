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


	let getConsents = function(disabled) {
		if (disabled) {
			// cookie consent has been explicitely disabled via config options
			return { behavioral : true, programmatic : 'y'};
		}
		else {
			// derive consent options from ft consent cookie
			const re = new RegExp('FTConsent=([^;]+)');
			const match = document.cookie.match(re);
			if (!match) {
				// cookie stasis or no consent cookie found.
				return { behavioral : true, programmatic : 'y'};
			}
			else {
				const consentCookie = match[1];
				return {
					behavioral : !!consentCookie.split(',').find(v => v === 'behaviouraladsOnsite:on'),
					programmatic : !!consentCookie.split(',').find(v => v === 'programmaticadsOnsite:on')
				};
			}
		}
	};


	Ads.prototype.init = function(options) {
	this.config.init();
	this.config(options);
	this.consents = getConsents(options.disableConsentCookie);

	// Delete the krux data from local storage if we need to
	if (!this.consents.behavioral && localStorage.getItem('kxkuid')) {
		Object
			.keys(localStorage)
			.filter((key) => /(^kx)|(^_kx)/.test(key))
			.forEach(item => localStorage.removeItem(item));
	}
	this.config({"dfp_targeting": {'cc': this.consents.programmatic}});

	const targetingApi = this.config().targetingApi;
	const validateAdsTrafficApi = this.config().validateAdsTrafficApi;

	// Don't need to fetch anything if no targeting or bot APIs configured.
	if(!targetingApi && !validateAdsTrafficApi) {
		return Promise.resolve(this.initLibrary());
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

			return this.initLibrary();
		})
		// If anything fails, default to load ads without targeting
		.catch(e => {
			return this.initLibrary();
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
					if(this.config('krux') && this.consents.behavioral) {
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
	if( this.config('krux') && this.consents.behavioral) {
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

function addDOMEventListener() {
	document.addEventListener('o.DOMContentLoaded', initAll);
}
function removeDOMEventListener() {
	document.removeEventListener('o.DOMContentLoaded', initAll);
}

const ads = new Ads();
module.exports = ads;

/* eslint valid-jsdoc: 0 */

function Ads() {
	addDOMEventListener();
}

// bung all our modules on the protoype
Ads.prototype.config = require('./src/js/config');
Ads.prototype.slots = require('./src/js/slots');
Ads.prototype.gpt = require('./src/js/ad-servers/gpt');
Ads.prototype.krux = require('./src/js/data-providers/krux');
Ads.prototype.api = require('./src/js/data-providers/api');
Ads.prototype.moat = require('./src/js/data-providers/moat');
Ads.prototype.targeting = require('./src/js/targeting');
Ads.prototype.utils = require('./src/js/utils');
const bowerJson = require('./bower.json');


/**
* Initialises the ads library and all sub modules
* @param options {object} a JSON object containing configuration for the current page
*/
Ads.prototype.init = function(options) {
	options = options || {};
	this.config.init();
	this.config(Object.assign(options, {
		nonPersonalized : !options.disableConsentCookie,
	}));

	if (options.disableConsentCookie) {
		this.consents = {
			behavioral : true
		};
	}
	else {
		this.consents = getConsents();
	}

	const targetingApi = this.config().targetingApi;
	const validateAdsTraffic = this.config().validateAdsTraffic;

	// Don't need to fetch anything if no targeting or validateAdsTraffic configured.
	if(!targetingApi && !validateAdsTraffic) {
		return Promise.resolve(this.initLibrary());
	}

	const targetingPromise = targetingApi ? this.api.init(targetingApi, this) : Promise.resolve();
	const validateAdsTrafficPromise = validateAdsTraffic ? this.moat.init() : Promise.resolve();

	/**
	Need to wait for the moat script to load to validate ads
	and the targeting API to return before we initialise the library.
	The targeting values are set on the instance of this.api, therefore
	response is irrelevant
	*/
	return Promise.all([targetingPromise, validateAdsTrafficPromise])
		.then(() => this.initLibrary())
		.catch((e) => {
			// If anything fails, default to load ads without targeting
			this.utils.log.error(e);
			this.utils.log.warn('There was an error with the targeting API or the Moat invalid traffic script. Loading the o-ads library anyway, but the ads may not work as expected...');
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
	if (this.consents.programmatic) {
		this.config({'nonPersonalized' : false });
		this.targeting.add({"cc" : "y"});
	}
	this.gpt.init();
	this.krux.init();
	if (this.consents.behavioral) {
		// set krux config option to opt-in /consented
		this.config({'krux': {'consentState' : true}});
	}

	this.utils.on('debug', this.debug.bind(this));
	this.isInitialised = true;
	this.utils.broadcast('initialised', this);
	removeDOMEventListener();
	return this;
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

Ads.prototype.version = function() {
	this.utils.log(`o-ads version: ${bowerJson.version}`);
};

const initAll = function() {
	return ads.init().then(() => {
		const slots = Array.from(document.querySelectorAll('.o-ads, [data-o-ads-name]'));
		slots.forEach(ads.slots.initSlot.bind(ads.slots));
	});
};

function getConsents() {
	// derive consent options from ft consent cookie
	const re = /FTConsent=([^;]+)/;
	const match = document.cookie.match(re);
	if (!match) {
		// cookie stasis or no consent cookie found
		return {
			behavioral : false,
			programmatic : false
		};
	}
	const consentCookie = decodeURIComponent(match[1]);
	return {
		behavioral: consentCookie.indexOf('behaviouraladsOnsite:on') !== -1,
		programmatic: consentCookie.indexOf('programmaticadsOnsite:on') !== -1
	};
}

function addDOMEventListener() {
	document.addEventListener('o.DOMContentLoaded', initAll);
}
function removeDOMEventListener() {
	document.removeEventListener('o.DOMContentLoaded', initAll);
}

const ads = new Ads();
module.exports = ads;

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
	options = options || {};
	this.config.init();
	this.config(options);
	if (options.disableConsentCookie) {
		this.consents =  {
			behavioral : true
		};
	}
	else {
		this.consents = getConsents();
	}

	// Delete the krux data from local storage if we need to
	if (!this.consents.behavioral && localStorage.getItem('kxkuid')) {
		Object
			.keys(localStorage)
			.filter((key) => /(^kx)|(^_kx)/.test(key))
			.forEach(item => localStorage.removeItem(item));
	}
	const targetingApi = this.config().targetingApi;
	const validateAdsTraffic = this.config().validateAdsTraffic;

	// Don't need to fetch anything if no targeting or validateAdsTraffic configured.
	if(!targetingApi && !validateAdsTraffic) {
		return Promise.resolve(this.initLibrary());
	}
	
	const targetingPromise = targetingApi ? this.api.init(targetingApi, this) : Promise.resolve();
	const validateAdsTrafficPromise = this.config().validateAdsTraffic ? getMoatIvtResponse() : Promise.resolve();
	
	return Promise.all([validateAdsTrafficPromise, targetingPromise])
		.then(([validateAdsTrafficResponse]) => {
			this.targeting.add(validateAdsTrafficResponse);
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
	if (this.consents.behavioral) {this.krux.init();}
	if (this.consents.programmatic) {this.targeting.add({"cc" : "y"});}
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


const getConsents = () => {
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
};


/**
 * Wait for moat script to load and return a response based on their API
 * @returns {Promise}
 */
function getMoatIvtResponse() {
	return new Promise((resolve, reject) => {
		const intervalId = setInterval(() => {
			if(window.moatPrebidApi) {
				clearInterval(intervalId);
				clearTimeout(timeoutId);
				resolve({
					mhv: window.moatPrebidApi.pageDataAvailable() ? 'n' : 'y'
				});
			}
		}, 50);
		const timeoutId = setTimeout(() => {
			clearInterval(intervalId);
			reject(new Error('Timeout while fetching moat invalid traffic script'));
		}, 1000);
	});
}

function addDOMEventListener() {
	document.addEventListener('o.DOMContentLoaded', initAll);
}
function removeDOMEventListener() {
	document.removeEventListener('o.DOMContentLoaded', initAll);
}

const ads = new Ads();
module.exports = ads;

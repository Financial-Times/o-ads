

/* eslint valid-jsdoc: 0 */
import config, { init, clear } from './src/js/config';
import slots from './src/js/slots';
import gpt from './src/js/ad-servers/gpt';
import moat from './src/js/data-providers/moat';
import targeting from './src/js/targeting';
import utils from './src/js/utils';

function Ads() {
	addDOMEventListener();

	if (window && !window.oAds) {
		window.oAds = this;
	}
}

config.init = init;
config.clear = clear;

// bung all our modules on the protoype
Ads.prototype.config = config;
Ads.prototype.slots = slots;
Ads.prototype.gpt = gpt;
Ads.prototype.moat = moat;
Ads.prototype.targeting = targeting;
Ads.prototype.utils = utils;

/**
* Initialises the ads library and all sub modules
* @param options {object} a JSON object containing configuration for the current page
*/
Ads.prototype.init = function(options) {
	options = options || {};
	this.config.init();
	const configOptions = Object.assign(options, {
		nonPersonalized : !options.disableConsentCookie,
	});
	this.config(configOptions);

	if (options.disableConsentCookie) {
		this.consents = {
			behavioral : true
		};
	}
	else {
		this.consents = getConsents();
	}

	if (this.consents.behavioral) {
		this.utils.broadcast('consentBehavioral');
	}

	if (this.consents.programmatic) {
		this.utils.broadcast('consentProgrammatic');
	}

	// Targeting
	const targetingParams = this.config().targeting;
	if(this.utils.isPlainObject(targetingParams)) {
		this.targeting.add(targetingParams);
	}

	console.log('targeting', this.targeting.get());

	const validateAdsTraffic = this.config().validateAdsTraffic;

	this.utils.broadcast('initialising');

	// Don't need to fetch anything if no targeting or validateAdsTraffic configured.
	if(!validateAdsTraffic) {
		return Promise.resolve(this.initLibrary());
	}

	/**
		Need to wait for the moat script to load to validate the source of the ad
		traffic is legit before we initialise the library.
	*/
	return this.moat.init()
		.then(() => this.initLibrary())
		.catch((e) => {
			// If anything fails, default to load ads without targeting
			this.utils.log.error(e);
			this.utils.log.warn('There was an error with the targeting API or the Moat invalid traffic script. Loading the o-ads library anyway, but the ads may not work as expected...');
			return this.initLibrary();
		});
};


/**
 * Update page level targeting data in o-ads and GPT
 */
Ads.prototype.updateTargeting = function(data) {
	this.config('targeting', data);
	this.gpt.updatePageTargeting(this.targeting.get());
};

Ads.prototype.initLibrary = function() {
	this.slots.init();
	if (this.consents.programmatic) {
		this.config({'nonPersonalized' : false });
		this.targeting.add({"cc" : "y"});
	}
	this.gpt.init();

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
	this.slots.debug();
	this.targeting.debug();

	if (remove) {
		localStorage.removeItem('oAds');
	}
};

Ads.prototype.version = function() {
	this.utils.log.warn('DEPRECATION NOTICE: Ads.version() will be deprecated in favour of Ads.getVersion()');
	this.utils.log(`o-ads version: ${this.utils.getVersion()}`);
};

Ads.prototype.getVersion = function() {
	return this.utils.getVersion();
};

const initAll = function() {
	return ads.init().then(() => {
		const slots = Array.from(document.querySelectorAll('.o-ads, [data-o-ads-name]'));
		slots.forEach(ads.slots.initSlot.bind(ads.slots));
	});
};

Ads.prototype.initAll = initAll;

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
export default ads;

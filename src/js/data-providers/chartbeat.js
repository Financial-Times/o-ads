/**
* @fileOverview
* Third party library for use with google publisher tags.
*
* @author Robin Marr, robin.marr@ft.com
*/
/**
* FT.ads.chartbeat provides chartbest integration for the FT advertising library
* @name targeting
* @memberof FT.ads
*/
const utils = require('../utils');
const config = require('../config');

function ChartBeat() {

}

ChartBeat.prototype.init = function() {
	const gpt = config('gpt') || {};
	const src = '//static.chartbeat.com/js/chartbeat_pub.js';
	this.config = config('chartbeat');

	/* istanbul ignore else  */
	if (this.config) {
		// config must be in a global var
		window._sf_async_config = {
			uid: this.config.uid,
			domain: this.config.domain || location.host,
			useCanonical: this.config.canonical || true,
			zone: this.config.zone || gpt.unitName || `${gpt.site}/${gpt.zone}`,
			sections: this.config.pageType,
			enableAdRefresh: this.config.enableAdRefresh || false
		};
		window._cbq = window._cbq || [];

		/* istanbul ignore else  */
		if (this.config.loadsJS && !utils.isScriptAlreadyLoaded(src)) {
			// LOAD LIBRARY
			window._sf_endpt = (new Date()).getTime();
			utils.attach(src, true);
		}

		/* istanbul ignore else  */
		if (this.config.demographics) {
			this.addDemographics(this.config.demographics);
		}
	}

	// Array used to register ad slots with chartbeat
	window._cba = [];

	// add an id attribute to each slot
	// id will be the slots name unless overidden
	utils.on('ready', function(event) {
		const slot = event.detail.slot;
		const name = utils.isNonEmptyString(slot.chartbeat) ? slot.chartbeat : slot.name;
		slot.container.setAttribute('data-cb-ad-id', name);
	});

	// Register GPT slots after they're defined with gpt
	utils.on('complete', function(event) {
		const slot = event.detail.slot;
		/* istanbul ignore else  */
		if (slot.gpt) {
			window._cba.push(function() {
				window.pSUPERFLY.registerGptSlot(slot.gpt.slot, slot.gpt.id);

				// TODO: where do we get this config?
				// (12/8/15)
				// from the call I'm on it would seem this config will come from data attributes on the creative
				// using data attrs seems far more managable than using page configuration due to complexitities
				// with master comapnions and such
				//window.pSUPERFLY.addEngagedAdFilter({engagedSeconds:15, id: slot.gpt.id});
			});
		}
	});

	// Notify chartbeat when a refresh happens
	utils.on('refresh', function(event) {
		if (window.pSUPERFLY) {
			window.pSUPERFLY.refreshAd(event.detail.name);
		}
	});
};

ChartBeat.prototype.addDemographics = function(demographicsObject) {
	// Pass User metadata to chartbeat
	const demographicCodes = Object.keys(demographicsObject).map(function (key) {
			return `${key}=${demographicsObject[key]}`;
		}).join(',');

	window._cbq.push(['_demo', demographicCodes]);
};

ChartBeat.prototype.debug = function () {
	const log = utils.log;

	if (!this.config) {
		return;
	}
	log.start('ChartBeat');

		const asyncConfig = utils.extend({}, window._sf_async_config);

		const attrs = ['uid', 'domain', 'useCanonical', 'zone', 'sections', 'enableAdRefresh'];

		attrs.forEach(attribute => {
				log(`%c ${attribute}:`, 'font-weight:bold', asyncConfig[attribute]);
				delete asyncConfig[attribute];
		});

		log.start('Superfly Async Config');
			log.attributeTable(asyncConfig);
		log.end();

		if (this.demographicCodes) {
			log.start('Demographic Codes');
				log.attributeTable(this.demographicCodes);
			log.end();
		}
	log.end();
};
module.exports = new ChartBeat();

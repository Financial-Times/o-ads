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
'use strict';
var utils = require('../utils');
var config = require('../config');

/**
* initialise chartbeat functionality
* Decorates the gpt refresh method with chartbeat functionality
* @name init
* @memberof ChartBeat
* @lends ChartBeat
*/


module.exports.init = function() {
	var gpt = config('gpt') || {};
	var src = '//static.chartbeat.com/js/chartbeat_pub.js';
	this.config = config('chartbeat');

	if (this.config) {

		//CONFIGURATION
		window._sf_async_config = {
			uid: this.config.uid,
			domain: this.config.domain || location.host,
			useCanonical: this.config.canonical || true,
			zone: this.config.zone ||  gpt.site + '/' + gpt.zone,
			sections: this.config.pageType,
			refresh: this.config.refresh
		};

		if (this.config.loadsJS && !utils.isScriptAlreadyLoaded(src)) {
			// LOAD LIBRARY
			window._sf_endpt = (new Date()).getTime();
			utils.attach(src, true);
		}

		// Array used to register ad slots with chartbeat
		window._cba = [];

		// ADD CB DATA-ATTRIBUTE TO CONTAINING DIV
		utils.on('ready', function(event) {
			var slot = event.detail.slot;
			var name = utils.isNonEmptyString(slot.chartbeat) ? slot.chartbeat : slot.name;
			slot.container.setAttribute('data-cb-ad-id', name);
		});

		// Register GPT slots after they're defined with gpt
		utils.on('complete', function(event) {
			var slot = event.detail.slot;
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
	}
};

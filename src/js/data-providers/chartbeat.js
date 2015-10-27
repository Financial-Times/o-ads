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
var metadata = require('../metadata');

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
		// config must be in a global var
		window._sf_async_config = {
			uid: this.config.uid,
			domain: this.config.domain || location.host,
			useCanonical: this.config.canonical || true,
			zone: this.config.zone || gpt.unitName || gpt.site + '/' + gpt.zone,
			sections: this.config.pageType,
			enableAdRefresh: this.config.enableAdRefresh || false
		};

		if (this.config.loadsJS && !utils.isScriptAlreadyLoaded(src)) {
			// LOAD LIBRARY
			window._sf_endpt = (new Date()).getTime();
			utils.attach(src, true);
		}

		if (this.config.demographics) {
			window._cbq = window._cbq || [];
			// Pass User metadata to chartbeat
			var demographicData = "",
			userObj = metadata.user(),
			demographicCodes = {
			'02' : userObj.gender, // Gender
			'05' : userObj.industry, // Industry
			'06' : userObj.job_responsibility, // Responsibility
			'07' : userObj.job_position, // Position
			'19' : userObj.company_size, // Company Size
			'40' : userObj.DB_company_size, // DB Company Size
			'41' : userObj.DB_industry, // DB Industry
			'42' : userObj.DB_company_turnover, // DB Company Takeover
			'46' : userObj.cameo_investor_code, // Cameo Investor
			'51' : userObj.cameo_property_code, // Cameo Property
			'slv' : ((userObj.subscription_level) ? userObj.subscription_level : 'anon'),
			}; // subscriber level

			// add demographics data
			for (var key in demographicCodes) {
			if (demographicData.length !== 0) demographicData += ",";
			demographicData = demographicData + key + "=" +  (!demographicCodes[key] || demographicCodes[key].match(/(NULL)|(null)/)) ? "" : demographicCodes[key] ;
			}
			window._cbq.push(["_demo", demographicData]);

		}
	}

	// Array used to register ad slots with chartbeat
	window._cba = [];

	// add an id attribute to each slot
	// id will be the slots name unless overidden
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
};

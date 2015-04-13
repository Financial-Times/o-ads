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
"use strict";
var utils = require('../utils');

/**
* initialise chartbeat functionality
* Decorates the gpt refresh method with chartbeat functionality
* @name init
* @memberof ChartBeat
* @lends ChartBeat
*/
module.exports.init = function () {
	utils.on('ready', function(event){
		var slot = event.detail.slot;
		if(slot.cbTrack !== false){
			slot.container.setAttribute('data-cb-ad-id', slot.name);
		}
	});

	utils.on('refresh', function(event){
		if (window.pSUPERFLY) {
			window.pSUPERFLY.refreshAd(event.detail.name);
		}
	});
};

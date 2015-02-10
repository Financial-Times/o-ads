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
var ads;
var proto = Chartbeat.prototype;
/**
* The ChartBeat class defines an FT.ads.chartbeat instance
* @class
* @constructor
*/
function Chartbeat() {

}


/**
* initialise chartbeat functionality
* Decorates the gpt refresh method with chartbeat functionality
* @name init
* @memberof ChartBeat
* @lends ChartBeat
*/
proto.init = function (impl) {
	ads = impl;
	this.decorateRefresh();
};

proto.decorateRefresh = function () {
	if (ads.utils.isFunction(ads.gpt.refresh)) {
		var _refresh = ads.gpt.refresh;
			ads.gpt.refresh =  this.refresh(_refresh);
		return true;
	}
};


/**
* Alerts chartbeat that a refresh is about ot happen on multiple slots
* @name refresh
* @memberof ChartBeat
* @lends ChartBeat
*/
proto.refresh = function (fn) {
	return function (slotsForRefresh) {
		if (window.pSUPERFLY){
			var slot, slotName, cbName;
			var slots = ads.slots;
			slotsForRefresh = slotsForRefresh || slots;
			for (slotName in slotsForRefresh) {
				if (slots.hasOwnProperty(slotName)) {
					slot = slots[slotName];
					if (slot.gptSlot && slot.timer === undefined) {
						if ( ads.utils.isNonEmptyString(cbName = slot.container.getAttribute('data-cb-ad-id')) ) {
							window.pSUPERFLY.refreshAd(cbName);
						}
					}
				}
			}
		}

		fn.apply(this, arguments);
	};
};

module.exports = new Chartbeat();

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@com
 */
/**
 * ads.rubicon provides rubicon real time pricing integration for the FT advertising library
 * @name targeting
 * @memberof ads
*/
'use strict';
const utils = require('../utils');
const config = require('../config');

/**
 * The Rubicon class defines an ads.rubicon instance
 * @class
 * @constructor
*/
function Rubicon() {
}

/**
 * initialise rubicon functionality
 * loads dorothy.js from rubicon
 * Decorates the gpt init slot method with rubicon valuation functionality
 * @name init
 * @memberof Rubicon
 * @lends Rubicon
*/
Rubicon.prototype.init = function() {
	this.queue = utils.queue(this.initValuation.bind(this));
	this.config = config('rubicon') || {};
	if (this.config.id && this.config.site) {
		let api = this.config.api || '//tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=';
		api += this.config.id + '/' + this.config.site;
		utils.attach(api, true, function() {
			this.queue.process();
		}.bind(this), function() {
			this.queue.setProcessor(function(slot) {
				utils.log.error('%s rtp valuation call failed', slot.name);
			}).process();
		}.bind(this));

		utils.on('ready', function(event) {
			this.queue.add(event.detail.slot);
		}.bind(this));
	}
};

/**
 * initialise rubicon valuation for a slot
 * @name initValuation
 * @memberof Rubicon
 * @lends Rubicon
*/
Rubicon.prototype.initValuation = function(slot) {
	const config = this.config;
	const zone = (config.zones) ? config.zones[slot.name] : false;
	const size = (config.formats) ? config.formats[slot.name] : false;

	if (zone && size) {
		// rubicon loves globals
		window.oz_api = 'valuation';
		window.oz_callback = this.valuationCallbackFactory.bind(null, slot, config.target);
		window.oz_ad_server = 'gpt';
		window.oz_async = true;
		window.oz_cached_only = config.cached || true;
		window.oz_site = config.id + '/' + config.site;
		window.oz_ad_slot_size = size;
		window.oz_zone = zone;
		window.oz_insight();
	}
};

/**
 * Valuation request callback factory
 * This generates the callback that receives the data from a valution request, it keeps the slotname in a closure.
 * @name init
 * @memberof Rubicon
 * @lends Rubicon
*/
Rubicon.prototype.valuationCallbackFactory = function(slot, target, results) {
	slot.container.setAttribute('data-o-ads-rtp', results.estimate.tier);
	if (target) {
		slot.targeting.rtp = results.estimate.tier;
	}
};

module.exports = new Rubicon();

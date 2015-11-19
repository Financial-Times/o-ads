/**
 * O-ADS - the origami advertising library
 * @author Advertising Technology origami.advertising.technology@ft.com
 *
 */
'use strict';

/**
 * Represents an instance of the o-ads on the page.
 * All sub modules are available from the prototype
 * @constructor
 */
function Ads() {
}

// bung all our modules on the protoype
Ads.prototype.config = require('./src/js/config');
Ads.prototype.slots = require('./src/js/slots');
Ads.prototype.gpt = require('./src/js/ad-servers/gpt');
Ads.prototype.krux = require('./src/js/data-providers/krux');
Ads.prototype.cb = require('./src/js/data-providers/chartbeat');
Ads.prototype.rubicon = require('./src/js/data-providers/rubicon');
Ads.prototype.admantx = require('./src/js/data-providers/admantx');
Ads.prototype.targeting = require('./src/js/targeting');
Ads.prototype.metadata = require('./src/js/metadata');
Ads.prototype.version = require('./src/js/version');
Ads.prototype.buildURLForVideo = require('./src/js/video');
var utils = Ads.prototype.utils = require('./src/js/utils');

/**
* Initialises the ads library and all sub modules
* @param config {object} a JSON object containing configuration for the current page
*/

Ads.prototype.init = function(config) {
	this.config.init();
	this.config(config);
	this.slots.init();
	this.gpt.init();
	this.krux.init();
	this.cb.init();
	this.rubicon.init();
	this.admantx.init();
	this.utils.on('debug', this.debug.bind(this));
	return this;
};

var ads = new Ads();
var initAll = function() {
	var metas = utils.arrayLikeToArray(document.getElementsByTagName('meta'));
	var stop = metas.filter(function(meta) {
		return meta.name === 'o-ads-stop';
	});

	if (!stop.length) {
		ads.init();
		var slots = utils.arrayLikeToArray(document.querySelectorAll('.o-ads, [data-o-ads-name]'));
		slots.forEach(ads.slots.initSlot.bind(ads.slots));
	}

	document.documentElement.removeEventListener('o.DOMContentLoaded', initAll);
};

Ads.prototype.debug = function (){
	this.slots.debug();
};

document.documentElement.addEventListener('o.DOMContentLoaded', initAll);

module.exports = ads;

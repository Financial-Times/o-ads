//TODO remove all ft.com specific stuff so we can remove this as a global
// currently all FT specific stuff is wrapped in an if window.FT

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

/**
 * The FT.ads.config object holds the confiuration properties for an FT.ads.gpt instance.
 * There are four tiers of configuration; cookie level config, default config (set within the constructor), metatag config and global (env) config.
 * Global config, (set in the page FT.env ojbect) takes priority over meta followed by default config with cookie config having the least priority.
 * The FT.ads.config() function acts as an accessor method for the config; allowing getting and setting of configuration values.
 * Calling config() with no parameters returns the entire configuration object.
 * Calling config passing a valid property key will envoke the 'getter' and return the value for that property key.
 * Calling config passing a valid property key and a value will envoke the setter and set the value of the key to the new value.
 * Calling config passing an object of keys and values will envoke a setter that extends the store with the object provided.
 * @name config
 * @memberof FT.ads
 * @function
*/
'use strict';
var utils = require('./utils');
/**
* Default configuration set in the constructor.
*/
var defaults = {
	formats: {
		MediumRectangle:  {sizes:[300, 250]},
		Rectangle:  {sizes:[180, 50]},
		WideSkyscraper:  {sizes:[160, 600]},
		Leaderboard:  {sizes:[728, 90]},
		SuperLeaderboard: {sizes: [[970, 90]]},
		HalfPage: {sizes: [300, 600]},
		Billboard:  {sizes: [970, 250]},
		Portrait:  {sizes: [300, 1050]},
		Pushdown:  {sizes: [[970, 90], [970, 66]]},
		Sidekick:  {sizes: [[300, 250], [300, 600], [970, 250]]},
		AdhesionBanner: {sizes: [320, 50]}
	},
	flags: {
		refresh: true,
		sticky: true,
		inview: true
	}
};

/**
* @private
* @function
* fetchMetaConfig pulls out metatag key value pairs into an object returns the object
*/
function fetchMetaConfig() {
	var meta;
	var results = {};
	var metas = document.getElementsByTagName('meta');
	for (var i = 0; i < metas.length; i++) {
		meta = metas[i];
		if (meta.name) {
			if (meta.getAttribute('data-contenttype') === 'json') {
				results[meta.name] = (window.JSON) ? JSON.parse(meta.content) : 'UNSUPPORTED';
			} else {
				results[meta.name] = meta.content;
			}
		}
	}

	return results;
}

function fetchDeclaritiveConfig() {
	var script;
	var scripts = document.querySelectorAll('script[data-o-ads-config]');
	var results = {};
	for (var i = 0; i < scripts.length; i++) {
		script = scripts[i];
		results = (window.JSON) ? utils.extend(results, JSON.parse(script.innerHTML)) : 'UNSUPPORTED';
	}

	return results;
}

/**
* @private
* @function
* fetchCanonicalURL Grabs the canonical URL from the page meta if it exists.
*/
function fetchCanonicalURL() {
	var canonical;
	var canonicalTag = document.querySelector('link[rel="canonical"]');
	if (canonicalTag) {
		canonical = canonicalTag.href;
	}

	return { canonical: canonical };
}

/**
* Defines a store for configuration information and returns a getter/setter method for access.
* @class
* @constructor
*/
function Config() {
	this.store = {};
}

Config.prototype.access = function(k, v) {
	var result;
	if (utils.isPlainObject(k)) {
		utils.extend(true, this.store, k);
		result = this.store;
	} else if (typeof v === 'undefined') {
		if (typeof k === 'undefined') {
			result = this.store;
		} else {
			result = this.store[k];
		}
	} else {
		this.store[k] = v;
		result = v;
	}

	return result;
};


Config.prototype.clear = function(key) {
	if (key) {
		delete this.store[key];
	} else {
		this.store = {};
	}
};

Config.prototype.init = function() {
	this.store = utils.extend(true, {}, defaults, fetchMetaConfig(), fetchCanonicalURL(), fetchDeclaritiveConfig());
	return this.store;
};

var config = new Config();
module.exports = config.access.bind(config);
module.exports.init = config.init.bind(config);
module.exports.clear = config.clear.bind(config);

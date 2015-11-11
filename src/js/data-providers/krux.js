/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
/**
 * FT.ads.targeting is an object providing properties and methods for accessing targeting parameters from various sources including FT Track and Audience Science and passing them into DFP
 * @name targeting
 * @memberof FT.ads

*/
'use strict';
var utils = require('../utils');
var config = require('../config');
var delegate;
delegate = require('ftdomdelegate');

/**
 * The Krux class defines an FT.ads.krux instance
 * @class
 * @constructor
*/
function Krux() {

}

Krux.prototype.init = function(impl) {
	var conf = config('krux');
	var metadata = config('metadata');
	if (config('krux') && config('krux').id) {

		if (!window.Krux) {
			((window.Krux = function() {
				window.Krux.q.push(arguments);
			}).q = []
			);
		}

		this.setPageAttributes(metadata)
		this.setUserAttributes(metadata)

		var m,
		src = (m = location.href.match(/\bkxsrc=([^&]+)/)) && decodeURIComponent(m[1]),
		finalSrc = /^https?:\/\/([^\/]+\.)?krxd\.net(:\d{1,5})?\//i.test(src) ? src : src === "disable" ? "" :  "//cdn.krxd.net/controltag?confid=" + config('krux').id;

		utils.attach(finalSrc, true);
		this.events.init();
	} else {
		// can't initialize Krux because no Krux ID is configured, please add it as key id in krux config.
	}
};

/**
* retrieve Krux values from localstorage or cookies in older browsers.
* @name retrieve
* @memberof Krux
* @lends Krux
*/
Krux.prototype.retrieve = function(name) {
	var value;
	name = 'kx' + name;

	if (window.localStorage && localStorage.getItem(name)) {
		value = localStorage.getItem(name);
	}  else if (utils.cookie(name)) {
		value = utils.cookie(name);
	}

	return value;
};

/**
* retrieve Krux segments
* @name segments
* @memberof Krux
* @lends Krux
*/
Krux.prototype.segments = function() {
	return this.retrieve('segs');
};

/**
* Retrieve all Krux values used in targeting and return them in an object
* Also limit the number of segments going into the ad calls via krux.limit config
* @name targeting
* @memberof Krux
* @lends Krux
*/
Krux.prototype.targeting = function() {
	var segs = this.segments();
	if (segs) {
		segs = segs.split(',');
		if (config('krux').limit) {
			segs = segs.slice(0, config('krux').limit);
		}
	}

	return {
		"kuid": this.retrieve('user'),
		"ksg": segs,
		"khost": encodeURIComponent(location.hostname),
		"bht": segs && segs.length > 0 ? 'true' : 'false'
	};
};

/**
* An object holding methods used by krux event pixels
* @name events
* @memberof Krux
* @lends Krux
*/
Krux.prototype.events = {
	dwell_time: function(config) {
		if (config) {
			var fire = this.fire,
			interval = config.interval || 5,
			max = (config.total / interval) || 120,
			uid = config.id;
			utils.timers.create(interval, (function() {
				return function() {
					fire(uid, {dwell_time: (this.interval * this.ticks) / 1000 });
				};
			}()), max, {reset: true});
		}
	},
	delegated: function(config) {
		if (window.addEventListener) {
			if (config) {
				var fire = this.fire;
				var eventScope = function(kEvnt) {
					return function(e, t) {
						fire(config[kEvnt].id);
					};
				};

				window.addEventListener('load', function() {
					var delEvnt = new delegate(document.body);
					for (var kEvnt in config) {
						if (config.hasOwnProperty(kEvnt)) {
							delEvnt.on(config[kEvnt].eType, config[kEvnt].selector, eventScope(kEvnt));
						}
					}
				}, false);
			}
		}
	}
};

Krux.prototype.events.fire = function(id, attrs) {
	if (id) {
		attrs = utils.isPlainObject(attrs) ? attrs : {};
		return window.Krux('admEvent', id, attrs);
	}

	return false;
};

Krux.prototype.events.init = function() {
	var event, configured = config('krux') && config('krux').events;
	if (utils.isPlainObject(configured)) {
		for (event in configured) {
			if (utils.isFunction(this[event])) {
				this[event](configured[event]);
			} else if (utils.isFunction(configured[event].fn)) {
				configured[event].fn(configured[event]);
			}
		}
	}
};

Krux.prototype.setPageAttributes = function (metadata) {
	if(metadata && metadata.page){
		Object.keys(metadata.page).forEach(function(item) {
			Krux('set', 'page_attr_' + item, metadata.page[item]);
		});
	}
};

Krux.prototype.setUserAttributes = function (metadata) {
	if(metadata && metadata.user){
		Object.keys(metadata.user).forEach(function(item) {
			Krux('set', 'user_attr_' + item, metadata.user[item]);
		});
	}
};

module.exports = new Krux();

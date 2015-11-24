/**
 * Utility methods for logging.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils/log
 * @see utils
 */

/* jshint devel: true */
'use strict';

module.exports = log;

/**
 * Safe logger for the browser
 * @exports utils/log
 * @param {string} type Sets the type of log message log, warn, error or info, if not set to one of these values log will be used
 * @param {any} args the arguments to be passed to console[type]
 */
function log() {
	var type, args, argsIndex;
	if ('log warn error info'.indexOf(arguments[0]) === -1) {
		type = 'log';
		argsIndex = 0;
	} else {
		type = arguments[0];
		argsIndex = 1;
	}

	args = [].slice.call(arguments, argsIndex);

	if (log.isOn(type)) {
		window.console[type].apply(window.console, args);
	}
}

/**
 * Determine if debug logging is on and if the type if supported
 * @param {string} type
 */
module.exports.isOn = function(type) {
	var debug = localStorage.getItem('oAds') || location.search.indexOf('DEBUG=OADS') !== -1;
	return debug && window.console && window.console[type];
};

/**
 * Log a warning message
 */
module.exports.warn = function() {
	var args = ['warn'].concat([].slice.call(arguments, 0));
	log.apply(null, args);
};

/**
 * Log an error message
 */
module.exports.error = function() {
	var args = ['error'].concat([].slice.call(arguments, 0));
	log.apply(null, args);
};

/**
 * Log an info message
 */
module.exports.info = function() {
	var args = ['info'].concat([].slice.call(arguments, 0));
	log.apply(null, args);
};

/**
 * Start a collapsed group
 * @param {string} group the name of the group, defaults to o-ads
 */
module.exports.start = function(group) {
	if (!log.isOn('groupCollapsed')) {
		return;
	}

	window.console.groupCollapsed(group || 'o-ads');
};

/**
 * End a collapsed group
 */
module.exports.end = function() {
	if (!log.isOn('groupEnd')) {
		return;
	}

	window.console.groupEnd();
};

module.exports.table = function(data, columns) {
	if (log.isOn('log') && window.console) {
		if(console.table) {
			console.table(data, columns);
		} else {
			console.log(data);
		}
	}
};

module.exports.attributeTable = function(object, columns) {
	if (log.isOn('log') && window.console) {
		if(console.table) {
			var val;
			if (FT.ads.utils.isArray(object[item]) || FT.ads.utils.isObject(object[item])) {
				val = JSON.stringify(object[item]);
			} else {
				val = object[item];
			}
			return {
				key: item,
				value: val
			};
		}
		console.table(data, columns);
		} else {
			console.log(object);
		}
	};
};

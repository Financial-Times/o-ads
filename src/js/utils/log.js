/* eslint no-console: 0 */
import { isArray, isObject } from './index';

/**
 * Utility methods for logging.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils/log
 * @see utils
 */

/* jshint devel: true */

/**
 * Safe logger for the browser
 * @exports utils/log
 * @param {string} type Sets the type of log message log, warn, error or info, if not set to one of these values log will be used
 * @param {any} args the arguments to be passed to console[type]
 */
export default function log() {
	let type;
	let argsIndex;
	if ('log warn error info'.indexOf(arguments[0]) === -1) {
		type = 'log';
		argsIndex = 0;
	} else {
		type = arguments[0];
		argsIndex = 1;
	}

	const args = [].slice.call(arguments, argsIndex);

	if (log.isOn(type)) {
		window.console[type].apply(window.console, args);
	}
}

/**
 * Determine if debug logging is on and if the type if supported
 * @param {string} type
 */
export const isOn = function(type) {
	/* istanbul ignore else  */
	const debug = localStorage && localStorage.getItem('oAds') || location.search.indexOf('DEBUG=OADS') !== -1;
	return debug && window.console && window.console[type];
};

/**
 * Log a warning message
 */
export const warn = function() {
	const args = ['warn'].concat([].slice.call(arguments, 0));
	log.apply(null, args);
};

/**
 * Log an error message
 */
export const error = function() {
	const args = ['error'].concat([].slice.call(arguments, 0));
	log.apply(null, args);
};

/**
 * Log an info message
 */
export const info = function() {
	const args = ['info'].concat([].slice.call(arguments, 0));
	log.apply(null, args);
};

/**
 * Start a collapsed group
 * @param {string} group the name of the group, defaults to o-ads
 */
export const start = function(group) {
	if (!log.isOn('groupCollapsed')) {
		return;
	}

	window.console.groupCollapsed(group || 'o-ads');
};

/**
 * End a collapsed group
 */
export const end = function() {
	if (!log.isOn('groupEnd')) {
		return;
	}

	window.console.groupEnd();
};

export const table = function(data, columns) {
	if (log.isOn('log') && window.console) {
		if(console.table) {
			console.table(data, columns);
		} else {
			console.log(data);
		}
	}
};

export const attributeTable = function(object, columns) {
	if (log.isOn('log') && window.console) {
		if (object && console.table) {
			const data = Object.keys(object).map((item) => {
				let val;
				if (isArray(object[item]) || isObject(object[item])) {
					val = JSON.stringify(object[item]);
				} else {
					val = object[item];
				}
				return {
					key: item,
					value: val
				};
			});
			console.table(data, columns);
		} else {
			console.log(object);
		}
	}
};

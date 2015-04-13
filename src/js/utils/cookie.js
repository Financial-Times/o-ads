/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Adapted for use in FT advertising Robin Marr 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
'use strict';

var utils = require('./index.js'),
	pluses = /\+/g,
	today = new Date();

function raw(s) {
	return s;
}

function decoded(s) {
	return decodeURIComponent(s.replace(pluses, ' '));
}

var config = module.exports.cookie = function (key, value, options) {
	// write
	if (value !== undefined) {
		options = utils.extend({}, config.defaults, options);

		if (value === null) {
			options.expires = -1;
		}

		if (typeof options.expires === 'number') {
			var days = options.expires, t = options.expires = new Date();
			t.setDate(t.getDate() + days);
		}

		value = config.json ? JSON.stringify(value) : String(value);
		value = config.raw ? value : encodeURIComponent(value);
		if(!!options.expires && (options.expires.valueOf() - today.valueOf()) < 0) {
			delete utils.cookies[encodeURIComponent(key)];
		} else {
			utils.cookies[encodeURIComponent(key)] = value;
		}

		return (document.cookie = [
			encodeURIComponent(key), '=', value,
			options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path    ? '; path=' + options.path : '',
			options.domain  ? '; domain=' + options.domain : '',
			options.secure  ? '; secure' : ''
		].join(''));
	}

	// read
	var decode = config.raw ? raw : decoded;
	var cookie = utils.cookies[encodeURIComponent(key)];
	if (!!cookie || cookie === '') {
		return config.json ? JSON.parse(decode(cookie)) : decode(cookie);
	}

	return null;
};

config.defaults = {};

module.exports.removeCookie = function (key, options) {
	if (module.exports.cookie(key) !== null) {
		module.exports.cookie(key, null, options);
		return true;
	}
	return false;
};

function getRegExp(name, param) {
	var re,
	formats ={
		"AYSC": "underscore",
		"FT_U": "underscoreEquals",
		"FT_Remember": "colonEquals",
		"FT_User": "colonEquals",
		"FTQA": "commaEquals"
	};

	switch (formats[name]) {
	case "underscore":
		re = '_' + param + '([^_]*)_';
		break;
	case "underscoreEquals":
		re = '_' + param + '=([^_]*)_';
		break;
	case "colonEquals":
		re = ':' + param + '=([^:]*)';
		break;
	case "commaEquals":
		re = param + '=([^,]*)';
		break;
	default:
		re = /((.|\n)*)/; // match everything
		break;
	}
	return new RegExp(re);
}

/** Get a parameter from a named cookie
 * @param {string} name The cookie's name
 * @param {string} param The parameter's name
 * @return {string|undefined}
 */
module.exports.getCookieParam = function (name, param) {
	var matches,
		wholeValue = module.exports.cookie(name) || "";
	if (param) {
		matches = wholeValue.match(getRegExp(name, param));
	}
	return (matches && matches.length) ? matches[1] : undefined;
};

module.exports.cookies = utils.hash(document.cookie, ';', '=');

/**
 * Utility methods for reading.writing cookie. Inspired by the jQuery Cookie plugin (https://github.com/carhartl/jquery-cookie).
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils/cookie
 * @see utils
 */

const utils = require('./index.js');
const pluses = /\+/g;
const today = new Date();

function raw(s) {
	return s;
}

function decoded(s) {
	return decodeURIComponent(s.replace(pluses, ' '));
}

/*
*	Read or write a cookie
* @exports utils/cookie
* @param {string} key the name of the cookie to be read/written
* @param {string} value The value to set to the written cookie (if param is missing the cookie will be read)
* @param {object} options Expires,
*/
const config = module.exports.cookie = function(key, value, options) {
	// write
	if (value !== undefined) {
		options = utils.extend({}, config.defaults, options);

		if (value === null) {
			options.expires = -1;
		}

		if (typeof options.expires === 'number') {
			const days = options.expires, t = options.expires = new Date();
			t.setDate(t.getDate() + days);
		}

		value = config.json ? JSON.stringify(value) : String(value);
		value = config.raw ? value : encodeURIComponent(value);
		if (!!options.expires && (options.expires.valueOf() - today.valueOf()) < 0) {
			delete utils.cookies[encodeURIComponent(key)];
		} else {
			utils.cookies[encodeURIComponent(key)] = value;
		}

		return (document.cookie = [
		encodeURIComponent(key), '=', value,
		options.expires ? `; expires=${options.expires.toUTCString()}` : '', // use expires attribute, max-age is not supported by IE
		options.path ? `; path=${options.path}` : '',
		options.domain ? `; domain=${options.domain}` : '',
		options.secure ? `; secure` : ''
		].join(''));
	}

	// read
	const decode = config.raw ? raw : decoded;
	const cookie = utils.cookies[encodeURIComponent(key)];
	if (!!cookie || cookie === '') {
		return config.json ? JSON.parse(decode(cookie)) : decode(cookie);
	}

	return null;
};

config.defaults = {};

/*
* Delete a cookie
* @exports utils/cookie/removeCookie
* @param {string} name The cookie's name
* @param {object} options see options above
*/
module.exports.removeCookie = function(key, options) {
	if (module.exports.cookie(key) !== null) {
		module.exports.cookie(key, null, options);
		return true;
	}

	return false;
};

/*
* Get the regex required to parse values from a cookie
* @private
* @param {string} name The cookie's name
* @param {string} param The parameter's name
* @return {string|undefined}
*/
function getRegExp(name, param) {
	let re;

	const formats = {
		"AYSC": "underscore",
		"FT_U": "underscoreEquals",
		"FT_Remember": "colonEquals",
		"FT_User": "colonEquals",
		"FTQA": "commaEquals"
	};

	switch (formats[name]) {
	case "underscore":
		re = `_${param}([^_]*)_`;
		break;
	case "underscoreEquals":
		re = `_${param}=([^_]*)_`;
		break;
	case "colonEquals":
		re = `:${param}=([^:]*)`;
		break;
	case "commaEquals":
		re = `${param}=([^,]*)`;
		break;
	default:
		re = /((.|\n)*)/; // match everything
		break;
	}
	return new RegExp(re);
}

/*
* Get a parameter from a named cookie
* @exports utils/cookie/getCookieParam
* @param {string} name The cookie's name
* @param {string} param The parameter's name
* @return {string|undefined}
*/
module.exports.getCookieParam = function(name, param) {
	let matches;

	const wholeValue = module.exports.cookie(name) || "";
	/* istanbul ignore else  */
	if (param) {
		matches = wholeValue.match(getRegExp(name, param));
	}

	return (matches && matches.length) ? matches[1] : undefined;
};

/*
* Parse document.cookie into an object for easier reading
* @name cookies
* @member cookie
*/
module.exports.cookies = utils.hash(document.cookie, ';', '=');

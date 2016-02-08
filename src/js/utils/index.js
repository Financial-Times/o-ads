/**
 * Utility methods for the advertising library.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils
 */
'use strict';
var hop = Object.prototype.hasOwnProperty;

var utils = module.exports;
/**
 * Uses object prototype toString method to get at the type of object we are dealing,
 * IE returns [object Object] for null and undefined so we need to filter those
 * http://es5.github.com/#x15.2.4.2
 * @private
 * @param {object} Any javascript object
 * @returns The type of the object e.g Array, String, Object
 */
function is(object) {
	var type = Object.prototype.toString.call(object)
	.match(/^\[object\s(.*)\]$/)[1];

	if (object === null) {
		return "Null";
	} else if (object === undefined) {
		return "Undefined";
	} else {
		return type;
	}
}

/**
 * Creates a method for testing the type of an Object
 * @private
 * @param {string} The name of the object type to be tested e.g. Array
 * @returns a method that takes any javascript object and tests if it is of
 * the supplied className
 */
function createIsTest(className) {
	return function(obj) {
		return is(obj) === className;
	};
}

/**
 * Curries some useful is{ClassName} methods into the supplied Object
 * @private
 * @param {object} The object to add the methods too
 * @param {array} A list of types to create methods for defaults to "Array", "Object", "String", "Function"
 * @returns The object supplied in the first param with is{ClassName} Methods Added
 */
function curryIsMethods(obj, classNames) {
	classNames = classNames || [
	'Array',
	'Object',
	'String',
	'Function',
	'Storage'
	];

	while (!!classNames.length) {
		var className = classNames.pop();
		obj['is' + className] = createIsTest(className);
	}

	return obj;
}

/**
 * Test if an object is the global window object
 * @param {object} obj The object to be tested
 * @returns {boolean} true if the object is the window obj, otherwise false
 */
module.exports.isWindow = function(obj) {
	return obj && obj !== null && obj === window;
};

/**
 * Test if an object inherits from any other objects, used in extend
 * to protect against deep copies running out of memory and constructors
 * losing there prototypes when cloned
 * @param {object} obj The object to be tested
 * @returns {boolean} true if the object is plain false otherwise
 */
module.exports.isPlainObject = function(obj) {
	var hop = Object.prototype.hasOwnProperty;

	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if (!obj || !utils.isObject(obj) || obj.nodeType || utils.isWindow(obj)) {
		return false;
	}

	try {
		// Not own constructor property must be Object
		if (obj.constructor && !hop.call(obj, 'constructor') && !hop.call(obj.constructor.prototype, 'isPrototypeOf')) {
			return false;
		}
	} catch (e) {
		/* istanbul ignore next  */
		// IE8,9 Will throw exceptions on certain host objects
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.

	var key;
	for (key in obj) {}

	return key === undefined || hop.call(obj, key);
};

/**
 * Test if an object is a string with a length
 * @param {object} str The object to be tested
 * @returns {boolean} true if the object is a string with a length greater than 0
 */
module.exports.isNonEmptyString = function(str) {
	return utils.isString(str) && !!str.length;
};

module.exports.isElement = function(element) {
	return element && element.nodeType === 1 && element.tagName || false;
};

/**
 * Test if an object is a finite number
 * @param {object} The object to be tested
 * @returns {boolean} true if the object is a finite number, can be a float or int but not NaN or Infinity
 */
module.exports.isNumeric = function(num) {
	return !isNaN(parseFloat(num)) && isFinite(num);
};

/**
 * Merge or clone objects
 * @function
 * @param {boolean/object} deep/target If boolean specifies if this should be a deep copy or not, otherwise is the target object for the copy
 * @param {object} target If deep copy is true will be the target object of the copy
 * @param {object} objects All other params are objects to be merged into the target
 * @returns {object} The target object extended with the other params
 */
module.exports.extend = extend;

function extend() {
	/* jshint forin: false */
	/* when doing a deep copy we want to copy prototype properties */
	var options, name, src, copy, copyIsArray, clone,
	target = arguments[0] || {},
	i = 1,
	length = arguments.length,
	deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};

		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	/* istanbul ignore else  */
	if (typeof target !== "object" && !utils.isFunction(target)) {
		target = {};
	}

	// do nothing if only one argument is passed (or 2 for a deep copy)
	/* istanbul ignore else  */
	if (length === i) {
		return target;
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) !== null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging arrays
				if (deep && copy && (utils.isPlainObject(copy) || utils.isArray(copy))) {
					copyIsArray = utils.isArray(copy);
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && utils.isArray(src) ? src : [];
					} else {
						clone = src && utils.isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
}

module.exports.hasClass = function(node, className) {
	/* istanbul ignore else  */
	if (node.nodeType === 1) {
		return node.className.split(' ').indexOf('o-ads__' + className) > -1 ? true : false;
	}

	return false;
};

module.exports.addClass = function(node, className) {
	if (node.nodeType === 1 && utils.isNonEmptyString(className) && !utils.hasClass(node, className)) {
		node.className += ' o-ads__' + className.trim();
	}

	return true;
};

module.exports.removeClass = function(node, className) {
	var index, classes;
	if (node.nodeType === 1 && utils.isNonEmptyString(className) && utils.hasClass(node, className)) {
		classes = node.className.split(' ');
		index = classes.indexOf('o-ads__' + className);
		classes.splice(index, 1);
		node.className = classes.join(' ');
	}

	return true;
};

/**
 * Create an object hash from a delimited string
 * Beware all properties on the resulting object will have string values.
 * @param {string}        str       The string to transform
 * @param {string|regexp} delimiter The character that delimits each name/value pair
 * @param {string}        pairing   The character that separates the name from the value
 * @return {object}
 *
 */
module.exports.hash = function(str, delimiter, pairing) {
	var pair, value, idx, len,
	hash = {};
	if (str && str.split) {
		str = str.split(delimiter);

		for (idx = 0, len = str.length; idx < len; idx += 1) {
			value = str[idx];
			pair = value.split(pairing);
			if (pair.length > 1) {
				hash[pair[0].trim()] = pair.slice(1).join(pairing);
			}
		}
	}

	return hash;
};

/**
* Takes a script URL as a string value, creates a new script element, sets the src and attaches to the page
* The async value of the script can be set by the seccond parameter, which is a boolean
* Note, we should use protocol-relative URL paths to ensure we don't run into http/https issues
* @param {string} scriptUrl The url to the script file to be added
* @param {boolean} async Set the async attribute on the script tag
* @param {function} callback A function to run when the script loads
* @param {function} errorcb A function to run if the script fails to load
* @returns {HTMLElement} the created script tag
*/
module.exports.attach = function(scriptUrl, async, callback, errorcb) {
	var tag = document.createElement('script');
	var node = document.getElementsByTagName('script')[0];
	var hasRun = false;
	tag.setAttribute('src', scriptUrl);
	tag.setAttribute('o-ads', '');
	/* istanbul ignore else */
	if (async) {
		tag.async = 'true';
	}
	/* istanbul ignore else  */
	if (utils.isFunction(callback)) {
		/* istanbul ignore if - legacy IE code, won't test */
		if (hop.call(tag, 'onreadystatechange')) {
			tag.onreadystatechange = function() {
				if (tag.readyState === "loaded") {
					if (!hasRun) {
						callback();
						hasRun = true;
					}
				}
			};
		} else {
			tag.onload =  function() {
				/* istanbul ignore else  */
				if (!hasRun) {
					callback();
					hasRun = true;
				}
			};
			/* istanbul ignore else  */
			if (utils.isFunction(errorcb)) {
				tag.onerror = function() {
					/* istanbul ignore else  */
					if (!hasRun) {
						errorcb();
						hasRun = true;
					}
				};
			}
		}
	}

	// Use insert before, append child has issues with script tags in some browsers.
	node.parentNode.insertBefore(tag, node);
	return tag;
};

/*
* Test to see if a script file is already referenced from the dom
* @param {string} url The URL to look for
* @return {boolean} true if the file is already referenced else false
*/
module.exports.isScriptAlreadyLoaded = function(url) {
	var scripts = document.getElementsByTagName('script');
	for (var i = scripts.length; i--;) {
		if (scripts[i].src === url) return true;
	}

	return false;
};

/*
* Make a cross domain XHR request
* @param {string} The url to request
* @param {string} THe method of the request (GET, POST).
* @param {function} callback A function to run when the request succeeds
* @param {function} A function to run if the request fails
* @returns {HTMLElement} the created XHR object
*/
module.exports.createCORSRequest = function(url, method, callback, errorcb) {
	var xhr = new XMLHttpRequest();
	/* istanbul ignore else - legacy IE code, won't test */
	if ('withCredentials' in xhr) {
		xhr.open(method, url, true);
		xhr.responseType = 'json';
	} else if (typeof XDomainRequest !== "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url, true);
	} else {
		xhr = null;
		errorcb();
	}

	xhr.onload = function(xhrEvent) {
		callback.call(this, this.response || this.responseText, xhrEvent);
	};

	if (utils.isFunction(errorcb)) {
		xhr.onerror = errorcb();
		xhr.ontimeout = errorcb();
	}

	xhr.send();
	return xhr;
};

/**
* return the current documents referrer or an empty string if non exists
* This method enables us to mock the referrer in our tests reliably and doesn't really serve any other purpose
* @returns {string} document.referrer
*/
/* istanbul ignore next - cannot reliably test value of referer */
module.exports.getReferrer = function() {
	return document.referrer || '';
};

/**
* Capitalise a string
* @param {string} string the string to capitalise
* @returns {string}
*/
module.exports.capitalise = function(string) {
	return string.replace(/(^[a-z])/, function(match, letter) {
		return letter.toUpperCase();
	});
};

/**
* Remove hyphens from a string and upper case the following letter
* @param {string} string the string to parse
* @returns {string}
*/
module.exports.dehyphenise = function(string) {
	return string.replace(/(-)([a-z])/g, function(match, hyphen, letter) {
		return letter.toUpperCase();
	});
};

/**
* Find uppercase characters in a string, lower case them and add a preceding hyphen
* @param {string} string the string to parse
* @returns {string}
*/
module.exports.hyphenise = function(string) {
	return string.replace(/([A-Z])/g, function(match, letter) {
		return '-' + letter.toLowerCase();
	});
};

/**
* remove prefixes from o-ads data attributes and dehyphenise the name
* @param {string|} name the name of the attribute to parse
* @returns {string}
*/
module.exports.parseAttributeName = function(attribute) {
	var name = utils.isString(attribute) ? attribute : attribute.name;
	return utils.dehyphenise(name.replace(/(data-)?o-ads-/, ''));
};

/**
* return the current documents url or an empty string if non exists
* This method enables us to mock the document location string in our tests reliably and doesn't really serve any other purpose
* @returns {string}
*/
/* istanbul ignore next - cannot reliably test value of location */
module.exports.getLocation = function() {
	return document.location.href || '';
};

/**
* return the current documents search or an empty string if non exists
* also strips the initial ? from the search string for easier parsing
* This method enables us to mock the search string in our tests reliably and doesn't really serve any other purpose
* @returns {string}
*/
module.exports.getQueryString = function() {
	return document.location.search.substring(1) || '';
};

/**
* returns a timestamp of the current date/time in the format YYYYMMDDHHMMSS
* @returns {string}
*/
module.exports.getTimestamp = function() {
	var now = new Date();
	return [
	now.getFullYear(),
	('0' + (now.getMonth() + 1)).slice(-2),
	('0' + now.getDate()).slice(-2),
	('0' + now.getHours()).slice(-2),
	('0' + now.getMinutes()).slice(-2),
	('0' + now.getSeconds()).slice(-2)
	].join("");
};

/**
* Converts an array like object e.g arguments into a full array
* @param {object}  obj an Array like object to convert
* @returns {array}
*/
module.exports.arrayLikeToArray = function(obj) {
	var array = [];
	try {
		array = Array.prototype.slice.call(obj);
	} catch (error) {
		/* istanbul ignore next  */
		for (var i = 0; i < obj.length; i++) {
			array[i] = obj[i];
		}
	}

	return array;
};

// capture all iframes in the page in a live node list
var iframes = document.getElementsByTagName('iframe');

/**
* Given the window object of an iframe this method returns the o-ads slot name
* that rendered the iframe, if the iframe was not rendered by o-ads this will
* return false
* @param {window}  a window object
* @returns {String|Boolean}
*/
module.exports.iframeToSlotName = function(iframeWindow) {
	var slotName, node;
	var i = iframes.length;

	// Figure out which iframe DOM node we have the window for
	while (i--) {
		/* istanbul ignore else  */
		if (iframes[i].contentWindow === iframeWindow) {
			node = iframes[i];
			break;
		}
	}
	/* istanbul ignore else  */
	if (node) {
		// find the closest parent with a data-o-ads-name attribute, that's our slot name
		while (node.parentNode) {
			slotName = node.getAttribute('data-o-ads-name');
			/* istanbul ignore else  */
			if (slotName) {
				return slotName;
			}

			node = node.parentNode;
		}
	}

	return false;
};

extend(module.exports, require('./cookie.js'));
extend(module.exports, require('./events.js'));
extend(module.exports, require('./messenger.js'));
module.exports.responsive = require('./responsive.js');
module.exports.timers = require('./timers.js')();
module.exports.queue = require('./queue.js');
module.exports.log = require('./log');
curryIsMethods(module.exports);

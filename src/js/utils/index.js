/**
 * Utility methods for the advertising library.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils
 */
const hop = Object.prototype.hasOwnProperty;

const utils = module.exports;
/**
 * Uses object prototype toString method to get at the type of object we are dealing,
 * IE returns [object Object] for null and undefined so we need to filter those
 * http://es5.github.com/#x15.2.4.2
 * @private
 * @param {object} Any javascript object
 * @returns The type of the object e.g Array, String, Object
 */
function is(object) {
	const type = Object.prototype.toString.call(object)
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

	while (classNames.length) {
		const className = classNames.pop();
		obj[`is${className}`] = createIsTest(className);
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
	const hop = Object.prototype.hasOwnProperty;

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
	let key;
	for (key in obj) {} //eslint-disable-line no-empty

	return key === undefined || hop.call(obj, key);
};

/**
 * Test if an object is a string with a length
 * @param {object} str The object to be tested
 * @returns {boolean} true if the object is a string with a length greater than 0
 */
module.exports.isNonEmptyString = function(str) {
	return utils.isString(str) && Boolean(str.length);
};

module.exports.isElement = function(element) {
	return element && element.nodeType === 1 && element.tagName || false;
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
	let options;
	let src;
	let copy;
	let copyIsArray;
	let clone;
	let target = arguments[0] || {};
	const length = arguments.length;
	let deep = false;
	let i = 1;

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
			for (const name in options) {
				/* istanbul ignore next */
				if(options.hasOwnProperty(name)) {
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
	}

	// Return the modified object
	return target;
}

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
	let pair;
	let value;
	const hash = {};
	if (str && str.split) {
		str = str.split(delimiter);

		for (let idx = 0, l = str.length; idx < l; idx += 1) {
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
module.exports.attach = function(scriptUrl, async, callback, errorcb, autoRemove) {
	const tag = document.createElement('script');
	const node = document.getElementsByTagName('script')[0];
	let hasRun = false;

	function processCallback(callback) {
		/* istanbul ignore else  */
		if (!hasRun) {
			callback.call();
			hasRun = true;
			/* istanbul ignore else  */
			if(autoRemove) {
				tag.parentElement.removeChild(tag);
			}
		}
	}

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
					processCallback(callback);
				}
			};
		} else {
			tag.onload = function() {
				processCallback(callback);
			};
		}
	}

	/* istanbul ignore else  */
	if (utils.isFunction(errorcb)) {
		tag.onerror = function() {
			processCallback(errorcb);
		};
	}
	// Use insert before, append child has issues with script tags in some browsers.
	node.parentNode.insertBefore(tag, node);
	return tag;
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
 * remove prefixes from o-ads data attributes and dehyphenise the name
 * @param {string|} name the name of the attribute to parse
 * @returns {string}
 */
module.exports.parseAttributeName = function(attribute) {
	const name = utils.isString(attribute) ? attribute : attribute.name;
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
 * Get a query string parameter by name from a url
 * @param name
 * @param url
 * @returns {string | null}
 */
module.exports.getQueryParamByName = function(name, url) {
	url = url || window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	const results = regex.exec(url);
	if (!results) {return null;}
	if (!results[2]) {return '';}
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/**
 * returns a timestamp of the current date/time in the format YYYYMMDDHHMMSS
 * @returns {string}
 */
module.exports.getTimestamp = function() {
	const now = new Date();
	return [
		now.getFullYear(),
		`0${(now.getMonth() + 1)}`.slice(-2),
		`0${now.getDate()}`.slice(-2),
		`0${now.getHours()}`.slice(-2),
		`0${now.getMinutes()}`.slice(-2),
		`0${now.getSeconds()}`.slice(-2)
	].join("");
};

/**
 * Given the window object of an iframe this method returns the o-ads slot name
 * that rendered the iframe, if the iframe was not rendered by o-ads this will
 * return false
 * @param {window}  a window object
 * @returns {String|Boolean}
 */
module.exports.iframeToSlotName = function(iframeWindow) {
	// capture all iframes in the page in a live node list
	const iframes = document.getElementsByTagName('iframe');
	let slotName;
	let node;
	let i = iframes.length;

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

module.exports.buildObjectFromArray = function buildObjectFromArray(targetObject) {
	return targetObject.reduce((prev, data) => {
		prev[data.key] = data.value;
		return prev;
	}, {});
};

module.exports.cookie = function(name) {
	const val = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
	return val ? val.pop() : null;
};

extend(module.exports, require('./events.js'));
extend(module.exports, require('./messenger.js'));
module.exports.responsive = require('./responsive.js');
module.exports.log = require('./log');
curryIsMethods(module.exports);

/**
 * @fileOverview
 * Utility methods for the advertising library.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
'use strict';
//TODO Use polyfils service for these instead
// add an ECMAScript5 compliant trim to String
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/Trim
if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

// add an ECMAScript5 compliant indexOf to Array
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        if (this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n !== 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}


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
function createIsTest(className){
  return function (obj) {
    return is(obj) === className;
  };
}

/**
 * Curries some useful is{ClassName}method into the supplied Object
 * @private
 * @param {object} The object to add the methods too
 * @param {array} A list of types to create methods for defaults to "Array", "Object", "String", "Function"
 * @returns The object supplied in the first param with is{ClassName} Methods Added
 */
function curryIsMethods(obj, classNames) {
  classNames = classNames || [
    "Array",
    "Object",
    "String",
    "Function",
    "Storage"
  ];

  while(!!classNames.length) {
    var className = classNames.pop();
    obj['is' + className] = createIsTest(className);
  }

  return obj;
}

/**
 * Test if an object is the global window object
 * @param {object} The object to be tested
 * @returns Boolean true if the object is the window obj false otherwise
 */
module.exports.isWindow = function (obj) {
  return obj && obj !== null && obj === window;
};

/**
 * Test if an object inherits from any other objects, used in extend
 * to protect against deep copies running out of memory and constructors
 * losing there prototypes when cloned
 * @param {object} The object to be tested
 * @returns Boolean true if the object is plain false otherwise
 */
module.exports.isPlainObject = function (obj) {
  var obj_hop = Object.prototype.hasOwnProperty;
  // Must be an Object.
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that DOM nodes and window objects don't pass through, as well
  if (!obj || !utils.isObject(obj) || obj.nodeType || utils.isWindow(obj)) {
      return false;
  }

  try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
          !obj_hop.call(obj, "constructor") &&
          !obj_hop.call(obj.constructor.prototype, "isPrototypeOf") ) {
          return false;
      }
  } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects
      return false;
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.

  var key;
  for ( key in obj ) {}

  return key === undefined || obj_hop.call( obj, key );
};

/**
 * Test if an object is a string with a length
 * @param {object} The object to be tested
 * @returns Boolean true if the object is a string with a length greater than 0
 */
module.exports.isNonEmptyString = function (str) {
  return utils.isString(str) && !!str.length;
};

/**
 * Test if an object is a finite number
 * @param {object} The object to be tested
 * @returns Boolean true if the object is a finite number, can be a float or int but not NaN or Infinity
 */
module.exports.isNumeric = function (num) {
  return !isNaN(parseFloat(num)) && isFinite(num);
};

/**
 * Used to merge or clone objects
 * @param If boolean specifies if this should be a deep copy or not, otherwise is the target object for the copy
 * @param If deep copy is true will be the target object of the copy
 * @param All other params are objects to be merged into the target
 * @returns The target object extended with the other params
 */
function extend() {
  var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

  // Handle a deep copy situation
  if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object" && !utils.isFunction(target)) {
      target = {};
  }

  // do nothing if only one argument is passed (or 2 for a deep copy)
  if (length === i) {
      return target;
  }

  for ( ; i < length; i++ ) {
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
              } else if ( copy !== undefined ) {
                  target[name] = copy;
              }
          }
      }
  }

  // Return the modified object
  return target;
}

module.exports.hasClass = function(node, className){
  if(node.nodeType === 1){
      return node.className.split(' ').indexOf(className) > -1 ? true : false;
  }
  return false;
};

module.exports.addClass = function(node, className){
  if(node.nodeType === 1 && utils.isNonEmptyString(className) && !utils.hasClass(node, className)){
      node.className += ' ' + className.trim();
  }
  return true;
};

module.exports.removeClass = function(node, className){
  var index, classes;
  if(node.nodeType === 1 && utils.isNonEmptyString(className) && utils.hasClass(node, className)){
      classes = node.className.split(' ');
      index = classes.indexOf(className);
      classes.splice(index, 1);
      node.className = classes.join(' ');
  }
  return true;
};


//TODO: remove this
module.exports.writeScript = function (url) {
  // Stop document.write() from happening after page load (unless QUnit is present)
  if (document.readyState !== "complete" || typeof QUnit === "object") {
    /*jshint evil:true*/
    document.write('<scr' + 'ipt src="' + url + '"></scr' + 'ipt>');
  }
};


/**
 * Create an object hash from a delimited string
 * Beware all properties on the resulting object will have  string values.
 * @param {String}        str       The string to transform
 * @param {String/RegExp} delimiter The character that delimits each name/value pair
 * @param {String}        pairing   The character that separates the name from the value
 * @return {object}
 */
module.exports.hash = function (str, delimiter, pairing) {
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
* @name attach
* @memberof FT._ads.utils
* @lends FT._ads.utils
*/
module.exports.attach = function (scriptUrl, async, callback, errorcb) {
  var tag = document.createElement('script'),
  obj_hop = Object.prototype.hasOwnProperty,
  node = document.getElementsByTagName('script')[0],
  hasRun = false;
  tag.setAttribute('src', scriptUrl);
  tag.setAttribute('o-ads', '');
  if (async){
    tag.async = 'true';
  }

  if (utils.isFunction(callback)) {

    if(obj_hop.call(tag, 'onreadystatechange')) {
      tag.onreadystatechange = function () {
        if (tag.readyState === "loaded") {
          if(!hasRun) {
            callback();
            hasRun = true;
          }
        }
      };
    } else {
      tag.onload =  function () {
        if(!hasRun) {
          callback();
          hasRun = true;
        }
      };

      if (utils.isFunction(errorcb)) {
        tag.onerror = function () {
          if(!hasRun) {
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

module.exports.isScriptAlreadyLoaded = function(url) {
  var scripts = document.getElementsByTagName('script');
  for (var i = scripts.length; i--;) {
      if (scripts[i].src == url) return true;
  }
  return false;
};

utils.createCORSRequest = function (url, method, callback, errorcb) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
        xhr.open(method, url, true);
        xhr.responseType = 'json';
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url, true);
    } else {
        xhr = null;
        errorcb();
    }

    xhr.onload = function (xhrEvent){
      callback.call(this, this.response || this.responseText, xhrEvent);
    };

    if (utils.isFunction(errorcb)) {
      xhr.onerror = errorcb;
      xhr.ontimeout = errorcb;
    }
    xhr.send();
    return xhr;
};

/**
* return the current documents referrer or an empty string if non exists
* This method enables us to mock the referrer in our tests reliably and doesn't really serve any other purpose
* @name getReferrer
* @memberof FT._ads.utils
* @lends FT._ads.utils
*/
module.exports.getReferrer = function () {
  return document.referrer || '';
};



/**
* return the current documents url or an empty string if non exists
* This method enables us to mock the document location string in our tests reliably and doesn't really serve any other purpose
* @name getReferrer
* @memberof FT._ads.utils
* @lends FT._ads.utils
*/
module.exports.getLocation = function () {
  return document.location.href || '';
};

/**
* return the current documents search or an empty string if non exists
* also strips the initial ? from the search string for easier parsing
* This method enables us to mock the search string in our tests reliably and doesn't really serve any other purpose
* @name getReferrer
* @memberof FT._ads.utils
* @lends FT._ads.utils
*/
module.exports.getQueryString = function () {
  return document.location.search.substring(1) || '';
};

/**
* returns a timestamp of the current time in the format YYYYMMDDHHMMSS
* @name getReferrer
* @memberof FT._ads.utils
* @lends FT._ads.utils
*/
module.exports.getTimestamp = function () {
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

module.exports.nodeListToArray = function(obj) {
  var array = [];
  for (var i = 0; i < obj.length; i++) {
    array[i] = obj[i];
  }
  return array;
};

module.exports.getiOSversion = function() {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
};

module.exports.cookies = utils.hash(document.cookie, ';', '=');

extend(module.exports, require('./cookie.js'));
module.exports.responsive = require('./responsive.js');
module.exports.timers = require('./timers.js')();
module.exports.queue = require('./queue.js');
module.exports.extend = extend;
curryIsMethods(module.exports);

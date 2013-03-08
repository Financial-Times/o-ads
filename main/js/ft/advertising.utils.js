/**
 * @fileOverview
 * Utility methods for the advertising library.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, FT, undefined) {
  "use strict";

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

  /**
   * @namespace All public functions are stored in the FT._ads.utils object for global access.
   */
  FT = FT || {};

  /**
   * @namespace All public functions are stored in the FT._ads.utils object for global access.
   */
  FT._ads = FT._ads || {};
  FT._ads.utils = FT._ads.utils || {};
  var utils = {};

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
      "Function"
    ];

    while(!!classNames.length) {
      var className = classNames.pop();
      obj['is' + className] = createIsTest(className);
    }

    return obj;
  }

  utils = curryIsMethods(utils);

  /**
   * Test if an object is the global window object
   * @param {object} The object to be tested
   * @returns Boolean true if the object is the window obj false otherwise
   */
  utils.isWindow = function (obj) {
    return obj && obj !== null && obj === window;
  };

  /**
   * Test if an object inherits from any other objects, used in extend
   * to protect against deep copies running out of memory and constructors
   * losing there prototypes when cloned
   * @param {object} The object to be tested
   * @returns Boolean true if the object is plain false otherwise
   */
  utils.isPlainObject = function (obj) {
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
   * Used to merge or clone objects
   * @param If boolean specifies if this should be a deep copy or not, otherwise is the target object for the copy
   * @param If deep copy true will be the target object of the copy
   * @param All other params are objects to be merged into the target
   * @returns The target object extended with the other params
   */
  utils.extend = function extend() {
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
  };

  utils.hasClass = function(ele, className){
    if(ele.nodeType === 1){
        return ele.className.split(' ').indexOf(className) > -1 ? true : false;
    }
    return false;
  };

  utils.writeScript = function (url) {
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
  utils.hash = function (str, delimiter, pairing) {
    var pair, value, idx, len,
      hash = {};

    str = str.split(delimiter);

    for (idx = 0, len = str.length; idx < len; idx += 1) {
      value = str[idx];
      pair = value.split(pairing);
      if (pair.length > 1) {
        hash[pair[0].trim()] = pair.slice(1).join(pairing);
      }
    }

    return hash;
  };

  utils.init = function () {
     this.cookies = FT._ads.utils.hash(document.cookie, ';', '=');
  };

  FT._ads.utils = utils.extend(FT._ads.utils, utils);
  FT._ads.utils.init();
  return utils;
}(window, document, FT));

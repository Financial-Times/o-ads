(function (win, doc, FT, undefined) {
  "use strict";
  FT._ads = FT._ads || {};
  var utils = {};

  // Uses object prototype toString method to get at the type of object we are dealing,
  // IE returns [object Object] for null and undefined so we need to filter those
  // http://es5.github.com/#x15.2.4.2
  function is(object, className) {
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

  function createIsTest(className){
    return function (obj) {
      return is(obj) === className;
    };
  }

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

  utils.isWindow = function (obj) {
    return obj && obj !== null && obj == obj.window;
  };

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

  FT._ads.utils = utils;
  return utils;
}(window, document, FT));

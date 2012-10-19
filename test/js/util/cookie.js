var FT = FT || {};

/**
  * @namespace Facade for jQuery.cookie, but also provides ways to get and set individual parameters (in AYSC etc)
 */
FT.cookie = (function () {

    var defaultCookieOptions = { domain: ".ft.com", path: "/", expires: 730 },
        formats = {
            "AYSC": "underscore",
            "FT_U": "underscoreEquals",
            "FT_Remember": "colonEquals",
            "FT_User": "colonEquals",
            "FTQA": "commaEquals"
        };

    /** Get a cookie's value
     * @param {string} name The cookie's name
     * @return {string|undefined}
     * */
    function getValue(name) {
        return FT.$.cookie(name);
    }

    /** Set a cookie
     * @param {string} name The cookie's name
     * @param {string} value The cookie's value
     * */
    function setValue(name, value, options) {
        FT.$.cookie(name, value, options);
    }

    /** Delete a cookie
     * @param {string} name The cookie's name
     * */
    function remove(name) {
        FT.$.cookie(name, null);
    }

    function getRegExp(name, param) {
        var re;
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
    function getParam(name, param) {
        var wholeValue = getValue(name) || "", matches;
        if (param) {
            matches = wholeValue.match(getRegExp(name, param));
        }
        return (matches && matches.length) ? matches[1] : undefined;
    }

    function updateAYSCValue(wholeValue, param, value) {
        if (!wholeValue) {
            wholeValue = "_";
        }
        var paramValue = getParam("AYSC", param);
        if (FT.$.type(paramValue) === "undefined") {
            return wholeValue + param + value + "_";
        } else {
            return wholeValue.replace(getRegExp("AYSC", param), "_" + param + value + "_");
        }
    }

    /** Set a particular parameter in a cookie, without changing the other parameters
     * @param {string} name The cookie's name
     * @param {string} param The parameter's name
     * @param {string} value The parameter's value
     * */
    function setParam(name, param, value) {
        var wholeValue = getValue(name) || "";
        if (name === "AYSC") {
            wholeValue = updateAYSCValue(wholeValue, param, value);
        } else {
            throw new Error("FT.cookie.setParam() currently only works for AYSC");
        }
        setValue("AYSC", wholeValue, defaultCookieOptions);
    }

    return {
        get: getValue,
        set: setValue,
        remove: remove,
        getParam: getParam,
        setParam: setParam
    };

}());
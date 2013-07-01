/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, undefined) {
    "use strict";

    function Config() {
        var self = this,
        defaults = {};

        this.store = FT._ads.utils.extend({}, this.fetchMetaConfig(), this.fetchGlobalConfig());

        return this;
    }

    Config.prototype.fetchMetaConfig = function() {
        var meta,
            results = {},
            metas = doc.getElementsByTagName('meta');

        for (var i= 0; i < metas.length; i++) {
            meta = metas[i];
            if (meta.name) {
               results[meta.name] = meta.content;
            }
        }

        return results;
    };

    Config.prototype.fetchGlobalConfig = function(first_argument) {
        return FT._ads.utils.isObject(FT.env) ? FT.env : {};
    };

    Config.prototype.get = function get(key) {
        var result;
        if (key) {
            result = this.store[key];
        } else {
            result = this.store;
        }

        return result;
    };

    Config.prototype.set = function set(key, value) {
        var result;
        if (value) {
            this.store[key] = value;
            result = value;
        }

        return result;
    };

    if (!FT) {
        FT = win.FT = {};
    }

    if (!FT.ads) {
        FT.ads = {};
    }

    FT._ads.utils.extend(FT.ads, {config: new Config()});
}(window, document));

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, undefined) {
    "use strict";
/**
 * @class
 * @constructor
 * Config defines an object which holds the confiuration properties for an FT.ads.gpt instance
 * There are four tiers of configuration; cookie level config, default config (set within the constructor), meta-tag config and global (env) config.
 * Global config, set in the page FT.env ojbect takes priority over meta, default and cookie config in that order.
*/
    function Config() {

        var defaults =  {
            network: '5887',
            formats:  {
                banlb: [[728,90], [468,60], [970,90]],
                mpu: [[300,250],[336,280]],
                doublet: [[342,200]],
                hlfmpu: [[300,600],[336,850],[300,250],[336,280]],
                intro: [[1,1]],
                newssubs: [[239,90]],
                refresh: [[1,1]],
                searchbox: [[200,28]],
                tlbxrib: [[336,60]]
            },
            audSciLimit : 2
        };
        var store = {};
        var fetchMetaConfig = function() {
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
        var fetchGlobalConfig = function() {
            return FT._ads.utils.isObject(FT.env) ? FT.env : {};
        };

        var fetchCookieConfig = function(){
            return FT._ads.utils.cookies;
        };

        var access= function(k,v){
            var result;
            if (typeof v==="undefined") {
                if (typeof k ==="undefined"){result = store;}
                else {
                    result = store[k];
                }
            }
            if (typeof v !== "undefined"){
                store[k] = v;
                result = v;
            }
            return result;
        };
        access.clear = function(){
            store={};
        };

        if (FT._ads.utils.isString(FT._ads.utils.cookie('ftads:mode_t'))) {
            if (FT._ads.utils.cookie('ftads:mode_t')==="testuser"){
                store = FT._ads.utils.extend({}, defaults, fetchMetaConfig(), fetchGlobalConfig(), fetchCookieConfig());
            }
        }
       else {
            store = FT._ads.utils.extend({}, fetchCookieConfig(), defaults, fetchMetaConfig(), fetchGlobalConfig());
        }
        return access;
    }

    if (!win.FT && FT._ads.utils.isObject(win.FT)) {
        FT = win.FT = {};

    }

    if (!FT.ads) {
        FT.ads = {};
    }

    FT._ads.utils.extend(FT.ads, {config: new Config()});
}(window, document));

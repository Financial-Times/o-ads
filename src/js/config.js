/* globals FT */
//TODO remove all ft.com specific stuff so we can remove this as a global
// currently all FT specific stuff is wrapped in an if window.FT

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

/**
 * The FT.ads.config object holds the confiuration properties for an FT.ads.gpt instance.
 * There are four tiers of configuration; cookie level config, default config (set within the constructor), metatag config and global (env) config.
 * Global config, (set in the page FT.env ojbect) takes priority over meta followed by default config with cookie config having the least priority.
 * The FT.ads.config() function acts as an accessor method for the config; allowing getting and setting of configuration values.
 * Calling config() with no parameters returns the entire configuration object.
 * Calling config passing a valid property key will envoke the 'getter' and return the value for that property key.
 * Calling config passing a valid property key and a value will envoke the setter and set the value of the key to the new value.
 * Calling config passing an object of keys and values will envoke a setter that extends the store with the object provided.
 * @name config
 * @memberof FT.ads
 * @function
*/
"use strict";
var ads;
/**
* The Config class defines an FT.ads.config instance.
* @class
* @constructor
*/
function Config() {
/**
* Default configuration set in the constructor.
*/
    var defaults =  {
        network: '5887',
        formats: {
            intro: {

            },
            leaderboard: {
                sizes: [[728,90], [468,60], [970,90], [970,66], [970, 250]],
                outOfPage: true
            },
            mpu: {
                sizes: [[300,250],[336,280]]
            },
            doublet: {
                sizes: [[352,230]]
            },
            hlfmpu: {
                sizes: [[300,250],[300,600],[336,850],[336,280],[300,1050]]
            },
            newssubs: {
                sizes: [[270,42]]
            },
            refresh: {
                'sz': '1x1'
            },
            searchbox: {
                sizes: [[270,42]]
            },
            tlbxrib: {
                sizes: [[336,60]]
            },
            marketingrib: {
                sizes: [[336,60]]
            },
            lhn: {
                sizes: [[136,64]]
            },
            tradcent: {
                sizes: [[336,260]]
            },
            mktsdata: { // also matches mktsdata2 and mktsdata3
                sizes: [[88,31], [75,25]]
            },
            mpusky: {
                sizes: [[300,250], [336,280],[160,60]]
            },
            wdesky: {
                sizes: [[160,600]]
            }
        },
        collapseEmpty: 'ft'
    };

    var store = {};
/**
* @private
* @function
* fetchMetaConfig pulls out metatag key value pairs into an object returns the object
*/
    var fetchMetaConfig = function() {
        var meta,
            results = {},
            metas = document.getElementsByTagName('meta');
        for (var i= 0; i < metas.length; i++) {
            meta = metas[i];
            if (meta.name) {
                if (meta.getAttribute("data-contenttype") === "json"){
                    results[meta.name] = (window.JSON) ? JSON.parse(meta.content) : "UNSUPPORTED";
                } else {
                    results[meta.name] = meta.content;
                }
            }
        }
        return results;
    };


/**
* @private
* @function
* fetchCanonicalURL Grabs the canonical URL of the page.
*/
    var fetchCanonicalURL = function() {
        var canonical,
            canonicalTag = document.querySelector('link[rel="canonical"]');
        if(canonicalTag) {
           canonical = canonicalTag.href;
        }
        return { canonical: canonical };
    };

/**
* @private
* @function
* fetchCookieConfig pulls out all cookie name/value pairs and returns them as an object.
*/
//TODO update this function to only pull out cookies related to ad config rather than the entire object
    var fetchCookieConfig = function(){
        return ads.utils.cookies;
    };

//TODO: this whole method is FT Specific move it into what ever becomes of the switcher
// getDFPSite will check the value of the FTQA cookie and the FT.Properties.ENV value and return either a live or test dfpsite value based on the config.
function setDFPSiteForEnv() {
    var env, site = store.dfp_site;
    if (window.FT && FT.Properties && FT.Properties.ENV) {
        env = FT.Properties.ENV.toLowerCase();
        if (env !== 'p') {
            site = site.replace(/^\w+\./, "test.");
            store.dfp_site = site;
        }
    }
}

/**
* @function
* access is returned by the Config constructor and acts as an accessor method for getting and setting config values.
*/
    var access = function(k, v){
        var result;
        if (ads.utils.isPlainObject(k)) {
            store = ads.utils.extend(store, k);
            result = store;
        } else if (typeof v === "undefined") {
            if (typeof k === "undefined"){
                result = store;
            } else {
                result = store[k];
            }
        } else {
            store[k] = v;
            result = v;
        }

        return result;
    };

    access.clear = function(key){
        if (key) {
            delete store[key];
        } else {
            store = {};
        }
    };

    access.init = function(impl, clear){
        ads = impl;
        if (!!clear) {
            access.clear();
        }

/**
* if the 'ftads:mode_t' cookie is set with the value 'testuser' then the cookie config takes priority over all over tiers of configuration
* this allows QA Testers to over-ride global and meta config.
*/
        if (ads.utils.isString(ads.utils.cookie('ftads:mode_t'))) {
            if (ads.utils.cookie('ftads:mode_t') === "testuser"){
                store = ads.utils.extend({}, defaults, fetchMetaConfig(), fetchCanonicalURL(), fetchCookieConfig());

                var siteCookie = ads.utils.cookie('ftads:dfpsite');
                if (siteCookie && (siteCookie === 'test' || siteCookie === 'ftcom')) {
                    var splitSite = (store.dfp_site || '').split('.');
                    splitSite[0] = siteCookie;
                    store.dfp_site = splitSite.join('.');
                } else {
                    setDFPSiteForEnv();
                }
            }
        } else {
            store = ads.utils.extend({}, defaults, fetchMetaConfig(), fetchCanonicalURL());
            setDFPSiteForEnv();
        }
        return store;
    };

    //access.init();
    return access;
}
module.exports = new Config();

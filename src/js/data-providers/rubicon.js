/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@com
 */
/**
 * ads.rubicon provides rubicon integration for the FT advertising library
 * @name targeting
 * @memberof ads
*/
var ads;
var proto = Rubicon.prototype;
var _initSlot = null;
var context; // used to store a local copy of ads.slots.initSlot

/**
 * The Rubicon class defines an ads.rubicon instance
 * @class
 * @constructor
*/
function Rubicon() {
    context = this;
    this.insights = {};
    this.attempts = {};
}

/**
 * initialise rubicon functionality
 * loads dorothy.js from rubicon
 * Decorates the gpt init slot method with rubicon valuation functionality
 * @name init
 * @memberof Rubicon
 * @lends Rubicon
*/
proto.init = function (impl) {
    ads = impl;
    var config = context.config = ads.config('rubicon');
    if (config && config.id && config.site) {
        context.maxAttempts = config.maxAttempts || 10;
        ads.utils.attach('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=' + config.id + '/' + config.site);
        context.decorateInitSlot();
    } 
};


/**
 * initialise rubicon valuation for a slot
 * This is called before an ad call is made so a valution can be made for slots that are configured to make one
 * @name initValuation
 * @memberof Rubicon
 * @lends Rubicon
*/
proto.initValuation = function (slotName) {
    var config = context.config;
    var zone = (config && config.zones) ? config.zones[slotName] : false;
    var size = (config && config.formats) ? config.formats[slotName] : false;

    if (zone && size) {
        if (!ads.utils.isFunction(window.oz_insight) && context.attempts[slotName] !== context.maxAttempts) {
            context.attempts[slotName] = context.attempts[slotName] ? context.attempts[slotName] + 1 : 1;
            ads.utils.timers.create(0.2, (function (slotName) {
                return function () {
                    context.initValuation(slotName);
                };
            }(slotName)), 1);
            return;
        } else if (context.attempts[slotName] === context.maxAttempts){
            // dorothy js has failed to promptly load so undecorate initSlot
            // and make the call for this slot
            // no calls to the valuation api will be made
            _initSlot.call(ads.slots, slotName);
            ads.slots.initSlot = _initSlot;
            return;
        }

        // rubicon loves globals
        window.oz_api = 'valuation';
        window.oz_callback = context.valuationCallbackFactory(slotName);
        window.oz_ad_server = 'gpt';
        window.oz_async = true;
        window.oz_cached_only = true;
        window.oz_site = config.id + '/' + config.site;
        window.oz_ad_slot_size = size;
        window.oz_zone = zone;
        window.oz_insight();
    } else {
        _initSlot.call(ads.slots, slotName);
    }
};

/**
 * Valuation request callback factory
 * This generates the callback that receives the data from a valution request, it keeps the slotname in a closure.
 * @name init
 * @memberof Rubicon
 * @lends Rubicon
*/    
proto.valuationCallbackFactory = function (slotName) {
    return function (results) {
        // add results to slot targeting and run initSlot
        document.getElementById(slotName).setAttribute('data-ftads-rtp', results.estimate.tier);
        _initSlot.call(ads.slots, slotName);
    };
};

/**
 * Decorate initSlot to make a valuation request
 * @name init
 * @memberof Rubicon
 * @lends Rubicon
*/    
proto.decorateInitSlot = function () {
    if (ads.utils.isFunction(ads.slots.initSlot)) {
        _initSlot = ads.slots.initSlot;
        ads.slots.initSlot = context.initValuation;
        return ads.slots.initSlot;
    }
};


module.exports = new Rubicon();

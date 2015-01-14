/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@com
 */
/**
 * ads.rubicon provides rubicon real time pricing integration for the FT advertising library
 * @name targeting
 * @memberof ads
*/
var ads;
var proto = Rubicon.prototype;
// used to store a local copy of ads.slots.initSlot
var _initSlot = null;
var context;

/**
 * The Rubicon class defines an ads.rubicon instance
 * @class
 * @constructor
*/
function Rubicon() {
    context = this;
    this.queue = [];
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
        ads.utils.attach('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=' + config.id + '/' + config.site, true, function(){
            context.processQueue(context.initValuation);
            ads.slots.initSlot = context.initValuation;
        }, function () {
            context.processQueue(_initSlot);
            ads.slots.initSlot = _initSlot;
        });
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
        // rubicon loves globals
        window.oz_api = 'valuation';
        window.oz_callback = context.valuationCallbackFactory(slotName, config.target);
        window.oz_ad_server = 'gpt';
        window.oz_async = true;
        window.oz_cached_only = config.cached || true;
        window.oz_site = config.id + '/' + config.site;
        window.oz_ad_slot_size = size;
        window.oz_zone = zone;
        window.oz_insight();
    } else if(config.target){
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
proto.valuationCallbackFactory = function (slotName, config) {
    return function (results) {
        // add results to slot targeting and run initSlot
        document.getElementById(slotName).setAttribute('data-o-ads-rtp', results.estimate.tier);
        if(config.target){
            _initSlot.call(ads.slots, slotName);
        }
    };
};

/**
 * Decorate initSlot to make a valuation request
 * @name decorateInitSlot
 * @memberof Rubicon
 * @lends Rubicon
*/
proto.decorateInitSlot = function () {
    if (ads.utils.isFunction(ads.slots.initSlot)) {
        _initSlot = ads.slots.initSlot;
        ads.slots.initSlot = context.addToQueue;
        return ads.slots.initSlot;
    }
};

/**
 * Add to queue
 * add an item to the queue while we wait for external dependencies
 * @name addToQueue
 * @memberof Rubicon
 * @lends Rubicon
*/
proto.addToQueue = function (slotName) {
    if (!~context.queue.indexOf(slotName)) {
        context.queue.push(slotName);
    }

    var config = context.config;
    if (!config.target) {
        _initSlot.call(ads.slots, slotName);
    }
};

/**
 * Process queue
 * once external dependencies have loaded process requests that have been queued
 * @name processQueue
 * @memberof Rubicon
 * @lends Rubicon
*/
proto.processQueue = function (action) {
    if (context.queue.length) {
        var slotName;
        while (slotName = context.queue.shift()) {
            action(slotName);
        }
    }
};


module.exports = new Rubicon();

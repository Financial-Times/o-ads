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
"use strict";
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
    context.queue = ads.utils.queue(context.initValuation);
    var config = context.config = ads.config('rubicon');
    if (config && config.id && config.site) {
        ads.utils.attach('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=' + config.id + '/' + config.site, true, function(){
            context.queue.process();
        }, function () {
            if(config.target){
                context.queue.setProcessor(function (slotName){
                    _initSlot.call(ads.slots, slotName);
                }).process();
            }
        });
        context.decorateInitSlot();
    }
};


/**
 * initialise rubicon valuation for a slot
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
proto.valuationCallbackFactory = function (slotName, target) {
    return function (results) {
        // add results to slot targeting and run initSlot
        document.getElementById(slotName).setAttribute('data-o-ads-rtp', results.estimate.tier);
        if(target){
            _initSlot.call(ads.slots, slotName);
        }
    };
};

proto.decoratorTarget = function (slotName){
    context.queue.add(slotName);
};


proto.decoratorNoTarget = function (slotName){
    context.queue.add(slotName);
    _initSlot.call(ads.slots, slotName);
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
        if(!context.config.target){
            ads.slots.initSlot = context.decoratorNoTarget;
        } else {
            ads.slots.initSlot = context.decoratorTarget;
        }
        return ads.slots.initSlot;
    }
};

module.exports = new Rubicon();

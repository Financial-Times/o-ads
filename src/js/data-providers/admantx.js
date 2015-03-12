/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@com
 */
/**
 * ads.admantx provides admantx contextual data target information
 * @name targeting
 * @memberof ads
*/
'use strict';

var ads;
var proto = Admantx.prototype;
// used to store a local copy of ads.slots.initSlot
var _initSlot = null;
var context;

/**
 * The Admantx class defines an ads.admantx instance
 * @class
 * @constructor
*/
function Admantx() {
    context = this;
}

/**
 * initialise Admantx functionality
 * calls Admantx api for targeting information
 * Decorates the gpt init slot method to prevent ads loading before we want them too
 * @name init
 * @memberof Admantx
 * @lends Admantx
*/
proto.init = function (impl) {
    ads = impl;
    var config = context.config = ads.config('admantx') || {};
    if (config.id) {
        context.collections = config.collections || {admants: true};
        context.api = config.url || 'http://usasync01.admantx.com/admantx/service?request=';
        context.decorateInitSlot();
        context.queue = ads.utils.queue(function (slotName){
            _initSlot.call(ads.slots, slotName);
        });
        context.makeAPIRequest();
    }
};

proto.makeAPIRequest = function () {
    var requestData = {
        "key": context.config.id,
        "method": "descriptor",
        "mode": "async",
        "decorator": "template.ft",
        "filter":["default"],
        "type": "URL",
        "body": encodeURIComponent(ads.config('canonical') || ads.utils.getLocation())
    };
    var url = context.api + encodeURIComponent(JSON.stringify(requestData));
    context.xhr = ads.utils.createCORSRequest(url, 'GET', context.resolve, context.resolve);
};

proto.cleanSpecialChars = function (value) {
   value = decodeURIComponent(value);
   value = value.trim();
   value = value.replace(/\//g, ' ');
   value = value.replace(/\s+/g, ' ');
   //value = encodeURIComponent(value);
   value = value.replace(/\./g, '%2E');
   value = value.replace(/\'/g, '%27');
   return value;
};

proto.processCollection = function(collection, max){
    var names = [];
    var i = 0;
    var j = ads.utils.isNumeric(max) ? Math.min(max, collection.length) : collection.length;
    for (;i < j; i++) {
        names.push(this.cleanSpecialChars(collection[i].name || collection[i]));
    }
    return names;
};

proto.resolve = function (response) {
    var collection;
    var collections = context.collections;
    var shortName;
    var targetingObj = {};
    if (ads.utils.isString(response)) {
        try {
            response = JSON.parse(response);
        } catch (e){
            // if the response is not valid JSON;
            response = false;
        }
    }

    //parse required targetting data from the response
    if(response) {
        for(collection in collections) {
            if (collections.hasOwnProperty(collection) && collections[collection] && response[collection]) {
                shortName = collection.substr(0, 2);
                targetingObj[shortName] = context.processCollection(response[collection], collections[collection]);
            }
        }
        ads.targeting.add(targetingObj);
    }
    context.queue.process();
};

proto.decorateInitSlot = function() {
    if (ads.utils.isFunction(ads.slots.initSlot)) {
        _initSlot = ads.slots.initSlot;
        ads.slots.initSlot = context.initSlotDecorator;
        return ads.slots.initSlot;
    }
};

proto.initSlotDecorator = function (slotName){
    context.queue.add(slotName);
};


module.exports = new Admantx();

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
        context.queue = ads.utils.queue(_initSlot);
        context.collections = config.collections || {admants: true};
        context.api = config.url || 'http://usasync01.admantx.com/admantx/service?request=';
        context.makeAPIRequest();
    }
};


proto.makeAPIRequest = function () {
    var requestData = {
        "key": context.config.id,
        "method":"descriptor",
        "mode":"async",
        "decorator":"json",
        "filter":["default"],
        "type":"URL",
        "body": ads.utils.getLocation()
    };
    var url = context.api + encodeURIComponent(JSON.stringify(requestData));
    context.xhr = ads.utils.createCORSRequest(url, 'GET', context.resolve, context.resolve);
};

proto.processCollection = function(collection, max){
    var names = [];
    var i = 0;
    var j = ads.utils.isNumeric(max) ? max : collection.length;
    for (;i < j; i++) {
        names.push(collection[i].name);
    }
    return names;
};

proto.resolve = function (response){
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
        for(collection in collections){
            if (collections.hasOwnProperty(collection) && collections[collection]) {
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

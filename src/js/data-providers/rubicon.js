/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
/**
 * FT.ads.rubicon provides rubicon integration for the FT advertising library
 * @name targeting
 * @memberof FT.ads
 */
"use strict";
var proto = Rubicon.prototype,
   _initSlot = null,
   context,
   ads;

/**
 * The Rubicon class defines an FT.ads.rubicon instance
 * @class
 * @constructor
 */
function Rubicon() {
   context = this;
   this.insights = {};
   // these have to be global
   window.oz_async = true;
   window.oz_cached_only = false;
}

/**
 * initialise rubicon functionality
 * Decorates the gpt init slot method with rubicon valuation functionality
 * @name init
 * @memberof Rubicon
 * @lends Rubicon
 */
proto.init = function (impl) {
   ads = impl;
   var config = this.config = FT.ads.config('rubicon');
   if(config && config.id && config.site){
      FT._ads.utils.attach('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=' + config.id + '/' + config.site);
      this.decorateInitSlot();
   }
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
      ads.slots.initSlot = this.initValuation;
      return ads.slots.initSlot;
   }
};

/**
 * initialise rubicon valuation for a slot
 * This is used to decorate the initSlot method so a valution can be made for each slot on the page, if slot loading is defered then the ad is not requested until after the valution
 * @name init
 * @memberof Rubicon
 * @lends Rubicon
 */
proto.initValuation = function (slotName) {
   var config = ads.config('rubicon');
   if( ads.utils.isFunction(window.RubiconInsight) ) {
      var insight = context.insights[slotName] = new RubiconInsight();
      insight.ftSlotName = slotName;
   } else {
      ads.utils.timers.create(0.1, (function (slotName) {
         return function () {
            context.initValuation(slotName);
         };
      }(slotName)), 1);
      return;
   }

   // TODO: use proper mapping once decided
   if(ads.config('formats')[slotName]) {
      var sizeMappings = {
         banlbGPT: '970x90',
         mpu: '300x250'
      };
      var size = sizeMappings[slotName];
   }

   insight.init({
      oz_api: "valuation",
      oz_callback: this.valuationCallbackFactory(slotName),
      oz_ad_server: "gpt",
      oz_site: config.id + '/' + config.site,
      oz_ad_slot_size: size,
      oz_zone: "103616",
      oz_async: true
   });

   // hopefully temp fix while rubicon sort out their api
   window.oz_onValuationLoaded = function(H) {
      insight.onValuationLoaded(H);
   };
   insight.start();
   if (config.defer) {

   } else {
      _initSlot.apply(FT.ads.slots, arguments);
   }
};

/**
 * Valuation request callback
 * This is the callback for that receives the data from a valution request
 * @name init
 * @memberof Rubicon
 * @lends Rubicon
 */
proto.valuationCallback = function (results) {
   if (config.defer) {
      // add results to slot targeting and run initSlot
   } else {
      // store the results somewhere or make a track requested
   }
};

/**
 * Valuation request callback factory
 * This is the callback for that receives the data from a valution request
 * @name init
 * @memberof Rubicon
 * @lends Rubicon
 */
proto.valuationCallbackFactory = function (slotName) {
   var config = ads.config('rubicon');
   return function (results) {
      this.valuationCallback(results);
   }
};




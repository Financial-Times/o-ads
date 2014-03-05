/*globals googletag: true */

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

 /**
 * The FT.ads.gpt object
 * @name gpt
 * @memberof FT.ads
 * @function
*/
(function (win, doc, undefined) {
    "use strict";
    var proto = GPT.prototype;
/**
 * The GPT class defines an FT.ads.gpt instance.
 * @class
 * @constructor
*/
    function GPT() {
        // set up a place holder for the gpt code downloaded from google
        win.googletag = win.googletag || {};
        // this is a command queue used by GPT any methods added to it will be
        // executed when GPT code is available, if GPT is already available they
        // will be executed immediately
        win.googletag.cmd = win.googletag.cmd || [];


var getDFPSite = function () {
   var site = FT.env.dfp_site,
      env,
      cookie;
   if (FT.Properties && FT.Properties.ENV) {
      env = FT.Properties.ENV.toLowerCase();
      cookie = FT._ads.utils.cookie("FTQA");
      if (cookie) {
         cookie = cookie.replace(/%3D/g, "=");
         // FTQA cookie present, look for env=live or env=nolive
         if (cookie.match(/env=live/)) {
            env = 'live';
            clientAds.log("FTQA cookie has set ads from live environment");
            this.addDiagnostic(this.baseAdvert.pos, { "getDFPSite": "using FTQA cookie to set ads from live environment" });
         }
         if (cookie.match(/env=nolive/)) {
            env = 'ci';
            clientAds.log("using FTQA cookie has set ads from non-live environment");
            this.addDiagnostic(this.baseAdvert.pos, { "getDFPSite": "using FTQA cookie to set ads from non-live environment" });
         }
      }
      if (env !== 'p' && !env.match(/^live/)) {
         site = site.replace(/^\w+\./, "test.");
      }
   }
   return site;
};



        this.unitName = '/' + [FT.ads.config('network'), getDFPSite(), FT.ads.config('dfp_zone')].join('/');
        return this;
    }
 /**
 * Register methods with the publisher services to display the ad via GPT
 * sets slot targeting and collapse configuration
 * @name defineSlot
 * @memberof GPT
 * @lends GPT
*/
    proto.defineSlot = function (slotName) {
        var context = this,
            slot = FT.ads.slots[slotName],
            slotId = slotName + '-gpt',
            wrap = FT.ads.slots.addContainer(slot.container, slotId);

        FT._ads.utils.addClass(wrap, 'wrap');
        googletag.cmd.push(function (context, slot, slotName, slotId) {
            return function () {
                slot.gptSlot = googletag.defineSlot(context.getUnitName(slotName), slot.config.sizes, slotId)
                        .addService(googletag.companionAds())
                        .addService(googletag.pubads());
                context.setSlotCollapseEmpty(slot.gptSlot, slot.config);
                context.setSlotTargeting(slot.gptSlot, slot.config.targeting);
                googletag.cmd.push(googletag.display(slotId));
            };
        }(this, slot, slotName, slotId));

        if (slot.config.outOfPage) {
            googletag.cmd.push(this.defineOutOfPage(this, slotName));
        }

        return slot;
    };

/**
 * creates a container for an out of page ad
 * Calls the GPT module to define the slot in the GPT service
 * @name defineOutOfPage
 * @memberof Slots
 * @lends Slots
*/
    proto.defineOutOfPage = function (context, slotName) {
        var slot = FT.ads.slots[slotName],
            slotId = slotName + '-oop';

        FT.ads.slots.addContainer(slot.container, slotId);
        return function() {
            var oopSlot;

            oopSlot = googletag.defineOutOfPageSlot(context.getUnitName(slotName), slotId)
                        .addService(googletag.pubads());

            slot.oopSlot = oopSlot;

            context.setSlotTargeting(oopSlot, slot.config.targeting);
            googletag.cmd.push(googletag.display(slotId));
        };
    };

/**
 * Given the slot name will return the GPT unit name for the slot.
 * the unit name is made up of network, dfp_site, dfp_zone, slot name
 * @name getUnitName
 * @memberof GPT
 * @lends GPT
*/
    proto.getUnitName = function (slotName) {
        return this.unitName;
    };

/**
 * Adds key values from FT.ads.targeting to GPT ad calls
 * @name setPageTargeting
 * @memberof GPT
 * @lends GPT
*/
    proto.setPageTargeting = function () {
        var param,
            targeting = FT.ads.targeting();

        function setTargeting(key, value) {
            return function () {
                googletag.pubads().setTargeting(key, value);
            };
        }

        for (param in targeting) {
            googletag.cmd.push(setTargeting(param, targeting[param]));
        }

        return targeting;
    };

    /**
     * Starts a timer to refresh all ads on the page after
     * a time specified in config refreshTime, maximum number of
     * refreshes defaults to infinity but can be set via the
     * maxRefresh config property
     * @name setPageRefresh
     * @memberof GPT
     * @lends GPT

    */
    proto.startRefresh = function () {
        var refreshConfig = FT.ads.config('refresh') || {},
            pageType = FT._ads.utils.getPageType(),
            time = (refreshConfig[pageType] && refreshConfig[pageType].time) || refreshConfig.time || false,
            max = (refreshConfig[pageType] && refreshConfig[pageType].max) || refreshConfig.max || 0;

        function refresh() {
            var slot, slotsForRefresh = [],
            slots = FT.ads.slots;
            for (slot in slots) {
                slot = slots[slot];
                if (slot.gptSlot && slot.timer === undefined) {
                    slot.gptSlot.setTargeting('rfrsh', 'true');
                    slotsForRefresh.push(slot.gptSlot);
                }
            }
            googletag.pubads().refresh(slotsForRefresh);
        }

        if (time) {
            this.refreshTimer = FT._ads.utils.timers.create(time, refresh, max);
        }
    };

    proto.pauseRefresh = function  () {
        if (this.refreshTimer) {
            this.refreshTimer.pause();
        }
    };

    proto.resumeRefresh = function  () {
        if (this.refreshTimer) {
            this.refreshTimer.resume();
        }
    };

    proto.stopRefresh = function  () {
        if (this.refreshTimer) {
            this.refreshTimer.stop();
        }
    };
/**
 * Sets the GPT collapse empty mode for the page
 * values can be 'after', 'before', 'never', 'ft'
 * after as in after ads have rendered is the default
 * true is synonymous with before
 * false is synonymous with never
 * ft uses our collapse method from the slots module, which is only attached at slot level
 * @name setPageTargeting
 * @memberof GPT
 * @lends GPT
*/
    proto.setPageCollapseEmpty = function () {
        var mode = FT.ads.config('collapseEmpty');

        if (mode === 'after' || mode === undefined) {
            mode = undefined;
        } else if (mode === 'before' || mode === true) {
            mode = true;
        } else if (mode === 'never' || mode === false) {
            mode = false;
        } else if (mode === 'ft') {
            mode = undefined;
        }

        googletag.cmd.push( function () {
            googletag.pubads().collapseEmptyDivs(mode);
        });
        return mode;
    };

/**
 * Sets the GPT collapse empty mode for a given slot
 * values can be 'after', 'before', 'never' or 'ft'
 * after as in after ads have rendered is the default
 * true is synonymous with before
 * false is synonymous with never
 * ft uses our collapse method from the slots module
 * @name setPageTargeting
 * @memberof GPT
 * @lends GPT
*/
    proto.setSlotCollapseEmpty = function (gptSlot, config) {
        var globalMode = FT.ads.config('collapseEmpty'),
            mode = config.collapseEmpty;

        if (mode === true || mode === 'after') {
            gptSlot.setCollapseEmptyDiv(true);
        } else if (mode === 'before') {
            gptSlot.setCollapseEmptyDiv(true, true);
        } else if (mode === false || mode === 'never') {
            gptSlot.setCollapseEmptyDiv(false);
        } else if (globalMode === 'ft' || mode === 'ft') {
            gptSlot.setCollapseEmptyDiv(true, true);
            gptSlot._renderEnded = gptSlot.renderEnded;
            gptSlot.renderEnded = function (context, slot) {
                return function (){
                    var slotId = slot.getSlotId(),
                        container = document.getElementById(slotId.getDomId()).parentNode,
                        iframe = document.getElementById('google_ads_iframe_' + slotId.getId());
                    FT.ads.gpt.handleNoAdAndSlotCustomization(iframe, container);
                    slot._renderEnded.apply(this, arguments);
                };
            }(this, gptSlot);
        }
        return mode;
    };


/**
 * Adds key values from a given targetingObj to a given GPT ad slot
 * @name setSlotTargeting
 * @memberof GPT
 * @lends GPT
*/
    proto.setSlotTargeting = function (gptSlot, targetingObj) {
        if (FT._ads.utils.isPlainObject(targetingObj)) {
            var targetKey;
            for (targetKey in targetingObj) {
                if (targetingObj.hasOwnProperty(targetKey)) {
                    gptSlot.setTargeting(targetKey, targetingObj[targetKey]);
                }
            }
        }
    };

/**
 * Searches the current GPT slot for a no-ad image and collapses the slot if one exists
 *
 * @name createOutOfPage
 * @memberof GPT
 * @lends GPT
*/
    proto.handleNoAdAndSlotCustomization = function (iframe, container) {
        if (iframe.attachEvent) {
            iframe.attachEvent(
                'onload',
                function () {
                    var slotName = container.getAttribute('id');
                    if (FT.ads.customSlots && slotName in FT.ads.customSlots) {FT.ads.customSlots[slotName]();}
                    try {
                        var img, imgs = iframe.contentDocument.getElementsByTagName('img');
                        imgs = FT._ads.utils.nodeListToArray(imgs);
                        while (img = imgs.pop()) {
                            if (/ft-no-ad/.test(img.src)) {
                                FT._ads.utils.addClass(container, 'empty');
                                document.body.className += " no-" + container.id;
                            }
                        }
                    } catch (err) {
                        return false;
                        // Probably blocked due to ad rendered in iframe no longer being on same domain.
                    }
                }
            );
        } else {
            var slotName = container.getAttribute('id');
            if (FT.ads.customSlots && slotName in FT.ads.customSlots) {FT.ads.customSlots[slotName]();}
            try {
                var img, imgs = Array.prototype.slice.call(iframe.contentDocument.getElementsByTagName('img'), 0);
                while (img = imgs.pop()) {
                    if (/ft-no-ad/.test(img.src)) {
                        FT._ads.utils.addClass(container, 'empty');
                        document.body.className += " no-" + container.id;
                    }
                }
            } catch (err) {
                return false;
                // Probably blocked due to ad rendered in iframe no longer being on same domain.
            }
        }
    };

/**
 * Initialises GPT on the page
 * @name setSlotTargeting
 * @memberof GPT
 * @lends GPT
*/
  proto.init = function () {
        FT._ads.utils.attach('//www.googletagservices.com/tag/js/gpt.js', true);
        this.setPageTargeting();

        if (!FT._ads.utils.isFunction(FT.env.refreshCancelFilter) || !FT.env.refreshCancelFilter()){
            this.startRefresh();
        }
        this.setPageCollapseEmpty();

        googletag.cmd.push( function () {
            googletag.pubads().enableAsyncRendering();
            googletag.pubads().enableVideoAds();
            googletag.companionAds().setRefreshUnfilledSlots(false);
            googletag.enableServices();
        });

        return this;
    };

    FT._ads.utils.extend(FT.ads, { gpt: new GPT()});
} (window, document));

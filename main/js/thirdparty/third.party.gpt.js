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
        this.slots = {};
        // set up a place holder for the gpt code downloaded from google
        win.googletag = win.googletag || {};
        // this is a command queue used by GPT any methods added to it will be
        // executed when GPT code is available, if GPT is already available they
        // will be executed immediately
        win.googletag.cmd = win.googletag.cmd || [];

        this.unitName = '/' + [FT.ads.config('network'), FT.ads.config('dfp_site'), FT.ads.config('dfp_zone')].join('/');
        return this;
    }
/**
 * Attaches the google publisher tags library to the page via an async script tag
 * //TODO parameterise the inputs and move this function to a utils namespace so it can be resued by Krux, Aud Sci and the like
 * @name attach
 * @memberof GPT
 * @lends GPT
*/
    proto.attach = function () {
        var tag = doc.createElement('script'),
            node = doc.getElementsByTagName('script')[0];

        tag.src = '//www.googletagservices.com/tag/js/gpt.js';
        tag.async = 'true';
        // Use insert before, append child has issues with script tags in some browsers.
        node.parentNode.insertBefore(tag, node);
        return tag;
    };

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
            slotId = slotName + '-gpt';

        FT.ads.slots.addContainer(slot.container, slotId);
        googletag.cmd.push(function (context, slot, slotName, slotId) {
            return function () {
                slot.gptSlot = googletag.defineSlot(context.getUnitName(slotName), slot.config.sizes, slotId)
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
        return function() {
            var oopSlot,
                slot = FT.ads.slots[slotName],
                slotId = slotName + '-oop';

            FT.ads.slots.addContainer(slot.container, slotId);
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
        return this.unitName + '/' + slotName;
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
            gptSlot._renderEnded = gptSlot.renderEnded;
            gptSlot.renderEnded = function (context, slot) {
                return function (){
                    FT.ads.gpt.findNoAd(slot);
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
    proto.findNoAd = function (slot) {
        var img,
            slotId = slot.getSlotId(),
            container = document.getElementById(slotId.getDomId()),
            iframe = document.getElementById('google_ads_iframe_' + slotId.getId());
        try {
            var imgs = Array.prototype.slice.call(iframe.contentDocument.getElementsByTagName('img'), 0);
            while (img = imgs.pop()) {
                if (/ft-no-ad/.test(img.src)) {
                    return container.style.display = 'none';
                }
            }
        } catch (err) {
            return false;
            // Probably blocked due to ad rendered in iframe no longer being on same domain.
        }
    };

/**
 * Initialises GPT on the page
 * @name setSlotTargeting
 * @memberof GPT
 * @lends GPT
*/
    proto.init = function () {
        this.attach();
        this.setPageTargeting();
        this.setPageCollapseEmpty();

        googletag.cmd.push( function () {
            googletag.pubads().enableAsyncRendering();
            googletag.enableServices();
        });

        return this.slots;
    };

    FT._ads.utils.extend(FT.ads, { gpt: new GPT()});
} (window, document));

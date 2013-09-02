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
 * Collects configuration values from data attributes set on the slots container,
 * attributes should be in the format ftads-attrname (data- can also be added)
 * Only certain attribute names are parsed, all attributes without a parser are
 * added to the slots targeting parameters as a key value
 * parsed attributes are:
 * position - is added to targeting parameters as pos
 * page-type  - is added to targeting parameters as pt
 * size - takes a comma separated list of sizes and parses them to an array e.g 1x1,728x60 -> [[1, 1], [728,60]]
 * targeting - a list of key value pairs to be added to targeting in the format key=value; e.g name=gilbert;fruit=grape;
 * out-of-page - when this attribute is present an out of page unit will be created for this slot
 * //TODO collapse - see slot collapse empty options
 * @name fetchSlotConfig
 * @memberof GPT
 * @lends GPT
*/
    proto.fetchSlotConfig = function  (container, config) {
        var attrs, attr, attrObj, name, matches, parser,
            sizes = [],
            targeting = {},
            parsers = {
                'size': function (name, value){
                    value.replace(/(\d+)x(\d+)/g, function (match, width, height) {
                      sizes.push([ parseInt(width, 10), parseInt(height, 10)]);
                    });

                    return !!sizes.length ? sizes : false;
                },
                'position': function (name, value){
                    targeting.pos = value;
                    return value;
                },
                'out-of-page':  function (name, value){
                    config.outOfPage = true;
                    return true;
                },
                'page-type':  function (name, value){
                    targeting.pt = value;
                    return value;
                },
                'targeting': function (name, value) {
                    if (value !== undefined) {
                        value = FT._ads.utils.hash(value, ';', '=');
                        targeting = FT._ads.utils.extend(targeting, value);
                    }
                    return value;
                },
                'default': function (name, value) {
                    targeting[name] = value;
                    return value;
                }
            };

        attrs = container.attributes;
        for(attr in attrs) {
            attrObj = attrs[attr];
            if(attrs.hasOwnProperty(attr) && attrObj.name &&  !!(matches = attrObj.name.match(/(data-)?(ad|ftads)-(.+)/))) {
                name = matches[3];
                parser = FT._ads.utils.isFunction(parsers[name]) ? parsers[name] : parsers['default'];
                parser(name, attrObj.value);
            }
        }

        return {
            sizes: !!(sizes.length) ? sizes : config.sizes,
            outOfPage: config.outOfPage || false,
            collapseEmpty: config.collapseEmpty,
            targeting: targeting
        };
    };

/**
 * Given a script tag the method will inject a div with the given id into the dom just before the script tag
 * if the script tag has the same id as given to the method the attribute will be removed
 * Given any other tag the method will attempt to append the new div as a child
 * @name addContainer
 * @memberof GPT
 * @lends GPT
*/
    proto.addContainer = function(node, id) {
        var container = doc.createElement('div');

        container.setAttribute('id', id);

        if (node.tagName === 'SCRIPT') {
            if (node.id === id) {
                node.removeAttribute('id');
            }
            node.parentNode.insertBefore(container, node);
        } else {
            node.appendChild(container);
        }

        return container;
    };

    proto.centerContainer = function (element, sizes) {
        element.style.marginRight = 'auto';
        element.style.marginLeft = 'auto';

        function getMaximums(sizes) {
            var result = [0, 0];

            if (FT._ads.utils.isArray(sizes[0])) {
                for (var i = 0; i < sizes.length; i++){
                    result[0] = Math.max(sizes[i][0], result[0]);
                    result[1] = Math.max(sizes[i][1], result[1]);
                }
            } else {
                result = sizes;
            }

            return result;
        }

        var max = getMaximums(sizes);
        element.style.minWidth = '1px';
        element.style.maxWidth = max[0] + 'px';
    };

/**
 * creates a container for the gpt ad in the page
 * defines and configures a slot in the gpt publisher services
 * then queues the ad for display
 * @name createSlot
 * @memberof GPT
 * @lends GPT
*/
    proto.createSlot = function (context, slotName) {
        return function() {
            var gptSlot, _renderEnded,
                slot = context.slots[slotName],
                container = slot.container,
                slotId ='gpt-' + slotName;

            context.centerContainer(context.addContainer(container, slotId), slot.config.sizes);
            gptSlot = googletag.defineSlot(context.getUnitName(slotName), slot.config.sizes, slotId)
                        .addService(googletag.pubads());
            context.slots[slotName].gptSlot = gptSlot;

            context.setSlotCollapseEmpty(gptSlot, slot.config);
            context.setSlotTargeting(gptSlot, slot.config.targeting);
            googletag.cmd.push(googletag.display(slotId));
        };
    };

/**
 * creates a container for a gpt out of page ad
 * defines and configures a slot in the gpt publisher services
 * then queues the ad for display
 * @name createOutOfPage
 * @memberof GPT
 * @lends GPT
*/
    proto.createOutOfPage = function (context, slotName) {
        return function() {
            var oopSlot,
                slot = context.slots[slotName],
                slotId = 'gpt-' + slotName + '-oop';

            context.addContainer(slot.container, slotId);
            oopSlot = googletag.defineOutOfPageSlot(context.getUnitName(slotName), slotId)
                        .addService(googletag.pubads());

            context.slots[slotName].oopSlot = oopSlot;

            context.setSlotTargeting(oopSlot, slot.config.targeting);
            googletag.cmd.push(googletag.display(slotId));
        };
    };

/**
 * creates a container for the ad in the page
 * gathers configuration data and queues slot creation
 * for gpt
 * @name createSlot
 * @memberof GPT
 * @lends GPT
*/
    proto.displaySlot = function (slotName) {
        var container = doc.getElementById(slotName),
            formats =  FT.ads.config('formats');

        if (!container) {
            return false;
        }

        var config = this.fetchSlotConfig(container, formats[slotName]);

        if (container.tagName === 'SCRIPT') {
            container = this.addContainer(container, slotName);
        }

        this.slots[slotName] = {
            container: container,
            config: config
        };

        googletag.cmd.push(this.createSlot(this, slotName));
        if (config.outOfPage) {
            googletag.cmd.push(this.createOutOfPage(this, slotName));
        }
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
 * values can be 'after', 'before', 'never'
 * after as in after ads have rendered is the default
 * true is synonymous with before
 * false is synonymous with never
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
 * values can be 'after', 'before', 'never'
 * after as in after ads have rendered is the default
 * true is synonymous with before
 * false is synonymous with never
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
                    context.collapse(slot);
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

    proto.collapse = function (slot) {
        var img,
            slotId = slot.getSlotId(),
            container = document.getElementById(slotId.getDomId()),
            iframe = document.getElementById('google_ads_iframe_' + slotId.getId());
        try {
            var imgs = Array.prototype.slice.call(iframe.contentDocument.getElementsByTagName('img'), 0);
            while (img = imgs.pop()) {
                if (img.src === 'http://media.ft.com/adimages/rich-banner/ft-no-ad.gif') {
                    container.style.display = 'none';
                }
            }
        } catch (err) {
            // Probably blocked due ad rendered in iframe no longer being on same domain.
        }

    };

    FT._ads.utils.extend(FT.ads, { gpt: new GPT()});
} (window, document));

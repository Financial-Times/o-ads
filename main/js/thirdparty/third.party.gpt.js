/*globals googletag: true */

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
(function (win, doc, undefined) {
    "use strict";
    var proto = GPT.prototype;

    function GPT() {
        this.slots = {};
        // set up a place holder for the gpt code downloaded from google
        win.googletag = win.googletag || {};
        // this is a command queue used by GPT any methods added to it will be
        // executed when GPT code is available, if GPT is available they will be executed immediately
        win.googletag.cmd = win.googletag.cmd || [];

        this.unitName = '/' + [FT.ads.config('network'), FT.ads.config('dfp_site'), FT.ads.config('dfp_zone')].join('/');
        return this;
    }

    proto.attach = function () {
        var tag = doc.createElement('script'),
            node = doc.getElementsByTagName('script')[0];

        tag.src = '//www.googletagservices.com/tag/js/gpt.js';
        tag.async = 'true';
        // Use insert before, append child has issues with script tags in some browsers.
        node.parentNode.insertBefore(tag, node);
        return tag;
    };

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

    proto.fetchContainer = function (slotName) {
        var container = doc.getElementById(slotName);
        if (container) {
            return container;
        }
        return false;
    };

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
                    var outOfPage;
                    if (value === 'true' || !!value){
                        outOfPage = true;
                    } else if (value === 'false' || !value){
                        outOfPage = false;
                    }
                    return outOfPage;
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

        config = config || {};
        return {
            sizes: !!(sizes.length) ? sizes : config.sizes,
            outOfPage: config.outOfPage || false,
            collapseEmpty: config.collapseEmpty,
            targeting: targeting
        };
    };

    proto.addSlotContainer = function(node, slotName) {
        var divContainer = doc.createElement('div');
            slotName = slotName || node.id;


        divContainer.setAttribute('id', slotName);

        if(node.tagName === 'SCRIPT') {
            node.parentNode.insertBefore(divContainer, node);
        } else {
            node.appendChild(divContainer);
        }

        return divContainer;
    };

    proto.createSlot = function (context, slotName) {
        return function() {
            var gptSlot, oopSlot, targetKey,
                unitName = context.getUnitName(slotName),
                slot = context.slots[slotName],
                container = slot.container;

            container = context.addSlotContainer(slot.container, slotName);
            context.addSlotContainer(container, slotName + '-itp');
            gptSlot = googletag.defineSlot(context.getUnitName(slotName), slot.config.sizes, slotName + '-itp')
                        .addService(googletag.pubads());

            context.slots[slotName].gptSlot = gptSlot;
            googletag.display(slotName + '-itp');

            if (slot.config.outOfPage === true) {
                context.addSlotContainer(slotName + '-oop');
                oopSlot = googletag.defineOutOfPageSlot(context.getUnitName(slotName), slotName + '-oop')
                            .addService(googletag.pubads());
                context.slots[slotName].oopSlot = oopSlot;
                googletag.display(slotName + '-oop');
            }

            for (targetKey in slot.config.targeting) {
                if (slot.config.targeting.hasOwnProperty(targetKey)) {
                    gptSlot.setTargeting(targetKey, slot.config.targeting[targetKey]);
                }
            }

            context.setSlotCollapseEmpty(gptSlot, slot.config);
        };
    };

    proto.getUnitName = function (slotName) {
        return this.unitName + '/' + slotName;
    };

    proto.displaySlot = function (slotName) {
        var unitName, config, container, formats;

        if (container = this.fetchContainer(slotName)) {
            formats = FT.ads.config('formats');
            unitName = this.getUnitName(slotName);
            config = this.fetchSlotConfig(container, formats[slotName]);

            this.slots[slotName] = {
                container: container,
                config: config
            };

            googletag.cmd.push(this.createSlot(this, slotName));
        }
    };

    proto.setPageCollapseEmpty = function () {
        var mode = FT.ads.config('collapseEmpty');

        if (mode === 'after' || mode === undefined) {
            mode = undefined;
        } else if (mode === 'before' || mode === true) {
            mode = true;
        } else {
            mode = !!mode;
        }

        googletag.cmd.push( function () {
            googletag.pubads().collapseEmptyDivs(mode);
        });
        return mode;
    };

    proto.setSlotCollapseEmpty = function (slot, config) {
        var mode = config.collapseEmpty;
        if (mode === true || mode === 'after') {
            slot.setCollapseEmptyDiv(true);
        } else if (mode === 'before') {
            slot.setCollapseEmptyDiv(true, true);
        } else if (mode === false || mode === 'never') {
            slot.setCollapseEmptyDiv(false);
        }

        return mode;
    };


    proto.init = function () {
        var slotName;

        this.attach();
        this.setPageTargeting();
        this.setPageCollapseEmpty();

        googletag.cmd.push( function () {
            googletag.pubads().enableAsyncRendering();
            googletag.enableServices();
        });

        return this.slots;
    };

    FT._ads.utils.extend(FT.ads, {gpt: new GPT()});
} (window, document));

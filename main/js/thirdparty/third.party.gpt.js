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
            targeting = {},
            base = FT.ads.config('dfp_targeting'),
            audsci = FT.ads.audsci.getAudSci();

        // Convert ;key=val strings to objects { key: value }
        base = FT._ads.utils.isString(base) ? FT._ads.utils.hash(base, ';', '=') : base;
        //audsci = FT._ads.utils.isString(audsci) ? FT._ads.utils.hash(audsci, ';', '=') : base;

        FT._ads.utils.extend(targeting, base, audsci);

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

    proto.fetchAdContainer = function (slotName) {
        var container = doc.getElementById(slotName);
        if (container) {
            return container;
        }
        return false;
    };



    proto.fetchSlotConfig = function  (container, sizes) {
        var sizesString;
        sizes = container.getAttribute('data-ad-size') || sizes || [1,1];

        if (FT._ads.utils.isString(sizes)) {
            sizesString = sizes;
            sizes = [];
            sizesString.replace(/(\d+)x(\d+)/g, function (match, width, height) {
              sizes.push([ parseInt(width, 10), parseInt(height, 10)]);
            });
        }

        //TODO add more slot level options targeting would be a good start

        return {
            sizes: sizes
        };
    };

    proto.fixContainer = function(container) {
        // this code is pretty much for HTSI only
        // if the ID is on a script tag
        // traverse the DOM for a suitable element to attach it to (anything but a script tag)
        var slotName = container.id;
        while (container.tagName === 'SCRIPT') {
            if (container.id === slotName) {
                container.removeAttribute('id');
            }
            container = container.parentNode;
        }
        container.setAttribute('id', slotName);
    };

    proto.fetchPageSlots = function () {
        var slotName, container, config,
            formats = FT.ads.config('formats');

        // Find ad slots marked up by ID
        for (slotName in formats) {
            if (container = this.fetchAdContainer(slotName)) {
                config = this.fetchSlotConfig(container, formats[slotName]);
                this.fixContainer(container);

                this.slots[slotName] = {
                    container: container,
                    config: config
                };
            }
        }
        return this.slots;
    };

    proto.configureSlot = function (slotName, slot) {
        // TODO slot level config/targeting via data attrs on the container.

        var unitName = this.getUnitName(slotName);
        googletag.cmd.push(this.createSlot(unitName, slot.config.sizes, slotName));
    };

    proto.createSlot = function (unitName, sizes, slotName) {
        return function() {
           var slot = googletag.defineSlot(unitName, sizes, slotName);

            slot.addService(googletag.pubads())
                .setTargeting('pos', slotName);
        };
    };

    proto.getUnitName = function (slotName) {
        return this.unitName + '/' + slotName;
    };

    proto.displaySlot = function (slotName) {
        var unitName, config, container, formats;

        if (FT.ads.config('fetchSlots') !== false) {
            if (container = this.fetchAdContainer(slotName)) {
                formats = FT.ads.config('formats');
                unitName = this.getUnitName(slotName);
                config = this.fetchSlotConfig(container, formats[slotName]);

                this.fixContainer(container);

                this.slots[slotName] = {
                    container: container,
                    config: config
                };

                googletag.cmd.push(this.createSlot(unitName, config.sizes, slotName));
            }
        }

        googletag.cmd.push( function () {
            googletag.display(slotName);
        });
    };

    proto.collapseEmpty = function () {
        var mode = FT.ads.config('collapseEmpty');
        if (FT.ads.config('collapseEmpty') !== false) {
            mode = mode === 'before' ? true : undefined;
            googletag.cmd.push( function () {
                 googletag.pubads().collapseEmptyDivs(mode);
            });
        }
    };

    // Use an init method for GPT while we have the switch, once we're fully on GPT this can be deprecated
    proto.init = function () {
        var slotName;

        this.attach();
        this.unitName = [FT.ads.config('network'), FT.ads.config('dfp_site'), FT.ads.config('dfp_zone')].join('/');
        this.setPageTargeting();

        if (FT.ads.config('fetchSlots') === false) {
            this.fetchPageSlots();
            for (slotName in this.slots) {
                this.configureSlot(slotName, this.slots[slotName]);
            }
        }

        this.collapseEmpty();

        googletag.cmd.push( function () {
            googletag.pubads().enableAsyncRendering();
            googletag.enableServices();
        });

        for (slotName in this.slots) {
            this.displaySlot(slotName);
        }

        return this.slots;
    };

    if (!FT) {
        FT = win.FT = {};
    }

    if (!FT.ads) {
        FT.ads = {};
    }

    FT._ads.utils.extend(FT.ads, {gpt: new GPT()});
} (window, document));

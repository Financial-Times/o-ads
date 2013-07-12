/*globals googletag: true */

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
(function (win, doc, undefined) {
    "use strict";

    function GPT() {
        var self = this;
        this.slots = {};
        // set up a place holder for the gpt code downloaded from google
        win.googletag = win.googletag || {};
        // this is a command queue used by GPT any methods added to it will be
        // executed when GPT code is available, if GPT is available they will be executed immediately
        win.googletag.cmd = win.googletag.cmd || [];
        return this;
    }

    GPT.prototype.attach = function () {

        var tag = doc.createElement('script'),
            node = doc.getElementsByTagName('script')[0];

        tag.src = '//www.googletagservices.com/tag/js/gpt.js';
        tag.async = 'true';
        // Use insert before, append child has issues with script tags in some browsers.
        node.parentNode.insertBefore(tag, node);
        return tag;
    };

    GPT.prototype.setPageTargetting = function () {
        var param,
            targeting = {},
            base = FT.ads.config.get('dfp_targetting'),
            audsci = FT.ads.audsci.getAudSci();

        // Convert ;key=val strings to objects { key: value }
        base = FT._ads.utils.isString(base) ? FT._ads.utils.hash(base, ';', '=') : base;
        //audsci = FT._ads.utils.isString(audsci) ? FT._ads.utils.hash(audsci, ';', '=') : base;

        FT._ads.utils.extend(targeting, base, audsci);

        function storeKeyValue(key, value) {
            return function () {
                googletag.pubads().setTargeting(key, value);
            };
        }

        for (param in targeting) {
            googletag.cmd.push(storeKeyValue(param, targeting[param]));
        }
    };

    GPT.prototype.fetchPageSlots = function () {
        var slotName, container,
            formats = FT.ads.config.get('formats');

        // Find ad slots marked up by ID
        for (slotName in formats) {
            container = doc.getElementById(slotName);
            if (container) {
                // if the ID is on a script tag
                // traverse the DOM for a suitable element to attach it to (anything but a script tag)
                while (container.tagName === 'SCRIPT') {
                    container.removeAttribute('id');
                    container = container.parentNode;
                }
                container.setAttribute(slotName);
                this.slots[slotName] = {
                    container: container
                };
            }
        }
    };

    // Use an init method for GPT while we have the switch, once we're fully on GPT this can be deprecated
    GPT.prototype.init = function () {
        this.attach();
    };

    if (!FT) {
        FT = win.FT = {};
    }

    if (!FT.ads) {
        FT.ads = {};
    }

    FT._ads.utils.extend(FT.ads, {gpt: new GPT()});
}(window, document));

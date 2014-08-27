/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
/**
 * FT.ads.chartbeat provides chartbest integration for the FT advertising library
 * @name targeting
 * @memberof FT.ads
*/
(function (win, doc, undefined) {
    "use strict";
    var proto = Chartbeat.prototype;
/**
 * The ChartBeat class defines an FT.ads.chartbeat instance
 * @class
 * @constructor
*/
    function Chartbeat() {

    }


/**
 * initialise chartbeat functionality
 * Decorates the gpt refresh method with chartbeat functionality
 * @name init
 * @memberof ChartBeat
 * @lends ChartBeat
*/
    proto.init = function () {
        if (window.pSUPERFLY) {
            this.decorateRefresh();
        }
    };

    proto.decorateRefresh = function () {
        if (FT._ads.utils.isFunction(FT.ads.gpt.refresh)) {
            var _refresh = FT.ads.gpt.refresh;
                FT.ads.gpt.refresh =  this.refresh(_refresh);
            return true;
        }
    };


/**
 * Alerts chartbeat that a refresh is about ot happen on multiple slots
 * @name refresh
 * @memberof ChartBeat
 * @lends ChartBeat
*/
    proto.refresh = function (fn) {
        return function (slotsForRefresh) {
            var slot, slotName, cbName,slots = FT.ads.slots;
            slotsForRefresh = slotsForRefresh || slots;
            for (slotName in slotsForRefresh) {
                slot = slots[slotName];
                if (slot.gptSlot && slot.timer === undefined) {
                    if ( FT._ads.utils.isNonEmptyString(cbName = slot.container.getAttribute('data-cb-ad-id')) ) {
                        window.pSUPERFLY.refreshAd(cbName);
                    }
                }
            }

            fn.apply(this, arguments);
        };
    };

  FT._ads.utils.extend(FT.ads, {cb: new Chartbeat()});
}(window, document));

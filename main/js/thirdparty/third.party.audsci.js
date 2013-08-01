/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */


/**
 * FT.ads.audsci is an object providing properties and methods for accessing Audience Science Targetting segments and passing them into DFP
 * @name audsci
 * @memberof FT.ads
 * @class
*/
(function (win, doc, undefined) {
 "use strict";
/**
 * @constructor
*/
    function AudSci() {
        var self = this;
        return this;
    }
/**
 * getAudSci takes an rsiSegs string and returns an DFP targetting object
 * @lends audsci
 * @function
*/
    AudSci.prototype.getAudSci = function(rsiSegs){

        function parseSegs(segs, max) {
            var match,
                exp = /J07717_10*([^|]*)/g,
                found = [],
                result;
            if (max && segs) {
                while((match = exp.exec(segs)) && (found.length < max)){
                    found.push('z'+match[1]);
                }
            }

            result = (found.length) ? {a : found} : {};
            return result;
        }
        if (typeof rsiSegs === "undefined") {rsiSegs = FT._ads.utils.cookie('rsi_segs');}
        return parseSegs(rsiSegs, FT.ads.config('audSciLimit'));
    };

    if (!win.FT ) {
        FT = win.FT = {};
    }

    if (!FT.ads) {
        FT.ads = {};
    }
    FT._ads.utils.extend(FT.ads, {audsci: new AudSci()});
}(window, document));


/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */


/**
 * FT.ads.targeting is an object providing properties and methods for accessing targeting parameters from various sources including FT Track and Audience Science and passing them into DFP
 * @name targeting
 * @memberof FT.ads
*/
(function (win, doc, undefined) {
    "use strict";
    var proto = Targeting.prototype;

/**
 * The Targeting class defines an FT.ads.targeting instance
 * @class
 * @constructor
*/
    function Targeting() {
        var parameters = {};
/**
 * fetchAudSci reads the rsi_segs cookie or takes an rsiSegs string in the format "J07717_10826|J07717_10830|D08734_70012" and returns a DFP targeting object.
 * only segments begining J07717_10 will be entered into the return object.
 * The return object will have a single key 'a' containing an array of segments: {'a' : []};
 * @name fetchAudSci
 * @memberof Targeting
 * @lends Targeting
*/
        function fetchAudSci(rsiSegs) {
            var segments = {};

            function parseSegs(segs, max) {
                var match,
                    exp = /J07717_10*([^|]*)/g,
                    found = [];

                if (max && segs) {
                    while((match = exp.exec(segs)) && (found.length < max)){
                        found.push('z'+ match[1]);
                    }
                }

                return (found.length) ? found : false;
            }

            if (typeof rsiSegs === "undefined") {
                rsiSegs = FT.ads.config('rsi_segs');
            }

            segments = parseSegs(rsiSegs, FT.ads.config('audSciLimit'));
            return segments ? {a: segments} : {};
        }

/**
 * fetchEid derives the eid of the current user first from the FT_U cookie then
 * the FT_Remember cookie if FT_U is unset. An object with the key eid and the derived eid value is
 * returned, if no value is availble null will be returned as the object value
 * @name fetchEid
 * @memberof Targeting
 * @lends Targeting
*/
        function getEid() {
            var eid = null,
                user = FT.ads.config('FT_U'),
                remember = FT.ads.config('FT_Remember');

            //TODO fix the utils hash method to not error when undefined is passed
            // then we can get rid of the test for the split method
            if (user && FT._ads.utils.isFunction(user.split)) {
                user = FT._ads.utils.hash(user, '_', '=');
                eid = user.EID || eid;
            } else if (remember && FT._ads.utils.isFunction(remember.split)) {
                remember = remember.split(':');
                eid = !!(remember[0].length) ? remember[0] : eid;
            }

            return { eid: eid};
        }

/**
 * getFromConfig returns an object containing all the key values pairs specified in the dfp_targeting
 * config.
 * @name getFromConfig
 * @memberof Targeting
 * @lends Targeting
*/
        function getFromConfig() {
            var targeting = FT.ads.config('dfp_targeting') || {};
            if (!FT._ads.utils.isPlainObject(targeting)) {
                if (FT._ads.utils.isString(targeting)) {
                    targeting = FT._ads.utils.hash(targeting, ';', '=') || {};
                }
            }
            return targeting;
        }


/**
 * returns an object containing all targeting parameters
 * @memberof Targeting
 * @lends Targeting
*/
        return function () {
            return FT._ads.utils.extend({}, getFromConfig(), fetchAudSci(), getEid());
        };
    }

    FT._ads.utils.extend(FT.ads, {targeting: new Targeting()});
}(window, document));

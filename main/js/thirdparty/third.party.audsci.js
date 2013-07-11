/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, undefined) {
    "use strict";

    function AudSci() {
        var self = this;
        return this;
    }

    AudSci.prototype.getAudSci = function(cookie){
        var audsciCookie,
            rsiSegs;
       function parseSegs(segs, max) {
            var match,
                exp = /J07717_10*([^|]*)/g,
                prefix = ';a=z',
                found = [],
                result = '';
            if (max) {
                 while(match = exp.exec(segs)) {
                    found.push(match[1]);
                }
            if (found.length) {
                    result = prefix  + found.slice(0, max).join(prefix);
                }
            }
            return result;
        }

        audsciCookie = ((typeof cookie) !== "string") ? document.cookie : cookie;
        rsiSegs = audsciCookie.replace(/^.*\brsi_segs=([^;]*).*$/, '$1');
        return parseSegs(rsiSegs, FT.ads.config.audSciLimit);
    };

    if (!win.FT ) {
        FT = win.FT = {};
    }

    if (!FT.ads) {
        FT.ads = {};
    }

    FT._ads.utils.extend(FT.ads, {audsci: new AudSci()});
}(window, document));

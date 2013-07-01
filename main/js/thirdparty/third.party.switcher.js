/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, FT, undefined) {
    "use strict";

    function switchAdLibrary(mode) {
       if (mode !== 'gpt') {
          FT.env.adCall = function () {};
          FT.env.getAudSci = function() {};
          FT.env.getURL = function() {};
          FT.env.getTag = function() {};
       } else {


       }
    }

    if (document.readyState === 'complete') {
        // get switch mode from metadata
        var mode = FT.ads.config.get("adLibMode");

        switchAdLibrary(mode);
    }

}(window, document, FT || {}));

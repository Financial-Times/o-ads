/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, FT, undefined) {
    "use strict";

    function switcher() {
      var mode = FT.ads.config.get('ftads:mode');
      if (mode === 'gpt') {
          FT.env.adCall = function () {
            return false;
          };
      }
    }

    switcher();
}(window, document, FT || {}));

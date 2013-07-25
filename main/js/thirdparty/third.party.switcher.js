/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, FT, undefined) {
    "use strict";

    function switcher() {
      var mode = FT.ads.config('ftads:mode');
      if (mode === 'gpt') {
          FT.env.adCall = function () {
            return false;
          };

          // for HTSI
          FT.env.advert = function () {
            return false;
          };

          FT.ads.config('formats', { banlb: [[728,90], [468,60], [970,90]], mpu: [[300,250],[336,280]], doublet: [[342,200]], hlfmpu: [[300,600],[336,850],[300,250],[336,280]], intro: [[1,1]], newssubs: [[239,90]], refresh: [[1,1]], searchbox: [[200,28]], tlbxrib: [[336,60]], mpu2: [[300,250],[336,280]]});
          $(function () {
            FT.ads.gpt.init();
          });
      }
    }

    switcher();
}(window, document, FT || {}));

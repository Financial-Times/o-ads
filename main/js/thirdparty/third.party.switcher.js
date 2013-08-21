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
            FT.ads.gpt.displaySlot.apply(FT.ads.gpt, arguments);
          };

          // for HTSI
          FT.env.advert = function () {
            FT.ads.gpt.displaySlot.apply(FT.ads.gpt, arguments);
          };

          FT.ads.config('formats', {
            banlb: {
              sizes: [[728,90], [468,60], [970,90]]
            },
            mpu: {
              sizes: [[300,250],[336,280]]
            },
            mpu2: {
              sizes: [[300,250],[336,280]]
            },
            hlfmpu: {
              sizes: [[300,600],[336,850],[300,250],[336,280]]
            },
            refresh: {
              outOfPage: true,
              collapseEmpty: false
            }
          });

          FT.ads.config('collapseEmpty', 'ft');

          FT.ads.gpt.init();
      }
    }

    switcher();
}(window, document, FT || {}));

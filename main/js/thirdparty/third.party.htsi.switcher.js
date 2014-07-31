  /**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, undefined) {
    "use strict";

    function switcher() {
      var mode = FT.ads.config('ftads:mode');
      if (mode === 'gpt') {
          FT.env.adCall = function () {
            FT.ads.slots.initSlot.apply(FT.ads.slots, arguments);
          };

          // for HTSI
          FT.env.advert = function () {
            FT.ads.slots.initSlot.apply(FT.ads.slots, arguments);
          };

        var findNoAD = function(iframe, slotName, callback){
            if (iframe.attachEvent) {
                iframe.attachEvent(
                    'onload',
                    function () {
                        try {
                            var img, imgs = iframe.contentDocument.getElementsByTagName('img');
                            imgs = FT._ads.utils.nodeListToArray(imgs);
                            while (img = imgs.pop()) {
                                if (/ft-no-ad/.test(img.src)) {
                                    callback(true, slotName);
                                } else {callback(false, slotName);}
                            }
                        } catch (err) {
                            return false;
                            // Probably blocked due to ad rendered in iframe no longer being on same domain.
                        }
                    }
                );
            } else {
                try {
                    var img, imgs = Array.prototype.slice.call(iframe.contentDocument.getElementsByTagName('img'), 0);
                    while (img = imgs.pop()) {
                        if (/ft-no-ad/.test(img.src)) {
                            callback(true, slotName);
                        } else {callback(false, slotName);}
                    }
                } catch (err) {
                    return false;
                            // Probably blocked due to ad rendered in iframe no longer being on same domain.
                }
                // Attaching an event listener to the iFrame's load event as a catch-all fail-safe to collapse the slot
                // in the case that the no-ad image hadn't loaded at the point of the first check.
                iframe.addEventListener(
                    'load',
                    function () {
                        try {
                            var img, imgs = Array.prototype.slice.call(iframe.contentDocument.getElementsByTagName('img'), 0);
                            while (img = imgs.pop()) {
                                if (/ft-no-ad/.test(img.src)) {
                                    callback(true, slotName);
                                } else {callback(false, slotName);}
                            }
                        } catch (err) {
                            return false;
                            // Probably blocked due to ad rendered in iframe no longer being on same domain.
                        }
                    },
                    false
                );
            }
        };

        FT.ads.renderEnded = function(event){
            if (event.slotType !== "oop") {
                if(event.isEmpty) {
                    event.slot.collapse();
                }else {
                    findNoAD(event.iframe, event.name, function(isNoAd, name){
                        if (isNoAd) {FT.ads.slots[name].collapse();} else {FT.ads.slots[name].uncollapse();}
                    });
                }
            }
        };

          FT.ads.config('formats', {
            banlb: {
              sizes: [[728,90], [468,60], [970,90]],
              outOfPage: true,
              cbTrack: true
            },
            mpu: {
              sizes: [[300,250], [336,280]],
              cbTrack: true
            },
            mpu2: {
              sizes: [[300,250], [336,280]],
              cbTrack: true
            },
            hlfmpu: {
              sizes: [[300,600], [336,850], [300,250], [336,280]],
              cbTrack: true
            }
          });

          FT.ads.config('collapseEmpty', 'ft');

          FT.ads.gpt.init();
          FT.ads.krux.init();
      }
    }

    switcher();
}(window, document));

  /**
 * @fileOverview
 * FT.com library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, undefined) {
    "use strict";

    function switcher() {
        /* Initialise FT.corpopup, this should be migrated to into the
        *  membership codebase and removed from here ASAP.
        */
        if (FT.HTMLAds) {
            FT.corppop = new FT.HTMLAds();
        }

        FT.ads.request = function (pos) {
            if (pos === 'corppop') {
                var AYSC_OK, TIME_OK, injectionPoint, inj, self,
                URL = '',
                cookieConsentName = 'cookieconsent',
                cookieConsentAcceptanceValue = 'accepted',
                SubsLevelReplaceLookup = {
                'edt': { '22': /^edit$/, '97': /^.*/ },
                'int': { '22': /^Ftemp$/, '97': /^.*/ },
                'cor': { '22': /^[N]*[PL][01][PL]*[1]*[PL][12][A-Za-z][A-Za-z]/, '97': /^c$/ },
                'lv1': { '22': /^[PL]*[0]*[PL]1[A-Za-z][A-Za-z]/, '97': /^[^c]$/ },
                'lv2': { '22': /^[N]*[PL]*[0]*[PL]2[A-Za-z][A-Za-z]/, '97': /^[^c]$/ },
                'reg': { '22': /^[PL]0[A-Za-z][A-Za-z]/, '97': /^[^c]$/ }
                },
                AYSC97 = FT._ads.utils.getCookieParam("AYSC", "97") || "",
                AYSC98 = FT._ads.utils.getCookieParam("AYSC", "98") || "",
                AYSC22 = FT._ads.utils.getCookieParam("AYSC", "22") || "",
                AYSC27 = FT._ads.utils.getCookieParam("AYSC", "27") || "",
                location = document.location.href;

                if (!location.match(/Authorised=false/) && (FT._ads.utils.cookie(cookieConsentName) === cookieConsentAcceptanceValue)) {
                    if (!FT._ads.utils.isString(FT._ads.utils.cookie("AYSC"))) {
                        AYSC_OK = 0;
                    } else {
                        AYSC_OK = FT.corppop.isCorporateUser(AYSC97, AYSC98, AYSC22, AYSC27, SubsLevelReplaceLookup);
                    }
                    TIME_OK = FT.corppop.timeOut(FT._ads.utils.cookie("FT_AM"), FT._ads.utils.cookie("CorpPopTimeout"));
                    injectionPoint = (FT.env.isLegacyAPI) ? FT.corppop.HTMLAdData.injectionLegacyParentDiv : FT.corppop.HTMLAdData.injectionParentDiv;
                    inj = document.getElementById(injectionPoint);

                    //we only call the corppop ad based on the AYSC field _22 and _27 values,
                    //if the FT_AM (+/- CorppopTimeout) cookie has expired,
                    //and a banlb div is present on the page
                    if ((AYSC_OK) && (TIME_OK) && (inj !== null)) {
                        URL = FT.corppop.buildAdURL(AYSC98, AYSC22, AYSC27, SubsLevelReplaceLookup);
                        FT.corppop.getHTMLAd(pos, inj, URL);
                    }
                }
            }
            else {
                FT.ads.slots.initSlot.apply(FT.ads.slots, arguments);
            }
        };


        // stop the old new subs box from rendering
        FT.ads.requestNewssubs = function (){};

        // Brightcove calls this method and sometimes it causes errors under GPT so we#re over writing it just in case
        FT.ads.beginVideo= function (){return true;};

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
             var gptSlotId = event.slot.getSlotId(),
             name = gptSlotId.getDomId().split('-')[0],
             iframeId = 'google_ads_iframe_' + gptSlotId.getId(),
             iframe = document.getElementById(iframeId),
             slot = FT.ads.slots[name];
            if(event.isEmpty) {
                slot.collapse();
            }else { 
               findNoAD(iframe, name, function(isNoAd, name){
                    if (isNoAd) {FT.ads.slots[name].collapse();} else {FT.ads.slots[name].uncollapse();}
                });
            }
        };

        var kruxId;
        if (FT.Properties.ENV === 'p') {
            kruxId = 'IhGt1gAD';
        } else {
            kruxId = 'IgnVxTJW';
        }

        // setup FT specific configuration
        FT.ads.config({
            collapseEmpty: 'ft',
            // these are all targeting options
            metadata: true,
            audSci: true,
            krux: {
                limit: FT.env.kruxMaxSegs || false,
                id: kruxId,
                events: {
                    dwell_time: {
                        interval: 5,
                        id: 'JCadw18P',
                        total: 600
                    }
                }
            },
            socialReferrer: true,
            pageReferrer: true,
            cookieConsent:  true,
            timestamp: true,
            version: true,
            refresh: {
                time: false,
                max: 0,
                art: {
                    time: false
                },
                ind: {
                    time: 900
                }
            }
        });

        // turn on video only for the video sections
        if ( /5887\.video$/.test(FT.ads.config('dfp_site')) ) {
          FT.ads.config('companions', true);
          FT.ads.config('video', true);
        }

        FT.ads.gpt.init();
        FT.ads.krux.init();
    }

    switcher();
}(window, document));

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
        } else {
            FT.ads.slots.initSlot.apply(FT.ads.slots, arguments);
        }
      };

      FT.ads.requestNewssubs = function (){

      };
  FT.ads.customSlots = {
    tlbxrib : function() {
       if (FT.env.dfp_site === "ftcom.5887.markets-data" && FT.env.dfp_zone === "equity-and-investment-tearsheets"){
        var iframe = document.getElementById('tlbxrib-gpt').getElementsByTagName('iframe')[0];
        var css = 'a img { border: none; }';
        var head = iframe.contentWindow.document.getElementsByTagName('head')[0],
        style = iframe.contentWindow.document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
        style.appendChild(iframe.contentWindow.document.createTextNode(css));
        }
        head.appendChild(style);
      }
    }
  };

  FT.ads.beginVideo= function (){return true;};

      FT.ads.config({
        collapseEmpty: 'ft',
        // these are all targeting options
        metadata: true,
        audSci: true,
        krux: true,
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

      FT.ads.gpt.init();

    }

    switcher();
}(window, document));

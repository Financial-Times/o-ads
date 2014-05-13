// http://adserver.adtech.de/addyn/3.0/1176/3073320/0/0/ADTECH;loc=100;target=_blank;AdId=7527748;BnId=-1;;grp=[group];misc='+new%20Date().getTime()+'
// Kodu expanding banlb ad with carousel booked through adtech
var adtechAdConfig = {
   "canvasId": 4098,
   "servicesUrl": "https://canvas-services.adtech.de/",
   "adServerVars": {
      "uid": "839892576",
      "id": "7582294",
      "bannerId": "1",
      "networkId": "1176",
      "subNetworkId": "1",
      "creativeId": "0",
      "pageId": "0",
      "placementId": "3584812",
      "adSize": "16",
      "servingProto": "http",
      "servingHost": "adserver.adtech.de",
      "baseURL": "http://aka-cdn-ns.adtech.de/rm/ads/4098/",
      "sslBaseURL": "https://aka-cdn.adtech.de/rm/ads/4098/",
      "viewCounter": ""
   },
   "geoData": {
      "area": "",
      "city": "Islington",
      "country": " UNITED KINGDOM",
      "state": "england",
      "zip": ""
   },
   "preview": false,
   "pubVars": {
      "iframeBusterPath": "",
      "clickRedirect": "",
      "overflowFixLevel": "0",
      "viewCountUrl": "",
      "overrideX": "",
      "overrideY": "",
      "closeTimeout": "0"
   },
   "rmLibUrl": "http://aka-cdn-ns.adtech.de/rm/adtechRichMediaLib_1_13_4.js",
   "clickRedirect": "http://adserver.adtech.de/custadlink/3.0/1176.1/3584812/0/16/AdId=7582294;CreativeId=0;BnId=1;EventIds=_CLK_ID_;link=",
   "assetContainers": {
      "main": {
         "type": "inlineDiv",
         "width": 1,
         "height": 1,
         "contentWidth": 1,
         "contentHeight": 1,
         "contentWidthUnit": "px",
         "contentHeightUnit": "px",
         "xRel": "adSlotLeft",
         "yRel": "adSlotTop",
         "x": 0,
         "y": 0,
         "renderEvent": "serve",
         "langVersion": 1,
         "content": "blank.swf",
         "contentType": "flash",
         "zIndex": 1,
         "wmode": "opaque",
         "pluginVersion": 8,
         "contractedY": 0,
         "contractedX": 0,
         "contractedWidth": 1,
         "contractedHeight": 1,
         "isExpandable": false,
         "startContracted": true,
         "stickyX": false,
         "stickyY": false,
         "pushesContent": false,
         "expandAnimationDuration": 0,
         "contractAnimationDuration": 0,
         "closeTimeout": 0,
         "modal": false
      }
   },
   "clickthroughs": {
      "default": {
         "id": 1008,
         "dest": "",
         "target": "_blank",
         "features": ""
      },
      "backupImageClickthrough": {
         "id": 7393,
         "dest": "",
         "target": "_blank",
         "features": ""
      },
      "Some clickthrough identifier": {
         "id": 8543,
         "dest": "http://www.kodudigital.com",
         "target": "_blank",
         "features": ""
      }
   },
   "contentVariables": {
      "Backup Alt Text": "Kodu advertisement"
   },
   "dataFeeds": {},
   "screenGrabs": {},
   "polls": {},
   "assets": [{
      "id": "main",
      "name": "blank.swf",
      "url": "blank_1333121223.swf"
   },
   {
      "id": "",
      "name": "customAd.js",
      "url": "customAd_1334243951.js"
   },
   {
      "id": null,
      "name": "backup.gif",
      "url": "backup_1333121658.gif"
   },
   {
      "id": "",
      "name": "noble-01.jpg",
      "url": "noble-01_1334232547.jpg"
   },
   {
      "id": "",
      "name": "noble-02.jpg",
      "url": "noble-02_1334232571.jpg"
   },
   {
      "id": "",
      "name": "noble-03.jpg",
      "url": "noble-03_1334232583.jpg"
   },
   {
      "id": "",
      "name": "noble-bg.jpg",
      "url": "noble-bg_1334232607.jpg"
   },
   {
      "id": null,
      "name": "hit.png",
      "url": "hit_1333637702.png"
   },
   {
      "id": null,
      "name": "noble-expand-full-01.jpg",
      "url": "noble-expand-full-01_1333637707.jpg"
   },
   {
      "id": null,
      "name": "noble-expand-full-02.jpg",
      "url": "noble-expand-full-02_1333637712.jpg"
   },
   {
      "id": null,
      "name": "noble-expand-full-03.jpg",
      "url": "noble-expand-full-03_1333637717.jpg"
   },
   {
      "id": null,
      "name": "blank.jpg",
      "url": "blank_1334056665.jpg"
   }],
   "events": [{
      "id": 1010,
      "name": "engagement",
      "cumulative": false,
      "interaction": true,
      "custom": false,
      "video": false,
      "isLoggable": true
   },
   {
      "id": 1467,
      "name": "backupView",
      "cumulative": false,
      "interaction": false,
      "custom": false,
      "video": false,
      "isLoggable": true
   },
   {
      "id": 8598,
      "name": "Expand ad",
      "cumulative": true,
      "interaction": true,
      "custom": true,
      "video": false,
      "isLoggable": true
   },
   {
      "id": 8599,
      "name": "Close ad",
      "cumulative": true,
      "interaction": true,
      "custom": true,
      "video": false,
      "isLoggable": true
   }],
   "timers": [{
      "id": 1438,
      "name": "displayTimer"
   },
   {
      "id": 1439,
      "name": "viewTimer"
   },
   {
      "id": 1440,
      "name": "engagementTimer"
   }],
   "eventHandlers": [],
   "thirdPartyTracking": [],
   "fallback": "blank.jpg"
};
var adtechFLPData = {
   "clickthroughs": {},
   "contentVariables": {},
   "thirdPartyTracking": {}
};
var adtechFlightPlacementId;

function adtechFLPDataExists(A) {
   return (adtechFLPData[A] && (typeof adtechFLPData[A][adtechFlightPlacementId] != "undefined"))
}
function adtechGetFLPData(A) {
   return adtechFLPData[A][adtechFlightPlacementId]
}
function adtechConfigureAdFLP() {
   adtechFlightPlacementId = adtechAdConfig.adServerVars.id;
   var N = "clickthroughs";
   var B = "contentVariables";
   var L = "thirdPartyTracking";
   var J = "dest";
   var D = "id";
   var M = "url";
   if (adtechFLPDataExists(N)) {
      var C = adtechGetFLPData(N);
      for (var E in adtechAdConfig[N]) {
         if (C[E]) {
            adtechAdConfig[N][E][J] = C[E]
         }
      }
   }
   if (adtechFLPDataExists(B)) {
      var K = adtechGetFLPData(B);
      for (var F in adtechAdConfig[B]) {
         if (K[F]) {
            adtechAdConfig[B][F] = K[F]
         }
      }
   }
   if (adtechFLPDataExists(L)) {
      var A = adtechGetFLPData(L);
      var H = adtechAdConfig[L];
      for (var G = 0; G < H.length; G++) {
         var I = H[G];
         if (A[I[D]]) {
            I[M] = A[I[D]]
         }
      }
   }
}
if (typeof adtechIframeHashArray == "undefined") {
   adtechConfigureAdFLP()
};
adtechAdConfig.assetContainers.main.type = "noContent";
var adtechTargetWin = ((self != top) && ((typeof inDapIF != "undefined" && inDapIF) || (typeof inFIF != "undefined" && inFIF) || (typeof adtechIframeHashArray != "undefined")) && ((typeof adtechCanvasAdPreview == "undefined" || !adtechCanvasAdPreview))) ? top : self;
adtechTargetWin.com = adtechTargetWin.com || {};
adtechTargetWin.com.adtech = adtechTargetWin.com.adtech || {};
adtechTargetWin.com.adtech.koduFTBanlb = function () {
   this.anchorDivId = "koduMpu_" + Math.random().toString().split(".")[1];
   if (typeof jQuery == "undefined") {
      document.write('<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"><\/script>');
      document.write('<script type="text/javascript" src="http://cs.kodudigital.com/ft/adserve/js/jquery.transit.min.js"><\/script>')
   } else {
      if (typeof $("body").transition == "undefined") {
         document.write('<script type="text/javascript" src="http://cs.kodudigital.com/ft/adserve/js/jquery.transit.min.js"><\/script>')
      }
   }
   if (typeof initVideo == "undefined") {
      document.write('<script type="text/javascript" src="http://cs.kodudigital.com/kodu-video-player/js/kodu-ft-video.js"><\/script>')
   }
   document.write('<div id="' + this.anchorDivId + '" style="position:relative;width:728px;height:90px;border:none;background: #ffffff"/>')
};
var koduFTBanlb = adtechTargetWin.com.adtech.koduFTBanlb;
koduFTBanlb.prototype = {
   init: function (A) {
      this.advert = A;
      this.eventBus = A.eventBus;
      this.utils = adtechTargetWin.com.adtech.Utils_1_13_4;
      this.globalEventBus = adtechTargetWin.adtechAdManager_1_13_4.globalEventBus;
      this.targetDoc = adtechTargetWin.document;
      if (this.globalEventBus.DOMLoaded) {
         this.domLoadHandler()
      } else {
         this.globalEventBus.addEventListener("DOMLoad", this.utils.createClosure(this, this.domLoadHandler))
      }
   },
   domLoadHandler: function (V) {
      if (typeof jQuery == "undefined") {
         alert("jquery not loaded")
      }
      if (typeof $("body").transition == "undefined") {
         alert("transit not loaded")
      }
      if (typeof initVideo == "undefined") {
         alert("kodu video not loaded")
      }
      var G = this.advert;
      var Y = '<a target="_blank" href="#" id="expand"><img src="' + G.getFileUrl("noble-01.jpg") + '" style="position: absolute; top: 0; left: 0;opacity:1;"><img src="' + G.getFileUrl("noble-02.jpg") + '" style="position: absolute; top: 0; left: 0;opacity:0;"><img src="' + G.getFileUrl("noble-03.jpg") + '" style="position: absolute; top: 0; left: 0;opacity:0;"><img src="' + G.getFileUrl("noble-04.jpg") + '" style="position: absolute; top: 0; left: 0;opacity:0;"><img src="' + G.getFileUrl("noble-05.jpg") + '" style="position: absolute; top: 0; left: 0;opacity:0;"></a>';
      var E = "#" + this.anchorDivId;
      var R;
      var L;
      var A;
      var D;
      var Q;
      var B;
      var P = false;
      var U = 0;
      var C = false;
      var H = 0;
      var F = 0;
      var J = 180;
      var O = 0;
      var I;
      var T;
      R = 3;
      L = 1;
      A = 5000;
      D = false;
      T = 0;
      $("#" + this.anchorDivId).css({
         background: "url(" + G.getFileUrl("noble-bg.jpg") + ")"
      });
      $(E).html(Y);
      $("body").off("click touch", E + " #expand");
      $("body").on("click touch", E + " #expand", function (a) {
         a.preventDefault();
         G.reportEvent("Expand ad");
         N()
      });
      $("body").off("click touchstart", "#overlay-close");
      $("body").on("click touchstart", "#overlay-close", function (a) {
         a.preventDefault();
         G.reportEvent("Close ad");
         W()
      });
      $("body").off("touchstart", "#expand-overlay");
      $("body").on("touchstart", "#expand-overlay", function (a) {
         if (a.originalEvent.touches == undefined) {
            var b = a
         } else {
            var b = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]
         }
         H = b.pageX;
         F = b.pageY
      });
      $("body").off("touchmove", "#expand-overlay");
      $("body").on("touchmove", "#expand-overlay", function (c) {
         if (c.originalEvent.touches == undefined) {
            var g = c
         } else {
            var g = c.originalEvent.touches[0] || c.originalEvent.changedTouches[0]
         }
         c.preventDefault();
         var f = $(this).offset();
         var a = g.pageX - f.left;
         var d = g.pageY - f.top;
         if (a < $(this).width() && a > 0) {
            if (d < $(this).height() && d > 0) {
               var b = g.pageX - H;
               if (b < -J) {
                  M()
               } else {
                  if (b > J) {
                     S()
                  }
               }
            }
         }
      });
      $("body").off("touchstart", "#expand-right-arrow");
      $("body").on("touchstart", "#expand-right-arrow", M);
      $("body").off("touchstart", "#expand-left-arrow");
      $("body").on("touchstart", "#expand-left-arrow", S);
      $(window).bind("hashchange", function () {
         W()
      });
      window.clearInterval(Q);
      Q = window.setInterval(function () {
         X()
      }, A);
      $(E + " #expand").css({
         display: "block",
         opacity: "0"
      });
      $(E + " #expand").transition({
         opacity: "1"
      });

      function Z(a) {
         $(E + " img").transition({
            opacity: "0",
            duration: "800ms"
         });
         $(E + " img:nth-child(" + a + ")").transition({
            opacity: "1",
            duration: "600ms"
         }, function () {
            L = a
         })
      }
      function X() {
         var a = L + 1;
         if (a > R) {
            a = 1
         }
         Z(a)
      }
      function N() {
         T = 0;
         var a = '<div id="expand-content" style="width:736px;height:652px;background: rgba(200,200,200,1);color: #ffffff;position:relative;z-index:3500;border-radius: 2px; overflow:hidden;"><a href="#" id="overlay-close" style="position: absolute; right:8px; top:8px;padding:8px 19px;border: solid 1px #AAAAAA;border-radius: 5px;color: #AAAAAA;text-decoration: none;background: transparent;z-index:3505">x</a>';
         a += '<div id="expand-full" style="width:736px; height:652px; position: absolute;top: 0; left: 0;z-index:3501:border-radius: 2px;overflow:hidden"><ul><li style="width:736px; height:652px;position: absolute;top: 0;left: 0; background:url(' + G.getFileUrl("noble-expand-full-01.jpg") + ');border-radius: 2px;"><a href="http://www.kodudigital.com" target="_blank"><img src="' + G.getFileUrl("hit.png") + '" style="position: absolute; bottom: 40px; right: 50px; width: 200px; height: 42px;"></a></li><li style="width:736px; height:652px;position: absolute;top: 0;left: 0; background:url(' + G.getFileUrl("noble-expand-full-02.jpg") + ');border-radius: 2px;"><a href="http://www.kodudigital.com" target="_blank"><img src="' + G.getFileUrl("hit.png") + '" style="position: absolute; bottom: 40px; right: 50px; width: 200px; height: 42px;"></a></li><li style="width:736px; height:652px;position: absolute;top: 0;left: 0; background:url(' + G.getFileUrl("noble-expand-full-03.jpg") + ');border-radius: 2px;"><a href="http://www.kodudigital.com" target="_blank"><img src="' + G.getFileUrl("hit.png") + '" style="position: absolute; bottom: 40px; right: 50px; width: 210px; height: 42px;"></a></li><ul><img src="' + G.getFileUrl("hit.png") + '" id="expand-left-arrow" style="position: absolute; top: 285px; left: 30px;width: 42px;height: 86px;z-index:3504"><img src="' + G.getFileUrl("hit.png") + '" id="expand-right-arrow" style="position: absolute; top: 285px; right: 30px;width: 42px;height: 86px;z-index:3504"></div>';
         a += "</div>";
         $('<div style="width:1024px;height:1024px; background-color:rgba(0,0,0,0.7); opacity:0;position:absolute;top:0;left:0;z-index : 3499;"></div>').attr({
            id: "expand-overlay"
         }).appendTo("body");
         $("#expand-overlay").append(a);
         K();
         $("#expand-content").css({
            left: window.innerWidth / 2 - 736 / 2,
            top: window.innerHeight / 2 - 652 / 2,
            position: "relative"
         });
         $("#expand-overlay").transition({
            opacity: "1",
            duration: "500ms",
            easing: "in-out"
         });
         $(window).bind("orientationchange", function () {
            $(".kodu-video-overlay").css({
               opacity: "0"
            });
            $("#expand-content").stop(true).transition({
               left: window.innerWidth / 2 - 736 / 2,
               top: window.innerHeight / 2 - 652 / 2,
               duration: "500ms"
            }, 100, function () {
               var b = $("#kodu-video").offset();
               $(".kodu-video-overlay").css(b);
               $(".kodu-video-overlay").transition({
                  opacity: "1",
                  duration: "250ms"
               })
            });
            if (window.innerWidth > window.innerHeight) {
               window.scrollTo(0, 1)
            } else {
               window.scrollTo(-100, 1)
            }
         })
      }
      function W() {
         $(".kodu-video-overlay").css({
            display: "none"
         });
         $("#expand-overlay").transition({
            opacity: "0",
            duration: "500ms"
         }, function () {
            $("#expand-overlay").remove();
            $(window).unbind("orientationchange")
         })
      }
      function K() {
         $("#expand-full li:not(:eq(" + T + "))").css({
            display: "none",
            opacity: "0",
            "z-index": "3503"
         });
         $("#expand-full li:eq(" + T + ")").css({
            display: "block",
            opacity: "1",
            "z-index": "3502"
         })
      }
      function S() {
         if (!P) {
            P = true;
            if (T - 1 >= 0) {
               T--
            } else {
               T = $("#expand-full li").length - 1
            }
            $("#expand-full li:eq(" + T + ")").css({
               display: "block"
            });
            $("#expand-full li:eq(" + T + ")").transition({
               opacity: "1",
               duration: "500ms",
               easing: "snap"
            }, function () {
               $("#expand-full li:not(:eq(" + T + "))").css({
                  display: "none",
                  opacity: "0",
                  "z-index": "3503"
               });
               $("#expand-full li:eq(" + T + ")").css({
                  display: "block",
                  opacity: "1",
                  "z-index": "3502"
               });
               P = false
            })
         }
      }
      function M() {
         if (!P) {
            P = true;
            if (T + 1 < $("#expand-full li").length) {
               T++
            } else {
               T = 0
            }
            $("#expand-full li:eq(" + T + ")").css({
               display: "block"
            });
            $("#expand-full li:eq(" + T + ")").transition({
               opacity: "1",
               duration: "500ms",
               easing: "snap"
            }, function () {
               $("#expand-full li:not(:eq(" + T + "))").css({
                  display: "none",
                  opacity: "0",
                  "z-index": "3503"
               });
               $("#expand-full li:eq(" + T + ")").css({
                  display: "block",
                  opacity: "1",
                  "z-index": "3502"
               });
               P = false
            })
         }
      }
   },
   pageResizeHandler: function (A) {},
   noInvoke: function () {
      ADTECH.click("Some clickthrough identifier");
      ADTECH.event("Expand ad");
      ADTECH.event("Close ad")
   }
};
adtechTargetWin.adtechCallbackInstances = adtechTargetWin.adtechCallbackInstances || [];
var adtechIdx = adtechTargetWin.adtechCallbackInstances.length;
adtechTargetWin.adtechCallbackInstances[adtechIdx] = new koduFTBanlb();
adtechTargetWin.adtechAdCallback = adtechTargetWin.adtechAdCallback || {};
adtechTargetWin.adtechAdCallback[adtechAdConfig.adServerVars.uid] = adtechTargetWin.adtechCallbackInstances[adtechIdx];
if (!adtechAdConfig.initOverride) {
   if (typeof adtechAdManager_1_13_4 == "undefined") {
      var adtechRmLibBaseUrl = "http://aka-cdn-ns.adtech.de/rm/";
      if (adtechAdConfig.adServerVars.servingProto === "https") {
         adtechAdConfig.adServerVars.baseURL = adtechAdConfig.adServerVars.sslBaseURL;
         adtechRmLibBaseUrl = "https://aka-cdn.adtech.de/rm/"
      }
      var adtechLibSuffix = (adtechAdConfig.mraidCompatible) ? "MRAID" : "";
      var adtechRmLibUrl = adtechRmLibBaseUrl + "adtechRichMediaLib" + adtechLibSuffix + "_1_13_4.js";
      adtechAdConfig.rmLibUrl = adtechRmLibUrl;
      window.adtechAdQueue = window.adtechAdQueue || [];
      window.adtechAdQueue.push(adtechAdConfig);
      var adtechScr = "scr";
      document.write("<" + adtechScr + 'ipt type="text/javascript" src="' + adtechRmLibUrl + '"></' + adtechScr + "ipt>")
   } else {
      adtechAdManager_1_13_4.registerAd(adtechAdConfig)
   }
};
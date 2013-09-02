// NOTEs: TEMPORARILY THE FTCOMBASE AND PHOENIX ADS LIBRARIES DEPEND ON THIS FILE
// IF YOU MAKE BUG FIXES HERE, YOU NEED TO REBUILD THE FTCOMBASE AND PHOENIX AD
// LIBRARIES. THIS SHOULD END WHEN FALCON HAVE REDESIGNED THE THIRD PARTY WRAPPERS
// AND ARTICLE PAGES.
//     http://epcvs.osb.ft.com/twiki/bin/view/Projects/DartForPublishers#Legacy_Ads_Libraries_FTCOMBASE_a

/*members "-", "02", "05", "06", "07", "14", "15", "19", "20", "21","22","27",
 "97", AD_SERVERS, AdFormat, Advertising, CONST, ENV, FTQA, FT_U,
 KeyOrder, KeyOrderVideo, KeyOrderVideoExtra, KeyOrderVideoSync,
 Properties, SubsLevelReplaceLookup, VERSION, a, adName, adServerCountry,
 ad_server, addClassName, addDiagnostic, addNewAttributes,
 additionalAdTargetingParams, ads, adverts, alt, altText, appendChild,
 asset, audSciInitial, audSciMax, banlb, baseAdvert, beginNewPage,
 beginVideo, body, breakout, buildURL, buildURLForVideo,
 buildURLFromBaseAdvert, buildURLIst, call, callType, callback, charAt,
 checkAdServerCountry, checkAdState, checkSiteZone,
 checkSubmitLongestUrl, className, clearAllIntervals, clearAllTimeouts,
 clearBaseAdvert, clearTimer, clickURL, clientHeight, clientWidth, cn,
 collapse, collapsePositionIfNoAd, collapsed, complete, console,
 constructor, content, cookie, cookies, cor, createAdRequestFromVideoUrl,
 createElement, dcopt, debug, decodeAudSci, detectAdMode,
 detectDFPTargeting, detectERights, dfp_site, dfp_zone, diagnostics,
 display, div, doublet, duplicateEID, edt, eid, encodeAudSci,
 encodeBaseAdvertProperties, endVideo, env, erightsID, excludeFields,
 exclusions, expand, extend, extendBaseAdvert, extraAds, fetch,
 fieldRegex, fieldSubstr, floor, foreach, fromBase36, getAdContainer,
 getAdFormat, getAyscVars, getCookie, getDFPSite, getElementById,
 getElementsByTagName, getKeys, getLongestUrl, getNamedAdContainer, reload,
 getNormalAdverts, getVideoAdverts, getVideoSyncAdverts,
 userInteracting, userInteractionTimer, hasAdClass,
 hasCalledInitDFP, hasClassName, hasDiv, hasInterstitial, hasOwnProperty,
 height, hlfmpu, href, id, imageURL, indexOf, init, initDFP, initialHTML,
 injectUnclassifiedTrackCall, injectUrlTrackCall, innerHTML, inputUrl,
 insertAdIntoIFrame, insertAdRequest, insertBefore, insertNewAd, inserted,
 int, intervals, intro, isLegacyAPI, isSystemDefault, isUnclassified,
 join, leading_zero_key_names, length, lib, location, log, lv1, lv2,
 marginTop, match, minHeight, mktsdata, mpu, mpusky, name, newssubs,
 noImageClickContent, noTargetDiv, offsetHeight, opera, ord, parentNode,
 pos, postError, prepareAdVars, prepareBaseAdvert, prototype,
 proxy_div_prefixes, push, random, reg,
 regex_key_names, register, removeChild, removeClassName,
 remove_exes, remove_res_pvt, render, renderImage,
 rendered, replace, request, requestDFP, requestInsertedAds,
 requestNewssubs, requestUrl, requestVideoSync, requestsInterstitial,
 resetLibrary, response, rsiSegs, rsi_segs, runinterval, setAttribute,
 setDefaultSiteZone, setInitialAdState, shift,
 shouldSubmitToTrack, showCookies, showDiagnostics, slice, slv, sort,
 split, src, state, storeResponse, stripLeadingZeros,
 style, submitToTrack, substr_key_names, substring, sz, target, test,
 tile, timeIntervalTolerance, timeoutTolerance, timeouts, tlbxrib,
 toBase36, toLowerCase, toString, toUpperCase, trackUrl, type, unshift, urlMax,
 urlStem, urlThreshold, urlThresholdMax, useDFP, verticallyAligned,
 video, videoAdverts, watchAdPosition, wdesky, width, write, writeScript,
 cleanKeywords, getKeywordsParam, prepareKeywordsParam, url_location, kw,
 dfp_targeting, search, vidbut1, vidbut2, vidbut3, isComplete, isEmptyAd,
 isAdStateEmpty, marketingrib, lhn, tradcent, expandPositionIfAd,
 setZeroHeight, legacyAdCollapse, legacyAdFixup, shouldAdBeZeroHeight,
 padding, library, marginBottom, marginLeft, paddingLeft, border, alwaysHide,
 getAdInnerHTML, getAdContainers, legacyAdCalls, legacyFetchIsAllowed,
 legacyEnableFetch, clientWidth, legacyWatchAdPosition, legacyClearInterval,
 legacyStopInterval, legacyConWidth, suppressAudSci, AYSC, iterator, HTMLAds,
 corppop, isCorporateUser, timeOut, CorpPopTimeout, buildAdURL, getHTMLAd,
 injectionLegacyParentDiv, injectionParentDiv, HTMLAdData, FT_AM, minivid,
 uKeyOrder, uuid, ts, getTimestamp, getMonth, getDate, getHours, getMinutes,
 getSeconds, getFullYear, searchbox, getDFPTargeting, getReferrer, mapReferrerName, isArticle, referrer,
 exec,bht, EUQuovaCountryCodes, hashCookies, FT_Remember, auuid, behaviouralFlag, fts, isLoggedIn, addClass,
 removeClass, cookieConsentName, cookieConsentAcceptanceValue, get, getParam, each,
 pushDownFormats, divId, aminatedProperty, expansionSubtrahend,
 VAR, pushDownImg, getIP, DFPNetworkCode, animatedDivId, animatedProperty, DFPPremiumCopy,
 DFPPremiumCopyNetworkCode, DFPPremiumReadOnly, pushDownFullWidthAssetsHeights,
 pushDownExpandingAsset, getConsentValue, ad_network_code, cc, loc, html, pushDownExpand,
 pollAdHeightAndExpand, find, css, DFPPremiumReadOnlyNetworkCode, nodeName, encodeIP,
 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ., replaceValue, replaceRegex, DFPPremiumIPReplaceLookup, SocialReferrerLookup, socref,
 "facebook.com", "linkedin.com", "drudgereport.com", "t.co", getSocialReferrer, getDocReferrer, socialReferrer, encode,
 enc, Utf8, parse, stringify, _ads, utils, isObject, isArray, isFunction, isString, getCookieParam, pop,
 splice, getUUIDFromString, artifactVersion, buildLifeId, buildLifeDate, buildLifeVersion, gitRev,reloadWindow,
 refresh, refreshTime, Refresh, startRefreshTimer, cleanDfpTargeting  */

/* The Falcon Ads API follows from here. */
//Setup the FT namespace if it doesn't already exist
//FT = FT || {};

FT.Advertising = function () {
   this.baseAdvert = {};

   // Set up DFP specific constants
   this.CONST = {};

   // Regex to match valid DFP ad server two letter codes at this time.
   this.CONST.AD_SERVERS = /^((a[lutre])|(b[rsgaye])|(c[nohazl])|(d[ke])|(e[gse])|(f[ri])|(g[rt])|(h[ukr])|(i[stlne])|(j[p])|(k[wr])|(l[uvt])|(m[yxaekd])|(n[olz])|(p[lthk])|(r[suo])|(s[gekai])|(t[rhw])|(u[kas])|(v[e])|(z[a]))$/i;
   //DFP Network code
   this.CONST.DFPNetworkCode = '/N5887';
   // Map ad position names to ad properties.
   // sz= allowable ad sizes in this position.
   // dcopt= doubleclick options. ist means interstitial ad - only one allowed per page
   // You can omit subsequently numbered positions if they match the formatting of the unnumbered ad position.
   this.CONST.AdFormat = {
      'intro': { 'sz': '1x1' },
      'banlb': { 'sz': '468x60,728x90,970x90', 'dcopt': 'ist' },
      'newssubs': { 'sz': '239x90' },
      'tlbxrib': { 'sz': '336x60' },
      'marketingrib': { 'sz': '336x60' },
      'lhn': { 'sz': '136x64' },
      'tradcent': { 'sz': '336x260' },
      'mktsdata': { 'sz': '88x31,75x25' }, // also matches mktsdata2 and mktsdata3
      'hlfmpu': { 'sz': '300x600,336x850,300x250,336x280,300x1050' },
      'doublet': { 'sz': '342x200' },
      'refresh': { 'sz': '1x1' },
      'mpu': { 'sz': '300x250,336x280' },
      'mpusky': { 'sz': '300x250,336x280,160x60' },
      'wdesky': { 'sz': '160x600' },
      'video': { 'sz': '592x333,400x225' },
      'minivid': { 'sz': '400x225' },
      'vidbut1': { 'sz': '120x29' }, // each vidbut is a different size so needs
      'vidbut2': { 'sz': '100x50' }, // its own entry in the table.
      'vidbut3': { 'sz': '200x50' },
      'searchbox': { 'sz': '200x28'},
      '-': {}
   };

   this.CONST.KeyOrder = ['sz', 'dcopt', '07', 'a', '06', '05', '27', 'eid', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '19', '20', '21', 'slv', '02', '14', 'cn', '01', 'kw', 'loc', 'uuid', 'auuid', 'ts', 'cc', 'pos', 'bht', 'fts', 'socref', 'tile', 'ord'];
   this.CONST.KeyOrderVideo = ['sz', 'dcopt', 'pos'];
   this.CONST.KeyOrderVideoExtra = ['dcopt', 'brand', 'section', 'playlistid', 'playerid', '07', 'a', '06', 'slv', 'eid', '05', '19', '21', '27', '20', '02', '14', 'cn', '01'];
   this.CONST.KeyOrderVideoSync = ['sz', 'dcopt'];
   this.CONST.uKeyOrder = ['eid', 'ip', 'uuid', 'auuid', 'ts'];
   this.CONST.cleanDfpTargeting = [ [/(&#039;)|(&#034;)|(&#060;)|(&#062;)+/g,''],
                                    [/(%27)|(%22)+/g,''], //hex encoding special characters occurs for referring urls in some browsers (e.g. Firefox)
                                    [/(&#038;)/,'&'],
                                    [/(^;)|(^x+$)|(;$)|([\[\]\{\}\(\)\*\+\!\.\\\^\|\,~#'"<>]+)/g, ''], //this regex explained http://regex101.com/r/yY5mH2
                                    [/;;+/g, ';' ]
                                    ];


   // filter constants for AYSC cookies
   this.CONST.exclusions = ['key=03', 'key=04', 'key=08', 'key=09', 'key=10', 'key=11', 'key=12', 'key=13', 'key=15', 'key=16', 'key=17', 'key=18', 'key=22', 'key=23', 'key=24', 'key=25', 'key=26', 'key=28', 'key=29', 'key=30'];
   this.CONST.leading_zero_key_names = [ '19', '21' ];
   this.CONST.remove_exes = {'02': 1, '05': 1, '06': 1, '07': 1, '19': 1, '20': 1, '21': 1};
   this.CONST.remove_res_pvt = {'14': 1, 'cn': 1, '27': 1};
   this.CONST.regex_key_names = ['22', '97'];

   this.CONST.SubsLevelReplaceLookup = {
      'edt': { '22': /^edit$/, '97': /^.*/ },
      'int': { '22': /^Ftemp$/, '97': /^.*/ },
      'cor': { '22': /^[N]*[PL][01][PL]*[1]*[PL][12][A-Za-z][A-Za-z]/, '97': /^c$/ },
      'lv1': { '22': /^[PL]*[0]*[PL]1[A-Za-z][A-Za-z]/, '97': /^[^c]$/ },
      'lv2': { '22': /^[N]*[PL]*[0]*[PL]2[A-Za-z][A-Za-z]/, '97': /^[^c]$/ },
      'reg': { '22': /^[PL]0[A-Za-z][A-Za-z]/, '97': /^[^c]$/ }
   };
   // format for creating a new key name and value from an old one using substring is: 'old key=start substring=no characters in substring=new key'
   this.CONST.substr_key_names = ['24=0=3=cn'];
   // proxy names for ad divs
   this.CONST.proxy_div_prefixes = ['', 'ad-placeholder-', 'ad-container-'];

   this.CONST.audSciMax = 35;
   this.CONST.audSciInitial = 35;
   // maximum ad url length allowable in the DFP Premium as of Dec 2012
   this.CONST.urlMax = 2083;

   // required for checkSubmitLongestUrl function
   this.CONST.urlThresholdMax = 2000000;
   this.CONST.urlThreshold = 10000;
   this.CONST.trackUrl = "http://track.ft.com/track/dfp_error.gif";
   this.CONST.cookieConsentName = 'cookieconsent';
   this.CONST.cookieConsentAcceptanceValue = 'accepted';
   this.CONST.pushDownFormats = {'banlb': {'pos': 'banlb', 'width': 970, 'height': 90, 'animatedDivId': 'header', 'animatedProperty': 'paddingTop', 'expansionSubtrahend': 78 }};

   //DFP migration environments
   this.CONST.DFPPremiumCopy = "gdfp-testing-only.g.doubleclick.net";
   this.CONST.DFPPremiumCopyNetworkCode = '/N282450';
   this.CONST.DFPPremiumReadOnly = this.CONST.DFPPremiumCopy;
   this.CONST.DFPPremiumReadOnlyNetworkCode = this.CONST.DFPNetworkCode;

   // DFPP encoding for IP
   this.CONST.DFPPremiumIPReplaceLookup = {
      '0': {'replaceRegex': /0/g, 'replaceValue': 'a'},
      '1': {'replaceRegex': /1/g, 'replaceValue': 'b'},
      '2': {'replaceRegex': /2/g, 'replaceValue': 'c'},
      '3': {'replaceRegex': /3/g, 'replaceValue': 'd'},
      '4': {'replaceRegex': /4/g, 'replaceValue': 'e'},
      '5': {'replaceRegex': /5/g, 'replaceValue': 'f'},
      '6': {'replaceRegex': /6/g, 'replaceValue': 'g'},
      '7': {'replaceRegex': /7/g, 'replaceValue': 'h'},
      '8': {'replaceRegex': /8/g, 'replaceValue': 'i'},
      '9': {'replaceRegex': /9/g, 'replaceValue': 'j'},
      '.': {'replaceRegex': /\./g, 'replaceValue': 'z'}
   };

   //variables we need to store between function calls
   this.VAR = {};
   this.VAR.pushDownFullWidthAssetsHeights = {};
   this.VAR.pushDownExpandingAsset = null;

   this.CONST.SocialReferrerLookup = {
      't.co': 'twi',
      'facebook.com': 'fac',
      'linkedin.com': 'lin',
      'drudgereport.com': 'dru'
   };

};

FT.ads = new FT.Advertising();

if (FT.HTMLAds) {
   FT.corppop = new FT.HTMLAds();
}

/*  Override the FT.ads.request() call so we can detect if we are on a Falcon
 page which does not use the legacy API. The first call on a page is either
 new Advert() [legacy API] or FT.ads.request() [Falcon API]*/

// TESTED in expand-collapse-test.html
// This can be replaced by requestDFP() once the legacy AD API is removed. (BSAC 09/2010)
FT.Advertising.prototype.request = function (pos) {
   // If this ever gets called, we know we are not using the Legacy API
   FT.env.isLegacyAPI = false;
   clientAds.log("FT.Advertising.prototype.request(" + pos + ")");
   this.initDFP();
   this.requestDFP(pos);
};

// Return a list of ad positions which are video pre-roll ads
// TESTED in video_test.html
FT.Advertising.prototype.getVideoAdverts = function () {
   var Ads = [];
   this.foreach(this.adverts, function (pos) {
      if ((this.adverts[pos].callType === 'video') || (this.adverts[pos].callType === 'minivid')) {
         Ads.push(pos);
      }
   });
   return Ads;
};

// Return a list of ad positions which are synchronized to the video ad
// TESTED in video_test.html
FT.Advertising.prototype.getVideoSyncAdverts = function () {
   var Ads = [];
   this.foreach(this.adverts, function (pos) {
      if (this.adverts[pos].callType === 'videoSync') {
         Ads.push(pos);
      }
   });
   return Ads;
};

// Return a list of ad positions which are normal ads (ie non-video)
// TESTED in video_test.html
FT.Advertising.prototype.getNormalAdverts = function () {
   var Ads = [];
   this.foreach(this.adverts, function (pos) {
      if (this.adverts[pos].callType === 'normal') {
         Ads.push(pos);
      }
   });
   return Ads;
};

// TESTED in video_test.html
FT.Advertising.prototype.register = function (pos) {
   clientAds.log("FT.Advertising.prototype.register(" + pos + ")");
   if (!FT.ads.hasCalledInitDFP) {
      FT.env.isLegacyAPI = false;
      this.initDFP();
   }
   this.adverts[pos] = this.adverts[pos] || {};
   this.adverts[pos].callType = 'videoSync';
   if (!this.videoAdverts) {
      this.videoAdverts = [];
   }
   this.videoAdverts.push(pos);
};

// TESTED in video_test.html
FT.Advertising.prototype.beginVideo = function () {
   this.beginNewPage();
};

// DFP specific ad request method
// Request the named ad, by document.writing a script tag (blocks page rendering)
// This can be renamed request() once the Legacy Ad API is removed. (BSAC 09/2010)
// TESTED in expand-collapse-test.html

FT.Advertising.prototype.requestDFP = function (pos) {
   var URL = '',
      cookieConsentName = FT.ads.CONST.cookieConsentName,
      cookieConsentAcceptanceValue = FT.ads.CONST.cookieConsentAcceptanceValue,
      AYSC97 = FT._ads.utils.getCookieParam("AYSC", "97") || "",
      AYSC98 = FT._ads.utils.getCookieParam("AYSC", "98") || "",
      AYSC22 = FT._ads.utils.getCookieParam("AYSC", "22") || "",
      AYSC27 = FT._ads.utils.getCookieParam("AYSC", "27") || "",
      location,
      AYSC_OK,
      TIME_OK,
      injectionPoint,
      inj,
      self;
   if (pos === 'corppop') {
      location = document.location.href;
      if (!location.match(/Authorised=false/) && (FT._ads.utils.cookie(cookieConsentName) === cookieConsentAcceptanceValue)) {
         if (!FT._ads.utils.isString(FT._ads.utils.cookie("AYSC"))) {
            AYSC_OK = 0;
         } else {
            AYSC_OK = FT.corppop.isCorporateUser(AYSC97, AYSC98, AYSC22, AYSC27, FT.ads.CONST.SubsLevelReplaceLookup);
         }
         TIME_OK = FT.corppop.timeOut(FT._ads.utils.cookie("FT_AM"), FT._ads.utils.cookie("CorpPopTimeout"));
         injectionPoint = (FT.env.isLegacyAPI) ? FT.corppop.HTMLAdData.injectionLegacyParentDiv : FT.corppop.HTMLAdData.injectionParentDiv;
         inj = document.getElementById(injectionPoint);

         //we only call the corppop ad based on the AYSC field _22 and _27 values,
         //if the FT_AM (+/- CorppopTimeout) cookie has expired,
         //and a banlb div is present on the page
         if ((AYSC_OK) && (TIME_OK) && (inj !== null)) {
            URL = FT.corppop.buildAdURL(AYSC98, AYSC22, AYSC27, FT.ads.CONST.SubsLevelReplaceLookup);
            FT.corppop.getHTMLAd(pos, inj, URL);
         }
      }
   } else {
      clientAds.log("FT.Advertising.requestDFP(" + pos + ")");
      this.setInitialAdState(pos);
      URL = this.buildURL(pos);
      if (URL) {
         self = this;
         FT._ads.utils.writeScript(URL);
         if (this.adverts[pos].state.alwaysHide) {
            this.collapse(pos);
         } else {
            clientAds.log("setting up anon_timeout(" + pos + ") " + this.timeoutTolerance);
            this.timeouts[pos] = setTimeout(function () {
               clientAds.log("called anon_timeout(" + pos + ")");
               self.collapsePositionIfNoAd(pos);
            }, this.timeoutTolerance);
         }
      }

   }

   this.addDiagnostic(pos, { "requestUrl": URL });
}; // requestDFP(pos)

// TESTED in dfp-advertising.html
FT.Advertising.prototype.foreach = function (obj, func) {
   var idx, value, prop, l;
   if (!obj || FT._ads.utils.isFunction(obj)) {
      return;
   }
   if (FT._ads.utils.isArray(obj)) {
      for (idx = 0, l = obj.length; idx < l; idx++) {
         value = FT._ads.utils.isString(obj) ? obj.charAt(idx) : obj[idx];
         if (func.call(this, value, idx) === false) {
            break;
         }
      }
   } else {
      for (prop in obj) {
         if (obj.hasOwnProperty(prop) && !FT._ads.utils.isFunction(obj[prop])) {
            if (func.call(this, prop, obj[prop]) === false) {
               break;
            }
         }
      }
   }
};

// Get ad format info for named ad position
// TESTED dfp-advertising.html
FT.Advertising.prototype.getAdFormat = function (pos) {
   var rFormat,
      posStem;
   if (this.CONST.AdFormat[pos]) {
      rFormat = this.CONST.AdFormat[pos];
   } else if (/\d+$/.test(pos)) {
      // numbered positions - if mpu2 isn't in the table, strip off the trailing digits and look for mpu
      posStem = pos.replace(/\d+$/, "");
      if (this.CONST.AdFormat[posStem]) {
         rFormat = this.CONST.AdFormat[posStem];
      }
   }

   return rFormat;
};

// TESTED in dfp-advertising.html
FT.Advertising.prototype.setInitialAdState = function (pos, callType) {
   callType = callType || 'normal';
   this.adverts[pos] = this.adverts[pos] || {};
   this.adverts[pos].callType = callType;
   this.adverts[pos].state = {
      'state': 'init',
      'hasDiv': false,
      'alwaysHide': false,
      'requestsInterstitial': false,
      'hasInterstitial': false,
      'isSystemDefault': false,
      'isEmptyAd': false,
      'initialHTML': ''
   };

   if (pos === 'refresh') {
      this.adverts[pos].state.alwaysHide = true;
   }
   var adHTML = this.getAdInnerHTML(pos);
   if (typeof adHTML !== 'undefined') {
      this.adverts[pos].state.hasDiv = true;
      this.adverts[pos].state.initialHTML = adHTML;
   }
};

// TESTED in dfp-advertising.html
// An ad is empty if it's the system default ad, the FT no ad filler and
// it doesn't have an interstitial ad riding in its position
FT.Advertising.prototype.isAdStateEmpty = function (state) {
   var empty = false;
   if (state.isSystemDefault || state.isEmptyAd) {
      if (!state.hasInterstitial) {
         empty = true;
      }
   }
   return empty;
};

// TESTED in dfp-advertising.html
// An ad should be zero height if it has an interstitial riding in it but
// no actual ad content (only system default or FT no ad filler)
FT.Advertising.prototype.shouldAdBeZeroHeight = function (state) {
   var beZero = false;
   if (state.isSystemDefault || state.isEmptyAd) {
      if (state.hasInterstitial) {
         beZero = true;
      }
   }
   return beZero;
};

// TESTED -- NOT
FT.Advertising.prototype.createAdRequestFromVideoUrl = function (pos, url) {
   var URL, requestURL;
   this.clearBaseAdvert();
   this.prepareBaseAdvert(pos);
   URL = this.buildURLFromBaseAdvert('videoSync');
   URL = URL.replace(/\?$/, '');
   requestURL = url.replace(/;pos=\w+/, ';pos=' + pos);
   requestURL = requestURL.replace(/^[^\s]+;sz=\d+x\d+(,\d+x\d+) {0,3}(;dcopt=ist)?/, URL);
   requestURL = requestURL.replace(/;tile=(\d{1,2})/, ';tile=' + this.baseAdvert.tile);
   return requestURL;
};

// TESTED -- NOT
FT.Advertising.prototype.insertAdIntoIFrame = function (pos, requestURL) {
   var el = this.getAdContainer(pos).div,
      iframeId;
   if (!el) {
      return undefined;
   }
   iframeId = pos + '_iframe';
   el.innerHTML = ['<iframe id="', iframeId, '"',
      ' width="', el.clientWidth, '"',
      ' height="', el.clientHeight, '"></iframe>'].join('');
   document.getElementById(iframeId).src = requestURL;
};

// TESTED in video_test.html
FT.Advertising.prototype.requestVideoSync = function (pos, url) {
   if (!this.getAdFormat(pos)) {
      this.addDiagnostic(pos, {
         'requestVideoSync': 'ad position not valid'
      });
      return undefined;
   }

   this.setInitialAdState(pos);
   var requestURL = this.createAdRequestFromVideoUrl(pos, url);
   this.adverts[pos].callType = 'videoSync';
   this.addDiagnostic(pos, {
      inputUrl: url,
      requestUrl: requestURL
   });

   this.insertAdIntoIFrame(pos, requestURL);

   return requestURL;
};

// TESTED in video_test.html
FT.Advertising.prototype.endVideo = function () {
   // due to same origin security policies this method is
   // stubbed and will not be used to collapse ads
   return;
};

// TESTED in dfp-advertising.html
FT.Advertising.prototype.checkAdState = function (pos) {
   clientAds.log("FT.Advertising.prototype.checkAdState(" + pos + ")");
   //TODO how are we getting here without having the .state defined???
   this.adverts[pos] = this.adverts[pos] || { 'state': {} };
   var rState = this.adverts[pos].state,
      adHTML = this.getAdInnerHTML(pos),
      rRegex;
   if (typeof adHTML !== 'undefined') {
      rState.hasDiv = true;
      rState.innerHTML = adHTML;
      if (rState.innerHTML !== rState.initialHTML) {
         rState.state = 'changed';
      }
      if (rState.state === 'changed') {
         if (/817-grey/.test(rState.innerHTML)) {
            rState.isSystemDefault = true;
         }
         if (/ft-no-ad-/.test(rState.innerHTML)) {
            rState.isEmptyAd = true;
         }
         rRegex = new RegExp("<!--\\s*Begin Interstitial Ad\\s*-->");
         if (rRegex.test(rState.innerHTML)) {
            rState.hasInterstitial = true;
         }
      }
   }
   clientAds.log("FT.Advertising.prototype.checkAdState(" + pos + ") " + [rState.state, "hasDiv: " + rState.hasDiv, "isSystemDefault: " + rState.isSystemDefault, "isEmptyAd: " + rState.isEmptyAd, "requestsInterstitial: " + rState.requestsInterstitial, "hasInterstitial: " + rState.hasInterstitial].join(", "));
};

// TESTED in expand-collapse-test.html
FT.Advertising.prototype.collapsePositionIfNoAd = function (pos) {
   clientAds.log("FT.Advertising.prototype.collapsePositionIfNoAd(" + pos + ")");
   this.checkAdState(pos);
   var rState = this.adverts[pos].state;
   // System Default ad or the FT no ad both indicate there is no ad present
   if (this.shouldAdBeZeroHeight(rState)) {
      this.collapse(pos, true);
   } else if (this.isAdStateEmpty(rState)) {
      this.collapse(pos);
   } else if (rState.state === 'init') {
      this.collapse(pos);
      this.watchAdPosition(pos);
   } else {
      this.expand(pos);
   }
};

// TESTED in expand-collapse-test.html
FT.Advertising.prototype.expandPositionIfAd = function (pos) {
   clientAds.log("FT.Advertising.prototype.expandPositionIfAd(" + pos + ")");
   this.checkAdState(pos);
   var rState = this.adverts[pos].state;
   // Must expand if there is an interstitial or the ad slot is not 'empty'
   if (!this.isAdStateEmpty(rState)) {
      clientAds.log("clearing anon_interval(" + pos + ") - is interstitial or not system default");
      this.expand(pos);
      clearInterval(this.intervals[pos]);
   }
};

// TESTED in expand-collapse-test.html
FT.Advertising.prototype.watchAdPosition = function (adPos) {
   clientAds.log("FT.Advertising.prototype.watchAdPosition(" + adPos + ")");
   // A Closure below so protect the vars we had passed in.
   var self = this,
      pos = adPos;

   clientAds.log("setting up anon_interval(" + pos + ") " + self.timeIntervalTolerance);
   self.intervals[pos] = setInterval(function () {
      clientAds.log("called anon_interval(" + pos + ")");
      self.expandPositionIfAd(pos);
   }, self.timeIntervalTolerance);
};

// TESTED in expand-collapse-test.html
FT.Advertising.prototype.clearAllTimeouts = function () {
   clientAds.log("FT.Advertising.prototype.clearAllTimeouts()");
   this.foreach(this.timeouts, function (pos, id) {
      clearTimeout(id);
   });
};

// TESTED in expand-collapse-test.html
FT.Advertising.prototype.clearAllIntervals = function () {
   clientAds.log("FT.Advertising.prototype.clearAllIntervals()");
   this.foreach(this.intervals, function (pos, id) {
      clearInterval(id);
   });
};

FT.Advertising.prototype.clearTimer = function () {
   clientAds.log("FT.Advertising.prototype.clearTimer()");
   // stubbed out for the moment.
};

// Mocked method to prevent homepage from breaking.
// TESTED in ad-on-a-page.html
FT.Advertising.prototype.complete = function () {
   clientAds.log("FT.ads.complete() " + this.isComplete);
   if (!this.isComplete) {
      // Note, jsLint might say that this is better written as this.adverts.refresh
      // but don't believe it. Writing it that way will cause a javascript error
      // in IE in preditor when the refresh position is not present on a particular page.
      // reply: ok, am not going to change it for fear of breaking something but have you tried doing typeof this.adverts.refresh !== 'undefined' ? - cj
      if (this.adverts.refresh) {
         this.legacyAdCollapse('refresh', false);
      }
      this.injectUnclassifiedTrackCall();
      this.injectUrlTrackCall();
   }
   this.isComplete = true;
};

// Ad response callback
// This method is only called when the adserver returns a json response
FT.Advertising.prototype.callback = function (rResponse) {
   if (!rResponse || !FT._ads.utils.isObject(rResponse) || !rResponse.name) {
      clientAds.log("FT.Advertising.callback(" + rResponse + ") - improper");
      return false;
   }
   clientAds.log("FT.Advertising.callback(" + [rResponse.name, rResponse.type, rResponse.adName].join(", ") + ")");

   // Update status of ad position.
   this.checkAdState(rResponse.name);

   // Store the response obj for diagnostics
   this.storeResponse(rResponse);
   // Process instructions
   if (rResponse.addNewAttributes) {
      this.extendBaseAdvert(rResponse.addNewAttributes);
   }
   if (rResponse.insertAdRequest) {
      this.insertNewAd(rResponse.insertAdRequest);
   }

   var radix; // to satisfy jslint
   if (parseInt(FT.Refresh.refreshTime, radix) > 0) {
      FT.Refresh.startRefreshTimer(FT.Refresh.refreshTime);
   }

   // Handle ad types
   if (rResponse.type) {
      switch (rResponse.type) {
         case "empty":
            if (!this.adverts[rResponse.name].state.requestsInterstitial) {
               // An ad position which requests an intersitial must be monitored for
               // a while longer to see if the interstitial comes along.
               clientAds.log("anon_timeout(" + rResponse.name + ") is being cancelled");
               clearTimeout(this.timeouts[rResponse.name]);
            }
            this.collapse(rResponse.name);
            this.addDiagnostic(rResponse.name, {
               "collapsed": "emptyAd"
            });
            break;
         case "imageclick":
            // I Don't think this type of ad is booked anywhere any more. this
            // can perhaps be removed. (BSAC 09/2010)
            this.renderImage(rResponse);
            break;
         default:
            // Ad content is outside of response and is in page
            break;
      }
   }
}; // callback(rResponse)

// Store response obj
FT.Advertising.prototype.storeResponse = function (rResponse) {
   clientAds.log("FT.Advertising.storeResponse(" + [rResponse.name, rResponse.type, rResponse.adName].join(", ") + ")");
   if (!FT._ads.utils.isObject(rResponse)) {
      return false;
   }
   if (!FT._ads.utils.isObject(this.adverts[rResponse.name])) {
      this.adverts[rResponse.name] = {};
   }
   this.adverts[rResponse.name].response = rResponse;
}; // storeResponse()

// Return all the properties of an object as an array
// TODO This is a candidate for the Lib.js
// TESTED in dfp-advertising.html
FT.Advertising.prototype.getKeys = function (rResponse) {
   var Keys = [];
   if (FT._ads.utils.isObject(rResponse)) {
      this.foreach(rResponse, function (prop) {
         Keys.push(prop);
      });
   }
   return Keys.sort();
}; // getKeys(rResponse)

// Check a space separated class name for the class named
// TESTED in dfp-advertising.html
FT.Advertising.prototype.hasClassName = function (fullClass, className) {
   var matcher, Classes, idx;
   matcher = className.constructor === RegExp ? className : new RegExp('^' + className + '$');
   Classes = fullClass.split(' ');
   for (idx = 0; idx < Classes.length; ++idx) {
      if (Classes[idx].match(matcher) !== null) {
         return true;
      }
   }
   return false;
};

// Adds diagnostic info to stored response
FT.Advertising.prototype.addDiagnostic = function (pos, rDiagObj) {
   if (!pos) {
      pos = '_anonymous';
   }
   if (!FT._ads.utils.isString(pos) || !FT._ads.utils.isObject(rDiagObj)) {
      return false;
   }
   clientAds.log("FT.Advertising.addDiagnostic(" + pos + ", " + this.getKeys(rDiagObj).join(", ") + ")");
   if (!this.adverts[pos]) {
      this.adverts[pos] = {
         "diagnostics": {}
      };
   }
   this.adverts[pos].diagnostics = FT._ads.utils.extend({}, this.adverts[pos].diagnostics, rDiagObj);
}; // addDiagnostic(pos, rDiagObj)

// Extend base advert with nodes and values from advert json
FT.Advertising.prototype.extendBaseAdvert = function (rResponse) {
   clientAds.log("FT.Advertising.extendBaseAdvert(" + rResponse + ")");
   this.baseAdvert = FT._ads.utils.extend({}, this.baseAdvert, rResponse);
}; // extendBaseAdvert(rResponse)

// Insert a new advert in the queue
FT.Advertising.prototype.insertNewAd = function (pos) {
   clientAds.log("FT.Advertising.insertNewAd(" + pos + ")");
   this.extraAds.unshift(pos);
   this.addDiagnostic(pos, {
      "inserted": true
   });
}; // insertNewAd(pos)

// TESTED dfp-advertising.html
FT.Advertising.prototype.setDefaultSiteZone = function () {
   FT.env.dfp_site = "ftcom.5887.unclassified";
   FT.env.dfp_zone = "unclassified";
}; // setDefaultSiteZone()

// TESTED dfp-advertising.html
FT.Advertising.prototype.isUnclassified = function () {
   var result = false;
   if ((FT.env.dfp_site === "ftcom.5887.unclassified" || FT.env.dfp_site === "test.5887.unclassified") && FT.env.dfp_zone === "unclassified") {
      result = true;
   }
   return result;
}; // setDefaultSiteZone()

// Check if the ad position and site/zone are good.
// Returns
//     'ok'         if all is well
//     'invalid'  if ad position is invalid and so cannot make an ad call
//     'default'  if site/zone were invalid and have been set to a usable default
// TESTED dfp-advertising.html
FT.Advertising.prototype.checkSiteZone = function (pos) {
   var ok = 'default',
      fix = true,
      reason_why,
      rFormat = this.getAdFormat(pos),
      site = this.getDFPSite();
   if (!rFormat) {
      reason_why = "invalid ad slot name";
      fix = false;
      ok = 'invalid';
   } else if (!this.detectDFPTargeting()) {
      // If we don't have good DFP targeting variables make a note of it and use a default
      reason_why = "dfp_site/zone are invalid";
   } else if (site.length > 31) {
      reason_why = "DFP site name too long: " + site;
   } else if (FT.env.dfp_zone.length > 32) {
      reason_why = "DFP zone name too long: " + FT.env.dfp_zone;
   } else if (site.match(/^X+$/i)) {
      reason_why = "DFP site name is default methode metadata";
   } else if (FT.env.dfp_zone.match(/^X+$/i)) {
      reason_why = "DFP zone name is default methode metadata";
   } else if (!site.match(/^\w+\.5887\.[\-\w]+$/)) {
      reason_why = "DFP site name is not the FT network: " + site;
   } else {
      ok = 'ok';
      fix = false;
   }
   if (ok !== 'ok') {
      this.addDiagnostic(pos, { "checkSiteZone": reason_why });
   }
   if (fix) {
      // No valid DFP targeting, use the unclassified site/zone so we can detect this in Ad reports
      this.setDefaultSiteZone();
   }

   return ok;
};

FT.Advertising.prototype.clearBaseAdvert = function () {
   var idx,
      keyname;
   //make sure the base ad doesnt inherit values from previous ads
   for (idx = 0; idx < this.CONST.KeyOrder.length; idx++) {
      keyname = this.CONST.KeyOrder[idx];
      if ((keyname !== 'tile') && (keyname !== 'ord')) {
         delete this.baseAdvert[keyname];
      }
   }
};

FT.Advertising.prototype.prepareAdVars = function (AllVars) {
   //now we filter the AYSC values prior to adding them to the baseAdvert
   //define fields where we need to strip leading zeros - should be in config
   AllVars = this.stripLeadingZeros(this.CONST.leading_zero_key_names, AllVars);

   //now assign new corporate codes based on certain regex of old code values
   AllVars = this.fieldRegex(this.CONST.regex_key_names, AllVars);

   //now take a substring of an input value - used for creating new continent codes - put in config?
   AllVars = this.fieldSubstr(this.CONST.substr_key_names, AllVars);

   //now add any erights value from the FT_U cookie
   AllVars = this.detectERights(AllVars);

   return AllVars;
};

FT.Advertising.prototype.erightsID = function () {
   var eid;
   if (FT._ads.utils.cookie("FT_U")) {
      eid = FT._ads.utils.getCookieParam("FT_U", "EID").replace(/^0*/, "");
   } else if (FT._ads.utils.cookie("FT_Remember")) {
      eid = FT._ads.utils.cookie("FT_Remember").split(':'); // EID in the FT_Remember cookie does not have a param name
      if (eid && eid.length > 0) {
         eid = eid[0];
      }
   }
   return eid;
};

FT.Advertising.prototype.getIP = function () {
   var ip, tmp, ftUserTrackVal = FT._ads.utils.cookie('FTUserTrack'), ipTemp;

   // sample FTUserTrackValue = 203.190.72.182.1344916650137365
   if (ftUserTrackVal) {
      ip = ftUserTrackVal;
      tmp = ftUserTrackVal.match(/^\w{1,3}\.\w{1,3}\.\w{1,3}\.\w{1,3}\.\w+$/);
      if (tmp) {
         tmp = tmp[0];
         ipTemp = tmp.match(/\w{1,3}/g);
         if (ipTemp) {
            ip = ipTemp[0] + "." + ipTemp[1] + "." + ipTemp[2] + "." + ipTemp[3];
         }
      }
   }
   return ip;
};

FT.Advertising.prototype.encodeIP = function (ip) {
   var encodedIP, ipEncodingLookup = this.CONST.DFPPremiumIPReplaceLookup;

   if (ip) {
      encodedIP = ip;
      this.foreach(ipEncodingLookup, function (lookupKey) {
         encodedIP = encodedIP.replace(new RegExp(ipEncodingLookup[lookupKey].replaceRegex), ipEncodingLookup[lookupKey].replaceValue);
      });
   }

   return encodedIP;
};

FT.Advertising.prototype.rsiSegs = function () {
   if (!this.suppressAudSci && FT._ads.utils.cookie("rsi_segs")) {
      var results = [];
      this.foreach(FT._ads.utils.cookie("rsi_segs").split('|'), function (value) {
         results.push(this.encodeAudSci(value));
      });
      return results;
   }
   return undefined;
};

FT.Advertising.prototype.getAyscVars = function (obj) {
   var out = {},
      item, q;
   if (FT._ads.utils.cookie("AYSC")) {
      q = FT._ads.utils.cookie("AYSC").split("_");

      for (var i = 0, j = q.length; i < j; i++) {
         item = q.pop();
         if (!!item) {
            var key, val,
               m = item.match(/^(\d\d)([^_]+)/);

            if (m) {
               key = m[1];
               val = m[2];
               out[key] = val;
            }
         }
      }
   }
   return FT._ads.utils.extend({}, obj, out);
};

FT.Advertising.prototype.getConsentValue = function () {
   var cookieConsentName = FT.ads.CONST.cookieConsentName, cookieConsentAcceptanceValue = FT.ads.CONST.cookieConsentAcceptanceValue;

   if (FT._ads.utils.cookie(cookieConsentName) === cookieConsentAcceptanceValue) {
      return "y"; //accepted
   } else {
      return "n"; //not seen widget or not accepted.
   }
};

FT.Advertising.prototype.prepareBaseAdvert = function (pos) {
   // get AYSC cookie values to determine ad server
   var AllVars = this.prepareAdVars(this.getAyscVars({})), cookie = FT._ads.utils.cookie("FTQA"),
      rFormat,
      docUUID;
   this.baseAdvert.pos = pos;

   if ((cookie) && (cookie.match(/env=(.*)premiumcopy/))) {
      //cookie switch to DFP Premium Copy network for testing
      this.baseAdvert.ad_server = this.CONST.DFPPremiumCopy;
      this.baseAdvert.ad_network_code = this.CONST.DFPPremiumCopyNetworkCode;
   } else if ((cookie) && (cookie.match(/env=(.*)premiumreadonly/))) {
      //cookie switch to DFP Premium Read Only network -- shadow live network
      this.baseAdvert.ad_server = this.CONST.DFPPremiumReadOnly;
      this.baseAdvert.ad_network_code = this.CONST.DFPPremiumReadOnlyNetworkCode;
   } else {
      //pre-migrated DFP network
      this.baseAdvert.ad_server = this.adServerCountry(AllVars['15'], pos);
      this.baseAdvert.ad_network_code = this.CONST.DFPNetworkCode;
   }


   // now lets exclude fields based on either key names or values
   AllVars = this.excludeFields(this.CONST.exclusions, AllVars);

   this.foreach(AllVars, function (ayscName, ayscVal) {
      if (!ayscVal) {
         return true;
      }
      if (this.CONST.remove_exes[ayscName] && /^x+$/i.test(ayscVal)) {
         // All X's in the value, for certain fields, do not put in base advert
         return true;
      }
      if (this.CONST.remove_res_pvt[ayscName] && /^pvt|res$/i.test(ayscVal)) {
         // RES or PVT in the value, for certain fields, do not put in base advert
         return true;
      }
      this.baseAdvert[ayscName] = ayscVal.toString().toLowerCase();
   });

   this.baseAdvert.a = this.rsiSegs();

   this.baseAdvert.cc = this.getConsentValue();

   rFormat = this.getAdFormat(pos);
   this.baseAdvert.sz = rFormat.sz;
   // Check whether we need to add the interstitial dcopt parameter for this ad format
   if (rFormat.dcopt) {
      if (this.baseAdvert.hasInterstitial) {
         this.addDiagnostic(pos, {
            "buildURLIst": "multiple interstitials on page, ignoring " + pos
         });
      } else {
         // We add the interstitial setting only if we've not seen one before on the page
         this.baseAdvert.hasInterstitial = true;
         this.baseAdvert.dcopt = rFormat.dcopt;
         this.adverts[pos].state.requestsInterstitial = true;
      }
   }
   this.baseAdvert.eid = this.erightsID();
   this.baseAdvert.uuid = FT.env.dfp_zone; //initialize
   this.baseAdvert.auuid = false;
   this.baseAdvert.bht = this.behaviouralFlag();
   this.baseAdvert.fts = this.isLoggedIn();
   this.baseAdvert.socref = this.socialReferrer();

   if (typeof pageUUID !== 'undefined') {
      if (pageUUID !== null && pageUUID !== '') {
         this.baseAdvert.uuid = pageUUID;
      }
   } else {
      if (FT._ads.utils.isFunction(window.getUUIDFromString)) { //check if common_raw.js is visible.
         docUUID = getUUIDFromString(document.location.toString());
         if (docUUID !== null && docUUID !== '') {
            this.baseAdvert.uuid = docUUID;
         }
      }
   }
   if (typeof articleUUID !== 'undefined') {
      if (articleUUID !== null && articleUUID !== '') {
         this.baseAdvert.auuid = articleUUID;
      }
   }
   this.baseAdvert.ts = this.getTimestamp();
   this.baseAdvert.loc = this.encodeIP(this.getIP());

   // Check if we are running in a non-live environment and change the site name
   this.baseAdvert.dfp_site = this.getDFPSite();
   FT.env.dfp_site = this.baseAdvert.dfp_site;
   this.baseAdvert.dfp_zone = FT.env.dfp_zone;

   // Handle the per-page custom targeting value from dfp_targeting.
   // By default Methode metadata puts XXXX in this field so we ignore that
   // and fix up any semicolons at the start and end of the field
   /*if (typeof FT.env.dfp_targeting !== 'undefined')
    {
    var targeting = FT.env.dfp_targeting.replace(/^;/, '').replace(/;$/, '').replace(/;;+/, ';').toLowerCase();
    if (targeting !== '' && ! /^x+$/.test(targeting)) {
    this.baseAdvert.dfp_targeting = targeting;
    }
    }*/
   this.baseAdvert.dfp_targeting = this.getDFPTargeting();
};

FT.Advertising.prototype.getDFPTargeting = function () {
   var dfpTargeting = '',
      referrer;
   //Handle the per-page custom targeting value from dfp_targeting.
   //By default Methode metadata puts XXXX in this field so we ignore that
   // and fix up any semicolons at the start and end of the field
   if (typeof FT.env.dfp_targeting !== 'undefined') {
      dfpTargeting = FT.env.dfp_targeting;
   //if current page is an article assign referrer and append pt to dfpTargeting if necessary
   if (this.isArticle(document.location.toString())) {
      //either environment variable does not exist or pt is not defined, add it manually.
      if (!/^.*;pt=.*$/.test(FT.env.dfp_targeting)) {
         dfpTargeting += (dfpTargeting !== '') ? ';pt=art' : 'pt=art';
      }

         //add referrer details to dfp_targeting if defined and non-empty.
      referrer = this.getReferrer();
      if (referrer !== undefined && referrer !== '') {
         dfpTargeting += (dfpTargeting !== '') ? ';rf=' + referrer : 'rf=' + referrer;
      }
   }

      dfpTargeting = dfpTargeting.toLowerCase();
      for (var i=0; i < this.CONST.cleanDfpTargeting.length ; i++){
         dfpTargeting = dfpTargeting.replace(this.CONST.cleanDfpTargeting[i][0], this.CONST.cleanDfpTargeting[i][1]) ;
      }
      dfpTargeting = encodeURI(dfpTargeting);
   }
   //return valid dfpTargeting else undefined.
   if (dfpTargeting !== '') {
      return dfpTargeting;
   }
   return undefined;
};

FT.Advertising.prototype.getReferrer = function () {
   var match = null,
      referrer = this.getDocReferrer(),
      hostRegex;
   //referrer is not article
   if (referrer !== '') {
      hostRegex = /^.*?:\/\/.*?(\/.*)$/;
      //remove hostname from results
      match = hostRegex.exec(referrer)[1];
   }
   if (match !== null) {
      return match.substring(1);
   }
   return undefined;
};

FT.Advertising.prototype.getDocReferrer = function () {
   return document.referrer;
};

FT.Advertising.prototype.getSocialReferrer = function () {
   var referrer = this.getDocReferrer(), codedValue, breakFromLoop = false,
      refererRegexTemplate = '^http(|s)://(www.)*(SUBSTITUTION)/|_i_referer=http(|s)(:|%3A)(\/|%2F){2}(www.)*(SUBSTITUTION)(\/|%2F)';

   if (referrer !== undefined) {
      this.foreach(FT.ads.CONST.SocialReferrerLookup, function (keyName) {
            var refererRegex = new RegExp(refererRegexTemplate.replace(/SUBSTITUTION/g, keyName));
            if (!breakFromLoop && keyName !== undefined && refererRegex.test(referrer)) {
               codedValue = FT.ads.CONST.SocialReferrerLookup[keyName];
               breakFromLoop = true;
            }
         }
      );
   }
   return codedValue;
};

FT.Advertising.prototype.mapReferrerName = function (referrerKey) {
   if (referrerKey !== undefined && referrerKey !== '') {
      return FT.ads.CONST.SocialReferrerLookup[referrerKey];
   }
   return undefined;
};

FT.Advertising.prototype.isArticle = function (urlParam) {
   var classicArticleRegex = /^.*\/cms\/s\/\d\/[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+.html.*$/,
      falconArticleRegex = /^.*;pt=art.*$/;
   return (classicArticleRegex.test(urlParam) || falconArticleRegex.test(FT.env.dfp_targeting));
};

FT.Advertising.prototype.getTimestamp = function () {
   var dateToFormat = new Date(),
      month = dateToFormat.getMonth() + 1,
      day = dateToFormat.getDate(),
      hours = dateToFormat.getHours(),
      minutes = dateToFormat.getMinutes(),
      seconds = dateToFormat.getSeconds(),
      dateArray,
      dateFormatted;
   if (month < 10) {
      month = "0" + month;
   }
   if (day < 10) {
      day = "0" + day;
   }
   if (hours < 10) {
      hours = "0" + hours;
   }
   if (minutes < 10) {
      minutes = "0" + minutes;
   }
   if (seconds < 10) {
      seconds = "0" + seconds;
   }
   //var dateFormatted = dateToFormat.getFullYear() + " " + month + " " + day + " " + hours + " " + minutes + " " + seconds;
   dateArray = [dateToFormat.getFullYear(), month, day, hours, minutes, seconds];
   dateFormatted = dateArray.join("");
   return dateFormatted;
};

FT.Advertising.prototype.prepareKeywordsParam = function () {
   var url,
      keywords;
   if (FT.env.url_location) {
      url = FT.env.url_location;
   }
   keywords = this.getKeywordsParam(url);
   if (keywords) {
      this.baseAdvert.kw = keywords;
   }
};

FT.Advertising.prototype.encodeBaseAdvertProperties = function (mode, vidKV) {
   var results = '',
      dfp_targeting = this.baseAdvert.dfp_targeting,
      rsiSegs = this.baseAdvert.a,
      Order;

   Order = this.CONST.KeyOrder;
   if (mode === 'video') {
      Order = this.CONST.KeyOrderVideo;
   } else if (mode === 'videoExtra') {
      Order = this.CONST.KeyOrderVideoExtra;
   } else if (mode === 'videoSync') {
      Order = this.CONST.KeyOrderVideoSync;
   }

   this.foreach(Order, function (key) {
      var value;
      if (typeof this.baseAdvert[key] !== 'undefined') {
         value = this.baseAdvert[key];
      } else if (typeof vidKV !== 'undefined' && (typeof vidKV[key] !== 'undefined')) {
         value = vidKV[key];
      }

      if (key === 'pos' && dfp_targeting) {
         results += dfp_targeting + ';';
      }

      if (key === 'a' && rsiSegs) {
         value = rsiSegs.slice(0, this.CONST.audSciMax).join(';a=');
      }

      results += !value ? '' : key + '=' + value + ';';
   });
   return results.replace(/;$/, '');
};

FT.Advertising.prototype.cleanKeywords = function (keywords) {
   keywords = unescape(keywords).toLowerCase();
   keywords = keywords.replace(/[';\^\+]/g, ' ');
   keywords = keywords.replace(/\s+/g, ' ');
   keywords = keywords.replace(/^\s+/, '');
   keywords = keywords.replace(/\s+$/, '');
   keywords = escape(keywords);
   // full-stop has special meaning to DFP so we must escape it
   keywords = keywords.replace(/\./g, '%2E');
   return keywords;
};

FT.Advertising.prototype.getKeywordsParam = function (url) {
   var keywords, Params, idx, Match;
   url = url || document.location.search;
   keywords = "";
   if (url.indexOf('?') >= 0) {
      url = url.replace(/^[^\?]*\?/, '');
      Params = url.split('&');
      for (idx = 0; keywords === "" && idx < Params.length; ++idx) {
         Match = Params[idx].match(/^(q|s|query|queryText|searchField)=(.+)$/);
         if (Match) {
            keywords = this.cleanKeywords(Match[2]);
         }
      }
   }
   return keywords;
};

FT.Advertising.prototype.buildURLFromBaseAdvert = function (mode) {
   mode = mode || 'normal';
   var type = (mode === 'video') ? "/pfadx/" : "/adj/",
      URL;
   type = (mode === 'videoSync') ? "/adi/" : type;
   URL = "http://" + this.baseAdvert.ad_server + this.baseAdvert.ad_network_code + type + this.baseAdvert.dfp_site + "/" + this.baseAdvert.dfp_zone + ";";
   URL += this.encodeBaseAdvertProperties(mode);
   if (mode !== 'video') {
      URL = URL + '?';
      if (this.baseAdvert.tile > 16) {
         this.addDiagnostic(this.baseAdvert.pos, {
            "buildURLFromBaseAdvert": "too many ads, exceeds maximum tile"
         });
         URL = undefined;
      }
      // Increment the tile for the next build call
      this.baseAdvert.tile++;
   }
   return URL;
};

// TESTED in dfp-advertising.html
FT.Advertising.prototype.buildURL = function (pos) {
   var URL;
   clientAds.log("FT.Advertising.buildURL(" + pos + ")");
   if (this.checkSiteZone(pos) === 'invalid') {
      return URL;
   }
   // Clear out any baseAdvert fields we need to
   this.clearBaseAdvert();
   this.prepareBaseAdvert(pos);
   this.prepareKeywordsParam();
   URL = this.buildURLFromBaseAdvert();
   return URL;
}; // buildURL(pos)

// TESTED in video_test.html
FT.Advertising.prototype.buildURLForVideo = function (zone, pos, vidKV) {
   pos = pos || 'video';
   vidKV = vidKV || {};
   var mode = 'video',
      URL,
      result;

   FT.env.dfp_zone = zone;
   if (this.checkSiteZone(pos) === 'invalid') {
      return URL;
   }

   this.adverts[pos] = this.adverts[pos] || {};
   this.adverts[pos].callType = mode;

   this.clearBaseAdvert();
   this.prepareBaseAdvert(pos);
   URL = this.buildURLFromBaseAdvert(mode);

   result = {
      urlStem: URL,
      additionalAdTargetingParams: this.encodeBaseAdvertProperties('videoExtra', vidKV)
   };

   this.addDiagnostic(pos, result);
   return result;
};

// Request any remaining ads and move staged ads within dom
FT.Advertising.prototype.requestInsertedAds = function () {
   clientAds.log("FT.Advertising.requestInsertedAds()");
   var advert = this.extraAds.shift();
   while (advert) {
      this.request(advert);
      advert = this.extraAds.shift();
   }
}; // requestInsertedAds()

//originally a proxy function but now used for deciding whether to serve newssubs
//depending whether we have a banlb or full-width billboard ad served in the
//banlb position
FT.Advertising.prototype.requestNewssubs = function () {

   var tryBanlb, banlbDiv, j, isBillboardAd = false, banlbInnerHTML, why;

   for (j = 0; j < this.CONST.proxy_div_prefixes.length; j++) {
      tryBanlb = this.CONST.proxy_div_prefixes[j] + "banlb";
      if (!!document.getElementById(tryBanlb)) {
         banlbDiv = tryBanlb;
      }
   }

   if (banlbDiv === null) {
      why = "Can't detect a banlb div in DOM";
      clientAds.log("FT.Advertising.requestNewssubs()" + why);
   } else {
      banlbInnerHTML = document.getElementById(banlbDiv).innerHTML;
      clientAds.log("banlb ad state=" + banlbInnerHTML);

      //tests for assets within the div which indicate a billboard ad
      //by virtue of width property
      if (banlbInnerHTML.match(/width=(["]{0,1})970(["]{0,1})|width:([\s]*)970/)) {
         isBillboardAd = true;
      }
   }

   if (isBillboardAd === true) {
      // This will not serve the newssubs and it will trigger the pushdown polling
      FT.ads.pushDownExpand('banlb', 1, FT.ads.pollAdHeightAndExpand);
   } else {
      //This will serve the newssubs
      this.request('newssubs');
   }
};

// Collapse advert element
// TESTED in expand-collapse-test.html
FT.Advertising.prototype.collapse = function (pos, zeroHeight) {
   var why = zeroHeight ? "no ad booked but interstitial present" : "no ad booked",
      doCollapse,
      adContainer,
      bodyClasses = document.body.className.split(' ');
   why = this.adverts[pos].state.alwaysHide ? 'position is always hidden' : why;
   clientAds.log("FT.Advertising.collapse(" + pos + ", " + zeroHeight + ") - " + why);

   doCollapse = this.legacyAdCollapse(pos, zeroHeight);
   if (doCollapse) {
      adContainer = this.getAdContainer(pos);
      if (adContainer.div) {
         if (zeroHeight) {
            adContainer.div.style.display = "block";
         } else {
            adContainer.div.style.display = "none";
         }
         bodyClasses.push(" no-" + adContainer.name);
         document.body.className = bodyClasses.join(' ');
      }
   } else {
      why = "collapse prevented by legacy handler";
   }
   this.addDiagnostic(pos, {
      "collapsed": why
   });
}; // collapse(pos)

// TESTED in expand-collapse-test.html
// Set div to take up no vertical space for when there is no ad in the div
// except for a piggybacked interstitial
FT.Advertising.prototype.setZeroHeight = function (pos, id) {
   var rDiv = document.getElementById(id);
   if (rDiv) {
      rDiv.style.height = 0;
      rDiv.style.padding = 0;
   } else {
      clientAds.log("FT.Advertising.setZeroHeight(" + id + ") - div not found");
      this.addDiagnostic(pos, {
         "setZeroHeight": "div not found: " + id
      });
   }
}; // setZeroHeight()

// Handle any collapse fixups needed because ads library is in use on old FTCOMBASE/PHOENIX pages
// NOT TESTED
FT.Advertising.prototype.legacyAdCollapse = function (pos, zeroHeight) {
   // This function should not live too long. Once the article pages and all
   // third parties are migrated to the new falcon stack and wrappers there
   // should be no fixups needed. If you see this function in existence many
   // months after June 2010 check if it can be removed.

   var doCollapse = true, rLeaderBoard, Divs, idx,
      rDiv;
   if (FT.env.isLegacyAPI) {
      // Refresh position is always hidden
      if (this.adverts[pos].state.alwaysHide) {
         clientAds.log("FT.Advertising.legacyAdCollapse(" + pos + ", " + zeroHeight + ") for " + this.library + " always hide");
         rDiv = document.getElementById('ad-container-' + pos);
         if (rDiv) {
            rDiv.style.display = 'none';
         }
      }
      if (pos === 'lhn') {
         // Cannot collapse the lhn position as it actually contains the Left Hand Nav
         doCollapse = false;
      }
      if (pos === 'banlb') {
         clientAds.log("FT.Advertising.legacyAdCollapse(" + pos + ", " + zeroHeight + ") for " + this.library);
         // on legacy pages remove the containing leaderboard height to
         // allow the position to collapse
         rLeaderBoard = document.getElementById('leaderboard');
         if (rLeaderBoard) {
            rLeaderBoard.style.minHeight = 0;
         }
         Divs = [
            'ad-placeholder-banlb',
            'page-header-ad'
         ];
         for (idx = 0; idx < Divs.length; ++idx) {
            this.setZeroHeight(pos, Divs[idx]);
         }
      }
   }
   if (!doCollapse) {
      clientAds.log("FT.Advertising.legacyAdCollapse(" + pos + ", " + zeroHeight + ") for " + this.library + " ad position collapse prevented");
   }

   return doCollapse;
}; // legacyAdCollapse()

// Handle any expand fixups needed because ads library is in use on old FTCOMBASE/PHOENIX pages
// NOT TESTED
FT.Advertising.prototype.legacyAdFixup = function (pos, adContainer) {
   // This function should not live too long. Once the article pages and all
   // third parties are migrated to the new falcon stack and wrappers there
   // should be no fixups needed. If you see this function in existence many
   // months after June 2010 check if it can be removed.

   if (this.library === 'ftcombase' && adContainer.div.id === 'ad-placeholder-hlfmpu') {
      // Half MPU ad position on Article pages using FTCOMBASE library we need to
      // add a border and some padding to the ad because the old library did this
      // manually. When falcon restyles the page they ought to be able to do this
      // with proper page structure and class=advertising.

      clientAds.log("FT.Advertising.legacyAdFixup(" + pos + ", " + adContainer.div.id + ") for " + this.library);
      // This horrible hack should be temporary until Falcon has re-styled the Article and Markets Data Pages
      adContainer.div.style.padding = "14px 0 14px 0";
      adContainer.div.style.marginBottom = 15 + "px";
      adContainer.div.style.border = "solid 1px #999";
   }
   if (this.library === 'phoenix' && adContainer.div.id === 'ad-placeholder-hlfmpu') {
      // Half MPU ad position on Markets Data pages using PHOENIX library we need to
      // add some padding to the ad because the old library did this
      // manually. When falcon restyles the page they ought to be able to do this
      // with proper page structure and class=advertising.

      clientAds.log("FT.Advertising.legacyAdFixup(" + pos + ", " + adContainer.div.id + ") for " + this.library);
      // This horrible hack should be temporary until Falcon has re-styled the Article and Markets Data Pages
      adContainer.div.style.padding = "14px 0 14px 0";
      adContainer.div.style.marginBottom = 15 + "px";
      adContainer.div.style.marginLeft = 0;
      adContainer.div.style.paddingLeft = 0;
   }
   if (this.library === 'ftcombase' && adContainer.div.id === 'ad-placeholder-tradcent') {
      // Tradecenter ad position on Article pages using FTCOMBASE library we need to
      // add a bottom margin of 15 px

      clientAds.log("FT.Advertising.legacyAdFixup(" + pos + ", " + adContainer.div.id + ") for " + this.library);
      // This horrible hack should be temporary until Falcon has re-styled the Article pages
      adContainer.div.style.marginBottom = 15 + "px";
   }
   if (this.library === 'ftcombase' && adContainer.div.id === 'ad-placeholder-tlbxrib') {
      // tlbxrib ad position on Article pages using FTCOMBASE library we need to
      // add a bottom margin of 15 px

      clientAds.log("FT.Advertising.legacyAdFixup(" + pos + ", " + adContainer.div.id + ") for " + this.library);
      // This horrible hack should be temporary until Falcon has re-styled the Article pages
      adContainer.div.style.marginBottom = 15 + "px";
   }
   if (this.library === 'ftcombase' && adContainer.div.id === 'ad-placeholder-marketingrib') {
      // Marketing Rib ad position on Article pages using FTCOMBASE library we need to
      // fix up the fonts so they match what they used to be.
      // When falcon restyles the page this should be fixed.

      clientAds.log("FT.Advertising.legacyAdFixup(" + pos + ", " + adContainer.div.id + ") for " + this.library);
      // This horrible hack should be temporary until Falcon has re-styled the Article and Markets Data Pages
      // Remove the ad placeholder class from the outer div which is styled horribly for the ad content.
      adContainer.div.className = "";
      adContainer.div.style.marginBottom = 15 + "px";
   }
}; // legacyAdFixup(pos, adContainer)

// Expand element position (in case content was returned without calling the callback)
// TESTED in expand-collapse-test.html
FT.Advertising.prototype.expand = function (pos) {
   clientAds.log("FT.Advertising.expand(" + pos + ")");
   var index,
      adContainer = this.getAdContainer(pos),
      bodyClasses = document.body.className.split(' ');
   if (adContainer.div) {
      this.legacyAdFixup(pos, adContainer);
      if (!adContainer.div.className.match(/\bhidden\b/)) {
         adContainer.div.style.display = "block";
      }
      index = bodyClasses.indexOf("no-" + adContainer.name);
      if (index > -1) {
         bodyClasses.splice(index, 1);
         document.body.className = bodyClasses.join(' ');
      }
   }
}; // expand(pos)

// Returns the element with an expected class name, which depends upon whether we
// are using the DFP or legacy API (walks up the DOM tree to find it)
// TESTED in dfp-advertising.html
FT.Advertising.prototype.getNamedAdContainer = function (idDiv, pos) {
   clientAds.log("FT.Advertising.getNamedAdContainer(" + idDiv + ") -- looking");
   var rDiv = document.getElementById(idDiv),
      ancestorLimit,
      ancestorCount,
      el,
      rOriginalDiv;
   clientAds.log("FT.Advertising.getNamedAdContainer(" + idDiv + ") -- got -- " + rDiv);
   if (rDiv) {
      clientAds.log("FT.Advertising.getNamedAdContainer(" + idDiv + ")");
      ancestorLimit = 3;
      ancestorCount = 0;
      el = rDiv;
      rOriginalDiv = rDiv;
      while (ancestorCount <= ancestorLimit && FT._ads.utils.isString(el.className) && this.hasAdClass(el, pos) === false) {
         el = el.parentNode;
         ancestorCount++;
      }
      rDiv = (el.className && this.hasAdClass(el, pos) === true) ? el : rOriginalDiv;
   }
   return rDiv;
};

// TESTED in dfp-advertising.html
FT.Advertising.prototype.getAdContainer = function (pos) {
   var AdContainers = this.getAdContainers(pos);
   if (AdContainers.length === 0) {
      this.addDiagnostic(pos, { "getAdContainer": 'div not found' });
      AdContainers = [
         {'div': null, 'name': null}
      ];
   }
   return AdContainers[0];
};

// Mostly to do with Legacy Ad pages which can have a placeholder and container div
// which are separate. This should be reworked to use getAdContainer when the legacy
// sites have been migrated.
// TESTED in dfp-advertising.html
FT.Advertising.prototype.getAdContainers = function (pos) {
   var AdContainers = [], stop, idx, idDiv, adElement;
   // Using the legacy API we have to look for ad-container-banlb and ad-placeholder-banlb classes
   // so we loop through entire proxy array. in non-legacy we only look for the named ad container
   stop = FT.env.isLegacyAPI ? this.CONST.proxy_div_prefixes.length : 1;
   for (idx = 0; idx < stop; ++idx) {
      idDiv = this.CONST.proxy_div_prefixes[idx] + pos;
      // Ok, this is a hack. The classic site page which has an LHN ad position
      // also has a div called lhn which has nothing to do with ads. So we
      // cannot match that div and instead look for the ad-placeholder-lhn, etc.
      // http://www.ft.com/personal-finance/banking
      // This should be resolved when the classic site is re-styled for Falcon
      if (!(FT.env.isLegacyAPI && idDiv === 'lhn')) {
         adElement = this.getNamedAdContainer(idDiv, pos);
         if (adElement) {
            AdContainers.push({'div': adElement, 'name': idDiv});
         }
      }
   }
   return AdContainers;
};

// TESTED in dfp-advertising.html
FT.Advertising.prototype.getAdInnerHTML = function (pos) {
   var html, AdContainers;
   AdContainers = this.getAdContainers(pos);
   if (AdContainers.length !== 0) {
      html = '';
      this.foreach(AdContainers, function (rAdContainer) {
         if (html.length) {
            html = html + "\n";
         }
         html = html + "<!-- " + rAdContainer.name + " -->\n" + rAdContainer.div.innerHTML;
      });
   } else {
      this.addDiagnostic(pos, { "getAdInnerHTML": 'div not found' });
   }
   return html;
};

// Given a DOM element, we look for the parent div which needs to be collapsed
// or expanded. Falcon pages simply have the classname 'advertising' on them.
// Non-falcon pages are either an ad-container or an ad-placeholder
// TESTED in dfp-advertising.html
FT.Advertising.prototype.hasAdClass = function (rElement, pos) {
   clientAds.log("FT.Advertising.hasAdClass(" + rElement + ")");
   if (FT.env.isLegacyAPI) {
      if (this.hasClassName(rElement.className, new RegExp('^ad-(container|placeholder)(-' + pos + ')?$'))) {
         return true;
      }
   } else if (this.hasClassName(rElement.className, 'advertising')) {
      return true;
   }
   return false;
};

// Create a linked image in the DOM
FT.Advertising.prototype.renderImage = function (rResponse) {
   /*jshint evil:true */
   // we have a document.write in this method so we tell jshint about it.
   var rDiv,
      link,
      img,
      imageclickPlaceholderId,
      doc,
      imageclickPlaceholderDiv;
   clientAds.log("FT.Advertising.renderImage(" + rResponse + ")");
   if (!FT._ads.utils.isObject(rResponse) || !rResponse.content || !rResponse.content.clickURL || !rResponse.content.imageURL) {
      this.addDiagnostic(rResponse.name, {
         "noImageClickContent": true
      });
      return false;
   }
   rDiv = document.getElementById(rResponse.name);
   if (!rDiv) {
      this.addDiagnostic(rResponse.name, {
         "noTargetDiv": true
      });
      return false;
   }
   link = document.createElement("a");
   link.href = rResponse.content.clickURL;
   link.target = "_blank";
   img = document.createElement("img");
   if (rResponse.content.altText) {
      img.alt = rResponse.content.altText;
   }
   if (rResponse.content.width) {
      img.width = rResponse.content.width;
   }
   if (rResponse.content.height) {
      img.height = rResponse.content.height;
   }
   img.src = rResponse.content.imageURL;
   link.appendChild(img);

   // create a placeholder so we can render th link and img next to it (e.g. inside the div.advert OR the #mktsdata span
   imageclickPlaceholderId = rResponse.name + "_imageclick_placeholder";
   document.write('<span style="display:none" id="' + imageclickPlaceholderId + '"></span>');
   imageclickPlaceholderDiv = document.getElementById(imageclickPlaceholderId);

   if (imageclickPlaceholderDiv.parentNode.insertBefore(link, imageclickPlaceholderDiv)) {
      this.addDiagnostic(rResponse.name, {
         "rendered": "fromJSON"
      });
   }

   imageclickPlaceholderDiv.parentNode.removeChild(imageclickPlaceholderDiv);

   // Vertically centre
   if (rResponse.content.height && img.height < rDiv.offsetHeight) {
      link.style.marginTop = ((rDiv.offsetHeight - img.height) / 2) + "px";
      link.style.display = "block";
      this.addDiagnostic(rResponse.name, {
         "verticallyAligned": true
      });
   }
   this.expand(rResponse.name);
}; // renderImage(rResponse)

// TESTED in dfp-advertising.html
FT.Advertising.prototype.toBase36 = function (value) {
   return parseInt(value, 10).toString(36);
};

// TESTED in dfp-advertising.html
FT.Advertising.prototype.fromBase36 = function (value) {
   return parseInt(value, 36);
};

// TESTED in dfp-advertising.html
FT.Advertising.prototype.encodeAudSci = function (value) {
   var rsiSeg = value.match(/^([A-L]\d{5})_(\d{5})$/i),
      segment;
   if (rsiSeg) {
      segment = parseInt(rsiSeg[2], 10) - 10000;
      if (/^J07717$/i.test(rsiSeg[1])) {
         return 'z' + segment;
      } else {
         return rsiSeg[1].charAt(0).toLowerCase() + this.toBase36(segment + rsiSeg[1].substring(1));
      }
   }
   return value.toUpperCase();
};

// TESTED in dfp-advertising.html
FT.Advertising.prototype.decodeAudSci = function (value) {
   if (value.charAt(0).toLowerCase() === 'z') {
      return "J07717_" + (parseInt(value.substring(1), 10) + 10000);
   } else {
      var rsiSeg = this.fromBase36(value.substring(1)).toString(),
         segment = parseInt(rsiSeg.slice(0, -5), 10) + 10000,
         clientId = value.charAt(0).toUpperCase() + rsiSeg.substring(rsiSeg.length - 5);
      return clientId + '_' + segment;
   }
};

// Implement DFP specific helper methods

// Constructor - a new page resets ads. If there are video ads, they are removed but
// the records of non-video ads remain in FT.ads.adverts. If there are no video ads
// then everything will be reset.
// TESTED dfp-advertising.html
FT.Advertising.prototype.beginNewPage = function (env) {
   clientAds.log("FT.Advertising.beginNewPage()");
   env = env || FT.env;

   this.baseAdvert = {};
   this.baseAdvert.ord = Math.floor(Math.random() * 1E16); // 16 digit random number
   this.baseAdvert.tile = 1; // tile = 1 .. 16 only
   this.extraAds = [];

   var VideoAds = this.getVideoAdverts(),
      VideoSyncAds = this.getVideoSyncAdverts(),
      cookie,
      Match;
   if (VideoAds.length || VideoSyncAds.length) {
      this.foreach(VideoAds, function (pos) {
         delete this.adverts[pos];
      });
      this.foreach(VideoSyncAds, function (pos) {
         delete this.adverts[pos];
      });
   } else {
      this.adverts = {};
   }

   this.isComplete = false;
   this.timeouts = {};
   this.intervals = {};
   this.runinterval = undefined;
   //this.refreshTimer      = null; // timer for refreshing the page

   this.timeoutTolerance = FT.env.timeoutTolerance || 25;  // Milliseconds after which to collapse ad position
   this.timeIntervalTolerance = FT.env.timeIntervalTolerance || 300; //Millisecond interval between checking for ad div state
   this.suppressAudSci = false;

   // Let the FTQA cookie value override the timeout, if present
   cookie = FT._ads.utils.cookie("FTQA");
   // For testing visit: http://admintools.internal.ft.com:86/adstools/html/FTQA.html
   // debug,timeout=2000,interval=100,longest_url=100-100 (100 out of 100)
   if (cookie) {
      Match = cookie.match(/timeout=(\d+)/);
      if (Match) {
         this.timeoutTolerance = Match[1];
      }
      Match = cookie.match(/interval=(\d+)/);
      if (Match) {
         this.timeIntervalTolerance = Match[1];
      }
      Match = cookie.match(/longest_url=(\d+)-(\d+)/);
      if (Match) {
         this.CONST.urlThreshold = Match[1];
         this.CONST.urlThresholdMax = Match[2];
      }
      Match = cookie.match(/ord=(\d+)/);
      if (Match) {
         this.baseAdvert.ord = Match[1];
      }
      Match = cookie.match(/noaudsci/);
      if (Match) {
         this.suppressAudSci = true;
      }
      clientAds.log("Configured from Cookies:");
      clientAds.log("timeoutTolerance: " + this.timeoutTolerance);
      clientAds.log("timeIntervalTolerance: " + this.timeIntervalTolerance);
      clientAds.log("urlThreshold: " + this.CONST.urlThreshold);
      clientAds.log("urlThresholdMax: " + this.CONST.urlThresholdMax);
      clientAds.log("ord: " + this.baseAdvert.ord);
      clientAds.log("noaudsci: " + this.suppressAudSci);
   }

   this.baseAdvert.hasInterstitial = false; // flag set if an interstitial ad has been requested - only one per page allowed
   this.submitToTrack = false;
   this.useDFP = true;
   this.library = "falcon";
   env.useDFP = true;
};

// Reset the library completely as if there are no ad calls
// TESTED dfp-advertising.html
FT.Advertising.prototype.resetLibrary = function () {
   this.beginNewPage();
   this.adverts = {};
};

// Check if ad server two letter code is valid.
// TESTED in dfp-advertising.html
FT.Advertising.prototype.checkAdServerCountry = function (iso2) {
   return this.CONST.AD_SERVERS.test(iso2);
};


// TESTED in dfp-advertising.html
FT.Advertising.prototype.adServerCountry = function (code, pos) {
   var server = '';
   if (code) {
      code = code.toLowerCase();
      if (this.checkAdServerCountry(code)) {
         code = code.toLowerCase();
         server = code + '.';
      } else if (code === 'gb' || code === 'gg' || code === 'im' || code === 'je') {
         server = 'uk.';
      } else {
         this.addDiagnostic(pos, {
            "adServerCountry": "Unsupported ad server: " + code
         });
      }
   }
   return 'ad.' + server + 'doubleclick.net';
};

//find out if we have an erights field and if so return as an object property
FT.Advertising.prototype.detectERights = function (obj) {
   if (FT._ads.utils.cookie("FT_U")) {
      var erights = FT._ads.utils.cookie("FT_U").split("="),
         keyname = erights[0],
         val = erights[1];
      if ((keyname !== undefined) && (val === undefined)) {
         obj[keyname] = val;
      }
   }
   return obj;
};

// set the value of the bht  based on AudSci cookie
FT.Advertising.prototype.behaviouralFlag = function () {
   var flag = (typeof this.rsiSegs() === "undefined") ? "false" : "true";
   return flag;
};


// set the value of the fts - user must have FTsession not just erightsId and slv
FT.Advertising.prototype.isLoggedIn = function () {
   var eid = this.erightsID();
   if (eid !== null && eid !== undefined) {
      return FT._ads.utils.cookie("FTSession") !== null;
   }
   else {
      return false;
   }
};

// set the value of the socref value
FT.Advertising.prototype.socialReferrer = function () {
   var socref = this.getSocialReferrer();
   if (socref !== undefined) {
      return socref;
   }
   return null;
};

// exclude fields on either key or val criteria
FT.Advertising.prototype.excludeFields = function (exclusions, obj) {
   var idx, keyvalsplit;
   // TODO: clean this up later -- val is now unused so this could be simpler.
   this.foreach(obj, function (prop) {
      for (idx = 0; idx < exclusions.length; idx++) {
         keyvalsplit = exclusions[idx].split("=");
         if (((keyvalsplit[0] === "key") && (prop === keyvalsplit[1])) || ((keyvalsplit[0] === "val") && (obj[prop] === keyvalsplit[1]))) {
            delete obj[prop];
         }
      }
   });
   return obj;
};

//here we strip leading zeros from certain fields
FT.Advertising.prototype.stripLeadingZeros = function (KeysToStrip, obj) {
   var idx, l;
   for (idx = 0, l = KeysToStrip.length; idx < l; idx++) {
      if (obj[KeysToStrip[idx]]) {
         obj[KeysToStrip[idx]] = obj[KeysToStrip[idx]].replace(/^0+/, "");
      }
   }
   return obj;
};

//here we do substitutions based on regexs.
FT.Advertising.prototype.fieldRegex = function (RegexKeyNames, obj) {
   this.foreach(this.CONST.SubsLevelReplaceLookup, function (replaceValue, regexHash) {
      var myState = "initial";
      this.foreach(RegexKeyNames, function (keyName) {
         var value = obj[keyName];
         if (value === undefined) {
            return;
         } else if ((myState !== "failed") && (value.match(regexHash[keyName]))) {
            myState = "passed";
         } else {
            myState = "failed";
            return;
         }
      });
      if (myState === "passed") {
         obj.slv = replaceValue;
      }
   });

   return obj;
}; // fieldRegex()

//here we take a substr of an object property value and then assign it
//to that object property
FT.Advertising.prototype.fieldSubstr = function (SubStrKeyNames, obj) {
   this.foreach(SubStrKeyNames, function (keyName) {
      // This is what we are splitting:
      // '24=0=3=cn'
      // i.e. AYSC chars 0 to 3 are stored in the cn field
      // AYSC field 24=europe then cn=eur
      var SubStrItems = keyName.split("="),
         ayscField = SubStrItems[0],
         val = obj[ayscField],
         newField;
      if (val !== undefined) {
         newField = SubStrItems[3];
         obj[newField] = val.substring(SubStrItems[1], SubStrItems[2]);
      }
   });
   return obj;
};

// Determine the DFP site targeting value from FT.env.dfp_site and modified
// by the release environment you are in. If non-live, we replace the first
// word of the site name with test.  For example ftcom.5887.blogs becomes
// test.5887.blogs.  The FTQA cookie can also select the environment
// with env=nolive or env=live
// TESTED in dfp-advertising.html
FT.Advertising.prototype.getDFPSite = function () {
   var site = FT.env.dfp_site,
      env,
      cookie;
   if (FT.Properties && FT.Properties.ENV) {
      env = FT.Properties.ENV.toLowerCase();
      cookie = FT._ads.utils.cookie("FTQA");
      if (cookie) {
         cookie = cookie.replace(/%3D/g, "=");
         // FTQA cookie present, look for env=live or env=nolive
         if (cookie.match(/env=live/)) {
            env = 'live';
            clientAds.log("FTQA cookie has set ads from live environment");
            this.addDiagnostic(this.baseAdvert.pos, { "getDFPSite": "using FTQA cookie to set ads from live environment" });
         }
         if (cookie.match(/env=nolive/)) {
            env = 'ci';
            clientAds.log("using FTQA cookie has set ads from non-live environment");
            this.addDiagnostic(this.baseAdvert.pos, { "getDFPSite": "using FTQA cookie to set ads from non-live environment" });
         }
      }
      if (env !== 'p' && !env.match(/^live/)) {
         site = site.replace(/^\w+\./, "test.");
      }
   }
   return site;
}; // getDFPSite()

// Assemble all the diagnostic messages into a single string for easy viewing with
//javascript:alert(this.showDiagnostics('banlb'))
FT.Advertising.prototype.showDiagnostics = function (pos) {
   var FullDiagnosis = ["FT.ads.showDiagnostics:\n"],
      AdPositions = this.getKeys(this.adverts);

   this.foreach(AdPositions, function (adPos) {
      var thisAdvert = this.adverts[adPos],
         Diagnosis,
         rDiagnostics,
         Topics,
         diagnosis;
      if (FT._ads.utils.isObject(thisAdvert) && (!pos || adPos === pos)) {
         Diagnosis = [];
         if (thisAdvert.diagnostics) {
            rDiagnostics = thisAdvert.diagnostics;
            Topics = this.getKeys(rDiagnostics);

            this.foreach(Topics, function (topic) {
               if (!FT._ads.utils.isFunction(rDiagnostics[topic])) {
                  Diagnosis.push("    " + topic + ": " + rDiagnostics[topic]);
               }
            });
         }
         diagnosis = Diagnosis.join("\n");
         if (diagnosis.length) {
            if (!adPos.match(/^_/)) {
               adPos = adPos + " Ad Call";
               if (thisAdvert.response && thisAdvert.response.adName) {
                  diagnosis = "    " + thisAdvert.response.adName + "\n" + diagnosis;
               }
            }
            FullDiagnosis.push(adPos + ":\n" + diagnosis + "\n");
         }
      }
   });
   return FullDiagnosis.join("\n");
}; // showDiagnostics()

// A breakpoint inserted for debugging only if the FTQQA cookie contains
// 'breakout' - don't remove this function, it's embedded into the ad call
// response so we can easily debug ad problems.
// DO NOT REMOVE. Unless you want the ads to stop working. Stub out as
// an empty function if you absolutely must, but this is handy for diagnosing ads problems.
FT.Advertising.prototype.breakout = function (rResponse) {
   var pause = true,
      cookie = FT._ads.utils.cookie("FTQA"),
      break_if;
   if (cookie) {
      cookie = cookie.replace(/%3D/g, "=");
      if (rResponse && rResponse.name) {
         pause = false;
         break_if = 'breakout=' + rResponse.name;
         if (cookie && (cookie.match(/breakout=all/) || cookie.indexOf(break_if) >= 0)) {
            pause = true;
         }
      }
      if (pause) {
         /*jshint debug:true*/
         debugger;
         /*jshint debug:false*/
      }
   }
};

// Detect whether the page settings contain DFP ad targeting variables
// Looks for FT.env.dfp_site and dfp_zone
// TESTED in dfp-advertising.html
FT.Advertising.prototype.detectDFPTargeting = function (env) {
   env = env || FT.env;
   return env.dfp_site && env.dfp_zone ? true : false;
};

// Determine whether the DFP ads system should be used or whether DE
// should be used. This is now always set to DFP mode
// TESTED in dfp-advertising.html
FT.Advertising.prototype.detectAdMode = function (env) {
   env = env || FT.env;
   env.useDFP = true;
   return env.useDFP;
}; // detectAdMode()

// Initialise the DFP ad system (only if FT.env.useDFP flag is set)
// We remove the DE methods from FT.Advertising and add in DFP methods
// TESTED dfp-advertising.html
FT.Advertising.prototype.initDFP = function (env) {
   clientAds.log("FT.Advertising.initDFP() - top");
   env = env || FT.env;
   this.hasCalledInitDFP = true;
   if (env.useDFP !== undefined) {
      // We have already initialised the DFP prototype methods, all we need to
      // do is reset the baseAdvert and other global page settings.
      this.beginNewPage(env);
   } else {
      // useDFP flag does not exist yet, we need to initialize the new DFP member functions.
      env.useDFP = true;
      clientAds.log("FT.ads.initDFP() - setup DFP");

      // Switch the request function now that we have detected Legacy or Falcon API
      FT.Advertising.prototype.request = FT.Advertising.prototype.requestDFP;

      // Re-initialise object with DFP settings
      this.beginNewPage(env);
   }
}; // initDFP()

// Function looks through adverts and gets the longest ad call URL that was created.
// TESTED in dfp-advertising.html
FT.Advertising.prototype.getLongestUrl = function () {
   var AdPositions = this.getKeys(this.adverts),
      longestRequestUrl,
      longestRequestUrlLength = 0;

   this.foreach(AdPositions, function (pos) {
      var thisAdvert = this.adverts[pos],
         rDiagnostics,
         requestUrl;

      if (FT._ads.utils.isObject(thisAdvert)) {
         rDiagnostics = thisAdvert.diagnostics;
         if (rDiagnostics && rDiagnostics.requestUrl) {
            requestUrl = rDiagnostics.requestUrl.replace(/^http:\/\/[^\/]+\.net/, '');
            if (requestUrl.length > longestRequestUrlLength) {
               longestRequestUrlLength = requestUrl.length;
               longestRequestUrl = requestUrl;
            }
         }
      }
   });
   return longestRequestUrl;
};

// Function to perform the pushdown of FT.com content on billboard Ad expansion. Accepts Ad position parameter like banlb and pause value in seconds
// Tested in dfp-advertising.html
FT.Advertising.prototype.pushDownExpand = function (adFormat, pauseInMilliseconds, func) {

   var timeoutVal;

   // Checking if the position is supported for the pushdown Ad
   if (FT.ads.CONST.pushDownFormats[adFormat] === undefined) {
      return;
   }

   timeoutVal = setTimeout(function () {
      func(adFormat, pauseInMilliseconds);
   }, pauseInMilliseconds);

   return timeoutVal;
};

// Function to poll the the billboard Ad resource to find out the expanded height and push down the FT.com content relatively.
// Tested in dfp-advertising.html
FT.Advertising.prototype.pollAdHeightAndExpand = function (adFormat, pauseInMilliseconds) {

   var expandableHeight, creativeOffsetHeight = 0, pushDownDiv = FT.ads.CONST.pushDownFormats[adFormat],
      clientHeight, clientWidth;

   if (FT.ads.VAR.pushDownExpandingAsset === null) {
      //we don't know what asset is being used to expand the ad yet - cycle through elements within the div
      var node,
         nodes = document.getElementById(pushDownDiv.pos).getElementsByTagName('*');

      for (var i = 0, j = nodes.length; i < j; i++) {
         node = nodes[i];
         //div, img and object nodes are most likely candidates
         if (node.nodeName.match(/DIV|IMG|OBJECT/)) {
            clientHeight = node.clientHeight || node.offsetHeight || null;
            clientWidth = node.clientWidth || null;
            if ((clientHeight !== null) && (clientHeight > 0) && (clientWidth === pushDownDiv.width)) {
               if (FT.ads.VAR.pushDownFullWidthAssetsHeights[node.id] === undefined) {
                  //acquire the  initial height of each asset and preserve it in a data structure
                  FT.ads.VAR.pushDownFullWidthAssetsHeights[node.id] = clientHeight;
               } else if (FT.ads.VAR.pushDownFullWidthAssetsHeights[node.id] < clientHeight) {
                  //asset appears to be expanding in height - set as watched asset for expanding page
                  FT.ads.VAR.pushDownExpandingAsset = node;
               }
            }
         }
      }
   }

   //we think we know the expanding asset so reset relevant DOM element height
   if (FT.ads.VAR.pushDownExpandingAsset !== null) {
      creativeOffsetHeight = FT.ads.VAR.pushDownExpandingAsset.clientHeight || FT.ads.VAR.pushDownExpandingAsset.offsetHeight || pushDownDiv.height;

      expandableHeight = Math.floor(creativeOffsetHeight - pushDownDiv.expansionSubtrahend);
      document.getElementById(pushDownDiv.animatedDivId).style[pushDownDiv.animatedProperty] = expandableHeight + 'px';
   }

   setTimeout(function () {
      FT.ads.pollAdHeightAndExpand(adFormat, pauseInMilliseconds);
   }, pauseInMilliseconds);

};

// Sticky flag which checks whether we should submit errors to the tracking server.
// TESTED in dfp-advertising.html
FT.Advertising.prototype.shouldSubmitToTrack = function () {
   if (!this.submitToTrack) {
      var rnd = Math.floor(Math.random() * this.CONST.urlThresholdMax);
      if (rnd < this.CONST.urlThreshold) {
         this.submitToTrack = true;
      }
   }
   return this.submitToTrack;
};

// Check if we should submit longest URL to the tracking server
// TESTED in dfp-advertising.html
FT.Advertising.prototype.checkSubmitLongestUrl = function () {
   if (this.shouldSubmitToTrack()) {
      return this.getLongestUrl();
   } else {
      return undefined;
   }
};

// Inject the code to submit the longest url to the track server, only if we
// should submit it based on the random number in shouldSubmitToTrack()
// TESTED in dfp-advertising.html and ad-on-a-page.html
FT.Advertising.prototype.injectUrlTrackCall = function () {
   var url = this.checkSubmitLongestUrl(),
      rImg;
   if (url && document.createElement) {
      clientAds.log("Injecting call to track long URL:" + url);
      rImg = document.createElement("img");
      rImg.src = this.CONST.trackUrl + "?long_url=" + url;
      rImg.id = "injectUrlTrackCall";
      rImg.setAttribute("style", "display:none");
      document.getElementsByTagName("body")[0].appendChild(rImg);
   }
   return url;
};

// Inject the code to submit the current page to the track server if it is
// unclassified.
// TESTED in dfp-advertising.html
FT.Advertising.prototype.injectUnclassifiedTrackCall = function () {
   var url,
      rImg;
   if (this.isUnclassified()) {
      if (this.shouldSubmitToTrack() && document.createElement) {
         url = document.location;
         clientAds.log("Injecting call to track unclassified page URL:" + url);
         rImg = document.createElement("img");
         rImg.src = this.CONST.trackUrl + "?unclassified=" + url;
         rImg.id = "injectUnclassifiedTrackCall";
         rImg.setAttribute("style", "display:none");
         document.getElementsByTagName("body")[0].appendChild(rImg);
      }
   }
   return url;
};

/*
 Implement a legacy ads interface to invoke Falcon ad calls when old ad
 calls happen on the page.  The legacy system calls functions in the
 following order:

 var banlb = new Advert(AD_BANLB);
 banlb.init();

 clientAds.fetch(AD_BANLB);
 clientAds.render(AD_BANLB);

 clientAds.render();  (after all ad calls)

 The falcon system calls functions in the following order:
 FT.ads.request('banlb');

 FT.ads.requestInsertedAds();  (after all .request calls)
 FT.ads.complete()                 (in page foot.js)

 To keep compatible we have the first call to Advert() detect whether we
 want DE or DFP ads.  When banlb.init() is called, FT.ads.request() will
 be called.  The clientAds.fetch() and .render(AD_BANLB) calls will do
 nothing.  The final render() call is detected because undefined is
 passed in for pos.  We will actually call FT.ads.requestInsertedAds().
 The FT.ads.complete() is normally called for each .togglable item on
 the page.

 On the Falcon home page, the Advert() call will not happen.
 FT.ads.request() will be the first opportunity to detect whether DE/DFP
 should be used.  So we initially override FT.Advertising.request(),
 save a copy of the existing .request() handler as .requestDE() and if
 our handler gets called, we detect DFP and then restore all overrides
 as needed.  We ensure we call the correct .request() so the first ad
 call doesn't get lost.

 This API compatibility means we do not have to stale the entire FT
 Cache when we implement the DFP ads across the site.  New falcon pages
 can be authored using the new API and existing pages will still be
 supported until they have been migrated to the Falcon way.

 */

// These ones are valid
var AD_BANLB = 'banlb';
var AD_NEWSSUBS = 'newssubs';
var AD_MPU = 'mpu';
var AD_HLFMPU = "hlfmpu";
var AD_MPUSKY = "mpusky";         // AD_MPU Box/Sky        300x250, 336x280, 160x600, 120x600, collapsible
var AD_OOB = 'oob';
var AD_CORPPOP = 'corppop';
var AD_REFRESH = 'refresh';
var AD_TLBXRIB = "tlbxrib";
var AD_MARKETINGRIB = "marketingrib";
var AD_INTRO = "intro";
var AD_TRADCENT = "tradcent";
var AD_DOUBLET = "doublet";
var AD_WDESKY = "wdesky";         // Sky/Wide Sky
var AD_LHN = "lhn";             // Left Hand Nav Sky

// These ones - are all deprecated
var AD_MACROAD = "deadA";
var AD_HMMPU = "deadB";
var AD_MARKETING = "deadC";
var AD_NRWSKY = "deadD";
var AD_ARTBOX = "deadE";
var AD_FTHBOX = "deadF";
var AD_TLBX = "deadG";
var AD_FMBUT2 = "deadH";
var AD_MKTBX = "deadI";
var AD_POP = "deadJ";
var AD_BXBAR = "deadK";
var AD_DKTALRT = "deadL";
var AD_DSKTICK = "deadM";
var AD_PRNT = "deadN";
var AD_INV = "deadO";
var AD_MBATOP = "deadP";
var AD_MBABOT = "deadQ";
var AD_MBALINK = "deadR";
var AD_SBHEAD = "deadS";
var AD_FTNT = "deadT";
var AD_1x1 = "deadU";
var AD_CURRCON = "deadV";
var AD_CURRBOX = "deadW";

clientAds = {
   'debug': null,
   'render': function (pos) {
      if (pos) {
         this.log('clientAds.render(' + pos + ') = NOP');
      } else {
         this.log('clientAds.render(' + pos + ') = FT.ads.requestInsertedAds() ' + (FT.env.useDFP ? '[DFP]' : '[DE]'));
         FT.ads.requestInsertedAds();
         FT.ads.complete();
      }
   },
   'fetch': function (pos) {
      this.log('clientAds.fetch(' + pos + ') = NOP');
   },
   // From here, just a few functions to help with debugging for now.
   'log': function (msg) {
      /*jshint devel:true */
      if (this.debug === null) {
         this.debug = false;
         // if (FT._ads.utils.cookie("FTQA") && FT._ads.utils.cookie("FTQA").match(/debug/)) {
         //     this.debug = true;
         // }
      }
      if (this.debug) {
         if (window.console && window.console.log) {
            window.console.log(msg);
         } else if (window.opera) {
            window.opera.postError(msg);
         }
      }
   },
   'showCookies': function (reKeys) {
      return "Cookies:\n" + document.cookie.split(';').sort().join(";\n");
   }
};

// Legacy ads interface to invoke Falcon ad calls when old ad calls seen on the page.
function Advert(pos) {
   clientAds.log('new Advert(' + pos + ')');
   // If this ever gets called, we know we are using the Legacy API
   FT.env.isLegacyAPI = true;

   // Return an object which can immediately have .init() called on it.
   var obj = {
      'name': pos,
      'init': function () {
         clientAds.log('Advert.init(' + this.name + ') = FT.ads.request(' + this.name + ') ' + (FT.env.useDFP ? '[DFP]' : '[DE]'));
         FT.ads.request(this.name);
      }
   };

   // Don't initialise ourselves more than once
   if (!FT.ads.hasCalledInitDFP) {
      FT.ads.initDFP();
   }
   // Return an object which can immediately have .init() called on it.
   return obj;
}

FT.Advertising.prototype.VERSION = {
   artifactVersion: "${project.version}",
   buildLifeId: "${buildLifeId}",
   buildLifeDate: "${buildLifeDate}",
   gitRev: "${buildNumber}",
   toString: function () {
      return " version: " + this.artifactVersion + " Build life id: " + this.buildLifeId + " Build date: " + this.buildLifeDate + " git revision: " + this.gitRev;
   }
};
FT.Advertising.prototype.library = "falcon";
clientAds.log("DFP Ads: " + FT.Advertising.prototype.library.toUpperCase() + " " + FT.Advertising.prototype.VERSION.toString());

/*  Functions with no direct test cases yet

 FT.Advertising.prototype.createAdRequestFromVideoUrl = function (pos, url)
 FT.Advertising.prototype.insertAdIntoIFrame = function (pos, requestURL)

 FT.Advertising.prototype.handleRefreshLogic = function (obj, timeout)
 FT.Advertising.prototype.clearTimer = function ()
 FT.Advertising.prototype.complete = function ()
 FT.Advertising.prototype.callback = function (rResponse)
 FT.Advertising.prototype.storeResponse = function (rResponse)
 FT.Advertising.prototype.addDiagnostic = function (pos, rDiagObj)
 FT.Advertising.prototype.extendBaseAdvert = function (rResponse)
 FT.Advertising.prototype.insertNewAd = function (pos)
 FT.Advertising.prototype.clearBaseAdvert = function ()
 FT.Advertising.prototype.prepareAdVars = function (AllVars)
 FT.Advertising.prototype.erightsID = function ()
 FT.Advertising.prototype.duplicateEID = function (eid)
 FT.Advertising.prototype.rsiSegs = function () {
 FT.Advertising.prototype.prepareBaseAdvert = function (pos)
 FT.Advertising.prototype.encodeBaseAdvertProperties = function (mode)
 FT.Advertising.prototype.buildURLFromBaseAdvert = function (mode)
 FT.Advertising.prototype.requestInsertedAds = function ()
 FT.Advertising.prototype.startRefreshTimer = function (delay)
 FT.Advertising.prototype.renderImage = function (rResponse)
 FT.Advertising.prototype.detectERights = function (obj)
 FT.Advertising.prototype.excludeFields = function (exclusions, obj)
 FT.Advertising.prototype.stripLeadingZeros = function (KeysToStrip, obj)
 FT.Advertising.prototype.fieldRegex = function (RegexKeyNames, obj)
 FT.Advertising.prototype.fieldSubstr = function (SubStrKeyNames, obj)
 FT.Advertising.prototype.showDiagnostics = function (pos)
 FT.Advertising.prototype.breakout = function (rResponse)
 FT.Advertising.prototype.removeDEMethods = function () {

 */

// ads.js Financial Times Web App advertising library
/*jslint browser: true, regexp: true, sloppy: true, white: false, plusplus: true,
  maxerr: 1000, indent: 3, todo: true */
/*global FT, alert, console, document, escape, jQuery, unescape, window */
/*properties
   '-', '-ds', ADSJSEND, ADSJSSTART, Adverts, DFPImpression, Defaults, FT,
   FullPageAdModes, History, Parts, Platforms, Queue, QuoteList, TempVars, URL,
   URLParts, VERSION, VisibilityHandlers, WeinreServerURL, ac, adCall, adId, adName,
   ad_call_pending, ad_call_url, addClass, ads, advertiserId, ajax, alv, append,
   apply, article, audSci, audSciLimit, banlb, banlb2, breakPoint, breakpoints,
   cache, cacheAds, cachedAdCall, calcTime, call, charAt, cleanAd, clickUrl,
   composeAd, composedAd, connection_slow, console, cookie, cors, creativeId,
   cs, css, customHtml, dataType, debug, debug_ghost, decodePlatform, defaultVisibilityHandler, demolish,
   device_size, dfp_site, dfp_zone, disableFullPageAds, display, docWrite,
   doc_write_calls, docco, done, each, eid, empty, enableFullPageAds, endTime, env,
   error, errorThrown, extractAppControlAds, extractImageClick,
   extractJSONTemplate, fetchAdByURL, fetchTime, fixed_eid, fixed_height,
   fixed_ord, fixed_ort, fixed_platform, fixed_prem, fixed_width, fixed_zone,
   floor, formats, fullpage, getAdFormatValue, getAudSci, getCachedAd,
   getCookieSettings, getDeviceSize, getInstance, getKeys, getKeysWithData,
   getPosFromURL, getRequestInfo, getResponseInfo, getTime, getURL, getVisibilityHandler, 
   handlers, hasAdResponse, hasAdsToRelease, hasDocWrite,
   hasOwnProperty, has_centering, has_fullpage_ads, has_impression,
   has_orientation, hlfmpu, html, imageAltText, imageLandscapeUrl, imageUrl,
   impressionUrl, indexOf, info, injectAd, injectAdTimes, injectImpression,
   innerHTML, innerHeight, innerWidth, invokeDebugger, isFullPage, isPreFetch,
   isPremium, isTest, is_centered, is_impression_submitted, is_prefetch, join,
   jqAjax, jqXHR, jsonAd, large, 'large:ios', largewide, length, log,
   logHistory, logHistoryPos, makeErrorAd, makeImpressionURL, match, maxHistory,
   maxQueueSize, medium, method, mpu, network_code, offline, onAdError,
   onAdReceived, onOrientationChanged, onVisibilityChanged, onelement, ord, orientation, ort,
   pageCount, pageCountWrap, pageType, parse, platform, pop, popAdFromQueue,
   pos, prototype, push, queueAd, queueSize, queueSummary, random, realDocWrite,
   realDocWriteln, releaseAds, remote_debug_url, removeClass, renderCachedAd,
   replace, request, reset, resetAdverts, resetValue, response, responseText,
   round, roundTime, screen_mode, script, server, setConnectionSlow, setOffline,
   setPlatform, setPremiumAd, setUserId, setVisibilityHandler, setup, setupFullPageAds, showHistory,
   size, small, 'small:ios', sort, split, startPage, startTime, status, stopAdCalls, stopads,
   submitImpressions, submit_impressions_pending, substring, success, support,
   sz, tag, targeting, test, test_ad_times, text, textStatus,
   thirdPartyImpression, thirdPartyImpressionUrl, tile, toLowerCase, toString,
   toUpperCase, track_ad_times, type, u, url, 
   userId, when_queued, write, writeln, zone, shift, resolveFunction, hasPendingAdToCache,
   incomplete, isIncomplete, lastIndexOf
*/

/* How to use this FT Webapp ads library to deliver ads from DFP into your
   webapp.

   You need to customize any constants within this library and incorporate it
   into your javascript code base. Alternatively you could include it as is 
   and then override the constants before calling the setup function.

   At run time your process will be to call setup(size, offline, platform, fullpage)
   to initially set up the ad library. Then you can set any other flags or 
   call methods to set the operation mode of the library. 

   Methods you can use to affect the operational mode or ad targeting:
   
   setUserId()
   setPremiumAd()
   setConnectionSlow()
   setOffline()
   setupFullPageAds()

   When you are preparing a screen or page which will contain ads you need to 
   call startPage(zone, pageType) to set the DFP zone level targeting and let 
   the library count what type of app page it is. You should then call any 
   other functions or set flags which relate to that particular application
   page.

   Within the page HTML you will have a div which determines physically where
   the advertisement is placed. You can use an id which matches the ad 'pos' 
   or your own way of identifying the placement and pass in an HTMLElement to
   the ad call. 

   You can retrieve ads two ways: immediate call and insertion into the app or
   pre-fetch for a smoother effect. The pre-fetch method cannot be overly 
   delayed so cannot be used for offline ads or for caching ads for a long 
   time.

   If you are making direct ad calls for insertion into the app page you will 
   use adCall(pos, rDiv, rcCallBack, orientation.)  

   If you wish to pre-fetch an ad you can use cacheAds(rAdsToCache, rcCallBack) 
   or cachedAdCall(pos, rcCallBack, orientation.) You will then have to call
   renderCachedAd(pos, rDiv, rcCallBack) when the time comes to insert the ad 
   into an app page. Finally, when the ad comes into view in the application 
   you will have to call submitImpressions(pos) to ensure DFP tracks the ad 
   impression.

   When you are about to destroy an app page containing ads you need to call
   releaseAds().

   For rich media ads the ad itself may need to know when something has 
   happened in the webapp of interest to it. When the ad is swiped on/off
   screen it may need to pause the playback of a video. The webapp will have
   to call onVisibilityChanged(pos, state) so that the ad can be notified. To
   register a visibility handler function, the ad library provides the
   setVisibilityHandler(pos, rcFunction) function.

   Configuration:

   Some settings within the library must be customized to the needs of the 
   webapp.  Each setting below is in the FT.env namespace.

   dfp_site

   - this will be assigned by Ad Ops to any new sites/apps and should be relatively
   constant across an app. In addition to the main site name, a test
   site name can be created to provide separate ads in a test environment.
   For example if bank.5887.home is your main site name then test.5887.home
   can be set up as a test site for ads in your test environment.

   dfp_zone

   - zones will be defined and provided to webapps and will vary across
   the individual sections of the app.  This value will likely vary for each 
   page in the app.

   targeting

   - additional targeting information may be set by the app based on query 
   string, or other special requirements.  Before calling any of the ad call
   functions you would set additional targeting with 
   FT.env.targeting = ';q=markets;author=bill';
   If you don't need additional targeting, set this to an empty string.
   FT.env.targeting = '';

   formats

   - an object mapping ad position names into ad sizes and any additional
   parameters for the ad call based on the screen size of the device. Screen
   sizes of small, medium, large and largewide are default and it is up to the
   webapp to decide what constitutes each size or whether other sizes are added.
   Each ad position name you use in the app needs to have an entry in the 
   table so that the allowed sizes can be put into the ad call for that 
   position. If you try to make an ad call for a position which has no entry, 
   then no ad call will be made and the position will remain empty.

   FullPageAdModes

   - an object which configures which modes will allow full page ad calls.
   You constuct a key name based on the device size and platform. For example
   'small:ios': true will enable full page ads on small screen ios devices.

   audSciLimit

   - if you do not require targeting ads based on FT audience science segments
   then you can leave this set to zero. Otherwise, set this to the number of
   Audience Science segments you wish to include in the ad call. These segments
   come from the rsi_segs cookie and must have the client code J07717_ to be
   recognized.

   pageCountWrap

   - if you would like to target an ad every Nth time the user uses an app 
   screen you can set this parameter to determine when the counter resets back
   to zero.

   server

   - if possible, the app can locate which country their users are in and
   change to a local ad server.  Otherwise the default server can be used.  DFP
   use ISO two letter codes to specify alternate ad servers i.e.
   ad.uk.doubleclick.net and have a limited number of servers so you will
   have to use only the proper ad servers if you wish to go down this route.
   To change the server you would use FT.env.server = 'uk.'; before calling
   and ad call functions.

   Here is a fully active sample which will deliver an ad for you to see:

   <!DOCTYPE html>
   <html>
   <head>
   <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
   <script src="http://ft-ad-enablement.appspot.com/h5ads/ads.js"></script>
   </head>
   <body>
   <div id="banlb">[ADVERTISEMENT]</div>
   <script>

   $(function () {
      // One time setup in the app.
      FT.env.debug = true;
      FT.env.dfp_site = 'test.5887.html5-app';
      FT.env.setup('small', false, 'ios', false); // configured for 300x50 ad only and forced no fullpage ads support.

      // wait a bit to simulate getting page content, etc.
      setTimeout(function () {
         FT.env.startPage('home', 'section');
         FT.env.adCall('banlb', '#banlb');
      }, 300);
   });

   </script>
   </body>
   </html>

*/
var FT = window.FT || {};

FT.env = {
   'ADSJSSTART': true,
   'VERSION': '1.9 $Id: ads.js 168229 2013-09-30 07:13:43Z mateoa $', // Version
   'alv': 1, // Ad Library Version parameter in DFP ad call

   // THIRD PARTY CUSTOMISATION HERE
   'dfp_site':  'mob.5887.html5-app',

   'formats':   {
      'small': {
         'banlb':    '300x50',
         'banlb2':   '300x50',
         'mpu':      '300x250',
         '-ds':      's'
      },
      'medium': {
         'banlb':    '600x100',
         'banlb2':   '600x100',
         '-ds':       'm'
      },
      'large': {
         'banlb':    '728x90',
         'mpu':      '300x250',
         'hlfmpu':   '300x600,300x250',
         '-ds':      'l'
      },
      'largewide': {
         'banlb':    '728x90',
         'mpu':      '300x250',
         'hlfmpu':   '300x600,300x250',
         '-ds':      'lw'
      },
      '-': '-'
   },

   'audSciLimit': 0,
   'pageCountWrap': 6,
   'maxHistory': 25,
   'maxQueueSize': 1,
   'FullPageAdModes' : {'large:ios' : true, 'small:ios' : true},
   // END THIRD PARTY CUSTOMISATION

   'debug': false,
   //'debug_ghost': false,

   'Platforms': ['ios', 'an', 'bb', 'pb', 'wm'],
   'TempVars': ['dfp_zone', 'tile', 'Adverts', 'targeting', 'pos', 'sz', 'url', 'URLParts', 'tag', 'Parts', 'jsonAd', 'doc_write_calls', 'ort', 'isPremium'],
   'QuoteList': ['clickUrl', 'impressionUrl', 'thirdPartyImpressionUrl', 'imageAltText', 'imageUrl', 'imageLandscapeUrl'],
   'Defaults': {
      'offline':     false,
      'isTest':      false,
      'isPremium':   false,
      //'use_ghostwriter':  true,
      'has_fullpage_ads': false,
      'track_ad_times':   false,
      'fixed_ord':    undefined,
      'fixed_ort':    undefined,
      'fixed_prem':   undefined,
      'fixed_width':  undefined,
      'fixed_height': undefined,
      'server':      '',
      'dfp_zone':    'unclassified',
      'fixed_zone':  undefined,
      'targeting':   '', //';key=value',
      'screen_mode': undefined,
      'device_size': 's',
      'network_code': '/N5887',
      'method':      '/adx/',
      'tile':        0,
      'ac':          0,
      'doc_write_calls': 0,
      'connection_slow': undefined,
      'cs':          undefined,
      'eid':         undefined,
      'platform':    undefined,
      'fixed_eid':   undefined,
      'fixed_platform': undefined,
      'pageCount':   {},
      'Adverts':     {},
      'VisibilityHandlers': {},
      'Queue':       [],
      'History':     [],
      'pos':         undefined,
      'sz':          undefined,
      'url':         undefined,
      'ort':         undefined,
      'URLParts':    undefined,
      'tag':         undefined,
      'Parts':       undefined,
      'audSci':      undefined,
      'jsonAd':      undefined,
      'u':               undefined,
      'breakpoints': '',
      'remote_debug_url': 'localhost:80810'
   },

   // Get the single instance of the ad library
   'getInstance': function () {
      return FT.env;
   },

   // Reset the ad library to default values (needed for test plans)
   'reset': function (bHard) {
      var ft = this, idx, key = '';
      ft.breakPoint('reset');
      if (bHard) {
         for (key in ft.Defaults) {
            if (ft.Defaults.hasOwnProperty(key)) {
               ft.resetValue(key);
            }
         }
      } else {
         for (idx = 0; idx < ft.TempVars.length; idx += 1) {
            if (ft.TempVars[idx] === 'Adverts') {
               ft.resetAdverts();
            } else {
               ft.resetValue(ft.TempVars[idx]);
            }
         }
      }
      ft.ord = ft.fixed_ord || Math.floor(Math.random() * 1E16);

      if (ft.History.length >= ft.maxHistory) {
         ft.History = [];
      }
   },

   // Reset ads object property to the default value from Defaults property
   // Array and object properties are reset to empty array or object
   'resetValue': function (key) {
      var ft = this, value = ft.Defaults[key];
      value = typeof value !== 'object' ? value : Object.prototype.toString.apply(value) === '[object Array]' ? [] : {};
      ft[key] = value;
   },

   // Adverts array requires special handling. Don't clear any cached
   // Ads from the array
   'resetAdverts': function () {
      var ft = this, idx, pos, max = ft.queueSize(), CachedAdverts = {};
      ft.breakPoint('resetAdverts');
      for (idx = 0; idx < max; idx += 1) {
         pos = ft.Queue[idx].pos;
         ft.logHistoryPos(pos, 'resetAdverts: ' + pos + ' preserved');
         CachedAdverts[pos] = ft.Adverts[pos];
      }
      ft.Adverts = CachedAdverts;
   },

   // Set the erights ID of the user
   'setUserId': function (eid) {
      var ft = this;
      ft.breakPoint('setUserId');
      ft.eid = eid ? ";eid=" + eid : "";
   },

   // Set the flag indicating the user is on a slow connection (3G)
   'setConnectionSlow': function (bSlow) {
      var ft = this;
      ft.breakPoint('setConnectionSlow');
      ft.connection_slow = bSlow ? 1 : 0;
   },

   // Set the flag indicating the user is offline and there should be no ad calls to DFP
   'setOffline': function (bOffline) {
      var ft = this;
      ft.breakPoint('setOffline');
      ft.offline = bOffline ? true : false;
      if (ft.offline) {
         ft.logHistory("Ad library set to offline.");
      }
   },

   // Set the platform of the device we are running on.
   // i.e. ios, an, bb, pb, wm
   //      Apple iOS, Android, Blackberry, Playbook, Windows Mobile
   'setPlatform': function (platform) {
      var ft = this;
      ft.breakPoint('setPlatform');
      if (platform === "") {
         platform = undefined;
      }
      ft.platform = platform ? ";platform=" + platform : "";
   },

   // gets a named value from the ad formatting table for the given screen mode
   // returns undefined if one does not exist
   'getAdFormatValue': function (screen_mode, key) {
      var ft = this, value;
      //ft.logHistory('screen_mode = ' + screen_mode + ' and key = ' + key);
      if (ft.formats[screen_mode] && ft.formats[screen_mode][key]) {
         value = ft.formats[screen_mode][key];
      }
      return value;
   },

   // gets the device size letter for screen mode name
   'getDeviceSize': function (screen_mode) {
      var ft = this;
      screen_mode = screen_mode || ft.screen_mode;
      return ft.getAdFormatValue(screen_mode, '-ds');
   },

   // Enable full page ads
   'enableFullPageAds': function () {
      var ft = this;
      ft.breakPoint('enableFullPageAds');
      ft.formats[ft.screen_mode].fullpage = '2x2';
      ft.has_fullpage_ads = true;
   },

   // Disable full page ads
   'disableFullPageAds': function () {
      var ft = this;
      ft.breakPoint('disableFullPageAds');
      if (ft.formats[ft.screen_mode]) {
         delete ft.formats[ft.screen_mode].fullpage;
      }
      ft.has_fullpage_ads = false;
      ft.logHistoryPos('fullpage', "Disabling full page ads.");
   },

   // set the full page ad state based on the screen_mode and platform, or
   // the override value of the full page
   'setupFullPageAds': function (fullpage) {
      var ft = this, platform = ft.fixed_platform || ft.decodePlatform(ft.platform);
      if (fullpage === undefined && ft.FullPageAdModes[ft.screen_mode + ':' + platform] === true) {
         fullpage = true;
      }
      if (fullpage) {
         ft.enableFullPageAds();
      } else {
         ft.disableFullPageAds();
      }

      // Temporary injection of style sheet values until the webapp includes them.
//      jQuery(document).ready(function () {
//         FT.env.breakPoint('setupFullPageAdsReady');
//         jQuery('head').append('<style type="text/css">' +
//            '.fullpage-advert-container { background-color: black; }' +
//            '.dfp-centered-ad-wrapper { height:inherit; width:inherit; display:table-cell; vertical-align:middle; padding:0px; margin:0px; }' +
//            '.dfp-centered-ad { display: block; margin-left: auto; margin-right:auto; padding:0px; }' +
//            '</style>');
//      });

   },

   // decode a platform parameter to extract the platform
   // ;platform=ios  => ios
   'decodePlatform': function (platform) {
      platform = platform || '';
      platform = platform.replace(/^;platform=/, '');
      return platform;
   },

   // Get audience science segments encoded for the DFP ad call URL
   'getAudSci': function (cookie) {
      var ft = this, idx, rsiSegs, segment, Segments = [], Found = [];
      ft.cookie = cookie === undefined ? document.cookie : cookie;
      ft.audSci = '';

      if (ft.audSciLimit) {
         rsiSegs = ft.cookie.replace(/^.*\brsi_segs=([^;]*).*$/, '$1');
         if (rsiSegs !== ft.cookie) {
            Segments = rsiSegs.split(/\|/);
            Found = [];
            for (idx = 0; Found.length < ft.audSciLimit && idx < Segments.length; idx += 1) {
               segment = Segments[idx];
               if (segment.match(/^J07717_/)) {
                  segment = segment.replace(/^J07717_/, '');
                  segment = ';a=z' + (parseInt(segment, 10) - 10000);
                  Found.push(segment);
               }
            }
            ft.audSci = Found.join('');
         }
      }
      return ft.audSci;
   },

   // At the moment only full paga ad positions are pre-fetched
   'isPreFetch': function (pos) {
      var ft = this;
      return ft.isFullPage(pos);
   },

   // Check if an ad position is a full page ad
   'isFullPage': function (pos) {
      return pos === 'fullpage' ? true : false;
   },

   // Set the state of the premium ad parameter. If set true
   // the next ad call will have the prem=1 added and then the
   // flag will be cleared to prevent further ad calls from having it.
   'setPremiumAd': function (bPrem) {
      var ft = this;
      ft.breakPoint('setPremiumAd');
      ft.isPremium = bPrem;
   },

   // Get a DFP ad call URL for the named ad position.
   // optional orientation param for fullpage ads (l=landscape, p=portrait)
   'getURL': function (pos, orientation) {
      var ft = this, method = ft.isPreFetch(pos) ? '/pfadx/' : ft.method;
      ft.breakPoint('getURL', pos);
      ft.url = undefined;
      ft.URLParts = [];
      ft.pos = pos;
      ft.getRequestInfo(pos);
      if (!ft.offline) {
         ft.sz = ft.formats[ft.screen_mode][ft.pos];
         ft.ac = ft.pageCount.article;
         ft.ort = ft.pos === 'fullpage' ? orientation : "";

         // Live Ad Calls pre 2012-03
         // http://ad.doubleclick.net/adj/mob.5887.html5-app/home;ds=l;sz=300x250;pos=mpu;eid=loggedout;tile=1;platform=ios;ord=9372063328046352?
         // New Ad Calls when go live with VERSION 1.4
         // http://ad.doubleclick.net/adx/mob.5887.html5-app/home;ds=l;alv=1;platform=ios;sz=300x250;pos=mpu;eid=loggedout;tile=1;ord=4206703647505492?&_=1333104304310

         if (ft.audSci === undefined) {
            ft.audSci = ft.getAudSci(ft.cookie);
         }
         ft.ac       = ft.ac ? ";ac=" + ft.ac % ft.pageCountWrap : "";

         // use the override values for eid and ort from the cookie if they were provided.
         ft.ort      = ft.fixed_ort ? (";ort=" + ft.fixed_ort) : ft.ort ? (";ort=" + ft.ort) : "";
         ft.eid      = ft.fixed_eid ? ";eid=" + ft.fixed_eid : ft.eid || "";
         ft.cs       = ft.connection_slow !== undefined ? ";cs=" + ft.connection_slow : "";
         ft.isPremium = ft.fixed_prem ? ";prem=1" : ft.isPremium ? ";prem=1" : "";

         // US18778: erights on webapp in u param
         if (ft.eid && ft.eid !== ';eid=loggedout') {
            ft.u = ";u=eid=" + ft.eid.split('=')[1];
         } else {
            ft.u = undefined;
         }

         if (ft.fixed_platform) {
            ft.setPlatform(ft.fixed_platform);
         }
         if (ft.sz) {
            ft.tile += 1;
            ft.URLParts = ['http:\/\/ad.', ft.server, 'doubleclick.net', ft.network_code, method, ft.dfp_site, '/', ft.dfp_zone, ';ds=', ft.device_size, ';alv=', ft.alv, ft.platform, ';sz=', ft.sz, ';pos=', ft.pos, ft.isPremium, ft.ort, ft.targeting, ft.audSci, ft.ac, ft.cs, ft.eid, ';dcmt=application%2fjson;tile=', ft.tile, ft.u, ';ord=', ft.ord,  '?'];
            ft.url = ft.URLParts.join('');
            ft.Adverts[ft.pos].request.url = ft.url;
            ft.Adverts[ft.pos].request.is_prefetch = ft.isPreFetch(pos);
            ft.setPremiumAd(false);
         }
      }
      ft.logHistoryPos(ft.pos, "getURL: " + ft.url);
      return ft.url;
   },

   // extract the ad position from the Ad Call URL
   'getPosFromURL': function (URL) {
      var pos = 'unknown', Match = URL.match(/;pos=([^;]+);/);
      if (Match && Match.length) {
         pos = Match[1];
      }
      return pos;
   },

   // getRequestInfo(pos, rRequest) - get info about the ad request after getURL was called
   // sets the info to rRequest if there is currently no info.
   'getRequestInfo': function (pos, rRequest) {
      var ft = this;
      ft.Adverts[pos] = ft.Adverts[pos] || {};
      ft.Adverts[pos].request = ft.Adverts[pos].request || rRequest || {};
      return ft.Adverts[pos].request;
   },

   // getResponseInfo(pos, rResponse) - get info about the ad response after adCall was called
   // sets the info to rResponse if there is currently no info.
   'getResponseInfo': function (pos, rResponse) {
      var ft = this, key;
      ft.Adverts[pos] = ft.Adverts[pos] || {};
      ft.Adverts[pos].response = ft.Adverts[pos].response || rResponse || {};

      if (rResponse !== undefined && ft.Adverts[pos].response !== rResponse) {
         for (key in rResponse) {
            if (rResponse.hasOwnProperty(key)) {
               ft.Adverts[pos].response[key] = rResponse[key];
            }
         }
      }

      return ft.Adverts[pos].response;
   },

   // hasAdResponse(pos) - check if there is an ad response present for position.
   'hasAdResponse': function (pos) {
      var ft = this, result = false;
      ft.Adverts[pos] = ft.Adverts[pos] || {};
      if (ft.Adverts[pos].response) {
         result = true;
      }
      return result;
   },

   // Clean up JSON Ad parameters for use with composeAd
   // Causes double quotes in URL parameters to be replaced with %34
   // Fixes mis-booked ads which have the pos parameter broken
   'cleanAd': function (rAd) {
      var ft = this, idx, replace;
      for (idx = ft.QuoteList.length - 1; idx >= 0; idx -= 1) {
         if (rAd[ft.QuoteList[idx]] !== undefined) {
            replace = /Url/.test(ft.QuoteList[idx]) ? '%34' : '&#34;';
            rAd[ft.QuoteList[idx]] = rAd[ft.QuoteList[idx]].replace(/"/g, replace);
         } else {
            rAd[ft.QuoteList[idx]] = '';
         }
      }
      if (rAd.pos) {
         replace = rAd.pos.split(';');
         if (replace) {
            rAd.pos = replace[0];
         }
      }

      return rAd;
   },

   // Compose the JSON ad into HTML payload
   'composeAd': function (rAd) {
      var ft = this, info, error = false, type = 'image click', html = '', alt = '',
         isEmpty = false, isStopAdCalls = false, //bGhostOk = false, 
         hasImpression = false, isOriented,
         imgUrl, imgHiddenUrl, classValue = '', classValueHidden = '';
      ft.breakPoint('composeAd');
      ft.cleanAd(rAd);
      info = [
         rAd.size || 'NxM', ' ',
         '[adv: ',
         rAd.advertiserId || '?',
         ', ad: ',
         rAd.adId || '?',
         ', cr: ',
         rAd.creativeId || '?',
         ']'
      ].join("");

      // TODO re-enable once testing is in place
      if (false) { // jslint weird condition ok temporarily
         if (rAd.stopAdCalls) { // jslint weird condition ok temporarily
            type = 'STOPAD' + 'CALLS marker';
            isStopAdCalls = true;
            isEmpty = true;
         }
      }

      if (rAd.customHtml && rAd.customHtml !== '') {
         // TODO REFACTOR into its own function? getting a little big
         html = rAd.customHtml;

         if (isStopAdCalls === false) {
            type = 'rich media';
         }

         if (html.indexOf("NO AD" + "VERT") >= 0) {
            type = 'NO AD' + 'VERT marker';
            isEmpty = true;
            rAd.clickUrl = undefined;
            rAd.imageUrl = undefined;
            rAd.imageAltText = undefined;

            if (rAd.pos === 'fullpage' && rAd.impressionUrl !== '') {
               html = html + '<img style="display: none;" src="' + rAd.impressionUrl + '"\/>';
               hasImpression = true;
            }
         }

         if (false) { // jslint weird condition ok temporarily
            if (html.indexOf("STOP" + "ADCALLS") >= 0) {
               type = 'STOPAD' + 'CALLS marker';
               isStopAdCalls = true;
               isEmpty = true;
            }
         }

        // if (type === 'rich media') {
        //    bGhostOk = true;
        // }

      } else {
         // TODO REFACTOR into it's own function? getting a little big
         if (rAd.imageAltText) {
            alt = ' title="' + rAd.imageAltText + '" alt="' + rAd.imageAltText + '"';
         }
         imgUrl = rAd.imageUrl;
         if (imgUrl !== '') {
            if (rAd.is_centered) {
               classValue = "dfp-centered-ad";
            }
            if (rAd.orientation) {
               imgHiddenUrl = rAd.imageLandscapeUrl;
               if (rAd.orientation === "l") {
                  type = type + " with LANDSCAPE orientation";
                  isOriented = 'l';
                  if (classValue !== '') {
                     classValue = classValue + ' ';
                  }
                  classValueHidden = classValue + "dfp-fullpage-portrait";
                  classValue = classValue + "dfp-fullpage-landscape";
                  imgUrl = rAd.imageLandscapeUrl;
                  if (imgUrl === '') {
                     type = type + ' no landscape image URL present';
                     imgUrl = rAd.imageUrl;
                  }
                  imgHiddenUrl = rAd.imageUrl;
               } else {
                  type = type + " with PORTRAIT orientation";
                  isOriented = 'p';
                  if (classValue !== '') {
                     classValue = classValue + ' ';
                  }
                  classValueHidden = classValue + "dfp-fullpage-landscape";
                  classValue = classValue + "dfp-fullpage-portrait";
               }
            }
            if (classValue !== '') {
               html = html + '<img src="' + imgUrl + '" class="' + classValue + '"' + alt + '\/>';
               if (imgHiddenUrl && imgHiddenUrl !== '') {
                  html = html + '<img src="' + imgHiddenUrl + '" class="' + classValueHidden + '"' + alt + '\/>';
               }
            } else {
               html = html + '<img src="' + imgUrl + '"' + alt + '\/>';
            }
         } else {
            type = 'incorrect JSON no creative';
            error = true;
            isEmpty = true;
         }

         if (rAd.clickUrl !== '') {
            html = '<a href="' + rAd.clickUrl + '" target="_blank">' + html + '</a>';
         } else {
            type = type + ' no click URL';
         }

         // Non pre-fetched ads, we have to put the impression URL directly into the ad.
         if (!ft.isPreFetch(rAd.pos)) {
            hasImpression = true;
            if (rAd.thirdPartyImpressionUrl !== '') {
               html = html + '<img style="display: none;" src="' + rAd.thirdPartyImpressionUrl + '"\/>';
            }
         } else {
            ft.logHistoryPos(rAd.pos, 'composeAd() - excluded impression trackers.');
         }

         // Wrapper div needs to have centering and orientation classes added to it.
         classValue = "";
         if (isOriented) {
            classValue = (isOriented === 'l') ? "dfp-landscape" : "dfp-portrait";
         }
         if (rAd.is_centered) {
            classValue = "dfp-centered-ad-wrapper" + (classValue === '' ? '' : ' ' + classValue);
            type = type + " with centering";
         }
         if (classValue !== '') {
            html = '<div class="' + classValue + '">' + html + '</div>';
         }
      }
      return {
         'error': error,
         'type': type,
         //'ghostwriter_ok': bGhostOk,
         'info': info,
         'html': html,
         'has_centering': rAd.is_centered ? true : false,
         'has_orientation': isOriented,
         'has_impression': hasImpression,
         'empty': isEmpty,
         'stopads': isStopAdCalls
      };
   },

   // Extract clickURL and Image from a standard DFP Image Ad if possible
   // <a target="_blank" href="CLICKURL"><img src="IMAGEURL" border=0 alt="ALTTEXT"></a>
   'extractImageClick': function (payload) {
      var rAd, Match;
      Match = payload.match(/<a target="_blank" href="([^"]*)"><img src="([^"]*)" border=0 alt="([^"]*)"><\/a>/i);
      if (Match) {
         rAd = {
            'clickUrl': Match[1],
            'imageUrl': Match[2],
            'imageAltText': Match[3],
            'error': false,
            'stopAdCalls': false,
            'empty': false,
            'hasDocWrite': false,
            'type': "DFP Standard Image Ad"
         };
      }
      if (!rAd) {
         Match = payload.match(/<a target="_blank" href="([^"]*)"><img src="([^"]*)"><\/a>/i);
         if (Match) {
            rAd = {
               'clickUrl': Match[1],
               'imageUrl': Match[2],
               'imageAltText': '',
               'error': false,
               'stopAdCalls': false,
               'empty': false,
               'hasDocWrite': false,
               'type': "DFP Standard Image Ad"
            };
         }
      }
      if (rAd && /viewad\/817-grey\.gif/.test(rAd.imageUrl)) {
         rAd.error = true;
         rAd.empty = true;
         rAd.type = "DFP System GIF";
      }
      return rAd;
   },

   // DFP Creative Template inserts a comment before the JSON causing a parse error
   // we detect this and carry on going. Nothing gonna stop us now.
   'extractJSONTemplate' : function (payload) {
      var ft = this, rAd, replaced;
      // look for template comments, remove it
      // ex:  <!-- Template ID = 19151 Template Name = FT WebApp NO ADVERT (JSON) -->
      replaced = payload.replace(/^\s*<!--\s*Template\s*ID\s*=[^>]+-->\s*/, '');
      if (replaced.length !== payload.length) {
         // parse for JSON only if we found the DFP Creative Template comment.
         try {
            rAd = JSON.parse(replaced);
            rAd.type = "JSON with DFP creative template comment";
         } catch (err) {
            // IGNORE if not JSON
            ft.logHistory("extractJSONTemplate - no JSON found in (" + payload + ")");
         }
      }
      return rAd;
   },

   // Check for NO ADVERT or STOPADCALLS in the payload and if there, then return a JSON
   // object as if we had received a JSON NO ADVERT or STOPADCALLS
   'extractAppControlAds': function (payload) {
      var rAd, noAd, key,
         noAdRegexes = {
            "pos": /<!--\s+No\s+ad\s+booked\s+for\s+([^ ]+)\s*-->/,
            "adId": /AdId:\s*([^\s<]+)/,
            "advertiserId": /AdvId:\s*([^\s<]+)/,
            "creativeId": /CrId:\s*([^\s<]+)/,
            "adName": /<!--\s+(No\s+ad\s+booked\s+for\s+[^>]*?)\s*-->/
         };

      noAd = payload.match(/<!-- NO ADVERT -->/);
      if (noAd) {
         rAd = {
            'stopAdCalls': false,
            'empty': true,
            'hasDocWrite' : false,
            'customHtml': '<!-- NO AD' + 'VERT -->',
            'type': 'NO AD' + 'VERT marker'
         };

         for (key in noAdRegexes) {
            if (noAdRegexes.hasOwnProperty(key)) {
               noAd = payload.match(noAdRegexes[key]);
               if (noAd) {
                  rAd[key] = noAd[1];
               }
            }
         }
      }
      return rAd;
   },

   // Fetch a JSON ad from the URL specified.
   'fetchAdByURL': function (URL, rcCallBack) {
      var ft = this, pos = ft.getPosFromURL(URL), bSaveCors = jQuery.support.cors;
      ft.breakPoint('fetchAdByURL', pos);
      ft.url = URL;
      ft.jsonAd = undefined;
      ft.logHistoryPos(pos, "fetchAdByURL: " + ft.url);
      // force cross-site scripting (as of jQuery 1.5) (for IE)
      // at this time FF,Chrome,Safari don't need it.
      // Opera gives ReferenceError: Security violation and cannot be made to work [http://my.opera.com/community/forums/topic.dml?id=995862]

      // COMPLEX:RB:20120919: FT Labs patch: change from always-JSON requests to text requests with a slightly
      // smarter JSON parse.  This avoids JSON parse attempt on non-JSON ads, and so avoids WebKit debuggers
      // choking on the JQuery-internal JSON parse failure in those cases.
      jQuery.support.cors = true;
      jQuery.ajax({
         'url': URL,
         'dataType': 'text', // FT Labs patch: was 'json'
         'cache': false,
         'success': function (rAd, textStatusUnused, jqXHR) { // FT Labs patch: was just rAd argument

            // FT Labs patch start
            if (!rAd || (typeof rAd !== 'object' && rAd.charAt(0) === '<')) {
               ft.onAdError(URL, 'parsererror', new Error('Skipping non-JSON JSON parse'), rcCallBack, jqXHR, this);
               return;
            }

            try {
               if (typeof rAd !== 'object') {
                  rAd = JSON.parse(rAd);// extract the zone from the url, set to rAd.zone
                  rAd.zone = URL.substring(URL.lastIndexOf("/") + 1, URL.indexOf(";"));
               }
            } catch (err) {
               ft.onAdError(URL, 'parsererror', err, rcCallBack, jqXHR, this);
               return;
            }
            // FT Labs patch end

            ft.onAdReceived(URL, rAd, rcCallBack, this);
         },
         'error': function (jqXHR, textStatus, errorThrown) {
            ft.onAdError(URL, textStatus, errorThrown, rcCallBack, jqXHR, this);
         }
      });
      jQuery.support.cors = bSaveCors;
   },

   // Called back when JSON ad is returned
   'onAdReceived': function (URL, rAd, rcCallBack, jqAjax) {
      var ft = this, rComposed, rResponse, ok = true;

      rcCallBack = rcCallBack || function () {};
      ft.breakPoint('onAdReceived', rAd.pos);
      ft.cleanAd(rAd);
      rComposed = ft.composeAd(rAd);
      ft.logHistoryPos(rAd.pos, 'onAdReceived: ' + (rComposed.error ? "Error " : "")  + rComposed.type + ' from ' + URL + ' ' + ft.queueSummary());

      // Store the response Ad and the composed Ad in the Adverts Array so it is available later.
      rResponse = ft.getResponseInfo(rAd.pos, rAd);
      rResponse.composedAd = rComposed;

      if (rComposed.error) {
         ok = false;
         ft.onAdError(URL, 'payloaderror', rComposed.type, rcCallBack, { 'status': 200, 'responseText': 'JSON keys: ' + ft.getKeysWithData(rAd) }, jqAjax);
      } else {
         ft.jsonAd = rAd;
         rResponse.is_impression_submitted = false;

         // For share of voice we only disable full page ads for stop ad calls
         if (rComposed.stopads && rAd.pos === 'fullpage') {
            ft.disableFullPageAds();
         }

         // submit impressions when submit_impressions_pending = true
         if (rResponse.submit_impressions_pending) {
            ft.submitImpressions(rAd.pos);
            rResponse.submit_impressions_pending = false;
         }
      }
      if (ok) {
         rcCallBack('ok', URL, rAd, jqAjax);
      }
   },

   // Called back when JSON ad error happens
   'onAdError': function (URL, textStatus, errorThrown, rcCallBack, jqXHR, jqAjax) {
      var ft = this, response = jqXHR.responseText || '', rAd, rResponse, rErrorInfo, pos, invokeCallBack = true;
      rcCallBack = rcCallBack || function () {};
      pos = ft.getPosFromURL(URL);
      ft.breakPoint('onAdError', pos);

      // Store the error info in the Adverts Array so it is available later.
      rErrorInfo = {
         'URL': URL,
         'textStatus': textStatus,
         'errorThrown': errorThrown,
         'jqXHR': jqXHR,
         'jqAjax': jqAjax
      };
      rAd = ft.extractJSONTemplate(response) || ft.extractAppControlAds(response) || ft.extractImageClick(response);
      if (rAd) {
         if (!rAd.pos) {
            rAd.pos = pos;
         }
         rResponse = ft.getResponseInfo(pos, rAd);
         rResponse.onAdError = rErrorInfo;
         ft.logHistoryPos(pos, 'onAdError: ' + rAd.type + ' returned from ' + URL + ' ' + ft.queueSummary());
         if (!rAd.error) {
            invokeCallBack = false;
            ft.onAdReceived(URL, rAd, rcCallBack, jqAjax);
         }
      } else {
         rResponse = ft.getResponseInfo(pos);
         rResponse.onAdError = rErrorInfo;
         ft.logHistoryPos(pos, 'onAdError: ' + textStatus + ': ' + errorThrown.toString() + ' from ' + URL + ' ' + ft.queueSummary());
         ft.logHistoryPos(pos, 'onAdError: [' + jqXHR.status + '] responseText[' + response + '] from ' + URL);
      }
      if (invokeCallBack) {
         rcCallBack('error', URL, textStatus, errorThrown, jqXHR, jqAjax);
      }
   },

   // Get the width of the visible area (from window or override)
   // javascript:alert(%22window%20inner%20Height/Width:%20(%22%20+%20window.innerWidth%20+%20%22,%20%22%20+%20window.innerHeight%20+%20%22)%5CniPad%20landscape%20(1024x690)%20portrait%20(768x896)%22)
   'innerWidth': function () {
      var ft = this;
      return ft.fixed_width || window.innerWidth;
   },

   // Get the height of the visible area (from window or override)
   'innerHeight': function () {
      var ft = this;
      return ft.fixed_height || window.innerHeight;
   },

   // Called when the device orientation has been changed and we need to change
   // which full page ad orientation is visible (if present)
   'onOrientationChanged': function (orientation) {
      var ft = this, hidden, width, height;
      ft.breakPoint('onOrientationChanged');
      width = ft.innerWidth();
      height = ft.innerHeight();
      if (orientation === undefined) {
         orientation = (width > height) ? 'l' : 'p';
      }
      orientation = orientation.substring(0, 1).toLowerCase();
      if (orientation === 'l') {
         orientation = 'landscape';
         hidden = 'portrait';
      } else {
         orientation = 'portrait';
         hidden = 'landscape';
      }
      ft.logHistory('onOrientationChanged ' + orientation + ' ' + width + 'x' + height);
      //ft.logHistory('current css sizes: ' + jQuery('div.fullpage-advert-container div.dfpadplaceholder').css('width') + ' x ' + jQuery('div.fullpage-advert-container div.dfpadplaceholder').css('height'));
      jQuery('div.fullpage-advert-container div.dfpadplaceholder').css('width', width).css('height', height);
      jQuery('div.dfpadplaceholder div.dfp-' + hidden).removeClass('dfp-' + hidden).addClass('dfp-' + orientation);
   },

   // Default visibility handler so there is always something.
   'defaultVisibilityHandler': function (unusedState) {
      return true;
   },

   // resolve a function name into a function which can be called
   'resolveFunction': function (name) {
      var ft = this, rcFunction = null, rObj = window, Names, key;
      if (typeof name === 'string' && name.match(/^[\w\.]+$/)) {
         // Resolve named function if possible
         Names = name.split('.');
         key = Names.shift();
         key = key === 'window' ? Names.shift() : key;
         while (key) {
            if (rObj[key]) {
               rObj = rObj[key];
               key = Names.shift();
            } else {
               key = undefined;
               rObj = null;
            }
         }
         if (typeof rObj === 'function') {
            rcFunction = rObj;
         }
      } else if (typeof name === 'function') {
         rcFunction = name;
      }
      if (!rcFunction) {
         ft.logHistory("resolveFunction(): cannot resolve handler [" + name + "] " + typeof name);
      }
      return rcFunction;
   },

   // Retrieve the visibility handler for an ad position
   'getVisibilityHandler': function (pos) {
      var ft = this, rcFunction = null;
      ft.breakPoint('getVisibilityHandler', pos);
      if (ft.formats[ft.screen_mode][pos]) {
         // valid ad position
         if (ft.VisibilityHandlers[pos]) {
            // and there's a handler registered, is it a string or function?
            rcFunction = ft.resolveFunction(ft.VisibilityHandlers[pos]);
         }
         if (!rcFunction) {
            // return a default handler closure with position name
            rcFunction = function (state) {
               ft.logHistoryPos(pos, "defaultVisibilityHandler(" + state + ")");
               return ft.defaultVisibilityHandler(state);
            };
         }
      }
      return rcFunction;
   },

   // Call this to set a visibility handler function
   // rcFunction should receive a state value of 'onscreen' or 'offscreen'
   // rcFunction can be a string name of a global function which doesn't currently exist.
   // In that case, getVisibilityHandler will be responsible for resolving if the global
   // exists when called.
   'setVisibilityHandler': function (pos, rcFunction) {
      var ft = this;
      ft.breakPoint('setVisibilityHandler', pos);
      rcFunction = rcFunction || null;
      if (ft.formats[ft.screen_mode][pos]) {
         if (typeof rcFunction === 'string' && !rcFunction.match(/^[\w\.]+$/)) {
            rcFunction = null;
         }
         ft.VisibilityHandlers[pos] = rcFunction;
      }
      return rcFunction;
   },

   // Called when an ad is being moved on or off the screen by a swipe
   // this allows the ad to pause playback and rewind position.
   // This only invokes the handler when a rich media ad is returned.
   // returns false if the handler is not invoked.
   'onVisibilityChanged': function (pos, state) {
      var ft = this, rcFunction, result = false, rResponse;
      state = state || '';
      ft.breakPoint('onVisibilityChanged', pos);
      if (state.match(/^o(n|ff)screen$/) && ft.hasAdResponse(pos)) {
         rResponse = ft.getResponseInfo(pos);
         if (rResponse.composedAd && rResponse.composedAd.type.match(/rich media/)) {
            // Only need visibility handling for rich media ads.
            rcFunction = ft.getVisibilityHandler(pos);
            if (rcFunction) {
               ft.logHistoryPos(pos, 'onVisibilityChanged(' + state + ') invoking handler');
               result = rcFunction(state);
            }
         }
      }
      return result;
   },

   // Inject the ad into the document
   // callback function is only called when injecting with ghostwriter
   'injectAd': function (pos, rAd, rDiv, rcCallBack) {
      var ft = this, rJQ, rPayload, rRequest, rResponse, rcCallBackWrapper;
      ft.breakPoint('injectAd', pos);
      rJQ = jQuery(rDiv || '#' + pos);

      // Arrange for the callback function to be called with the pos, rAd and rDiv parameters
      rcCallBack = rcCallBack || function () {};
      rcCallBackWrapper = function () {
         rcCallBack(pos, rAd, rDiv);
      };

      if (rJQ.length === 1) {
         rPayload = ft.composeAd(rAd);
         // REFACTOR TODO this should be the response, not the request. refactor
         // but that causes many integratin tests to fail so be careful on this one.
         rRequest = ft.getRequestInfo(pos);
         rResponse = ft.getResponseInfo(pos);
         if (rPayload.has_impression || (rRequest.is_prefetch !== undefined && !rRequest.is_prefetch) || !ft.isPreFetch(pos)) {
            rResponse.is_impression_submitted = true;
         }
         /* US34148: remove ghostwriter
         if (ft.use_ghostwriter && rPayload.ghostwriter_ok) {
            ft.logHistoryPos(pos, 'injectAd: with ghostwriter ' + pos + ' ' + rPayload.type + ' ' + rPayload.info + ' injected');
            rRequest.used_ghostwriter = true;
            rJQ.html("");
            rRequest.gw_handle = ghostwriter(rDiv || pos, {
               script: { text: "document.write(unescape('" + escape(rPayload.html) + "'))" },
               done: rcCallBackWrapper
            });
         } else { */
            ft.logHistoryPos(pos, 'injectAd: ' + pos + ' ' + rPayload.type + ' ' + rPayload.info + ' injected');
            //rRequest.used_ghostwriter = false;
            rJQ.html(rPayload.html);
            rcCallBackWrapper();
        // }
         if (ft.isFullPage(rAd.pos)) {
            ft.onOrientationChanged();
         }
      } else {
         ft.logHistoryPos(pos, 'injectAd: error: #' + pos + ' position found ' + rJQ.length + ' times on page, cannot inject');
      }
   },

   // Construct an impression url
   'makeImpressionURL': function (URL) {
      // use a new RegExp instead of an inline regex match because the
      // code which strips out comments was fooled into stripping the if statement.
      var impURL, ord, regex = new RegExp("^https?:\/\/");
      if (URL !== undefined && regex.test(URL)) {
         ord = Math.floor(Math.random() * 1E16);
         if (/%3f$/.test(URL)) {
            impURL = URL.replace(/%3f$/, "%3fhttp:%2f%2fwww.ft.com/c.gif?webapp-impression-redirect&iord=" + ord);
         } else if (/\?/.test(URL)) {
            impURL = URL + "&iord=" + ord;
         } else {
            impURL = URL + "?iord=" + ord;
         }
      }
      return impURL;
   },

   // Inject an impression into the DOM
   'injectImpression': function (rResult, key, id, URL) {
      var ft = this, divID = 'ft-' + id + '-impression';
      if (!jQuery('#ft-ad-impressions').length) {
         jQuery('body').append('<div id="ft-ad-impressions" style="visibility: hidden; position: absolute; top: -20000px;"><\/div>');
      }
      URL = ft.makeImpressionURL(URL);
      if (URL) {
         rResult[key] = URL;
         ft.logHistory('submitImpression ' + id.toUpperCase() + ': ' + URL);
         URL = '<img style="visibility: hidden;" src="' + URL + '">';
         if (!jQuery('#ft-ad-impressions #' + divID).length) {
            jQuery('#ft-ad-impressions').append('<div id="' + divID + '" style="visibility: hidden;"><\/div>');
         }
         jQuery('#' + divID).append(URL);
      }
   },

   // Submit impression counts by injecting into the DOM
   'submitImpressions': function (pos) {
      var ft = this, rResult, rRequest, rResponse;
      ft.breakPoint('submitImpressions', pos);
      ft.logHistoryPos(pos, 'submitImpressions: ' + pos + ' ' + ft.queueSummary());
      rRequest = ft.getRequestInfo(pos);
      rResponse = ft.getResponseInfo(pos);
      rResponse.submit_impressions_pending = rResponse.pos ? false : true;
      if (!rResponse.submit_impressions_pending) {
         if ((rRequest.is_prefetch || ft.isPreFetch(pos)) && !rResponse.is_impression_submitted) {
            rResult = {
               'DFPImpression': false,
               'thirdPartyImpression': false
            };
            ft.injectImpression(rResult, 'DFPImpression', 'dfp', rResponse.impressionUrl);
            ft.injectImpression(rResult, 'thirdPartyImpression', '3pty', rResponse.thirdPartyImpressionUrl);
            rResponse.is_impression_submitted = rResult.DFPImpression || rResult.thirdPartyImpression;
            ft.popAdFromQueue(pos);
         }
      }
      return rResult;
   },

   // Construct an ad to return which indicates there was an error.
   'makeErrorAd': function (URL) {
      var ft = this, rAd = {
         'pos': ft.getPosFromURL(URL),
         'ad_call_url': URL,
         'error': true,
         'composedAd': {
            'empty': true
         }
      };
      return rAd;
   },

   // Perform an ad call and inject into the document eventually
   // pos = ad position name (ex. fullpage)
   // rDiv = reference the div where to inject the ad
   // rcCallBack = function that gets called when ad is received from the ad server
   // orientation = for full page ads (optional, either l or p)
   // returns the Ad call URL or undefined if for any reason no ad call was made.
   'adCall': function (pos, rDiv, rcCallBack, orientation) {
      var ft = this, URL;

      ft.breakPoint('adCall', pos);
      ft.getResponseInfo(pos);
      delete ft.Adverts[pos].response;
      ft.calcTime(pos, "startTime");
      // Backwards compatability for the  ad signature without a rDiv
      if (Object.prototype.toString.call(rDiv) === '[object Function]') {
         orientation = rcCallBack;
         rcCallBack = rDiv;
         rDiv = undefined;
      }
      rcCallBack = rcCallBack || function () {};
      URL = ft.getURL(pos, orientation);
      if (URL) {
         ft.fetchAdByURL(URL, function (result, callURL, rAd) {
            ft.breakPoint('adCallCallBack', rAd.pos);
            if (result === 'ok') {
               rAd = ft.getResponseInfo(pos, rAd);
               ft.calcTime(pos, "fetchTime");
               ft.injectAd(pos, rAd, rDiv, function () {
                  ft.calcTime(pos, "endTime");
                  ft.injectAdTimes();
                  rcCallBack(result, callURL, rAd);
               });
            } else {
               // Call the user's callback signalling an error ad.
               rAd = ft.makeErrorAd(callURL);
               rcCallBack(result, callURL, rAd);
            }
         });
      }
      return URL;
   },

   // Answer with the size of the cached ad queue
   'queueSize': function () {
      var ft = this;
      return ft.Queue.length;
   },

   // Put an ad in the Queue. If there is an ad_call_pending ad in the queue, that entry will be overwritten
   // otherwise a new entry will be added to the queue.
   'queueAd': function (rAd) {
      var ft = this, idx = ft.Queue.length - 1, time = new Date();

      if (idx >= 0 && ft.Queue[idx].ad_call_pending) {
         // if there is a pending ad call in the queue, overwrite it
         rAd.ad_call_pending = false;
         rAd.when_queued = ft.Queue[idx].when_queued;
         ft.Queue[idx] = rAd;
      } else {
         // No ad or no pending ad in the queue, add to the queue
         rAd.ad_call_pending = true;
         rAd.when_queued = time.getTime();
         ft.Queue.push(rAd);
         idx = ft.Queue.length - 1;
      }
      return ft.Queue[idx];
   },

   // Remove an ad from the Queue and get rid of the request/response
   'popAdFromQueue': function (pos) {
      var ft = this;
      // at the moment the pos passed in should match the pos of the ad in the queue
      if (ft.queueSize()) {
         if (ft.getCachedAd(pos) === undefined) {
            ft.logHistoryPos(pos, 'WARNING popAdFromQueue when a pending ad is in the queue');
         }
         delete ft.Adverts[pos];
         ft.Queue.pop();
      }
      ft.logHistoryPos(pos, 'popAdFromQueue: ' + ft.queueSummary());
   },

   // Get a summary of the cache for debugging
   'queueSummary': function () {
      var ft = this, idx, max = ft.queueSize(), Queue = ['q =', max, '['], rAd;
      for (idx = 0; idx < max; idx += 1) {
         rAd = ft.Queue[idx];
         Queue.push(rAd.pos + (rAd.ad_call_pending ? ':pending' : ':' + rAd.creativeId));
      }
      Queue.push(']');
      return Queue.join(' ');
   },

   // Get a cached ad from the Queue. Pending ads are NOT returned by this function.
   'getCachedAd': function (unusedPos) {
      var ft = this, idx = ft.Queue.length - 1, rAd;
      // if there is an ad in the queue which is no longer pending a response from the ad server, we return it.
      if (idx >= 0 && !ft.Queue[idx].ad_call_pending) {
         rAd = ft.Queue[idx];
      }
      return rAd;
   },

   // checks the queue if the ad server request hasn't returned yet with the ad
   'hasPendingAdToCache': function (unusedPos) {
      var ft = this, idx = ft.Queue.length - 1, adCallPending = false;

      if (idx >= 0) {
         adCallPending = ft.Queue[idx].ad_call_pending;
      }
      return adCallPending;
   },

   // checks the queue if the ad server request hasn't returned yet with the ad
   'isIncomplete': function (unusedPos) {
      var ft = this, idx = ft.Queue.length - 1, isIncomplete = false;

      if (idx >= 0) {
         isIncomplete = ft.Queue[idx].composedAd.incomplete;
      }
      return isIncomplete;
   },

   // Perform cached ad calls by setting up startPage() and then making
   // ad calls with cachedAdCall()
   // Note: at the moment only one item in the cache is allowed.
   // rAdsToCache - an array of ad pages to cache providing parameters for
   // startPage and adCall as shown below.
   // [
   //    {
   //       'zone': 'home',
   //       'pageType': 'section',
   //       'userId': eid,
   //       'ads': ['banlb', 'mpu']
   //    },
   //    {
   //       'zone': 'ros',
   //       'pageType': 'fullpage',
   //       'orientation': 'l',
   //       'ads': ['fullpage']
   //    }
   // ]
   'cacheAds': function (rAdsToCache, rcCallBack) {
      var ft = this, idx, idxAd, maxIdxAd, rAdPage, maxIdx = rAdsToCache.length;
      ft.breakPoint('cacheAds');
      ft.logHistory("cacheAds: called " + ft.queueSummary());
      for (idx = 0; idx < maxIdx; idx += 1) {
         rAdPage = rAdsToCache[idx];
         ft.startPage(rAdPage.zone, rAdPage.pageType);
         if (rAdPage.userId) {
            ft.setUserId(rAdPage.userId);
         }
         for (idxAd = 0, maxIdxAd = rAdPage.ads.length; idxAd < maxIdxAd; idxAd += 1) {
            ft.cachedAdCall(rAdPage.ads[idxAd], rcCallBack, rAdPage.orientation);
         }
      }
   },

   // Perform an ad call and cache the result for later injection
   // pos = ad position name (ex. fullpage)
   // rcCallBack = function that gets called when ad is received from the ad server
   // orientation = for full page ads (optional, either l or p)
   // zone = for 
   // returns the Ad call URL or undefined if for any reason no ad call was made.
   'cachedAdCall': function (pos, rcCallBack, orientation) {
      var ft = this, URL, rAd, adOnQueue, zone = ft.dfp_zone;

      ft.breakPoint('cachedAdCall', pos);

      // check if the zone in cached Ad == ft.dfp zone
      // if not equal, pop it and get a new one
      if (ft.isPreFetch(pos) && ft.queueSize() > 0) {
         rAd = ft.hasPendingAdToCache(pos) ? ft.Queue[0] : ft.getCachedAd(pos);

         if (rAd !== undefined && rAd.zone !== undefined && rAd.zone !== zone) {
            ft.popAdFromQueue(pos);
         }
      }

      if (ft.isPreFetch(pos) && ft.queueSize() < ft.maxQueueSize) {
         ft.logHistoryPos(pos, "cachedAdCall: orientation " + orientation);
         ft.getResponseInfo(pos);
         delete ft.Adverts[pos].response;
         ft.calcTime(pos, "startTime");
         rcCallBack = rcCallBack || function () {};
         URL = ft.getURL(pos, orientation);
         if (URL) {
            // add pending ad call to the queue
            rAd = ft.queueAd({ 'pos': pos, 'ad_call_url': URL, 'zone' : zone});

            ft.fetchAdByURL(URL, function (result, callURL, rAd) {
               ft.breakPoint('adCallCallBack', rAd.pos);
               if (result === 'ok') {
                  rAd = ft.getResponseInfo(pos, rAd);
                  adOnQueue = ft.Queue[0];
                  // queue the ad if the zone of the pending ad is the same as the zone of the returned ad
                  // rcCallback is skipped if not the same
                  if (adOnQueue !== undefined && adOnQueue.zone === rAd.zone) {
                     // add response ad to the queue
                     ft.queueAd(rAd);
                     rcCallBack(result, callURL, rAd);
                  }
                  ft.calcTime(pos, "fetchTime");
               } else {
                  // Call the user's callback signalling an error ad.
                  rAd = ft.makeErrorAd(callURL);
                  rcCallBack(result, callURL, rAd);
               }
            });
         }
      }
      return rAd;
   },


   // function to render the cached ad (ad from the queue)
   // 07.16.2013: added check for the ad in the queue, if it's zone
   //             is different from the current targetting zone then
   //             dont render it, mark the ad as empty so the web app
   //             can collapse it
   // If the ad is empty we also pop it from the cache otherwise we
   // leave it in the cache until submitImpressions is called.
   'renderCachedAd': function (pos, targettingZone, rDiv, rcCallBack) {
      var ft = this, rAd, isEmpty, URL, isDiffZone;
      rcCallBack = rcCallBack || function () {};
      ft.breakPoint('renderCachedAd', pos);
      ft.logHistoryPos(pos, "renderCachedAd: " + ft.queueSummary());
      if (ft.queueSize()) {
         rAd = ft.getCachedAd(pos);
         URL = ft.getRequestInfo(pos).url;
         if (rAd) {
            // set incomplete to false
            rAd.composedAd.incomplete = false;
            // check if the zone of the ad in queue
            // if the same, render the ad
            // if not, mark the ad as empty
            isDiffZone = rAd.zone && targettingZone && rAd.zone !== targettingZone;
            if (isDiffZone) {
               ft.logHistoryPos(pos, "renderCachedAd: isDiffZone = " + isDiffZone + " : mark the ad as empty");
               rAd.composedAd.empty = true;
            } else {
               ft.logHistoryPos(pos, "renderCachedAd: rendering ad from queue");
               ft.injectAd(pos, rAd, rDiv);
            }
            isEmpty = rAd.composedAd && rAd.composedAd.empty;
            if (isEmpty) {
               ft.popAdFromQueue(rAd.pos);
            }
            rcCallBack('ok', URL, rAd);
         } else {
            ft.logHistoryPos(pos, "renderCachedAd: no ad in queue to render");
            rAd = ft.makeErrorAd(URL);
            if (ft.hasPendingAdToCache(pos)) {
               // set a flag render_ad_pending to true
               rAd.composedAd.incomplete = true;
            }
            // Call the user's callback signaling an error ad since the ad
            // had not come back fast enough.
            rcCallBack('error', URL, rAd);
         }
      }
   },

   // Parse the cookie to control settings of the ad library for debugging
   // Places where you can set the cookie and see what values to use.
   // http://ft-ad-enablement.appspot.com/FTQA.html
   // http://rs-adverts.sandboxes.app.ft.com/FTQA.html
   // http://admintools.internal.ft.com:86/adstools/html/FTQA.html
   // http://www.ft.com/FTCOM/JavaScript/FTQA.html
   'getCookieSettings': function (cookie) {
      var ft = this, FTQA = "FTQA=", Match, getCookieValue, getCookieInt, fullpage;
      ft.cookie = cookie === undefined ? document.cookie : cookie;
      // Parse the cookie
      // FTQA=debug%2Cenv%3Dtest; expires=Wed, 01 Jun 2011 09:25:21 GMT; path=/; domain=.ft.com
      Match = ft.cookie.match(/(?:^|;|\s)FTQA=(?:[^;]+)(?:;|$)/g);
      // Initialise Weinre server URL to avoid error and prevent webapp from hanging
      window.WeinreServerURL = undefined;

      getCookieValue = function (key, property, property2) {
         var rRegex = new RegExp(key + '=([^,;]+)', 'i'), Match = [];
         Match = FTQA.match(rRegex);
         if (Match) {
            ft[property] = Match[1];
            if (property2) {
               ft[property2] = Match[1];
            }
         }
      };
      getCookieInt = function (key, property, bBool) {
         var rRegex = new RegExp(key + '=(\\d+)', 'i'), Match = [];
         Match = FTQA.match(rRegex);
         if (Match) {
            ft[property] = parseInt(Match[1], 10);
            if (bBool) {
               ft[property] = ft[property] ? true : false;
            }
         }
      };

      if (Match) {
         // Could be the same cookie setting multiple times so we use the last one found.
         FTQA = Match[Match.length - 1].replace(/%3D/g, "=");
         FTQA = FTQA.replace(/%2C/g, ",");
         FTQA = FTQA.replace(/%3A/g, ":");
         if (FTQA.match(/debug/i)) {
            ft.debug = true;
         }
         if (FTQA.match(/env=(test|nolive)/i)) {
            ft.isTest = true;
         }
         getCookieValue('site', 'dfp_site');
         getCookieValue('zone', 'dfp_zone', 'fixed_zone');
         getCookieValue('platform', 'fixed_platform');
         getCookieValue('screenmode', 'screen_mode');
         getCookieValue('eid', 'fixed_eid');
         getCookieValue('remotedebug', 'remote_debug_url');
         getCookieInt('ord', 'fixed_ord');
         getCookieInt('slow', 'connection_slow');
        // getCookieInt('ghost', 'use_ghostwriter', 'boolean');
         getCookieInt('timings', 'track_ad_times', 'boolean');
        // getCookieInt('ghostbug', 'debug_ghost', 'boolean');
         if (FTQA.match(/noaudsci/i)) {
            ft.audSciLimit = 0;
         }

         // APU FPADS
         getCookieValue('fullpage', 'fixed_ort');
         if (ft.fixed_platform) {
            ft.setupFullPageAds();
            ft.setPlatform(ft.fixed_platform);
         }

         if (ft.fixed_ort !== undefined) {
            // So long as first letter is l or p, any case we go for full page mode
            ft.fixed_ort = ft.fixed_ort.charAt(0).toLowerCase();
            fullpage = (/^(l|p)/i.test(ft.fixed_ort)) ? true : false;
            ft.setupFullPageAds(fullpage);
         }

         if (ft.has_fullpage_ads) {
            getCookieValue('prem', 'fixed_prem');
            if (ft.fixed_prem !== undefined && ft.fixed_prem === '1') {
               ft.setPremiumAd(true);
            }
         }

         if (ft.remote_debug_url) {
            // Set the Remote debugging server URL if specified:
            // see http://phoneapp.github.com/weinre/Runnint.html for details
            ft.remote_debug_url = ft.remote_debug_url.replace(new RegExp('^http:\/\/'), '');
            ft.remote_debug_url = "http:\/\/" + ft.remote_debug_url;
            window.WeinreServerURL = ft.remote_debug_url;
            ft.logHistory("Remote Debugger Server: " + ft.remote_debug_url);
         }
         // break=fullpage:setup,onAdReceived
         getCookieValue('break', 'breakpoints');
      }
      ft.logHistory("Cookie " + FTQA);
      ft.breakPoint('adinit');
   },

   // Set up the ad library for screen size, etc.
   'setup': function (size, offline, platform, fullpage) {
      // size = small, medium, large, largewide
      // offline = true or false
      // platform = ios (apple iPhone/iPad), an (android), bb (blackberry), pb (playbook), wm (windows mobile)
      // fullpage = true, false or undefined - undefined causes the default behaviour - turns on only for iOS large devices
      var ft = this;
      ft.reset(true);
      ft.screen_mode = ft.screen_mode || size;
      ft.platform = platform;
      ft.setupFullPageAds(fullpage);
      ft.setPlatform(platform);
      ft.getCookieSettings(ft.cookie);
      ft.breakPoint('setup');
      if (ft.ort !== undefined) {
         size = ft.screen_mode;
         platform = ft.fixed_platform;
      }
      ft.logHistory("setup: size=" + size + " offline=" + offline + " platform=" + platform + " fullpage=" + fullpage + " version=" + ft.VERSION);

      ft.setOffline(offline);
      if (ft.formats[ft.screen_mode]) {
         ft.device_size = ft.getDeviceSize();
         if (ft.isTest) {
            ft.dfp_site = ft.dfp_site.replace(/^[^\.]+\./, "test.");
         }
      } else {
         // If it's a size we don't know then go to offline mode.
         ft.setOffline(true);
      }

      /* US34148: remove ghostwriter
      if (window.ghostwriter !== undefined) {
         ghostwriter.debug(ft.debug_ghost);
         ghostwriter.handlers = {
            onelement: function (domElement) {
               // Example of what the innerHTML of the domElement contains when we have a document.write present
               // document.write(unescape('<p>document.write(ln)? be here...</p><script>document.write('<p>Test HTML5 JSON 300x250 DocWrite Ad</p>');document.writeln('<p>Test document.writeln too</p>');</script>'))
               // Google Chrome: <script src=\\"data:text/javascript,document.write(unescape(...

               var text = unescape(domElement.innerHTML);
               text = text.replace(/^\s*\<scr\ipt src="data:text\/javascript,/, '');
               text = text.replace(/^\s*document\.writel?n?\(unescape\(['"]/, '');
               text = text.replace(/['"]\)\)\s*$/, '');
               if (text.match(/^\s*document\.writel?n?\(/)) {
                  text = text.replace(/^\s*document\.writel?n?\(['"]?/, '');
                  text = text.replace(/['"]?\)\s*$/, '');
                  ft.docWrite('by ghostwriter: ' + text);
               }
            }
         };
      }
      */
      ft.logHistory("setup is: site=" + ft.dfp_site + " platform=" + ft.platform + " device_size=" + ft.device_size + " fullpage=" + ft.has_fullpage_ads + " offline=" + ft.offline + " isTest=" + ft.isTest);
   },

   // Set up state to begin ads on a new page
   'startPage': function (zone, pageType) {
      var ft = this;

      ft.breakPoint('startPage');
      ft.logHistory("===== startPage: zone=" + zone + " pageType=" + pageType + " fixed_zone=" + ft.fixed_zone);
      //if (ft.hasAdsToRelease()) {
      //   ft.logHistory("WARNING: startPage called before releaseAds has been called.");
      //}
      ft.reset();
      ft.dfp_zone = ft.fixed_zone || zone;
      if (!ft.pageCount[pageType]) {
         ft.pageCount[pageType] = 0;
      }
      ft.pageCount[pageType] += 1;
      if (jQuery('#ft-ad-impressions').length) {
         jQuery('#ft-ad-impressions').html('');
      }
   },

   // Release Ads which may still be pending insertion by ghostwriter
   'releaseAds': function () {
	  /* US34148: remove ghostwriter
      var ft = this, rObj = ft.Adverts, rRequest, rResponseTODOREFACTOR, handle, pos;

      ft.breakPoint('releaseAds');
      ft.logHistory("releaseAds: called");
      // Look at the ghostwriter handle object for each ad which was fetched and destroy it.
      for (pos in rObj) {
         if (rObj.hasOwnProperty(pos)) {
            rRequest = ft.getRequestInfo(pos);
            handle = rRequest.gw_handle;
            rRequest.gw_handle = undefined;
            if (handle !== undefined && typeof handle.demolish === 'function') {
               ft.logHistoryPos(pos, "releaseAds: demolish " + pos);
               handle.demolish();
            }
         }
      }
      */
      
   },

   /* US34148: remove ghostwriter
   // Ghostwriter related check if there are any ads which need to be released to prevent
   // a bug where eventually ghostwriter locks up and fails to display any more ads.
   'hasAdsToRelease': function () {
      var ft = this, rObj = ft.Adverts, rRequest, rResponseTODOREFACTOR, pos, handle, bAdFound = false;
      for (pos in rObj) {
         if (rObj.hasOwnProperty(pos)) {
            // TODO REFACTOR GW handle should be in the response, not the request.
            rRequest = ft.getRequestInfo(pos);
            handle = rRequest.gw_handle;
            if (handle !== undefined && typeof handle.demolish === 'function') {
               bAdFound = true;
               break;
            }
         }
      }
      return bAdFound;
   },
   */

   // Get all the non-function keys from an object
   'getKeys': function (rObj) {
      var key = '', Keys = [];
      for (key in rObj) {
         if (rObj.hasOwnProperty(key)) {
            if (typeof rObj[key] !== 'function') {
               Keys.push(key);
            }
         }
      }
      return Keys.sort();
   },

   // Get all the non-function keys from an object which have non-empty data
   'getKeysWithData': function (rObj) {
      var key = '', Keys = [];
      for (key in rObj) {
         if (rObj.hasOwnProperty(key)) {
            if (typeof rObj[key] !== 'function' && rObj[key] !== '') {
               Keys.push(key);
            }
         }
      }
      return Keys.sort();
   },

   // Intercept the document.write(ln)? so that the webapp is not accidentally trashed.
   'docWrite': function (message) {
      var ft = FT.env;
      ft.breakPoint('docwrite');
      ft.doc_write_calls += 1;
      ft.logHistory("document.write(ln)? intercepted: " + message);
   },

   // Record something to the log
   'logHistory': function (message) {
      var ft = this;
      ft.History = ft.History || [];
      ft.History.push(message);
      if (ft.debug && window.console && window.console.log) {
         console.log(message);
      }
   },

   // Record something to the log about an ad position
   'logHistoryPos': function (pos, message) {
      var ft = this;
      if (pos === undefined) {
         pos = 'POS?';
      }
      ft.logHistory(pos.toUpperCase() + ': ' + message);
   },

   // Show what's in the ad log
   'showHistory': function () {
      var ft = this;
      alert("FT.env.History:\n\n" + ft.History.join("\n"));
   },

   // Invoke a breakpoint in the ad library if FTQA tells us to.
   // pos - can select to break only on a given ad position
   // breakpoint string from FTQA cookie is like fullpage:setup,onAdReceived
   // or just setup,onAdReceived for any ad position.
   'breakPoint': function (breakpoint, pos) {
      var ft = this, invoke = false, rRegex = new RegExp(breakpoint, 'i');
      ft.breakpoints = ft.breakpoints || '';
      if (ft.breakpoints.match(rRegex)) {
         rRegex = new RegExp('^' + pos + ':');
         if (pos === undefined || !ft.breakpoints.match(/:/)) {
            invoke = true;
            ft.logHistory("BREAK - " + breakpoint + " breakpoint invoked from FTQA cookie");
         } else if (ft.breakpoints.match(rRegex)) {
            invoke = true;
            ft.logHistoryPos(pos, "BREAK - " + breakpoint + " breakpoint invoked from FTQA cookie");
         }
         if (invoke) {
            ft.invokeDebugger(breakpoint);
         }
      }
   },

   // Invoke the debugger
   'invokeDebugger': function (breakpoint) {
      breakpoint = breakpoint || '';
      debugger; // jslint debugger ok
   },

   // Calculate time and store for ad call
   'calcTime': function (pos, timeDesc) {
      var ft = this, rObj = ft.Adverts, date;
      if (ft.track_ad_times) {
         date = new Date();
         rObj[pos] = rObj[pos] || {};
         rObj[pos].request = rObj[pos].request || {};
         rObj[pos].request[timeDesc] = date.getTime();
         if (ft.test_ad_times) {
            // For test plan, we fake the timing
            if (timeDesc === 'fetchTime') {
               rObj[pos].request[timeDesc] = rObj[pos].request.startTime + ft.test_ad_times;
            }
            if (timeDesc === 'endTime') {
               rObj[pos].request[timeDesc] = rObj[pos].request.fetchTime + ft.test_ad_times;
            }
         }
         // ft.logHistoryPos(pos, timeDesc + " recorded for " + pos + " of " + rObj[pos].requests[timeDesc]);
      }
   },

   // Inject the ad timing information into the document
   'injectAdTimes': function () {
      var ft = this, logRow, resultRow, adPos, rObj = ft.Adverts, resultsRows = "<table><tr id='ft-ad-timings-row'><td>Position<\/td><td>Fetch Time (ms)<\/td><td>Render Time (ms)<\/td><td>Total Time (ms)<\/td><\/tr>";
      if (ft.track_ad_times) {
         if (!jQuery('#ft-ad-timings').length) {
            jQuery('body').append("<div id='ft-ad-timings'><h2 id='timings-header'>Ad Timings<\/h2><span id='ft-ad-timings-container'></span><\/div>");
         }
         for (adPos in rObj) {
            if (rObj.hasOwnProperty(adPos)) {
               rObj[adPos].request = rObj[adPos].request || {};
               logRow = ft.roundTime(adPos, "fetch-time", rObj[adPos].request.startTime, rObj[adPos].request.fetchTime) +
                  ft.roundTime(adPos, "render-time", rObj[adPos].request.fetchTime, rObj[adPos].request.endTime) +
                  ft.roundTime(adPos, "total-time", rObj[adPos].request.startTime, rObj[adPos].request.endTime);
               resultRow = "<tr><td>" + adPos + "</td>" + logRow + "</tr>";
               resultsRows += resultRow;
               if (rObj[adPos].request.endTime) {
                  // clean up output <td id='banlb-fetch-time'>0.13</td>
                  logRow = logRow.replace(/<\/td>/g, 'ms ');
                  logRow = logRow.replace(/<td id='[^\-]+-/g, '');
                  logRow = logRow.replace(/'>/g, ': ');
                  ft.logHistoryPos(adPos, "ad timings: " + logRow);
               }
            }
         }
         resultsRows += "</table>";
         jQuery('#ft-ad-timings-container').html(resultsRows);
         jQuery('#ft-ad-timings').css({ 'display': 'block'});
      }
   },

   // Round time to two digits for display in table
   'roundTime': function (adPos, timeType, startTime, endTime) {
      var deltaTimeMS;
      try {
         // Round to two decimal places exactly
         deltaTimeMS = Math.round((endTime - startTime) * 100.0) / 100.0;
         if (!isNaN(deltaTimeMS)) {
            deltaTimeMS = deltaTimeMS.toString();
            if (deltaTimeMS.indexOf('.') < 0) {
               deltaTimeMS += '.00';
            }
            if (deltaTimeMS.indexOf('.') === (deltaTimeMS.length - 2)) {
               deltaTimeMS += '0';
            }
         }
      } catch (err) {
         deltaTimeMS = "<span class='ft-ad-timings-error'>ERROR!</span>";
      }
      // ft.logHistoryPos(adPos, timeType + " calculated for " + adPos + " of " + deltaTimeMS);
      return "<td id='" + adPos + "-" + timeType + "'>" + deltaTimeMS + "</td>";
   },

   '-': '-'
};

delete FT.env['-'];

// We override the document.write so that the web app will not accidentally be blatted by a stray document.write.
// We use FT.env.docco to prevent jslint warnings since we know what we're doing
FT.env.docco = document;
FT.env.realDocWrite = FT.env.docco.write;
FT.env.realDocWriteln = FT.env.docco.writeln;
FT.env.docco.write = FT.env.docWrite;
FT.env.docco.writeln = FT.env.docWrite;
delete FT.env.docco;
FT.env.ADSJSEND = true;
delete FT.env.ADSJSSTART;
delete FT.env.ADSJSEND; // just a marker to find the end of ad library easily within javascript.js

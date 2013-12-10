/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
/**
 * FT.ads.targeting is an object providing properties and methods for accessing targeting parameters from various sources including FT Track and Audience Science and passing them into DFP
 * @name targeting
 * @memberof FT.ads
*/
(function (win, doc, undefined) {
    "use strict";
    var proto = Targeting.prototype;
    proto.init=false;
/**
 * The Targeting class defines an FT.ads.targeting instance
 * @class
 * @constructor
*/
    function Targeting() {
      var context = this,
        parameters = {};


/**
 * returns an object containing all targeting parameters
 * @memberof Targeting
 * @lends Targeting
*/

        return function () {
            var item,
            config = {
              metadata: context.getFromMetaData,
              audSci: context.fetchAudSci,
              krux: context.fetchKrux,
              socialReferrer: context.getSocialReferrer,
              pageReferrer: context.getPageReferrer,
              cookieConsent:  context.cookieConsent,
              timestamp: context.timestamp,
              version : context.version
            };

            parameters = FT._ads.utils.extend({}, context.getFromConfig(), context.encodedIp(), context.getAysc(), context.searchTerm());

            for (item in config)  {
              if (FT.ads.config(item)) {
                FT._ads.utils.extend(parameters, config[item]());
              }
            }

            // if (FT.ads.config('metadata') !== false) {
            //   FT._ads.utils.extend(parameters, ());
            // }

            // if (FT.ads.config('audSci') !== false) {
            //   FT._ads.utils.extend(parameters, ());
            // }

            // if (FT.ads.config('krux') !== false) {
            //   FT._ads.utils.extend(parameters, ());
            // }

            // if (FT.ads.config('socialReferrer') !== false) {
            //   FT._ads.utils.extend(parameters, context.getSocialReferrer());
            // }

            // if (FT.ads.config('pageReferrer') !== false) {
            //   FT._ads.utils.extend(parameters, context.getPageReferrer());
            // }

            // if (FT.ads.config('cookieConsent') !== false) {
            //   FT._ads.utils.extend(parameters, context.cookieConsent());
            // }


            // if(FT.ads.config('timestamp') !== false){
            //   FT._ads.utils.extend(parameters, context.timestamp());
            // }
            proto.init=true;
            return parameters;
        };

        //FT.ads.config('targeting') could hold switches for each Targeting function
    }

    proto.getFromMetaData =  function () {
      var page = FT.ads.metadata.page(),
      user = FT.ads.metadata.user();
      return {
        eid: user.eid || null,
        fts: user.loggedIn + '',
        uuid: page.uuid,
        auuid: page.auuid
      };
    };

    proto.encodedIp =  function () {
        var DFPPremiumIPReplaceLookup = {
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

        function getIP () {
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
        }

        function encodeIP(ip) {
           var encodedIP, lookupKey;

           if (ip) {
              encodedIP = ip;
              for (lookupKey in DFPPremiumIPReplaceLookup) {
                 encodedIP = encodedIP.replace(new RegExp(DFPPremiumIPReplaceLookup[lookupKey].replaceRegex), DFPPremiumIPReplaceLookup[lookupKey].replaceValue);
              }
           }

           return encodedIP;
        }

/**
* returns an object with key loc and a value of the encoded ip
* @memberof Targeting
* @lends Targeting
*/
        return { loc: encodeIP(getIP())};
    };

/**
 * getFromConfig returns an object containing all the key values pairs specified in the dfp_targeting
 * config.
 * @name getFromConfig
 * @memberof Targeting
 * @lends Targeting
*/
    proto.getFromConfig = function () {
        var targeting = FT.ads.config('dfp_targeting') || {};
        if (!FT._ads.utils.isPlainObject(targeting)) {
            if (FT._ads.utils.isString(targeting)) {
                targeting = FT._ads.utils.hash(targeting, ';', '=') || {};
            }
        }
        return targeting;
    };

/**
 * fetchAudSci reads the rsi_segs cookie or takes an rsiSegs string in the format "J07717_10826|J07717_10830|D08734_70012" and returns a DFP targeting object.
 * only segments begining J07717_10 will be entered into the return object.
 * The return object will have a single key 'a' containing an array of segments: {'a' : []};
 * @name fetchAudSci
 * @memberof Targeting
 * @lends Targeting
*/
    proto.fetchAudSci = function (rsiSegs) {
        var segments = {};


        if (!proto.init) {
            FT._ads.utils.attach("//js.revsci.net/gateway/gw.js?csid=J07717",true);
        }

        function parseSegs(segs, max) {
            var match,
                exp = /J07717_10*([^|]*)/g,
                found = [];

            if (max && segs) {
                while((match = exp.exec(segs)) && (found.length < max)){
                    found.push('z'+ match[1]);
                }
            }

            return (found.length) ? found : false;
        }

        if (typeof rsiSegs === "undefined") {
            rsiSegs = FT._ads.utils.cookie('rsi_segs');
        }

        segments = parseSegs(rsiSegs, FT.ads.config('audSciLimit'));
        return segments ? {a: segments} : {};
    };

    proto.fetchKrux = function (){
        var segs, bht = false;

        if (!window.Krux) {
            ((window.Krux = function(){
                    window.Krux.q.push(arguments);
                }).q = []
            );
        }

        function attachControlTag() {
            var m,
            kruxConfigId = ((FT.ads.config('dfp_site')) && FT.ads.config('dfp_site').match(/^ftcom/)) ? "IhGt1gAD" : "IgnVxTJW",
            src=(m=location.href.match(/\bkxsrc=([^&]+)/)) && decodeURIComponent(m[1]),
            finalSrc = /^https?:\/\/([^\/]+\.)?krxd\.net(:\d{1,5})?\//i.test(src) ? src : src === "disable" ? "" :  "//cdn.krxd.net/controltag?confid="+kruxConfigId;

            FT._ads.utils.attach(finalSrc,true);
        }

        function retrieve(name){
            var value;
            name ='kx'+ name;

            if (window.localStorage && localStorage.getItem(name)) {
                value = localStorage.getItem(name);
            }  else if (FT._ads.utils.cookie(name)) {
                value = FT._ads.utils.cookie(name);
            }

            return value;
        }

        function segments() {
            var segs = retrieve('segs'),
                limit = FT.ads.config('kruxLimit');
            if (segs) {
                segs = segs.split(',');
                if (limit) {
                    segs = segs.slice(0, limit);
                }
                return segs;
            }
            return;
        }
if (!proto.init){
        attachControlTag();
      }
        segs = segments();
        return  {
            "kuid" : retrieve('user'),
            "ksg" : segs,
            "khost": encodeURIComponent(location.hostname),
            "bht": segs && segs.length > 0 ? 'true' : 'false'
        };
    };

    proto.getPageReferrer = function () {
       var match = null,
          referrer = FT._ads.utils.getReferrer(),
          hostRegex;
       //referrer is not article
       if (referrer !== '') {
          hostRegex = /^.*?:\/\/.*?(\/.*)$/;
          //remove hostname from results
          match = hostRegex.exec(referrer)[1];

           if (match !== null) {
              match.substring(1);
           }
       }
       return match && {rf: match.substring(1)} || {};
    };

    proto.getSocialReferrer = function () {
        var codedValue, refUrl,
        referrer = FT._ads.utils.getReferrer(),
        lookup = {
            't.co': 'twi',
            'facebook.com': 'fac',
            'linkedin.com': 'lin',
            'drudgereport.com': 'dru'
        },
        refererRegexTemplate = '^http(|s)://(www.)*(SUBSTITUTION)/|_i_referer=http(|s)(:|%3A)(\/|%2F){2}(www.)*(SUBSTITUTION)(\/|%2F)';

        if (FT._ads.utils.isString(referrer)) {
            for(refUrl in lookup) {
                var refererRegex = new RegExp(refererRegexTemplate.replace(/SUBSTITUTION/g, refUrl));
                if (refUrl !== undefined && refererRegex.test(referrer)) {
                   codedValue = lookup[refUrl];
                   break;
                }
            }
        }
        return codedValue && { socref: codedValue } || {};
    };

    proto.cookieConsent = function () {
        return {cc: FT._ads.utils.cookie('cookieconsent') === 'accepted' ? 'y' : 'n'};
    };

  proto.getAysc = function () {
    var exclusions =  ['key=03', 'key=04', 'key=08', 'key=09', 'key=10', 'key=11', 'key=12', 'key=13', 'key=15', 'key=16', 'key=17', 'key=18', 'key=22', 'key=23', 'key=24', 'key=25', 'key=26', 'key=28', 'key=29', 'key=30', 'key=96', 'key=98'];
    var remove_exes = {'02': 1, '05': 1, '06': 1, '07': 1, '19': 1, '20': 1, '21': 1};
    var remove_res_pvt = {'14': 1, 'cn': 1, '27': 1};
    var returnObj = {};
    var AllVars = FT.ads.metadata.getAyscVars({});

    function excludeFields(exclusions, obj) {
      var idx, keyvalsplit, prop;
      // TODO: clean this up later -- val is now unused so this could be simpler.
        for(prop in obj){
              for (idx = 0; idx < exclusions.length; idx++) {
                keyvalsplit = exclusions[idx].split("=");
                if (((keyvalsplit[0] === "key") && (prop === keyvalsplit[1])) || ((keyvalsplit[0] === "val") && (obj[prop] === keyvalsplit[1]))) {
                   delete obj[prop];
                }
              }
            }
          return obj;
        }

        AllVars = excludeFields(exclusions, AllVars);
        for (var ayscVar in AllVars){
            if (!AllVars[ayscVar]){continue;}
            if (remove_exes[ayscVar] && /^x+$/i.test(AllVars[ayscVar])) {continue;}
            if (remove_res_pvt[ayscVar] && /^pvt|res$/i.test(AllVars[ayscVar])) {continue;}
            returnObj[ayscVar] = AllVars[ayscVar].toString().toLowerCase();
        }
        return returnObj;
    };

    proto.behaviouralFlag = function () {
        var flag = (typeof this.rsiSegs() === "undefined") ? "false" : "true";
        return flag;
    };

    proto.searchTerm = function () {
      var qs = FT._ads.utils.hash(FT._ads.utils.getQueryString(), /\&|\;/, '='),
      keywords = qs.q || qs.s || qs.query || qs.queryText || qs.searchField || undefined;

      if (keywords && keywords !== '') {
        keywords = unescape(keywords).toLowerCase()
                    .replace(/[';\^\+]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                    //.replace(/\./g, '%2E');
      }
      return {kw: keywords};
    };

    proto.timestamp = function () {
      return { ts: FT._ads.utils.getTimestamp() };
    };

    proto.version = function(){
      return {ver : "gpt-" + FT.ads.version.artifactVersion};
    };
  FT._ads.utils.extend(FT.ads, {targeting: new Targeting()});
}(window, document));

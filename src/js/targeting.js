/* jshint forin: false */
//TODO: refactor the asyc code, it's nasty

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

"use strict";
var ads;
var proto = Targeting.prototype;
var context;
var parameters = {};
proto.initialised = false;

/**
* The Targeting class defines an FT.ads.targeting instance
* @class
* @constructor
*/
function Targeting() {
	context = this;
}

proto.get = function(){
	var item,
	config = {
		metadata: context.getFromMetaData,
		krux: context.fetchKrux,
		socialReferrer: context.getSocialReferrer,
		pageReferrer: context.getPageReferrer,
		cookieConsent:  context.cookieConsent,
		timestamp: context.timestamp,
		version : context.version
	};

	ads.utils.extend(parameters, context.getFromConfig(), context.encodedIp(), context.getAysc(), context.searchTerm());

	for (item in config)  {
		if (config.hasOwnProperty(item) && ads.config(item)) {
			ads.utils.extend(parameters, config[item]());
		}
	}
	return parameters;
};

proto.add = function (obj){
	if (ads.utils.isPlainObject(obj)){
		ads.utils.extend(parameters, obj);
	}
};

proto.getFromMetaData =  function () {
	var page = ads.metadata.page(),
	user = ads.metadata.user();
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
			var ip, tmp, ftUserTrackVal = ads.utils.cookie('FTUserTrack'), ipTemp;

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
					if(DFPPremiumIPReplaceLookup.hasOwnProperty(lookupKey)){
						encodedIP = encodedIP.replace(new RegExp(DFPPremiumIPReplaceLookup[lookupKey].replaceRegex), DFPPremiumIPReplaceLookup[lookupKey].replaceValue);
					}
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
	var targeting = ads.config('dfp_targeting') || {};
	if (!ads.utils.isPlainObject(targeting)) {
			if (ads.utils.isString(targeting)) {
					targeting = ads.utils.hash(targeting, ';', '=') || {};
			}
	}
	return targeting;
};

proto.fetchKrux = function (){
		return ads.krux.targeting();
};

proto.getPageReferrer = function () {
	var match = null,
		referrer = ads.utils.getReferrer(),
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
		referrer = ads.utils.getReferrer(),
		lookup = {
				't.co': 'twi',
				'facebook.com': 'fac',
				'linkedin.com': 'lin',
				'drudgereport.com': 'dru'
		},
		refererRegexTemplate = '^http(|s)://(www.)*(SUBSTITUTION)/|_i_referer=http(|s)(:|%3A)(\/|%2F){2}(www.)*(SUBSTITUTION)(\/|%2F)';

		if (ads.utils.isString(referrer)) {
				for(refUrl in lookup) {
					if(lookup.hasOwnProperty(refUrl)){
						var refererRegex = new RegExp(refererRegexTemplate.replace(/SUBSTITUTION/g, refUrl));
						if (refUrl !== undefined && refererRegex.test(referrer)) {
							codedValue = lookup[refUrl];
							break;
						}
					}
				}
		}
		return codedValue && { socref: codedValue } || {};
};

proto.cookieConsent = function () {
		return {cc: ads.utils.cookie('cookieconsent') === 'accepted' ? 'y' : 'n'};
};

proto.getAysc = function () {
	var exclusions =  ['key=03', 'key=04', 'key=08', 'key=09', 'key=10', 'key=11', 'key=12', 'key=13', 'key=15', 'key=16', 'key=17', 'key=18', 'key=22', 'key=23', 'key=24', 'key=25', 'key=26', 'key=28', 'key=29', 'key=30', 'key=96', 'key=98'];
	var remove_exes = {'02': 1, '05': 1, '06': 1, '07': 1, '19': 1, '20': 1, '21': 1};
	var remove_res_pvt = {'14': 1, 'cn': 1, '27': 1};
	var returnObj = {};
	var AllVars = ads.metadata.getAyscVars({});

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

//TODO is this still relevant maybe we should remove it
proto.behaviouralFlag = function () {
	var flag = (typeof this.rsiSegs() === "undefined") ? "false" : "true";
	return flag;
};

proto.searchTerm = function () {
	var qs = ads.utils.hash(ads.utils.getQueryString(), /\&|\;/, '='),
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
	return { ts: ads.utils.getTimestamp() };
};

proto.version = function(){
	return {ver : ads.version.artifactVersion};
};

proto.init = function (impl) {
	ads = impl;
	return this;
};

module.exports = new Targeting();

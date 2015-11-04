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

'use strict';
var config = require('./config');
var metadata = require('./metadata');
var krux = require('./data-providers/krux');
var version = require('./version');
var utils = require('./utils');
var parameters = {};

/**
* The Targeting class defines an ads.targeting instance
* @class
* @constructor
*/
function Targeting() {
}

Targeting.prototype.get = function() {
	var item;
	var methods = {
		metadata: this.getFromMetaData,
		krux: this.fetchKrux,
		socialReferrer: this.getSocialReferrer,
		pageReferrer: this.getPageReferrer,
		cookieConsent:  this.cookieConsent,
		timestamp: this.timestamp,
		version: this.version
	};

	utils.extend(parameters, this.getFromConfig(), this.encodedIp(), this.getAysc(), this.searchTerm());

	for (item in methods)  {
		if (methods.hasOwnProperty(item) && config(item)) {
			utils.extend(parameters, methods[item]());
		}
	}

	return parameters;
};

Targeting.prototype.add = function(obj) {
	if (utils.isPlainObject(obj)) {
		utils.extend(parameters, obj);
	}
};

Targeting.prototype.clear = function() {
	parameters = {};
};

Targeting.prototype.getFromMetaData =  function() {
	var user = metadata.user();
	return {
		eid: user.eid || null,
		fts: user.loggedIn + ''
	};
};

Targeting.prototype.encodedIp =  function() {
	var DFPPremiumIPReplaceLookup = {
		0: {replaceRegex: /0/g, replaceValue: 'a'},
		1: {replaceRegex: /1/g, replaceValue: 'b'},
		2: {replaceRegex: /2/g, replaceValue: 'c'},
		3: {replaceRegex: /3/g, replaceValue: 'd'},
		4: {replaceRegex: /4/g, replaceValue: 'e'},
		5: {replaceRegex: /5/g, replaceValue: 'f'},
		6: {replaceRegex: /6/g, replaceValue: 'g'},
		7: {replaceRegex: /7/g, replaceValue: 'h'},
		8: {replaceRegex: /8/g, replaceValue: 'i'},
		9: {replaceRegex: /9/g, replaceValue: 'j'},
		'.': {replaceRegex: /\./g, replaceValue: 'z'}
	};

	function getIP() {
		var ip;
		var tmp;
		var ipTemp;
		var ftUserTrackVal = utils.cookie('FTUserTrack');

		// sample FTUserTrackValue = 203.190.72.182.1344916650137365
		if (ftUserTrackVal) {
			ip = ftUserTrackVal;
			tmp = ftUserTrackVal.match(/^\w{1,3}\.\w{1,3}\.\w{1,3}\.\w{1,3}\.\w+$/);
			if (tmp) {
				tmp = tmp[0];
				ipTemp = tmp.match(/\w{1,3}/g);
				if (ipTemp) {
					ip = ipTemp[0] + '.' + ipTemp[1] + '.' + ipTemp[2] + '.' + ipTemp[3];
				}
			}
		}

		return ip;
	}

	function encodeIP(ip) {
		var encodedIP;
		var lookupKey;

		if (ip) {
			encodedIP = ip;
			for (lookupKey in DFPPremiumIPReplaceLookup) {
				if (DFPPremiumIPReplaceLookup.hasOwnProperty(lookupKey)) {
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
Targeting.prototype.getFromConfig = function() {
	var targeting = config('dfp_targeting') || {};
	if (!utils.isPlainObject(targeting)) {
		if (utils.isString(targeting)) {
			targeting = utils.hash(targeting, ';', '=') || {};
		}
	}

	return targeting;
};

Targeting.prototype.fetchKrux = function() {
	return krux.targeting();
};

Targeting.prototype.getPageReferrer = function() {
	var hostRegex;
	var match = null;
	var referrer = utils.getReferrer();

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

Targeting.prototype.getSocialReferrer = function() {
	var codedValue;
	var refUrl;
	var referrer = utils.getReferrer();
	var refererRegexTemplate = '^http(|s)://(www.)*(SUBSTITUTION)/|_i_referer=http(|s)(:|%3A)(\/|%2F){2}(www.)*(SUBSTITUTION)(\/|%2F)';
	var lookup = {
		't.co': 'twi',
		'facebook.com': 'fac',
		'linkedin.com': 'lin',
		'drudgereport.com': 'dru'
	};

	if (utils.isString(referrer)) {
		for (refUrl in lookup) {
			if (lookup.hasOwnProperty(refUrl)) {
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

Targeting.prototype.cookieConsent = function() {
	return {cc: utils.cookie('cookieconsent') === 'accepted' ? 'y' : 'n'};
};

Targeting.prototype.getAysc = function() {
	var exclusions = ['key=03', 'key=04', 'key=08', 'key=09', 'key=10', 'key=11', 'key=12', 'key=13', 'key=15', 'key=16', 'key=17', 'key=18', 'key=22', 'key=23', 'key=24', 'key=25', 'key=26', 'key=28', 'key=29', 'key=30', 'key=96', 'key=98'];
	var remove_exes = {'02': 1, '05': 1, '06': 1, '07': 1, 19: 1, 20: 1, 21: 1};
	var remove_res_pvt = { 14: 1, cn: 1, 27: 1};
	var returnObj = {};
	var AllVars = metadata.getAyscVars({});

	function excludeFields(exclusions, obj) {
		var idx;
		var keyvalsplit;
		var prop;

		// TODO: clean this up later -- val is now unused so this could be simpler.
		for (prop in obj) {
			for (idx = 0; idx < exclusions.length; idx++) {
				keyvalsplit = exclusions[idx].split('=');
				if (((keyvalsplit[0] === 'key') && (prop === keyvalsplit[1])) || ((keyvalsplit[0] === 'val') && (obj[prop] === keyvalsplit[1]))) {
					delete obj[prop];
				}
			}
		}

		return obj;
	}

	AllVars = excludeFields(exclusions, AllVars);
	for (var ayscVar in AllVars) {
		if (!AllVars[ayscVar]) {continue;}

		if (remove_exes[ayscVar] && /^x+$/i.test(AllVars[ayscVar])) {continue;}

		if (remove_res_pvt[ayscVar] && /^pvt|res$/i.test(AllVars[ayscVar])) {continue;}

		returnObj[ayscVar] = AllVars[ayscVar].toString().toLowerCase();
	}

	return returnObj;
};

//TODO is this still relevant maybe we should remove it
Targeting.prototype.behaviouralFlag = function() {
	var flag = (typeof this.rsiSegs() === 'undefined') ? 'false' : 'true';
	return flag;
};

Targeting.prototype.searchTerm = function() {
	var qs = utils.hash(utils.getQueryString(), /\&|\;/, '=');
	var keywords = qs.q || qs.s || qs.query || qs.queryText || qs.searchField || undefined;

	if (keywords && keywords !== '') {
		keywords = unescape(keywords).toLowerCase()
		.replace(/[';\^\+]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

		//.replace(/\./g, '%2E');
	}

	return {kw: keywords};
};

Targeting.prototype.timestamp = function() {
	return { ts: utils.getTimestamp() };
};

Targeting.prototype.version = function() {
	return {ver: version.artifactVersion};
};

module.exports = new Targeting();

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
		krux: this.fetchKrux,
		socialReferrer: this.getSocialReferrer,
		pageReferrer: this.getPageReferrer,
		cookieConsent:  this.cookieConsent,
		timestamp: this.timestamp,
		version: this.version
	};

	utils.extend(parameters, this.getFromConfig(), this.encodedIp(), this.searchTerm());

	for (item in methods)  {
		if (methods.hasOwnProperty(item) && config(item)) {
			utils.extend(parameters, methods[item]());
		}
	}

	return parameters;
};

Targeting.prototype.add = function(obj) {
	/* istanbul ignore else  */
	if (utils.isPlainObject(obj)) {
		utils.extend(parameters, obj);
	}
};

Targeting.prototype.clear = function() {
	parameters = {};
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
				/* istanbul ignore else  */
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
				/* istanbul ignore else  */
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
		/* istanbul ignore else  */
		if (utils.isString(targeting)) {
			targeting = utils.hash(targeting, ';', '=');
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
		/* istanbul ignore else  */
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

	/* istanbul ignore else  */
	if (utils.isString(referrer)) {
		for (refUrl in lookup) {
			/* istanbul ignore else  */
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

Targeting.prototype.searchTerm = function() {
	var qs = utils.hash(utils.getQueryString(), /\&|\;/, '=');
	var keywords = qs.q || qs.s || qs.query || qs.queryText || qs.searchField || undefined;

	if (keywords && keywords !== '') {
		keywords = unescape(keywords).toLowerCase()
		.replace(/[';\^\+]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	}

	return {kw: keywords};
};

Targeting.prototype.timestamp = function() {
	return { ts: utils.getTimestamp() };
};

Targeting.prototype.version = function() {
	return {ver: version.artifactVersion};
};

Targeting.prototype.debug = function () {
	var log = utils.log;
	var parameters = this.get();
	if (!parameters) {
		return;
	}

	log.start('Targeting');
		log.attributeTable(this.get());
	log.end();
};

module.exports = new Targeting();

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 */
/**
 * FT.ads.video.miniplayer is...
 * @name video-miniplayer
 * @memberof FT.ads
*/
"use strict";
var config = require('./config');
var targeting = require('./targeting');

function gptVideoURL(pos, vkv){
	var URL, additionalAdTargetingParams, fullURL;
	var buildCustomParams = function (vkv) {
		var allTargeting = targeting.get();
		var results = '',
		kruxSegs = allTargeting.ksg,
		includeParams = [ 'playlistid', 'playerid', '07', 'ksg', 'a', '06', 'slv', 'eid', '05', '19', '21', '27', '20', '02', '14', 'cn', '01','rfrsh', 'dcopt', 'brand', 'section', 'lnID', 'specialBadging'];
		var i;
		for (i=0;i<includeParams.length;i++){
			var key= includeParams[i];
			var value = false;
			if (typeof allTargeting[key] !== 'undefined') {
				value = allTargeting[key];
			} else if (typeof vkv !== 'undefined' && (typeof vkv[key] !== 'undefined')) {
				value = vkv[key];
			}
			if (key === 'ksg' && kruxSegs) {
				value=kruxSegs.slice(0,config('kruxMaxSegs')).join(',');
			}
			results += !value ? '' : key + '=' + value + '&';
		}
		return results;
	};
	var encodeCustParams = function (vkv) {
		return encodeURIComponent(buildCustomParams(vkv));
	};

	URL = "http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/"+ config('dfp_site') + "/" + config('dfp_zone') + "&sz=592x333&unviewed_position_start=1&scp=pos%3D" + pos;
	additionalAdTargetingParams = encodeCustParams(vkv);
	fullURL = (buildCustomParams(vkv) === "") ? URL : URL + '&' + buildCustomParams(vkv);

	return {
		urlStem : URL,
		additionalAdTargetingParams : additionalAdTargetingParams,
		fullURL : fullURL
	};
}

function legacyVideoURL(mode, vkv){
	var URL;
	var keyOrderVideo = ['dcopt', 'pos'];
	var keyOrderVideoExtra = ['dcopt', 'brand', 'section', 'playlistid', 'playerid', '07', 'ksg', 'a', '06', 'slv', 'eid', '05', '19', '21', '27', '20', '02', '14', 'cn', '01','rfrsh'];
	var encodeBaseAdvertProperties = function (mode, vidKV) {
		var allTargeting = targeting.get();
		var results = '',
		dfp_targeting = config('dfp_targeting'),
		kruxSegs = allTargeting.ksg,
		order;
		if (mode === 'video') {order=keyOrderVideo;}
		if (mode === 'videoExtra') {order=keyOrderVideoExtra;}
		var i;
		for (i=0;i<order.length;i++){
			var key= order[i];
			var value = false;
			if (typeof allTargeting[key] !== 'undefined') {
				value = allTargeting[key];
			} else if (typeof vidKV !== 'undefined' && (typeof vidKV[key] !== 'undefined')) {
				value = vidKV[key];
			}
			if (key === 'pos' && dfp_targeting) {
				results += dfp_targeting + ';';
			}
			if (key === 'ksg' && kruxSegs) {
				value=kruxSegs.slice(0,config('kruxMaxSegs')).join(';ksg=');
			}
			results += !value ? '' : key + '=' + value + ';';
		}
		return results.replace(/;$/, '');
	};
	URL = "http://ad.uk.doubleclick.net/N5887/pfadx/" + config('dfp_site') + "/" + config('dfp_zone') + ";sz=592x333,400x225;pos=video;";
	URL += encodeBaseAdvertProperties('video');
	return  {
		urlStem: URL,
		additionalAdTargetingParams: encodeBaseAdvertProperties('videoExtra', vkv)
	};
}


function buildURLForVideo(zone, pos, vidKV){
	pos = pos || 'video';
	vidKV = vidKV || {};

	if (config('video')) {
		return gptVideoURL(pos, vidKV);
	}
	if (!config('video')) {
		return legacyVideoURL('video', vidKV);
	}
}

module.exports = buildURLForVideo;

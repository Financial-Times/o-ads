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
'use strict';
const config = require('./config');
const targeting = require('./targeting');

function buildURLForVideo(zone, pos, vidKV) {
	const krux = config('krux') || {};
	const gpt = config('gpt') || {};
	pos = pos || 'video';
	vidKV = vidKV || {};
	const gptVideoURL = function() {
		let URL, additionalAdTargetingParams, fullURL;
		const buildCustomParams = function(vkv) {
			const allTargeting = targeting.get();
			let results = '';
			const kruxSegs = allTargeting.ksg;
			const includeParams = ['playlistid', 'playerid', '07', 'ksg', 'kuid', 'khost', '06', 'slv', 'eid', '05', '19', '21', '27', '20', '02', '14', 'cn', '01', 'rfrsh', 'dcopt', 'brand', 'section', 'lnID', 'specialBadging'];

			for (let i = 0; i < includeParams.length; i++) {
				const key = includeParams[i];
				let value = false;
				if (typeof allTargeting[key] !== 'undefined') {
					value = allTargeting[key];
				} else if (typeof vkv !== 'undefined' && (typeof vkv[key] !== 'undefined')) {
					value = vkv[key];
				}

				if (key === 'ksg' && kruxSegs) {
					const max = krux.limit || 1e4;
					value = kruxSegs.slice(0, max).join(',');
				}

				results += !value ? '' : key + '=' + value + '&';
			}

			return results;
		};

		const encodeCustParams = function(vkv) {
			return encodeURIComponent(buildCustomParams(vkv));
		};

		URL = 'http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/' + gpt.site + '/' + gpt.zone + '&sz=592x333|400x225&unviewed_position_start=1&scp=pos%3D' + pos;
		additionalAdTargetingParams = encodeCustParams(vidKV);
		fullURL = (buildCustomParams(vidKV) === '') ? URL : URL + '&' + buildCustomParams(vidKV);
		return {
			urlStem: URL,
			additionalAdTargetingParams: additionalAdTargetingParams,
			fullURL: fullURL
		};
	};

	return gptVideoURL();
}

module.exports = buildURLForVideo;

module.exports.debug = function(){
	const utils = require('./utils');
	const log = utils.log;

	log.start('Video');
		log.attributeTable(buildURLForVideo());
	log.end();
};

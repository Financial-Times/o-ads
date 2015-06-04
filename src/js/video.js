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
var ads;

function buildURLForVideo(zone, pos, vidKV){
    pos = pos || 'video';
    vidKV = vidKV || {};

    var gptVideoURL = function(){
        var URL, additionalAdTargetingParams, fullURL;
        var buildCustomParams = function (vkv) {
            var allTargeting = ads.targeting.get();
                        var results = '',
                        kruxSegs = allTargeting.ksg,
                        includeParams = [ 'playlistid', 'playerid', '07', 'ksg', 'kuid', 'khost', '06', 'slv', 'eid', '05', '19', '21', '27', '20', '02', '14', 'cn', '01','rfrsh', 'dcopt', 'brand', 'section', 'lnID', 'specialBadging'];
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
                                value=kruxSegs.slice(0,ads.config('kruxMaxSegs')).join(',');
                            }
                            results += !value ? '' : key + '=' + value + '&';
                        }
                        return results;
        };
        var encodeCustParams = function (vkv) {
            return encodeURIComponent(buildCustomParams(vkv));
        };

        URL = "http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/"+ ads.config('dfp_site') + "/" + ads.config('dfp_zone') + "&sz=592x333|400x225&unviewed_position_start=1&scp=pos%3D" + pos;
        additionalAdTargetingParams = encodeCustParams(vidKV);
        fullURL = (buildCustomParams(vidKV) === "") ? URL : URL + '&' + buildCustomParams(vidKV);

        return {
            urlStem : URL,
            additionalAdTargetingParams : additionalAdTargetingParams,
            fullURL : fullURL
        };
    };
        return gptVideoURL();
}

buildURLForVideo.init = function (impl) {
    ads = impl;
};

module.exports = buildURLForVideo;

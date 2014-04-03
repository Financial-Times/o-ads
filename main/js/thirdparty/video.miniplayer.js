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
(function (win, doc, undefined) {
    "use strict";

    var buildURLForVideo = function(zone, pos, vidKV){
        pos = pos || 'video';
        vidKV = vidKV || {};

        var gptVideoURL = function(){
            var URL;
            var dfp_targeting;
            var encodeCustParams = function (vkv) {
                var allTargeting = FT.ads.targeting();
                var results = '',
                rsiSegs = allTargeting.a,
                kruxSegs = allTargeting.ksg,
                includeParams = [ 'playlistid', 'playerid', '07', 'ksg', 'a', '06', 'slv', 'eid', '05', '19', '21', '27', '20', '02', '14', 'cn', '01','rfrsh'];
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
                        value=kruxSegs.slice(0,FT.ads.config('kruxMaxSegs')).join(',');
                    }
                    if (key === 'a' && rsiSegs) {
                        value = rsiSegs.slice(0, FT.ads.config('audSciLimit')).join(',');
                    }
                    results += !value ? '' : key + '=' + value + '&';
                }
                return encodeURIComponent(results);
            };
            

            URL = "http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/"+ FT.ads.config('dfp_site') + "/" + FT.ads.config('dfp_zone') + "&sz=592x333&unviewed_position_start=1&scp=pos%3D" + pos;
           // URL += encodeURIComponent(FT.ads.config('dfp_targeting'));
            return {
                urlStem : URL,
                additionalAdTargetingParams : encodeCustParams(vidKV)
            };
        };

        var legacyVideoURL = function(mode, vkv){
            var URL;
            var keyOrderVideo = ['dcopt', 'pos'];
            var keyOrderVideoExtra = ['dcopt', 'brand', 'section', 'playlistid', 'playerid', '07', 'ksg', 'a', '06', 'slv', 'eid', '05', '19', '21', '27', '20', '02', '14', 'cn', '01','rfrsh'];
            var encodeBaseAdvertProperties = function (mode, vidKV) {
                var allTargeting = FT.ads.targeting();
                var results = '',
                dfp_targeting = FT.ads.config('dfp_targeting'),
                rsiSegs = allTargeting.a,
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
                        value=kruxSegs.slice(0,FT.ads.config('kruxMaxSegs')).join(';ksg=');
                    }
                    if (key === 'a' && rsiSegs) {
                        value = rsiSegs.slice(0, FT.ads.config('audSciLimit')).join(';a=');
                    }
                    results += !value ? '' : key + '=' + value + ';';
                }
                return results.replace(/;$/, '');
            };
            URL = "http://ad.uk.doubleclick.net/N5887/pfadx/" + FT.ads.config('dfp_site') + "/" + FT.ads.config('dfp_zone') + ";sz=592x333,400x225;pos=video;";
            URL += encodeBaseAdvertProperties('video');
            return  {
                urlStem: URL,
                additionalAdTargetingParams: encodeBaseAdvertProperties('videoExtra', vidKV)
            };
        };

        if (FT.ads.config('video')) {
            return gptVideoURL();
        }
        if (!FT.ads.config('video')) {
            return legacyVideoURL();
        }
};
    FT._ads.utils.extend(FT.ads, {buildURLForVideo: buildURLForVideo});
}(window, document));

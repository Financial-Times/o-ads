(function (window, doc, $, undefined) {
    sinon.spies = {
        
    };
    function runTests() {
    	module('Video Main-player tests',  {
            setup: function () {
                FT.ads.enableCompanionAds = true;
                FT.ads.enableVideoAds = true;
            },
            teardown: function () {
                FT.ads.enableCompanionAds = null;
                FT.ads.enableVideoAds = null;
            }
        });
        test('buildURLForVideo returns correct URL base when vidoe-hub is set', function () {
            expect(1);

            var result;
            TEST.beginNewPage({
        	   global: {'dfp_site': 'ftcom.5887.video', 'dfp_zone': 'video'}
            });
            result = FT.ads.buildURLForVideo("uk","video",{});
            strictEqual(result.urlStem,'http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/ftcom.5887.video/video-hub&sz=592x333&unviewed_position_start=1&scp=pos%3Dvideo');

        });
    }

    $(runTests);
}(window, document, jQuery));
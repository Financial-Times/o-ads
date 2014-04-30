(function (window, document, $, undefined) {
    function runTests() {
        module('Krux');

        test( "control tag", function() {
            TEST.beginNewPage({
                config: {krux: {id: 'hello'}}
            });

           FT.ads.krux.init();
           ok($('script[src*="krux.js"]').size() === 1, 'the krux control tag file is attached to the page');
        });

        test('targeting data', function () {

            if (FT._ads.utils.isStorage(window.localStorage)) {
                TEST.beginNewPage({config: { cookieConsent: false, krux: { krux: {id: '112233'}}, timestamp: false}, localStorage: { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'}});
                var result = FT.ads.krux.targeting();
                deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "krux segments in localStorage returned correctly");
                equal(result.kuid, 'kxuser', "krux user id returned correctly from localStorage");
                equal(result.khost, encodeURIComponent(location.hostname), "krux host returned correctly");
                equal(result.bht, "true", "Behavioural flag is set, when local storage is used");

            } else {
                ok(true, 'localstorage unavailable in this browser')
            }

            TEST.beginNewPage({config: { krux: {id: '112233'}}, cookies: { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'}});
            var result = FT.ads.krux.targeting();
            deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "krux returns segments from cookies");
         //   equal(result.kuid, "kxuser", "krux user id returned correctly  from cookies");
            equal(result.khost, encodeURIComponent(location.hostname), "krux host returned correctly");
            equal(result.bht, "true", "Behavioural flag is set, when cookies are used");

            TEST.beginNewPage({config: { krux:{id: '112233', limit: 2}}, cookies: { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'}});
            var result = FT.ads.targeting();
            deepEqual(result.ksg, ["seg1", "seg2"], "krux returns 2 segments");
        });


        test('event pixels', function () {
            // given krux is enabled
            // running the events.fire function kicks off an event
            //
        });

        test('event pixel - dwell time', function () {

            // given the lib is configured to do dwell time
            // then after x seconds the event is fired
            // and a call is made to krux
        });

    }
    $(runTests);
}(window, document, jQuery));

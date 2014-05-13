(function (window, document, $, undefined) {
    function runTests() {
        module('Krux');

        test( "control tag is attached when initialised", function() {
            TEST.beginNewPage({
                config: {krux: {id: 'hello'}}
            });

           FT.ads.krux.init();
           ok($('script[src*="util/krux.js"][ftads]').size() === 1, 'the krux control tag file is attached to the page');
        });

        test('targeting data is generated correctly', function () {

            if (FT._ads.utils.isStorage(window.localStorage)) {
                var kruxData= { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'};


                TEST.beginNewPage({config: { cookieConsent: false, krux: { krux: {id: '112233'}}, timestamp: false}, localStorage: kruxData});
                var result = FT.ads.krux.targeting();
                deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "segments in localStorage returned correctly");
                equal(result.kuid, kruxData.kxuser, "user id returned correctly from localStorage");
                equal(result.khost, encodeURIComponent(location.hostname), "host returned correctly");
                equal(result.bht, "true", "Behavioural flag is set, when local storage is used");

            } else {
                ok(true, 'localstorage unavailable in this browser');
            }

            TEST.beginNewPage({config: { krux: {id: '112233'}}, cookies: { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'}});
            var result = FT.ads.krux.targeting();
            deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "returns segments from cookies");
            equal(result.khost, encodeURIComponent(location.hostname), "host returned correctly");
            equal(result.bht, "true", "Behavioural flag is set, when cookies are used");

            TEST.beginNewPage({config: { krux: {id: '112233', limit: 2}}, cookies: { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'}});
            var result = FT.ads.targeting();
            deepEqual(result.ksg, ["seg1", "seg2"], "returns 2 segments");
        });


        test('event pixels', function () {

            TEST.beginNewPage({config: { krux: {id: '112233'}}});
            window.Krux = TEST.sinon.Krux = sinon.stub();
            var eventId = 'crunch',
                attrs = {snap: 'crackle'};
            FT.ads.krux.events.fire(eventId);
            ok(window.Krux.calledWith('admEvent', eventId), 'firing an event works!');

            FT.ads.krux.events.fire(eventId, attrs);
            ok(window.Krux.calledWith('admEvent', eventId, attrs), 'firing an event with attributes works!');
        });

        test('event pixel - dwell time', function () {
            var dwellTimeId = 'JCadw18P',
                dwellTimeInterval = 10,
                dwellTimeTotal = 20;
            TEST.beginNewPage({
                date: (new Date()).valueOf(),
                config: {
                    krux: {
                        id: '112233',
                        events: {
                        dwell_time: {
                                interval: dwellTimeInterval,
                                id: dwellTimeId,
                                total: dwellTimeTotal
                            }
                        }
                    }
                }
            });

            window.Krux = TEST.sinon.Krux = sinon.stub();
            FT.ads.krux.events.init();
            TEST.sinon.clock.tick(11000);
            ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: dwellTimeInterval}), 'fired after first interval');

            TEST.sinon.clock.tick(11000);
            ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: dwellTimeTotal}), 'fired after second interval');

            TEST.sinon.clock.tick(11000);
            ok(window.Krux.neverCalledWith('admEvent', {dwell_time: 30}), 'doesn\'t fire once max interval is reached');
        });
    }
    $(runTests);
}(window, document, jQuery));

(function (win, doc, $, undefined) {
    win.testMode  = win.unitOrIntegrationMode(FT._ads.utils.cookies.FTQA);

    sinon.spies = {
        gptCmdPush: sinon.spy(googletag.cmd, 'push'),
        fetchPageSlots: sinon.spy(FT.ads.gpt, 'fetchPageSlots'),
        fetchAdContainer: sinon.spy(FT.ads.gpt, 'fetchAdContainer'),
        fetchSlotConfig: sinon.spy(FT.ads.gpt, 'fetchSlotConfig')
    };

    function runTests() {

        module('Third party gpt',  {
            setup: function () {

                // reset all spies between test
                // this fails if you do it in teardown for some reason.
                for (var spy in sinon.spies) {
                    sinon.spies[spy].reset();
                }
            }
        });

        test('set page targeting with config', function () {
            expect(2);
            FT.ads.config.clear();
            FT.ads.config('dfp_targeting', ';some=test;targeting=params');

            var result = FT.ads.gpt.setPageTargeting(),
                expected = {some: 'test', targeting: 'params'};

            deepEqual(result, expected, 'setting dfp_targeting in config works');
            ok(sinon.spies.gptCmdPush.calledTwice, 'the params are queued with GPT');
        });

        test('set page targeting with meta', function () {
            expect(2);
            FT._ads.utils.cookies.rsi_segs = '';
            // add meta config and fetch it
            var meta1 = $('<meta name="dfp_targeting" content=";targetKey1=targetValue1;targetKey2=targetValue2">').appendTo('head');
           // FT.ads.config.init();

            var result = FT.ads.gpt.setPageTargeting(),
                expected =  { "targetKey1": "targetValue1", "targetKey2": "targetValue2" };

            deepEqual(result, expected, 'settting dfp_targeting in meta');
            console.dir(sinon.spies.gptCmdPush);
            ok(sinon.spies.gptCmdPush.calledTwice, 'the params are queued with GPT');
            meta1.remove();
        });

        test('set fetch page slots', function () {
           expect(8);

            var result = FT.ads.gpt.fetchPageSlots();

            ok(sinon.spies.fetchAdContainer.calledWith('banlb'), 'search for banlb container');
            ok(sinon.spies.fetchAdContainer.calledWith('hlfmpu'), 'search for hlfmpu container');
            ok(sinon.spies.fetchAdContainer.calledWith('mpu'), 'search for mpu container');

            ok(sinon.spies.fetchSlotConfig.calledWith(doc.getElementById('banlb'), [[728,90], [468,60], [970,90]]), 'Fetch add slot config is called correctly for the banlb');
            ok(sinon.spies.fetchSlotConfig.calledWith(doc.getElementById('mpu'), [[300,250],[336,280]]), 'Fetch add slot config is called correctly for the mpu');
            ok(sinon.spies.fetchSlotConfig.calledWith(doc.getElementById('hlfmpu'), [[300,600],[336,850],[300,250],[336,280]]), 'Fetch add slot config is called correctly for the hlfmpu');

            deepEqual(sinon.spies.fetchSlotConfig.returnValues[0], { sizes: [[728,90], [468,60], [970,90]] }, 'Fetch add slot config returns sizes from config.formats for banlb');
            deepEqual(sinon.spies.fetchSlotConfig.returnValues[2], { sizes: [[300,600]] }, 'Fetch add slot config returns sizes from data attribute for hlfmpu');

        });

        test('Attach GPT library to page', function () {
            expect(2);

            // initial number of async
            var initialScripts = $('script').size();

            FT.ads.gpt.attach();
            deepEqual($('script').size() - initialScripts, 1, 'a new script tag has been added to the page.' );

            // wait for a maximum of 5 seconds for the google code to load
            // the display methods is tested to see if the lib is available
            QUnit.stop();

            var totalTime = 0,
                maxTime = 5000,
                interval = 100,
                timer = setInterval(function () {
                    totalTime += interval;
                    if (!!googletag.display) {
                        ok(true, 'GPT available after ' + totalTime / 1000 + ' seconds');
                        clearInterval(timer);
                        QUnit.start();
                    } else if (interval === maxTime) {
                        ok(false, 'GPT was not available after ' + maxTime / 1000 + ' seconds');
                        clearInterval(timer);
                        QUnit.start();
                    }
                }, interval);
        });

    }

    $(runTests);

    $(function() {
        FT.ads.config('dfp_site', "test.5887.dev");
        FT.ads.config('dfp_zone', "master-companion-test");
        FT.ads.config('dfp_site', "test.5887.dev");
        FT.ads.config('dfp_zone', "master-companion-test");
        FT.ads.gpt.init();
    });
}(window, document, jQuery));

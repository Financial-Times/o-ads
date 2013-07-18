(function (win, doc, $, undefined) {
    win.testMode  = win.unitOrIntegrationMode(FT._ads.utils.cookies.FTQA);

    sinon.spies = {
        gptCmdPush: sinon.spy(googletag.cmd, 'push')
    };

    function runTests() {

        module('Third party gpt',  {
            teardown: function () {
                for (var spy in sinon.spies) {
                    sinon.spies[spy].reset();
                }
            }
        });

        test('Attach GPT library to page', function () {
            expect(2);

            // initial number of async
            var initialScripts = $('script').size();

            FT.ads.gpt.attach();
            deepEqual($('script').size() - initialScripts, 1, 'a new async script tag has been added to the page.' );

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

        test('set page targetting with config', function () {
            expect(2);

            FT.ads.config.set('dfp_targeting', ';some=test;targeting=params');

            var result = FT.ads.gpt.setPageTargeting(),
                expected = {some: 'test', targeting: 'params'};

            deepEqual(result, expected, 'settting dfp_targeting in config works');
            ok(sinon.spies.gptCmdPush.calledTwice, 'the params are queued with GPT');
        });

        test('set page targeting with meta', function () {
            expect(2);
            // add meta config and fetch it
            var meta1 = $('<meta name="dfp_targeting" content=";targetKey1=targetValue1;targetKey2=targetValue2">').appendTo('head');
            FT.ads.config.init();

                var result = FT.ads.gpt.setPageTargeting(),
                    expected =  { "targetKey1": "targetValue1", "targetKey2": "targetValue2" };

                deepEqual(result, expected, 'settting dfp_targeting in meta');
            //ok(sinon.spies.gptCmdPush.calledTwice, 'the params are queued with GPT');
            meta1.remove();
        });

    }

    $(runTests);
    $(function() {
        FT.ads.config.set('dfp_site', "test.5887.dev");
        FT.ads.config.set('dfp_zone', "master-companion-test");
        FT.ads.gpt.init();
    });
}(window, document, jQuery));

(function (window, document, $, undefined) {
    window.testMode  = window.unitOrIntegrationMode(FT._ads.utils.cookies.FTQA);

    sinon.spies = {
        gptCmdPush: sinon.spy(googletag.cmd, 'push')
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

        test('set page targeting', function () {
            expect(2);
            var oldConfig = FT.ads.config();
            FT.ads.config.clear();
            FT.ads.config('dfp_targeting', ';some=test;targeting=params');

            var result = FT.ads.gpt.setPageTargeting(),
                expected = {eid: null, some: 'test', targeting: 'params'};

            deepEqual(result, expected, 'setting dfp_targeting in config works');
            ok(sinon.spies.gptCmdPush.calledThrice, 'the params are queued with GPT');
            FT.ads.config(oldConfig);
        });

        test('collapse empty', function () {
            var result;

            sinon.spies.gptCmdPush.reset();
            result  = FT.ads.gpt.setPageCollapseEmpty();
            equal(result, undefined, 'No config set defaults to undefined');
            ok(sinon.spies.gptCmdPush.calledOnce, 'the action is queued with GPT');

            sinon.spies.gptCmdPush.reset();
            FT.ads.config('collapseEmpty', 'after');
            result  = FT.ads.gpt.setPageCollapseEmpty();
            equal(result, undefined, 'Config set to "after" mode is undefined!');
            ok(sinon.spies.gptCmdPush.calledOnce, 'the action is queued with GPT');

            sinon.spies.gptCmdPush.reset();
            FT.ads.config('collapseEmpty', 'before');
            result  = FT.ads.gpt.setPageCollapseEmpty();
            equal(result, true, 'Config set to "before" mode is true!');
            ok(sinon.spies.gptCmdPush.calledOnce, 'the action is queued with GPT');

            sinon.spies.gptCmdPush.reset();
            FT.ads.config('collapseEmpty', false);
            result  = FT.ads.gpt.setPageCollapseEmpty();
            equal(result, false, 'setting the value with false works');
            ok(sinon.spies.gptCmdPush.calledOnce, 'the action is queued with GPT');
        });

        // test('displaySlot', function () {

        //     FT.ads.gpt.defineSlot('mpu');

        //     sinon.spies.gptCmdPush.reset();
        //     FT.ads.config('fetchSlots', true);
        //     FT.ads.gpt.defineSlot('hlfmpu');
        //     //FT.ads.gpt.slots('');
        //     //deepEqual({},{},);

        // });

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
}(window, document, jQuery));

(function (win, doc, $, undefined) {
    win.testMode  = win.unitOrIntegrationMode(FT._ads.utils.cookies.FTQA);

    sinon.spies = {
        gptCmdPush: sinon.spy(googletag.cmd, 'push'),
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

        test('fetchSlotConfig sizes', function () {
            expect(8);

            var container = $('<script data-ftads-size="1x1">FT.env.advert(\'refresh\')</script>')[0],
                result = FT.ads.gpt.fetchSlotConfig(container, {sizes: [[5,5]]}),
                expected = [[1, 1]];
            deepEqual(result.sizes, expected, 'data-ftads-size attribute on a script tag');

            container = $('<div data-ftads-size="1x1"></div>')[0],
            result = FT.ads.gpt.fetchSlotConfig(container, {sizes: [[5,5]]}),
            expected = [[1, 1]];
            deepEqual(result.sizes, expected, 'data-ftads-size attribute on a div tag');

            container = $('<div data-ad-size="1x1"></div>')[0],
            result = FT.ads.gpt.fetchSlotConfig(container, {sizes: [[5,5]]}),
            expected = [[1, 1]];
            deepEqual(result.sizes, expected, 'data-ad-size attribute on a div tag');

            container = $('<div data-ftads-size="600x300,300x600,720x30">')[0];
            result = FT.ads.gpt.fetchSlotConfig(container, {sizes: [[5,5]]});
            expected = [[600, 300], [300, 600], [720, 30]];
            deepEqual(result.sizes, expected, 'Multiple sizes are parsed');

            container = $('<div data-ftads-size="600x300,invalidxsize,100x200,720x30">')[0];
            result = FT.ads.gpt.fetchSlotConfig(container, {sizes: [[5,5]]});
            expected = [[600, 300], [100, 200], [720, 30]];
            deepEqual(result.sizes, expected, 'Invalid size is ignored');

            container = $('<div data-ftads-size="">')[0];
            result = FT.ads.gpt.fetchSlotConfig(container, {sizes: [[5,5]]});
            expected = [[5, 5]];
            deepEqual(result.sizes, expected, 'Empty string returns size from passed config');

            container = $('<div>')[0];
            result = FT.ads.gpt.fetchSlotConfig(container, {sizes: [[5,5]]});
            expected = [[5, 5]];
            deepEqual(result.sizes, expected, 'No attribute returns size from passed config');

            container = $('<div data-ftads-size="invalidxsize">')[0];
            result = FT.ads.gpt.fetchSlotConfig(container, {sizes: [[5,5]]});
            expected = [[5, 5]];
            deepEqual(result.sizes, expected, 'Single invalid size returns size passed from config');
        });

        test('fetchSlotConfig out of page', function () {
            expect(3);

            var container = $('<div data-ftads-out-of-page></div>')[0],
                result = FT.ads.gpt.fetchSlotConfig(container, {});
            ok(result.outOfPage, 'data-ftads-out-of-page attribute is present returns true');

            container = $('<div>')[0];
            result = FT.ads.gpt.fetchSlotConfig(container, {outOfPage: true});
            ok(result.outOfPage, 'No attribute returns value from passed config');


            container = $('<div>')[0];
            result = FT.ads.gpt.fetchSlotConfig(container, {});
            ok(!result.outOfPage, 'No attribute and no config returns false');
        });

        test('fetchSlotConfig targeting', function () {
            expect(4);

            var container = $('<div data-ftads-targeting="some=test;targeting=params;"></div>')[0],
                result = FT.ads.gpt.fetchSlotConfig(container, {}),
                expected = { some: 'test', targeting: 'params'};

            deepEqual(result.targeting, expected, 'data-ftads-targeting attribute is parsed');

            container = $('<div data-ftads-targeting="some=test; ;targeting=params;"></div>')[0],
            result = FT.ads.gpt.fetchSlotConfig(container, {}),
            expected = { some: 'test', targeting: 'params'};

            deepEqual(result.targeting, expected, 'data-ftads-targeting malformed string is ok');

            container = $('<div data-ftads-position="banlb"></div>')[0],
            result = FT.ads.gpt.fetchSlotConfig(container, {}),
            expected = { pos: 'banlb'};

            deepEqual(result.targeting, expected, 'position is parsed to pos');

            container = $('<div data-ad-whatever="happened" data-></div>')[0],
            result = FT.ads.gpt.fetchSlotConfig(container, {}),
            expected = { whatever: 'happened'};

            deepEqual(result.targeting, expected, 'other attributes are set as is');
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

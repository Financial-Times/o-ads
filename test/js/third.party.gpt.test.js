(function (window, document, $, undefined) {
    sinon.spies = {
        gptCmdPush: sinon.spy(googletag.cmd, 'push')
    };

     function runTests() {
        module('Third party gpt',  {
            setup: function () {
            }
        });

        test('init', function () {
            TEST.beginNewPage({config: {krux: false, timestamp: false, audSci : false}});
            FT.ads.gpt.init();

            ok(TEST.sinon.attach.calledWith('//www.googletagservices.com/tag/js/gpt.js', true), 'google publisher tag library is attached to the page');
        });

        test('set page targeting', function () {
            expect(2);
            sinon.spies.gptCmdPush.reset();
            TEST.beginNewPage({config: {cookieConsent: false, krux: false, timestamp: false, audSci : false, dfp_targeting: ';some=test;targeting=params'}});
            var result = FT.ads.gpt.setPageTargeting(),
                expected = {some: 'test', targeting: 'params'};

            deepEqual(result, expected, 'setting dfp_targeting in config works');
            equal(sinon.spies.gptCmdPush.callCount, 2, 'the params are queued with GPT');
        });

        // test('refresh', function () {
        //     TEST.mock.date('now');
        //     TEST.beginNewPage({config: {refreshTime: 1 }});
        //     FT.ads.gpt.startRefresh();
        //     TEST.sinon.GPTrefreshTimer = sinon.spy(FT.ads.gpt.refreshTimer, 'fn');

        //     TEST.sinon.clock.tick(1025);
        //     ok();
        // });

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

        test('define with images sizes', function () {
           TEST.beginNewPage({config: {responsive:{large: [1280, 800], medium: [970, 690], small: [0,0]}, meta: mpu ,formats: {
              banlb: {
                 sizes: {
                    small: [[468, 60]],
                    medium: [[728, 90]],
                    large: [[970, 90]]
                 }
              },
              hlfmpu:{
                 sizes: {
                    small: [[300, 250]],
                    medium: [[300, 600]],
                    large: [[300, 1050]]
                 }
              },
              mpu: {
                 sizes: {
                    small: false,
                    medium: [[300, 250]],
                    large: [[336,280]]
                 }
              }
           },  krux: false, timestamp: false, audSci : false}});
           FT.ads.gpt.init(); // define method is run in the init

           FT.ads.slots.initSlot('mpu');
           var result, stubOnSlot;
           stubOnSlot = FT.ads.slots.mpu.gptSlot;
           expect(2);
           ok(googletag.defineSlot.calledOnce, 'the GPT define slot is called');
           ok(stubOnSlot.defineSizeMapping.calledOnce, 'the GPT defineSizeMapping slot is called');

        });

        test('define without images sizes', function () {
           TEST.beginNewPage({config: {responsive:{large: [1280, 800], medium: [970, 690], small: [0,0]}, meta: mpu,  krux: false, timestamp: false, audSci : false}});
           FT.ads.gpt.init(); // define method is run in the init

           FT.ads.slots.initSlot('mpu');
           var result, stubOnSlot;
           stubOnSlot = FT.ads.slots.mpu.gptSlot;
           expect(2);
           ok(googletag.defineSlot.calledOnce, 'the GPT define slot is called');
           equal(stubOnSlot.defineSizeMapping.callCount, 0, 'the GPT defineSizeMapping slot is called');

        });


    }

    $(runTests);
}(window, document, jQuery));



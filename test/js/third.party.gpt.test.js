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

        test('getUnitName', function () {
            expect(6);

            TEST.beginNewPage({config: {network: '5887', dfp_site: 'some-dfp-site', dfp_zone: 'some-dfp-zone'}});
            var result = FT.ads.gpt.getUnitName(),
                expected = '/5887/some-dfp-site/some-dfp-zone';

            strictEqual(result, expected, 'setting unit name with site and zone works');

            TEST.beginNewPage({config: {network: '5887', dfp_site: 'some-dfp-site'}});
            var result = FT.ads.gpt.getUnitName(),
                expected = '/5887/some-dfp-site';

            strictEqual(result, expected, 'setting unit name with site and no zone works');

            TEST.beginNewPage({config: {network: '5887'}});
            var result = FT.ads.gpt.getUnitName(),
                expected = '/5887';

            strictEqual(result, expected, 'setting unit name with empty site and empty zone  just returns network');

            TEST.beginNewPage({config: {network: '5887', dfp_site: '', dfp_zone: ''}});
            var result = FT.ads.gpt.getUnitName(),
                expected = '/5887';

            strictEqual(result, expected, 'setting unit name with empty string site and zone just returns network');

            TEST.beginNewPage({config: {network: '5887', dfp_site: 'some-dfp-site', dfp_zone: ''}});
            var result = FT.ads.gpt.getUnitName(),
                expected = '/5887/some-dfp-site';

            strictEqual(result, expected, 'setting unit name with site and empty string zone works');


            TEST.beginNewPage({config: {gptUnitName: '/hello-there/stranger'}});
            var result = FT.ads.gpt.getUnitName(),
                expected = '/hello-there/stranger';

            strictEqual(result, expected, 'unit name override works');

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
    }

    $(runTests);
}(window, document, jQuery));

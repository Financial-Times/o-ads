/* jshint strict: false */
/* globals  FT, asyncTest: false, deepEqual: false, equal: false, expect: false, module: false, notDeepEqual: false, notEqual: false, notStrictEqual : false, ok: false, QUnit: false, raises: false, start: false, stop: false, strictEqual: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn of use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, document, $, undefined) {
     function runTests() {

        QUnit.module('Third party gpt',  {
            setup: function () {
            }
        });

        test('init', function () {
            TEST.beginNewPage({config: {krux: false, timestamp: false, audSci : false}});
            FT.ads.gpt.init(FT.ads);

            ok(TEST.sinon.attach.calledWith('//www.googletagservices.com/tag/js/gpt.js', true), 'google publisher tag library is attached to the page');
        });

        test('set page targeting', function () {
            expect(2);
            googletag.cmd.push.reset();
            TEST.beginNewPage({config: {cookieConsent: false, krux: false, timestamp: false, audSci : false, dfp_targeting: ';some=test;targeting=params'}});
            var result = FT.ads.gpt.setPageTargeting(),
                expected = {some: 'test', targeting: 'params'};
            deepEqual(result, expected, 'setting dfp_targeting in config works');
            equal(googletag.cmd.push.callCount, 2, 'the params are queued with GPT');
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
            googletag.cmd.push.reset();
            googletag.cmd.push.reset()
            result  = FT.ads.gpt.setPageCollapseEmpty();
            equal(result, undefined, 'No config set defaults to undefined');
            ok(googletag.cmd.push.calledOnce, 'the action is queued with GPT');

            googletag.cmd.push.reset();
            FT.ads.config('collapseEmpty', 'after');
            result  = FT.ads.gpt.setPageCollapseEmpty();
            equal(result, undefined, 'Config set to "after" mode is undefined!');
            ok(googletag.cmd.push.calledOnce, 'the action is queued with GPT');

            googletag.cmd.push.reset();
            FT.ads.config('collapseEmpty', 'before');
            result  = FT.ads.gpt.setPageCollapseEmpty();
            equal(result, true, 'Config set to "before" mode is true!');
            ok(googletag.cmd.push.calledOnce, 'the action is queued with GPT');

            googletag.cmd.push.reset();
            FT.ads.config('collapseEmpty', false);
            result  = FT.ads.gpt.setPageCollapseEmpty();
            equal(result, false, 'setting the value with false works');
            ok(googletag.cmd.push.calledOnce, 'the action is queued with GPT');
        });


        test('define with images sizes', function () {
           $('body').append('<div id="responsive-mpu"></div>');
           TEST.beginNewPage({
            container: 'responsive-mpu', config: {
            responsive:{
              large: [1280, 800],
              medium: [970, 690],
              small: [0,0]
            },
            formats: {
              'responsive-mpu': {
                 sizes: {
                    small: false,
                    medium: [[300, 250]],
                    large: [[336,280]]
                 }
              }
           },  krux: false, timestamp: false, audSci : false}});
           FT.ads.gpt.init(FT.ads); // define method is run in the init

           FT.ads.slots.initSlot('responsive-mpu');
           var result, stubOnSlot;
           stubOnSlot = FT.ads.slots['responsive-mpu'].gptSlot;
           expect(2);
           ok(googletag.defineUnit.calledOnce, 'the GPT define unit is called');
           ok(stubOnSlot.defineSizeMapping.calledOnce, 'the GPT defineSizeMapping slot is called');

        });

        test('define without images sizes', function () {
          $('body').append('<div id="no-responsive-mpu"></div>');
           TEST.beginNewPage({
            container: 'no-responsive-mpu',
            config: {
              responsive: {
                large: [1280, 800],
                medium: [970, 690],
                small: [0,0]
              },
              krux: false,
              timestamp: false,
              audSci : false,
              formats: {
                'no-responsive-mpu': {
                   sizes: [[300, 250]]
                }
              }
            }
          });

          FT.ads.gpt.init(FT.ads); // define method is run in the init

          FT.ads.slots.initSlot('no-responsive-mpu');
          var result,
              stubOnSlot = FT.ads.slots['no-responsive-mpu'].gptSlot;
          expect(2);
          ok(googletag.defineSlot.calledOnce, 'the GPT define slot is called');
          equal(stubOnSlot.defineSizeMapping.callCount, 0, 'the GPT defineSizeMapping slot is called');

        });

        test('update correlator without images sizes', function () {
          TEST.beginNewPage();
          FT.ads.gpt.updateCorrelator();
          ok(googletag.pubads().updateCorrelator.calledOnce, 'the pub ads update correlator method is called when our method is called.');
        });

        test('fix the url for ad requests', function () {
          TEST.beginNewPage({
            container: 'url-slot',
            config: {
              canonical: 'http://www.ft.com',
              formats: {
                'url-slot': {
                   sizes: [[300, 250]]
                }
              }
            }
          });
          FT.ads.slots.initSlot('url-slot');

          var slot = FT.ads.slots['url-slot'];
          ok(slot.gptSlot.set.calledWith('page_url', 'http://www.ft.com'), 'page url set via config');

          TEST.beginNewPage({
            canonical: 'http://www.ft.com/',
            container: 'canonical-slot',
            config: {
              formats: {
                'canonical-slot': {
                   sizes: [[300, 250]]
                }
              }
            }
          });

          FT.ads.slots.initSlot('canonical-slot');

          var slot = FT.ads.slots['canonical-slot'];
          ok(slot.gptSlot.set.calledWith('page_url', 'http://www.ft.com/'), 'page url set via canonical link tag');

    });
  }

    $(runTests);
}(window, document, jQuery));

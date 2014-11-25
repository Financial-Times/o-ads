/* jshint strict: false */
/* globals  FT, deepEqual: false, equal: false, expect: false, module: false, notDeepEqual: false, notEqual: false, notStrictEqual : false, ok: false, QUnit: false, raises: false, start: false, stop: false, strictEqual: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn off use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, document, $, undefined) {
   function runTests() {
      var _initSlot = FT.ads.slots.initSlot;
      QUnit.module('Rubicon', {
         setup: function() {
         },
         teardown: function() {
            FT.ads.slots.initSlot = _initSlot;
         }
      });

      test('init - disable rubicon', function () {
         TEST.beginNewPage({config: {rubicon: false}});
         FT.ads.rubicon.init(FT.ads);

         ok(!TEST.sinon.attach.calledWith('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is not attached to the page');
      })

      test('init - enable rubicon', function () {
         var decorateInitSlot = sinon.spy(FT.ads.rubicon, 'decorateInitSlot');
         TEST.beginNewPage({config: {rubicon: {id: 10232, site: 26290}}});
         FT.ads.rubicon.init(FT.ads);

         ok(TEST.sinon.attach.calledWith('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is attached to the page');
         ok(decorateInitSlot.calledOnce, 'initSlot is called');

         decorateInitSlot.restore();
      });

      test('decorate slots.initSlot', function () {
         TEST.beginNewPage({config: {rubicon: {id: 10232, site: 26290}}});

         FT.ads.rubicon.decorateInitSlot();

         equal(FT.ads.slots.initSlot, FT.ads.rubicon.initValuation, 'ads.slots.initSlot is decorated by ads.rubicon.initValuation');
      });

      test('test rubicon insight - no rubicon mapping for given site and size', function () {
         var initValuation = sinon.spy(FT.ads.rubicon, 'initValuation');
         TEST.beginNewPage({
             config: {
                 dfp_site: 'test.5887.home',
                 dfp_zone: 'index',
                 rubicon: {
                     id: 10232,
                     site: 26290,
                     formats: {
                        leaderboard: '728x90'
                     },
                     zones: {
                        leaderboard: 123456
                     }
                 }
             }
         });

         FT.ads.rubicon.init(FT.ads);
         FT.ads.slots.initSlot('mpu');

         ok(initValuation.called, 'ads.rubicon.initValuation called');
         ok(!(FT.ads.rubicon.insights && FT.ads.rubicon.insights['mpu']), 'rubiconInsight.init is not created');
         ok(!(FT.ads.rubicon.insights && FT.ads.rubicon.insights['mpu']), 'rubiconInsight.start is not created');

         initValuation.restore();
      });

   test('test rubicon insight - rubicon mapping for given site and size', function () {
      var initValuation = sinon.spy(FT.ads.rubicon, 'initValuation');
      TEST.beginNewPage({
         container: 'leaderboard',
         config: {
            dfp_site: 'test.5887.home',
            dfp_zone: ' index',
            rubicon: {
               id: 10232,
               site: 26290,
               formats: {
                  leaderboard: '728x90'
               },
               zones: {
                  leaderboard: 123456
               }
            }
         }
      });

      FT.ads.rubicon.init(FT.ads);
      FT.ads.slots.initSlot("leaderboard");

      ok(initValuation.called, 'ads.rubicon.initValuation called');
      ok(window.oz_insight.called, 'rubiconInsight.init is called');
      ok(window.oz_insight.called, 'rubiconInsight.start is called');
      initValuation.restore();
   });

   }
   $(runTests);
}(window, document, jQuery));

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
      });

      // test('init - enable rubicon', function () {
      //    TEST.beginNewPage({config: {rubicon: {id: 10232, site: 26290}}});
      //    FT.ads.rubicon.init(FT.ads);
      //    var decorateInitSlot = sinon.spy(FT.ads.rubicon, 'decorateInitSlot');

      //    ok(TEST.sinon.attach.calledWith('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is attached to the page');
      //    ok(decorateInitSlot.calledOnce, 'initSlot is called');

      //    decorateInitSlot.restore();
      // });

      // test('decorate slots.initSlot', function () {
      //    TEST.beginNewPage({config: {rubicon: {id: 10232, site: 26290}}});

      //    FT.ads.rubicon.decorateInitSlot();

      //    equal(FT.ads.slots.initSlot, FT.ads.rubicon.addToQueue, 'ads.slots.initSlot is decorated by ads.rubicon.initValuation');
      // });

      // test('test rubicon insight - no rubicon mapping for given site and size', function () {
      //    var addToQueue = sinon.spy(FT.ads.rubicon.queue, 'add');
      //    TEST.beginNewPage({
      //        config: {
      //            dfp_site: 'test.5887.home',
      //            dfp_zone: 'index',
      //            rubicon: {
      //                id: 10232,
      //                site: 26290,
      //                formats: {
      //                   leaderboard: '728x90'
      //                },
      //                zones: {
      //                   leaderboard: 123456
      //                }
      //            }
      //        }
      //    });

      //    FT.ads.rubicon.init(FT.ads);
      //    FT.ads.slots.initSlot('mpu');

      //    ok(addToQueue.called, 'ads.rubicon.addToQueue called');
      //    equal(FT.ads.rubicon.queue[0], 'mpu', 'mpu is added to the queue');

      //    FT.ads.rubicon.processQueue(FT.ads.rubicon.initValuation);
      //    ok(!FT.ads.rubicon.queue.length,'the queue has been processed');
      //    ok(!window.oz_insight.called,'no valuation is intialised');

      //    addToQueue.restore();
      // });

      // test('test rubicon insight - rubicon mapping for given site and size', function () {
      //    var addToQueue = sinon.spy(FT.ads.rubicon.queue, 'add');
      //    TEST.beginNewPage({
      //       container: 'leaderboard',
      //       config: {
      //          dfp_site: 'test.5887.home',
      //          dfp_zone: ' index',
      //          rubicon: {
      //             id: 10232,
      //             site: 26290,
      //             formats: {
      //                leaderboard: '728x90'
      //             },
      //             zones: {
      //                leaderboard: 123456
      //             }
      //          }
      //       }
      //    });

      //    FT.ads.rubicon.init(FT.ads);
      //    FT.ads.slots.initSlot('leaderboard');

      //    ok(addToQueue.called, 'ads.rubicon.addToQueue called');
      //    equal(FT.ads.rubicon.queue[0], 'leaderboard', 'leaderboard is added to the queue');

      //    FT.ads.rubicon.processQueue(FT.ads.rubicon.initValuation);
      //    ok(!FT.ads.rubicon.queue.length,'the queue has been processed');
      //    ok(window.oz_insight.called,'a valuation is intialised');

      //    addToQueue.restore();
      // });

   }
   $(runTests);
}(window, document, jQuery));

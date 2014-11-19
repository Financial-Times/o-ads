/* jshint strict: false */
/* globals  FT, deepEqual: false, equal: false, expect: false, module: false, notDeepEqual: false, notEqual: false, notStrictEqual : false, ok: false, QUnit: false, raises: false, start: false, stop: false, strictEqual: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn off use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, document, $, undefined) {
   function runTests() {
      QUnit.module('Rubicon');
   }

   test('init - disable rubicon', function () {
      TEST.beginNewPage({config: {rubicon: false}});
      FT.ads.rubicon.init(FT.ads);

      ok(!TEST.sinon.attach.calledWith('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is attached to the page');
   })

   test('init - enable rubicon', function () {
      var decorateInitSlot = sinon.spy(FT.ads.rubicon, 'decorateInitSlot');
      TEST.beginNewPage({config: {rubicon: {id: 10232, site: 26290}}});
      FT.ads.rubicon.init(FT.ads);

      ok(TEST.sinon.attach.calledWith('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is attached to the page');
      ok(decorateInitSlot.calledOnce, 'initSlot is decorated');
   });

   test('decorate slots.initSlot', function () {
      FT.ads.rubicon.decorateInitSlot();

      equal(FT.ads.slots.initSlot, FT.ads.rubicon.initValuation, 'ads.slots.initSlot is decorated by ads.rubicon.initValuation');
   });

   $(runTests);
}(window, document, jQuery));
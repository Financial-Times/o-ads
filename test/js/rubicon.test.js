/* jshint strict: false */
/* globals  FT, deepEqual: false, equal: false, expect: false, module: false, notDeepEqual: false, notEqual: false, notStrictEqual : false, ok: false, QUnit: false, raises: false, start: false, stop: false, strictEqual: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn off use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, document, $, undefined) {
   function runTests() {
      test('init - enabling rubicon attaches the RTP library', function () {
         TEST.beginNewPage({config: {rubicon: {id: 10232, site: 26290}}});
         FT.ads.rubicon.init(FT.ads);
         ok(TEST.sinon.attach.calledWith('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is attached to the page');
      });

      test('rubicon configured to make request but not add targeting', function () {
         TEST.beginNewPage({
            network: 1234,
            dfp_site: 'rubicon',
            dfp_zone: 'rubicon',
            container: 'rubicon-no-target',
            config: {
               formats: {
                  'rubicon-no-target': {
                     sizes: [[728,90]]
                  }
               },
               rubicon: {
                  id: 10232,
                  site: 26290,
                  zone: 1111,
                  formats: {
                     'rubicon-no-target': '728x90'
                  }
               }
            }
         });`
      });

      test('rubicon configured to make request and add targeting', function () {
         TEST.beginNewPage({
            network: 1234,
            dfp_site: 'rubicon',
            dfp_zone: 'rubicon',
            container: 'rubicon-target',
            config: {
               formats: {
                  'rubicon-no-target': {
                     sizes: [[728,90]]
                  }
               },
               rubicon: {
                  id: 10232,
                  site: 26290,
                  zone: 1111,
                  formats: {
                     'rubicon-target': '728x90'
                  }
               }
            }
         });
      });

      test('rubicon a slot not configured to make request is not queued', function () {
         TEST.beginNewPage({
            network: 1234,
            dfp_site: 'rubicon',
            dfp_zone: 'rubicon',
            container: 'rubicon-no-config',
            config: {
               formats: {
                  'rubicon-no-config': {
                     sizes: [[728,90]]
                  }
               },
               rubicon: {
                  id: 10232,
                  site: 26290,
                  zone: 1111,
               }
            }
         });
      });
   }
   $(runTests);
}(window, document, jQuery));

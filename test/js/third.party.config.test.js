(function (window, document, $, undefined) {
    function runTests() {
        module('Third party config', {
            setup: function () {
                FT.ads.config('clear');
                window.iframe = $('<iframe>').appendTo('body');
            },
            teardown: function () {
                window.iframe.remove();
            }
        });

        test('Config get/set', function () {
            var result, obj,
                key = 'key',
                invalid = 'invalid',
                value = 'value',
                value2 = 'value2';

            expect(7);

            strictEqual(typeof FT.ads.config, 'function', 'The set method exists');

            result = FT.ads.config(key, value);
            deepEqual(result, value, 'passing a key+value returns the value.');

            result = FT.ads.config();
            obj = {};
            obj[key] = value;
            deepEqual(result, obj, 'calling without params returns all config.');

            result = FT.ads.config(key);
            deepEqual(result, value, 'passing a valid key returns the value.');

            result = FT.ads.config(invalid);
            deepEqual(result, undefined, 'passing an invalid key returns undefined.');

            result = FT.ads.config(key, value2);
            deepEqual(result, value2, 'set an existing key returns the new value.');

            result = FT.ads.config(key);
            deepEqual(result, value2, 'get returns the new value.');
      });

    test('Config fetchMetaConfig', function () {
        QUnit.stop();
        iframe.load(function () {

                // Use the iframe context for our assertions
                 expect(1);
                var win = this.contentWindow;
                var FT = win.FT;
                var result = FT.ads.config();
                var expected = {
                    'network': '5887',
                    'collapseEmpty': true,
                    'formats':  {
                        banlb: [[728,90], [468,60], [970,90]],
                        mpu: [[300,250],[336,280]],
                        mpu2: [[300,250],[336,280]],
                        doublet: [[342,200]],
                        hlfmpu: [[300,600],[336,850],[300,250],[336,280]],
                        intro: [[1,1]],
                        newssubs: [[239,90]],
                        refresh: [[1,1]],
                        searchbox: [[200,28]],
                        tlbxrib: [[336,60]]
                    },
                    'audSciLimit' : 2,
                    'metaParam1': 'metaValue1',
                    'ftads:mode': 'gpt'
                };
            deepEqual(result, expected, 'return an object of meta values.');
            QUnit.start();
          });
          iframe.attr('src', '../iframes/third.party.switcher.meta.html');
         });
    }

    $(runTests);
}(window, document, jQuery));
/*
        test('Config fetchGlobalConfig', function () {

           expect(1);

            FT.env = {
                envParam1: 'envValue1',
                envParam2: 'envValue2'
            };

            var result = FT.ads.config.fetchGlobalConfig(),
                expected = {
                    envParam1: 'envValue1',
                    envParam2: 'envValue2'
                };

            deepEqual(result, expected, 'return an object of global values.');
        });

        test('Config init', function () {
            // remove defaults
            var oldDefaults = FT.ads.config.defaults;
            FT.ads.config.defaults = {};

            FT.env = {
                envParam1: 'envValue1',
                envParam2: 'envValue2',
                overlapParam: 'envValue3'
            };

            var meta1 = $('<meta name="metaParam1" content="metaValue1">').appendTo('head'),
                meta2 = $('<meta name="metaParam2" content="metaValue2">').appendTo('head'),
                meta3 = $('<meta name="overlapParam" content="metaValue3">').appendTo('head'),
                result = FT.ads.config.init(),
                expected = {
                    metaParam1: 'metaValue1',
                    metaParam2: 'metaValue2',
                    envParam1: 'envValue1',
                    envParam2: 'envValue2',
                    overlapParam: 'envValue3'
                };

            expect(5);

            deepEqual(FT.ads.config.store, expected, 'the store is now populated with meta and global values');
            deepEqual(FT.ads.config.get(), expected, 'get a returns all expected values');
            deepEqual(FT.ads.config.get('metaParam1'), 'metaValue1', 'get a meta value');
            deepEqual(FT.ads.config.get('envParam1'), 'envValue1', 'get a global value');
            deepEqual(FT.ads.config.get('overlapParam'), 'envValue3', 'global values override meta values');

            meta1.remove();
            meta2.remove();
            meta3.remove();
            FT.ads.config.defaults = oldDefaults;
    }
*/


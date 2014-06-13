(function (window, document, $, undefined) {
    function runTests() {
        module('Third party config', {
            setup: function () {
                //FT.ads.config.clear();
            },
            teardown: function () {
                //window.iframe.remove();
                //FT._ads.utils.cookie('ftads:mode_t', null, { expires: -1 });
                //FT._ads.utils.cookie('cookieconf1', null, { expires: -1 })
            }
        });

        test('Config get/set', function () {
            FT.ads.config.clear();
            var result, obj,
                key = 'key',
                invalid = 'invalid',
                value = 'value',
                value2 = 'value2';

            expect(9);

            ok(FT._ads.utils.isFunction(FT.ads.config), 'The set method exists');

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

            FT.ads.config.clear();
            obj = {
                'some': 'config',
                'parameters': 'to',
                'be': 'added'
            };
            result = FT.ads.config(obj);
            deepEqual(result, obj, 'set multiple key/values using an object.');

            result = FT.ads.config();
            deepEqual(result, obj, 'get returns the new values.');
        });

        test('Config fetchMetaConfig', function () {
            TEST.beginNewPage({
                meta: {
                    metaconf1: 'I\'m so meta, even this acronym.'
                }
            });
            var result = FT.ads.config();

            ok(result.hasOwnProperty('metaconf1'), 'Meta value has been added to config');
            equal(FT.ads.config('metaconf1'), 'I\'m so meta, even this acronym.', 'Config returns the correct value');
        });

        // test('Config fetchCookieConfig', function () {

        // });

        test('Config fetchGlobalConfig', function () {
            TEST.beginNewPage({global: {globablconf1: 'Mondo Value!!'}});
            var result =  FT.ads.config();
            ok(result.hasOwnProperty('globablconf1'), 'Global (env) values have been added to config');
            equal(FT.ads.config('globablconf1'), 'Mondo Value!!', 'Config returns the correct value');
        });

        test('Config defaults', function () {
            TEST.beginNewPage();
            var result =  FT.ads.config();
            ok(result.hasOwnProperty('network'), 'default properties have been added to config');
            equal(FT.ads.config('network'), '5887', 'Config returns the correct value');
        });

        test('Config cookie over-ride for Test User mode', function () {
            TEST.beginNewPage({cookies: {'ftads:mode_t': 'testuser', network: 'over-ride'}});
            equal(FT.ads.config('network'), 'over-ride', 'the global config network property should be over-ridden by the network value set in the cookie, as we have set the test mode cookie ');
        });

        test('Config over-ride for dfp_site', function () {
            TEST.beginNewPage({global: {'dfp_site': 'ftcom.5887.home'}, cookies: {'ftads:dfpsite': 'test'}});
            equal(FT.ads.config('dfp_site'), 'ftcom.5887.home', 'without test mode site is unaffected');

            TEST.beginNewPage({global: {'dfp_site': 'ftcom.5887.home'}, cookies: {'ftads:mode_t': 'testuser'}});
            equal(FT.ads.config('dfp_site'), 'ftcom.5887.home', 'without dfpsite config is unaffected');

            TEST.beginNewPage({global: {'dfp_site': 'ftcom.5887.home'}, cookies: {'ftads:mode_t': 'testuser', 'ftads:dfpsite': 'test'}});
            equal(FT.ads.config('dfp_site'), 'test.5887.home', 'with test mode and dfpsite set to test, production config is updated to show test ads');

            TEST.beginNewPage({global: {'dfp_site': 'test.5887.home'}, cookies: {'ftads:mode_t': 'testuser', 'ftads:dfpsite': 'ftcom'}});
            equal(FT.ads.config('dfp_site'), 'ftcom.5887.home', 'with test mode and dfpsite set to ftcom, test config is updated to show live ads');

            TEST.beginNewPage({global: {'dfp_site': 'test.5887.home'}, cookies: {'ftads:mode_t': 'testuser', 'ftads:dfpsite': 'test'}});
            equal(FT.ads.config('dfp_site'), 'test.5887.home', 'with test mode and dfpsite set to test, test config is updated to show test ads');

            TEST.beginNewPage({global: {'dfp_site': 'ftcom.5887.home'}, cookies: {'ftads:mode_t': 'testuser', 'ftads:dfpsite': 'ftcom'}});
            equal(FT.ads.config('dfp_site'), 'ftcom.5887.home', 'with test mode and dfpsite set to ftcom, production config is updated to show live ads');

            TEST.beginNewPage({global: {'dfp_site': 'ftcom.5887.home'}, cookies: {'ftads:mode_t': 'testuser', 'ftads:dfpsite': 'milkshake'}});
            equal(FT.ads.config('dfp_site'), 'ftcom.5887.home', 'invalid cookie value does not affect the dfp_site value');
        });

    }

    $(runTests);
}(window, document, jQuery));

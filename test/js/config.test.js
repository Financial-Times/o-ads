/* jshint strict: false */
/* globals jQuery: false, FT, deepEqual: false, equal: false, expect: false, ok: false, QUnit: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn of use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, document, $, undefined) {
	function runTests() {
		QUnit.module('Third party config', {
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
					metaconf1: 'I&#39;m so meta, even this acronym.'
				}
			});
			var result = FT.ads.config();

			ok(result.hasOwnProperty('metaconf1'), 'Meta value has been added to config');
			equal(FT.ads.config('metaconf1'), 'I\'m so meta, even this acronym.', 'Config returns the correct value');
		});

		test('Config fetchMetaConfigJSON', function () {
			if (window.JSON) {
				TEST.beginNewPage({
					meta: {
						metaconfjson1: {
							content: '{"testing":"blah"}',
							other: 'data-contenttype="json"'
						}
					}
				});
				var result = FT.ads.config();

				ok(result.hasOwnProperty('metaconfjson1'), 'Meta value has been added to config');
				equal(FT.ads.config('metaconfjson1').testing, 'blah', 'Config returns the correct value');
			}
			else {ok(true, "JSON is not defined");}
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

	}

	$(runTests);
}(window, document, jQuery));

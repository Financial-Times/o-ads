/* jshint strict: false */
/* globals jQuery: false, sinon: false, FT, deepEqual: false, equal: false, ok: false, QUnit: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn off use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, document, $, undefined) {
	function runTests() {
		QUnit.module('Adamantx');

		test('decorate InitSlot', function () {
			var initSlot = FT.ads.slots.initSlot;
			FT.ads.admantx.decorateInitSlot();
			equal(FT.ads.slots.initSlot, FT.ads.admantx.initSlotDecorator, 'InitSlot is decorated with the correct method');

			//  undecorate initslot for other tests
			FT.ads.slots.initSlot = initSlot;
		});

		test('process categories', function () {
			var given = [
				{ "name": "US", "origin": "NORMAL", "score": 12, "type": "MAINLEMMAS" },
				{ "name": "Boris Johnson", "origin": "NORMAL", "score": 10, "type": "PEOPLE" },
				{ "name": "London", "origin": "NORMAL", "score": 8, "type": "PLACES" },
				{ "name": "United States of America", "origin": "NORMAL", "score": 7, "type": "PLACES" },
				{ "name": "tax bill", "origin": "NORMAL", "score": 6,  "type": "MAINLEMMAS"}
			];
			var returns = ["US", "Boris Johnson", "London", "United States of America", "tax bill"];
			deepEqual(FT.ads.admantx.processCollection(given), returns, 'Given a set from Adamantx and no max argument returns all name nodes');
			deepEqual(FT.ads.admantx.processCollection(given, true), returns, 'Given a set from Adamantx and a boolean max argument returns all name nodes');

			returns = ["US", "Boris Johnson", "London"];
			deepEqual(FT.ads.admantx.processCollection(given, 3), returns, 'Given a set from Adamantx and a numerical max argument returns the correct number of name nodes');
		});

		test('resolve', function () {
			var given = JSON.stringify(TEST.mock.admantx);
			TEST.beginNewPage({
				config: {
					admantx: {
						id: 'someAdmantxID',
						collections: {
							admants: true
						}
					}
				}
			});

			FT.ads.admantx.init(FT.ads);
			var targetingAdd = sinon.spy(FT.ads.targeting.add);
			var queueProcess = sinon.stub(FT.ads.admantx.queue, 'process');

			FT.ads.admantx.resolve(given);
			ok(targetingAdd.withArgs({ ad: ["Professional Education", "car_lifestyle", "joy_saving", "mercedes_fashion", "safe_choices", "share_promise"]}), 'all admants are added to targeting with ad as the key');
			ok(queueProcess.calledOnce, 'the queue of slots is process');

			TEST.beginNewPage({
				config: {
					admantx: {
						id: 'someAdmantxID',
						collections: {
							admants: 3
						}
					}
				}
			});
			FT.ads.admantx.init(FT.ads);
			FT.ads.admantx.resolve(given);
			ok(targetingAdd.withArgs({ ad: ["Professional Education", "car_lifestyle", "joy_saving"]}), '3 admants are added to targeting with ad as the key');
			ok(queueProcess.calledOnce, 'the queue of slots is process');
		});
	}
	$(runTests);
}(window, document, jQuery));

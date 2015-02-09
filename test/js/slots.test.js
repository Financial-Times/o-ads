/* jshint strict: false */
/* globals jQuery: false, sinon: false, FT, deepEqual: false, expect: false, ok: false, QUnit: false, test: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn of use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, doc, $, undefined) {
	var testingContainer = window.testingContainer;

	function runTests() {
		sinon.spies = {
			fetchSlotConfig: sinon.spy(FT.ads.slots, 'fetchSlotConfig')
		};

		QUnit.module('Third party slots',  {
			setup: function () {
				window.testingContainer = $('<div id="slot-tests">').appendTo(document.body);
				// reset all spies between tests
				// this fails if you do it in teardown for some reason.
				for (var spy in sinon.spies) {
					if (sinon.spies.hasOwnProperty(spy)) {
						sinon.spies[spy].reset();
					}
				}
			},
			teardown: function () {
				window.testingContainer.remove();
			}
		});

		test('fetchSlotConfig sizes', function () {
			expect(8);

			var container = $('<script data-o-ads-size="1x1">FT.env.advert(\'refresh\')</script>')[0],
				result = FT.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]}),
				expected = [[1, 1]];
			deepEqual(result.sizes, expected, 'data-o-ads-size attribute on a script tag');

			container = $('<div data-o-ads-size="1x1"></div>')[0];
			result = FT.ads.slots.fetchSlotConfig(container,'', {sizes: [[5,5]]});
			expected = [[1, 1]];
			deepEqual(result.sizes, expected, 'data-o-ads-size attribute on a div tag');

			container = $('<div data-ad-size="1x1"></div>')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]});
			expected = [[1, 1]];
			deepEqual(result.sizes, expected, 'data-ad-size attribute on a div tag');

			container = $('<div data-o-ads-size="600x300,300x600,720x30">')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]});
			expected = [[600, 300], [300, 600], [720, 30]];
			deepEqual(result.sizes, expected, 'Multiple sizes are parsed');

			container = $('<div data-o-ads-size="600x300,invalidxsize,100x200,720x30">')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', '', {sizes: [[5,5]]});
			expected = [[600, 300], [100, 200], [720, 30]];
			deepEqual(result.sizes, expected, 'Invalid size is ignored');

			container = $('<div data-o-ads-size="">')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]});
			expected = [[5, 5]];
			deepEqual(result.sizes, expected, 'Empty string returns size from passed config');

			container = $('<div>')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]});
			expected = [[5, 5]];
			deepEqual(result.sizes, expected, 'No attribute returns size from passed config');

			container = $('<div data-o-ads-size="invalidxsize">')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]});
			expected = [[5, 5]];
			deepEqual(result.sizes, expected, 'Single invalid size returns size passed from config');
		});

		test('Add container', function () {
			expect(3);
			FT.ads.slots.addContainer(testingContainer[0], 'container');
			ok($('#container').size(), 'the container is appended to the div');
			var scriptTag = document.createElement('script');
			scriptTag.id = 'slot';
			scriptTag.className = 'slot';
			testingContainer[0].appendChild(scriptTag);
			FT.ads.slots.addContainer(scriptTag, 'script');
			ok($('div#script').size(), 'the container exists and the id has been moved');
			ok($('div#script').next().hasClass('slot'), 'the container is inserted before the script tag');
		});

		test('Center container', function () {
			expect(1);
			FT.ads.slots.centerContainer(testingContainer[0], [[1,4], [2,5], [3,6]]);
			ok(testingContainer.hasClass('center'), 'the centering class has been added');
		});

		test('fetchSlotConfig out of page', function () {
			expect(3);

			var container = $('<div data-o-ads-out-of-page></div>')[0];
			var result = FT.ads.slots.fetchSlotConfig(container, '', {});
			ok(result.outOfPage, 'data-o-ads-out-of-page attribute is present returns true');

			container = $('<div>')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {outOfPage: true});
			ok(result.outOfPage, 'No attribute returns value from passed config');


			container = $('<div>')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {});
			ok(!result.outOfPage, 'No attribute and no config returns false');
		});

		test('fetchSlotConfig targeting', function () {
			expect(4);

			var container = $('<div data-o-ads-targeting="some=test;targeting=params;"></div>')[0];
			var result = FT.ads.slots.fetchSlotConfig(container, '', {});
			var expected = { pos: "", some: 'test', targeting: 'params'};

			deepEqual(result.targeting, expected, 'data-o-ads-targeting attribute is parsed');

			container = $('<div data-o-ads-targeting="some=test; ;targeting=params;"></div>')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {});
			expected = { pos: "", some: 'test', targeting: 'params'};

			deepEqual(result.targeting, expected, 'data-o-ads-targeting malformed string is ok');

			container = $('<div data-o-ads-position="banlb"></div>')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {});
			expected = { pos: 'banlb'};

			deepEqual(result.targeting, expected, 'position is parsed to pos');

			container = $('<div data-ad-whatever="happened" data-></div>')[0];
			result = FT.ads.slots.fetchSlotConfig(container, '', {});
			expected = { pos: "", whatever: 'happened'};

			deepEqual(result.targeting, expected, 'other attributes are set as is');
		});
	}

	$(runTests);
}(window, document, jQuery));




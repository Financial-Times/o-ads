/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Slots');
QUnit.test('create a basic slot with js configuration', function (assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="banlb"></div>');

	var expected = {
		outOfPage: true,
		sizes: [[2,2]]
	};

	this.ads.init({'slots': { banlb: expected }});
	this.ads.slots.initSlot(this.fixturesContainer.lastChild);
	var result = this.ads.slots.banlb;
	var container = result.container;
	var outer = container.querySelector('.outer');
	var inner = outer.querySelector('.inner');
	assert.strictEqual(result.name, 'banlb', 'the slot name is available');
	assert.ok(result, 'the slot object is available');
	assert.equal(result.sizes, expected.sizes, 'the correct sizes are configured');
	assert.equal(result.outOfPage, expected.outOfPage, 'the correct outOfPage is configured');
	assert.ok(outer, 'the outer div is rendered');
	assert.ok(inner, 'the inner div is rendered');
});

QUnit.test('create a slot with sizes via sizes attribute', function (assert) {
	var expected = [[600, 300], [300, 600], [720, 30]];
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="banlb2" data-o-ads-sizes="600x300,300x600,720x30" class="o-ads o-ads-slot"></div>');
	this.ads.init();
	this.ads.slots.initSlot(this.fixturesContainer.lastChild);
	var result = this.ads.slots.banlb2;
	assert.deepEqual(result.sizes, expected, 'Multiple sizes are parsed and added correctly');
});

QUnit.test('create a slot with an invalid size among multiple sizes', function (assert) {
	var expected = [[600, 300], [100, 200], [720, 30]];
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="banlb" data-o-ads-sizes="600x300,invalidxsize,100x200,720x30" class="o-ads o-ads-slot"></div>');
	this.ads.init();
	this.ads.slots.initSlot(this.fixturesContainer.lastChild);
	var result = this.ads.slots.banlb;
	assert.deepEqual(result.sizes, expected, 'Invalid size is ignored');
});

QUnit.test('create a slot with responsive sizes via sizes attributes', function (assert) {
	var slotHTML = '<div data-o-ads-name="mpu" data-o-ads-sizes-large="300x600,300x1050"  data-o-ads-sizes-medium="300x400, 300x600"  data-o-ads-sizes-small="false"></div>';
	var expected = { "small":false, "medium":[[300, 400], [300, 600]], "large":[[300,600],[300, 1050]]};
	this.fixturesContainer.insertAdjacentHTML('beforeend', slotHTML);
	this.ads.init();
	this.ads.slots.initSlot(this.fixturesContainer.lastChild);
	var result = this.ads.slots.mpu;
	assert.deepEqual(result.sizes, expected, 'sizes are parsed into slot config.');
});

QUnit.test('create a slot with sizes via format attribute', function (assert) {
	var expected = [[300,250]];
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init();
	this.ads.slots.initSlot(this.fixturesContainer.lastChild);
	var result = this.ads.slots.mpu;
	assert.deepEqual(result.sizes, expected, 'Formats names are parsed and the matching sizes are pulled from config.');
});

QUnit.test('create a slot with responsive sizes via formats attributes', function (assert) {
	var slotHTML = '<div data-o-ads-name="mpu" data-o-ads-formats-large="Leaderboard"  data-o-ads-formats-medium="MediumRectangle"  data-o-ads-formats-small="false"></div>';
	var expected = { "small":false, "medium":[[300,250]], "large":[[728,90]]};
	this.fixturesContainer.insertAdjacentHTML('beforeend', slotHTML);
	this.ads.init();
	this.ads.slots.initSlot(this.fixturesContainer.lastChild);
	var result = this.ads.slots.mpu;
	assert.deepEqual(result.sizes, expected, 'Formats names are parsed and the matching sizes are pulled from config.');
});

// QUnit.test('Center container', function (assert) {
// 	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div id="center-test"></div>');
// 	this.ads.slots.init(this.ads);
// 	var div = document.getElementById('center-test');
// 	this.ads.slots.centerContainer(div, [[1,4], [2,5], [3,6]]);
// 	assert.ok($(div).hasClass('center'), 'the centering class has been added');
// });

// QUnit.test('fetchSlotConfig out of page', function (assert) {
// 	var container = $('<div data-o-ads-out-of-page></div>')[0];
// 	var result = this.ads.slots.fetchSlotConfig(container, '', {});
// 	assert.ok(result.outOfPage, 'data-o-ads-out-of-page attribute is present returns true');

// 	container = $('<div>')[0];
// 	result = this.ads.slots.fetchSlotConfig(container, '', {outOfPage: true});
// 	assert.ok(result.outOfPage, 'No attribute returns value from passed config');


// 	container = $('<div>')[0];
// 	result = this.ads.slots.fetchSlotConfig(container, '', {});
// 	assert.ok(!result.outOfPage, 'No attribute and no config returns false');
// });

// QUnit.test('fetchSlotConfig targeting', function (assert) {

// 	var container = $('<div data-o-ads-targeting="some=test;targeting=params;"></div>')[0];
// 	var result = this.ads.slots.fetchSlotConfig(container, '', {});
// 	var expected = { pos: "", some: 'test', targeting: 'params'};

// 	assert.deepEqual(result.targeting, expected, 'data-o-ads-targeting attribute is parsed');

// 	container = $('<div data-o-ads-targeting="some=test; ;targeting=params;"></div>')[0];
// 	result = this.ads.slots.fetchSlotConfig(container, '', {});
// 	expected = { pos: "", some: 'test', targeting: 'params'};

// 	assert.deepEqual(result.targeting, expected, 'data-o-ads-targeting malformed string is ok');

// 	container = $('<div data-o-ads-position="banlb"></div>')[0];
// 	result = this.ads.slots.fetchSlotConfig(container, '', {});
// 	expected = { pos: 'banlb'};

// 	assert.deepEqual(result.targeting, expected, 'position is parsed to pos');

// 	container = $('<div data-ad-whatever="happened" data-></div>')[0];
// 	result = this.ads.slots.fetchSlotConfig(container, '', {});
// 	expected = { pos: "", whatever: 'happened'};

// 	assert.deepEqual(result.targeting, expected, 'other attributes are set as is');
// });

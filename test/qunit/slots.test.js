/* jshint globalstrict: true, browser: true */
/* globals QUnit: false, $: false */
"use strict";

QUnit.module('Slots');
QUnit.test('create a basic slot with js configuration', function (assert) {
	var node = this.fixturesContainer.add('<div data-o-ads-name="banlb"></div>');

	var expected = {
		outOfPage: true,
		sizes: [[2,2]]
	};

	this.ads.init({'slots': { banlb: expected }});
	this.ads.slots.initSlot(node);
	var result = this.ads.slots.banlb;
	var container = result.container;
	var outer = container.querySelector('.o-ads__outer');
	var inner = outer.querySelector('.o-ads__inner');
	assert.strictEqual(result.name, 'banlb', 'the slot name is available');
	assert.ok(result, 'the slot object is available');
	assert.equal(result.sizes, expected.sizes, 'the correct sizes are configured');
	assert.equal(result.outOfPage, expected.outOfPage, 'the correct outOfPage is configured');
	assert.ok(outer, 'the outer div is rendered');
	assert.ok(inner, 'the inner div is rendered');
});

QUnit.test('create a slot with sizes via sizes attribute', function (assert) {
	var expected = [[600, 300], [300, 600], [720, 30]];
	var node = this.fixturesContainer.add('<div data-o-ads-name="banlb2" data-o-ads-sizes="600x300,300x600,720x30" class="o-ads o-ads-slot"></div>');
	this.ads.init();
	this.ads.slots.initSlot(node );
	var result = this.ads.slots.banlb2;
	assert.deepEqual(result.sizes, expected, 'Multiple sizes are parsed and added correctly');
});

QUnit.test('create a slot with an invalid size among multiple sizes', function (assert) {
	var expected = [[600, 300], [100, 200], [720, 30]];
	var node = this.fixturesContainer.add('<div data-o-ads-name="banlb" data-o-ads-sizes="600x300,invalidxsize,100x200,720x30" class="o-ads o-ads-slot"></div>');
	this.ads.init();
	this.ads.slots.initSlot(node);
	var result = this.ads.slots.banlb;
	assert.deepEqual(result.sizes, expected, 'Invalid size is ignored');
});

QUnit.test('create a slot with responsive sizes via sizes attributes', function (assert) {
	var slotHTML = '<div data-o-ads-name="mpu" data-o-ads-sizes-large="300x600,300x1050"  data-o-ads-sizes-medium="300x400, 300x600"  data-o-ads-sizes-small="false"></div>';
	var expected = { "small":false, "medium":[[300, 400], [300, 600]], "large":[[300,600],[300, 1050]]};
	var node = this.fixturesContainer.add(slotHTML);
	this.ads.init();
	this.ads.slots.initSlot(node);
	var result = this.ads.slots.mpu;
	assert.deepEqual(result.sizes, expected, 'sizes are parsed into slot config.');
});

QUnit.test('create a slot with sizes via format attribute', function (assert) {
	var expected = [[300,250]];
	var node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init();
	this.ads.slots.initSlot(node);
	var result = this.ads.slots.mpu;
	assert.deepEqual(result.sizes, expected, 'Formats names are parsed and the matching sizes are pulled from config.');
});

QUnit.test('create a slot with responsive sizes via formats attributes', function (assert) {
	var slotHTML = '<div data-o-ads-name="mpu" data-o-ads-formats-large="Leaderboard"  data-o-ads-formats-medium="MediumRectangle"  data-o-ads-formats-small="false"></div>';
	var expected = { "small":false, "medium":[[300,250]], "large":[[728,90]]};
	var node = this.fixturesContainer.add(slotHTML);
	this.ads.init();
	this.ads.slots.initSlot(node);
	var result = this.ads.slots.mpu;
	assert.deepEqual(result.sizes, expected, 'Formats names are parsed and the matching sizes are pulled from config.');
});

QUnit.test('Center container', function (assert) {
	var slotHTML = '<div data-o-ads-name="center-test" data-o-ads-formats="MediumRectangle"></div>';
	var node = this.fixturesContainer.add(slotHTML);
	this.ads.init({slots: {
		'center-test': {
			center: true
		}
	}});
	var result = this.ads.slots.initSlot(node);

	assert.ok($(result.container).hasClass('o-ads__center'), 'the centering class has been added');
});

QUnit.test('configure out of page slot', function (assert) {
	var slotHTML = '<div data-o-ads-name="out-of-page-test" data-o-ads-formats="MediumRectangle"></div>';
	var node = this.fixturesContainer.add(slotHTML);
	this.ads.init({
		slots: {
		'out-of-page-test': {
			outOfPage: true
		}
	}});
	var result = this.ads.slots.initSlot(node);
	assert.ok(result.outOfPage, 'data-o-ads-out-of-page attribute is present returns true');

	this.ads.init({
		slots: {
			'out-of-page-test': {
				outOfPage: true
			}
	}});
  result = this.ads.slots.initSlot(node);
	assert.ok(result.outOfPage, 'No attribute returns value from passed config');

	this.ads.init({});
	result = this.ads.slots.initSlot(node);
	assert.ok(!result.outOfPage, 'No attribute and no config returns false');
});

QUnit.test('configure slot level targeting', function (assert) {
	var targeting = 'some=test;targeting=params;';
	var node = this.fixturesContainer.add('<div data-o-ads-targeting="' + targeting + '" data-o-ads-name="targeting-test" data-o-ads-formats="MediumRectangle"></div>');

	var result = this.ads.slots.initSlot(node);
	var expected = { some: 'test', targeting: 'params'};

	assert.deepEqual(result.targeting, expected, 'data-o-ads-targeting attribute is parsed');

	targeting = 'some=test; ;targeting=params;';
	node = this.fixturesContainer.add('<div data-o-ads-targeting="' + targeting + '" data-o-ads-name="malformed-test" data-o-ads-formats="MediumRectangle"></div>');
	result = this.ads.slots.initSlot(node);
	expected = { some: 'test', targeting: 'params'};

	assert.deepEqual(result.targeting, expected, 'data-o-ads-targeting malformed string is ok');

});

QUnit.test('configure refresh globally on a timer', function (assert) {
	var done = assert.async();
	var clock = this.date();
	var slotHTML = '<div data-o-ads-name="refresh-test" data-o-ads-formats="MediumRectangle"></div>';
	var node = this.fixturesContainer.add(slotHTML);

	document.body.addEventListener('oAds.refresh', function (event){
		assert.equal(event.detail.name, 'refresh-test', 'our test slot is refreshed');
		done();
	});

	this.ads.init({ refresh: { time: 1 }});
	this.ads.slots.initSlot(node);
	clock.tick(1025);
});

QUnit.test('lazy loading', function (assert) {
	var done = assert.async();
	var done2 = assert.async();
	var slotHTML = '<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle"></div>';
	var node = this.fixturesContainer.add(slotHTML);
	document.body.addEventListener('oAds.inview', function (event){
		assert.equal(event.detail.name, 'lazy-test', 'our test slot is inview');
		done();
	});

	document.body.addEventListener('oAds.render', function (event){
		assert.equal(event.detail.name, 'lazy-test', 'our test slot fired the render event');
		done2();
	});

	this.ads.init();
	this.ads.slots.initSlot(node);
});

QUnit.test('complete events fire', function (assert) {
	var done = assert.async();
	var done2 = assert.async();

	var clock = this.date();
	var slotHTML = '<div data-o-ads-name="first" data-o-ads-formats="MediumRectangle"></div>';
	var first = this.fixturesContainer.add(slotHTML);
	slotHTML = '<div data-o-ads-name="second" data-o-ads-formats="MediumRectangle"></div>';
	var second = this.fixturesContainer.add(slotHTML);

	document.body.addEventListener('oAds.complete', function (event){
		assert.ok(event.detail.name, event.detail.name + ' completed.');
		if(event.detail.name === 'first') {
			done();
		} else {
			done2();
		}
	});

	this.ads.init({ refresh: { time: 1 }});
	this.ads.slots.initSlot(first);
	this.ads.slots.initSlot(second);

	clock.tick(1025);
});

/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Slots');
QUnit.test('create a basic slot with imperative configuration', function (assert) {
	var done = assert.async();
	var expected = {
		outOfPage: true,
		sizes: [[2,2]]
	};
	this.ads.init({'slots': { banlb: expected }});
	this.ads.test= 1;

	document.body.addEventListener('oAds.ready', function (event){
		assert.strictEqual(event.detail.name, 'banlb', 'the slot name is available');
		assert.ok(event.detail.slot, 'the slot object is available');
		assert.equal(event.detail.slot.sizes, expected.sizes, 'the correct sizes are configured');
		assert.equal(event.detail.slot.outOfPage, expected.outOfPage, 'the correct outOfPage is configured');
		done();
	}.bind(this));

	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="banlb"></div>');
	this.ads.slots.initSlot(this.fixturesContainer.lastChild);
});



QUnit.test('create a slot set size', function (assert) {
	var done = assert.async();
	var expected = [[1,1]];
	document.body.addEventListener('oAds.ready', function (event){
		var result = event.detail.slot;
		assert.deepEqual(result.sizes, expected, 'data-o-ads-size attribute');
		done();
	}.bind(this));
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="test" data-o-ads-sizes="1x1"></div>');
	this.ads.init();
	this.ads.slots.initSlot(this.fixturesContainer.lastChild);
});

//QUnit.test('create a basic slot  sizes', function (assert) {
	//console.log(this.ads);
	//var done = assert.async();
	//this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="banlb" data-o-ads-size="1x1"></div>');
	//this.ads.init();
	//this.ads.slots.initSlot(this.fixturesContainer.lastChild);
	//var result= this.ads.slots.banlb;
	//var expected = [[1,1]];
	//assert.deepEqual(result.sizes, expected, 'data-o-ads-size attribute');
//});


QUnit.test('create a slot with Mult---iple sizes', function (assert) {
	//console.log(this.ads.test);
	var done = assert.async();
	var expected = [[600, 300], [300, 600], [720, 30]];
	document.body.addEventListener('oAds.ready', function (event){
	//	console.log(event.detail);
		var result= event.detail.slot;
		console.log('name:' + event.detail.slot.name);
		console.log('sizes: ' + event.detail.slot.sizes);
		assert.deepEqual(result.sizes, expected, 'data-o-ads-size attribute');
		done();
	}.bind(this));
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="banlb2" data-o-ads-sizes="600x300,300x600,720x30" class="o-ads o-ads-slot"></div>');
	this.ads.init();
	this.ads.slots.initSlot(this.fixturesContainer.lastChild);
});

// 	container = $('<div data-o-ads-size="600x300,300x600,720x30">')[0];
// 	result = this.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]});
// 	expected = [[600, 300], [300, 600], [720, 30]];
// 	assert.deepEqual(result.sizes, expected, 'Multiple sizes are parsed');

// 	container = $('<div data-o-ads-size="600x300,invalidxsize,100x200,720x30">')[0];
// 	result = this.ads.slots.fetchSlotConfig(container, '', '', {sizes: [[5,5]]});
// 	expected = [[600, 300], [100, 200], [720, 30]];
// 	assert.deepEqual(result.sizes, expected, 'Invalid size is ignored');

// 	container = $('<div data-o-ads-size="">')[0];
// 	this.ads.
// 	result = this.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]});
// 	expected = [[5, 5]];
// 	assert.deepEqual(result.sizes, expected, 'Empty string returns size from passed config');

// 	container = $('<div>')[0];
// 	result = this.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]});
// 	expected = [[5, 5]];
// 	assert.deepEqual(result.sizes, expected, 'No attribute returns size from passed config');

// 	container = $('<div data-o-ads-size="invalidxsize">')[0];
// 	result = this.ads.slots.fetchSlotConfig(container, '', {sizes: [[5,5]]});
// 	expected = [[5, 5]];
// 	assert.deepEqual(result.sizes, expected, 'Single invalid size returns size passed from config');
//});

// QUnit.test('Add container', function (assert) {
// 	this.ads.slots.addContainer(this.fixturesContainer, 'container');
// 	assert.ok($('#container').size(), 'the container is appended to the div');
// 	this.fixturesContainer.insertAdjacentHTML('beforeend', '<script id="slot" class="slot"></script>');
// 	var scriptTag = document.getElementById('slot');
// 	this.ads.slots.addContainer(scriptTag, 'script');
// 	assert.ok($('div#script').size(), 'the container exists and the id has been moved');
// 	assert.ok($('div#script').next().hasClass('slot'), 'the container is inserted before the script tag');
// });

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

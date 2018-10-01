/* globals QUnit: false, $: false */

'use strict'; //eslint-disable-line

QUnit.module('Slots', {
	beforeEach: function() {
		window.scrollTo(0, 0);
		this.server = this.server();
		this.server.autoRespond = true;
	},

	afterEach: function() {
		window.scrollTo(0, 0);
	}
});

QUnit.test('fails nicely if not slots found', function(assert) {
	this.fixturesContainer.add('<div id="banlb2" class="o-ads o-ads-slot"></div>');
	this.ads.init();
	const result = this.ads.slots.initSlot('banlb1');
	assert.notOk(result, 'failed to find an ad slot');
});

QUnit.test('moves id attribute to data-o-ads-name attribute instead', function(assert) {
	this.fixturesContainer.add('<div id="banlb2" data-o-ads-sizes="600x300,300x600,720x30" class="o-ads o-ads-slot"></div>');
	this.ads.init();
	const result = this.ads.slots.initSlot('banlb2');
	assert.ok(result, 'ad slot inited correctly');
});

QUnit.test('generates new name for a slot', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-sizes="600x300,300x600,720x30"></div>');
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	const result = slot.container.getAttribute('data-o-ads-name');
	assert.ok(result, 'ad slot inited correctly');
});

QUnit.test('adds an aria-hidden attribute on a slot', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-sizes="600x300,300x600,720x30"></div>');
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	const result = slot.container.getAttribute('aria-hidden');
	assert.ok(result, 'ad slot has the aria attribute');
	assert.equal(result, 'true', 'ad slot aria attribue value is correct');
});

QUnit.test('sets all attributes on slot object', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-sizes="600x300,300x600,720x30"></div>');
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	assert.notOk(slot.attributes, 'attributes are not set on slot object');
	slot.getAttributes();
	assert.ok(slot.attributes, 'attributes are set on slot object');
});

QUnit.test('catches when the ads format is not correct', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="WrongFormat" data-o-ads-sizes="600x300,300x600,720x30"></div>');
	this.ads.init();
	const errorSpy = this.spy(this.utils.log, 'error');
	this.ads.slots.initSlot(node);
	assert.ok(errorSpy.calledOnce, 'logs error when using wrong format');
});


QUnit.test('catches when the ads sizes are not correct', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="WrongFormat" data-o-ads-sizes></div>');
	this.ads.init();
	const errorSpy = this.spy(this.utils.log, 'error');
	this.ads.slots.initSlot(node);
	assert.ok(errorSpy.called, 'logs error when using wrong sizes');
	assert.ok(errorSpy.calledWith('slot %s has no configured sizes!'), 'missing size config logs correct error message');
});


QUnit.test('creates add based on a format with multiple sizes defined', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="TestFormat" data-o-ads-sizes></div>');
	const sizes = [[970, 90], [970, 66], [180, 50]];
	this.ads.init({
		formats: {
			TestFormat: {sizes: [[970, 90], [970, 66], [180, 50]]}
		}
	});
	const slot = this.ads.slots.initSlot(node);
	assert.deepEqual(slot.sizes, sizes, 'slot contains all sizes defined in the format defined');
});

QUnit.test('allows fluid as a creative format size', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="FluidFormat" data-o-ads-sizes></div>');
	const sizes = ['fluid', [970, 90]];

	this.ads.init({
		formats: {
			FluidFormat: { sizes: sizes }
		}
	});
	const slot = this.ads.slots.initSlot(node);
	assert.deepEqual(slot.sizes, sizes, 'slot contains all sizes defined in the format defined');
});

QUnit.test('allows fluid as a slot size', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-sizes="fluid" data-o-ads-sizes></div>');

	this.ads.init({});
	const slot = this.ads.slots.initSlot(node);
	assert.deepEqual(slot.sizes, ["fluid"], 'slot contains all sizes defined in the format defined');
});


QUnit.test('converts false string value of a property to a boolean', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-center="false" data-o-ads-sizes="600x300,300x600,720x30"></div>');
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	assert.notOk(slot.center, 'the center value is a boolean');
});

QUnit.test('converts false string value of a property to a boolean', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-center="true" data-o-ads-sizes="600x300,300x600,720x30"></div>');
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	assert.ok(slot.center, 'the center value is a boolean');
});

QUnit.test('defaults empty string value of a property to a true boolean', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-center="" data-o-ads-sizes="600x300,300x600,720x30"></div>');
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	assert.ok(slot.center, 'the center value is a boolean');
});

QUnit.test('create a basic slot with js configuration', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="banlb"></div>');

	const expected = {
		outOfPage: true,
		sizes: [[2, 2]]
	};

	this.ads.init({slots: { banlb: expected }});
	this.ads.slots.initSlot(node);
	const result = this.ads.slots.banlb;
	const container = result.container;
	const outer = container.querySelector('.o-ads__outer');
	const inner = outer.querySelector('.o-ads__inner');
	assert.strictEqual(result.name, 'banlb', 'the slot name is available');
	assert.ok(result, 'the slot object is available');
	assert.deepEqual(result.sizes, expected.sizes, 'the correct sizes are configured');
	assert.strictEqual(result.outOfPage, expected.outOfPage, 'the correct outOfPage is configured');
	assert.ok(outer, 'the outer div is rendered');
	assert.ok(inner, 'the inner div is rendered');
});

QUnit.test('create a slot with sizes via sizes attribute', function(assert) {
	const expected = [[600, 300], [300, 600], [720, 30]];
	const node = this.fixturesContainer.add('<div data-o-ads-name="banlb2" data-o-ads-sizes="600x300,300x600,720x30" class="o-ads o-ads-slot"></div>');
	this.ads.init();
	this.ads.slots.initSlot(node);
	const result = this.ads.slots.banlb2;
	assert.deepEqual(result.sizes, expected, 'Multiple sizes are parsed and added correctly');
});

QUnit.test('create a slot with an invalid size among multiple sizes', function(assert) {
	const expected = [[600, 300], [100, 200], [720, 30]];
	const node = this.fixturesContainer.add('<div data-o-ads-name="banlb" data-o-ads-sizes="600x300,invalidxsize,100x200,720x30" class="o-ads o-ads-slot"></div>');
	this.ads.init();
	this.ads.slots.initSlot(node);
	const result = this.ads.slots.banlb;
	assert.deepEqual(result.sizes, expected, 'Invalid size is ignored');
});

QUnit.test('create a slot with sizes via format attribute', function(assert) {
	const expected = [[300, 250]];
	const node = this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({
		responsive: {
			small: [0, 0],
			medium: [400, 400],
			large: [600, 600]
		}
	});
	this.ads.slots.initSlot(node);
	const result = this.ads.slots.mpu;
	assert.deepEqual(result.sizes, expected, 'Formats names are parsed and the matching sizes are pulled from config.');
});

QUnit.test('Center container', function(assert) {
	const slotHTML = '<div data-o-ads-name="center-test" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({slots: {
		'center-test': {
			center: true
		}
	}});
	const result = this.ads.slots.initSlot(node);

	assert.ok($(result.container).hasClass('o-ads--center'), 'the centering class has been added');
});

QUnit.test('Label container', function(assert) {
	const slotHTML = '<div data-o-ads-name="label-test" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({slots: {
		'label-test': {
			label: true
		}
	}});
	const result = this.ads.slots.initSlot(node);

	assert.ok($(result.container).hasClass('o-ads--label-left'), 'the labeling class has been added');
});

QUnit.test('Label right container', function(assert) {
	const slotHTML = '<div data-o-ads-name="label-right-test" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({slots: {
		'label-right-test': {
			label: 'right'
		}
	}});
	const result = this.ads.slots.initSlot(node);

	assert.ok($(result.container).hasClass('o-ads--label-right'), 'the labeling class has been added');
});

QUnit.test('Label container via attribute', function(assert) {
	const slotHTML = '<div data-o-ads-name="label-attr-test" data-o-ads-label="left" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({slots: {
		'label-attr-test': {
			label: 'right'
		}
	}});
	const result = this.ads.slots.initSlot(node);

	assert.ok($(result.container).hasClass('o-ads--label-left'), 'the labeling class has been added');
});

QUnit.test('configure out of page slot', function(assert) {
	const slotHTML = '<div data-o-ads-name="out-of-page-test" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({
		slots: {
			'out-of-page-test': {
				outOfPage: true
			}
		}});
	let result = this.ads.slots.initSlot(node);
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

QUnit.test('configure out of page slot via DOM', function(assert) {
	const slotHTML = '<div data-o-ads-out-of-page="true" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init();
	const result = this.ads.slots.initSlot(node);
	assert.ok(result.outOfPage, 'data-o-ads-out-of-page attribute is present returns true');
});

QUnit.test('configure slot level targeting', function(assert) {
	let targeting = 'some=test;targeting=params;';
	let node = this.fixturesContainer.add('<div data-o-ads-targeting="' + targeting + '" data-o-ads-name="targeting-test" data-o-ads-formats="MediumRectangle"></div>');

	let result = this.ads.slots.initSlot(node);
	let expected = { some: 'test', targeting: 'params'};

	assert.deepEqual(result.targeting, expected, 'data-o-ads-targeting attribute is parsed');

	targeting = 'some=test; ;targeting=params;';
	node = this.fixturesContainer.add('<div data-o-ads-targeting="' + targeting + '" data-o-ads-name="malformed-test" data-o-ads-formats="MediumRectangle"></div>');
	result = this.ads.slots.initSlot(node);
	expected = { some: 'test', targeting: 'params'};

	assert.deepEqual(result.targeting, expected, 'data-o-ads-targeting malformed string is ok');
});

QUnit.test('Slots.collapse will collapse a single slot', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="collapse-test" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.slots.initSlot(node);
	this.ads.slots.collapse('collapse-test');
	assert.ok($(node).hasClass('o-ads--empty'), 'slot is collapsed');
	assert.equal(this.fixturesContainer.getAttribute('data-o-ads-loaded', false));
});

QUnit.test('Slots.collapse will collapse mulitple slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="collapse1-test" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="collapse2-test" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.slots.initSlot(node1);
	this.ads.slots.initSlot(node2);
	this.ads.slots.collapse(['collapse1-test', 'collapse2-test']);
	assert.ok($(node1).hasClass('o-ads--empty'), 'slot 1 is collapsed');
	assert.ok($(node2).hasClass('o-ads--empty'), 'slot 2 is collapsed');
});

QUnit.test('Slots.collapse with no args will collapse all slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="collapse1-test" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="collapse2-test" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.slots.initSlot(node1);
	this.ads.slots.initSlot(node2);
	this.ads.slots.collapse();
	assert.ok($(node1).hasClass('o-ads--empty'), 'slot 1 is collapsed');
	assert.ok($(node2).hasClass('o-ads--empty'), 'slot 2 is collapsed');
});

QUnit.test('Slots.collapse will emit an event', function(assert) {
	this.stub(this.utils, 'broadcast');
	const node = this.fixturesContainer.add('<div data-o-ads-name="collapse-test" data-o-ads-formats="MediumRectangle"></div>');
	const initedSlot = this.ads.slots.initSlot(node);
	this.ads.slots.collapse('collapse-test');
	assert.ok($(node).hasClass('o-ads--empty'), 'slot is collapsed');
	assert.equal(this.fixturesContainer.getAttribute('data-o-ads-loaded', false));
	assert.ok(this.utils.broadcast.calledWith('collapsed', initedSlot), 'event broadcast has been called with correct event');
});


QUnit.test('Slots.uncollapse will uncollapse a single slot', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="collapse-test" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.slots.initSlot(node);
	this.ads.slots.collapse('collapse-test');
	assert.ok($(node).hasClass('o-ads--empty'), 'slot is collapsed');
	this.ads.slots.uncollapse('collapse-test');
	assert.notOk($(node).hasClass('o-ads--empty'), 'slot is collapsed');
});

QUnit.test('Slots.uncollapse will uncollapse mulitple slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="collapse1-test" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="collapse2-test" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.slots.initSlot(node1);
	this.ads.slots.initSlot(node2);
	this.ads.slots.collapse(['collapse1-test', 'collapse2-test']);
	assert.ok($(node1).hasClass('o-ads--empty'), 'slot 1 is collapsed');
	assert.ok($(node2).hasClass('o-ads--empty'), 'slot 2 is collapsed');
	this.ads.slots.uncollapse(['collapse1-test', 'collapse2-test']);
	assert.notOk($(node1).hasClass('o-ads--empty'), 'slot 1 is uncollapsed');
	assert.notOk($(node2).hasClass('o-ads--empty'), 'slot 2 is uncollapsed');
});

QUnit.test('Slots.uncollapse with no args will collapse all slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="collapse1-test" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="collapse2-test" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.slots.initSlot(node1);
	this.ads.slots.initSlot(node2);
	this.ads.slots.collapse();
	assert.ok($(node1).hasClass('o-ads--empty'), 'slot 1 is collapsed');
	assert.ok($(node2).hasClass('o-ads--empty'), 'slot 2 is collapsed');
	this.ads.slots.uncollapse();
	assert.notOk($(node1).hasClass('o-ads--empty'), 'slot 1 is uncollapsed');
	assert.notOk($(node2).hasClass('o-ads--empty'), 'slot 2 is uncollapsed');
});

QUnit.test('Slots.refresh will refresh a single slot', function(assert) {
	const done = assert.async();
	const node = this.fixturesContainer.add('<div data-o-ads-name="refresh-test" data-o-ads-formats="MediumRectangle"></div>');

	node.addEventListener('oAds.refresh', function(event) {
		assert.equal(event.detail.name, 'refresh-test', 'our test slot is refreshed');
		done();
	});
	this.ads.slots.initSlot(node);
	this.ads.slots.refresh('refresh-test');
});

QUnit.test('Slots.refresh will refresh a single slot', function(assert) {
	const done = assert.async();
	const node = this.fixturesContainer.add('<div data-o-ads-name="refresh-test" data-o-ads-formats="MediumRectangle"></div>');

	node.addEventListener('oAds.refresh', function(event) {
		assert.equal(event.detail.name, 'refresh-test', 'our test slot is refreshed');
		done();
	});
	this.ads.slots.initSlot(node);
	this.ads.slots.refresh('refresh-test');
});

QUnit.test('Slots.destroy will destroy a single slot', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="destroy-test" data-o-ads-formats="MediumRectangle"></div>');
	const slot = this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['destroy-test'], 'slot to be destoryed has been initialised');
	const destroySpy = this.spy(slot, 'destroy');
	this.ads.slots.destroy('destroy-test');
	assert.notOk(this.ads.slots['destroy-test'], 'slot has been destoryed and reference to it has been removed');
	assert.ok(destroySpy.calledOnce, 'clear method has been called on a slot');
});

QUnit.test('Slots.destroy will call destroySlot method from the ad server provider when one is present', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="destroy-test" data-o-ads-formats="MediumRectangle"></div>');
	const slot = this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['destroy-test'], 'slot to be destoryed has been initialised');
	// provide mock method on slot (usually responosbility of ad server provider)
	slot.destroySlot = function(){};
	const destroySpy = this.spy(slot, 'destroy');
	const destroySlotSpy = this.spy(slot, 'destroySlot');
	this.ads.slots.destroy('destroy-test');
	assert.notOk(this.ads.slots['destroy-test'], 'slot has been destoryed and reference to it has been removed');
	assert.ok(destroySpy.calledOnce, 'destroy method has been called on a slot');
	assert.ok(destroySlotSpy.calledOnce, 'destroy slot method has been called on a slot');
});

QUnit.test('Slots.destroy with args will destroy multiple slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="destroy-test-1" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="destroy-test-2" data-o-ads-formats="MediumRectangle"></div>');
	const slot1 = this.ads.slots.initSlot(node1);
	const slot2 = this.ads.slots.initSlot(node2);
	assert.ok(this.ads.slots['destroy-test-1'], 'first slot to be destoryed has been initialised');
	assert.ok(this.ads.slots['destroy-test-2'], 'second slot to be destoryed has been initialised');
	const destroySpy1 = this.spy(slot1, 'destroy');
	const destroySpy2 = this.spy(slot2, 'destroy');
	this.ads.slots.destroy(['destroy-test-1', 'destroy-test-2']);
	assert.notOk(this.ads.slots['destroy-test-1'], 'first slot has been destoryed and reference to it has been removed');
	assert.notOk(this.ads.slots['destroy-test-2'], 'second slot has been destoryed and reference to it has been removed');
	assert.ok(destroySpy1.calledOnce, 'destroy method has been called on the first slot');
	assert.ok(destroySpy2.calledOnce, 'destroy method has been called on the second slot');
});

QUnit.test('Slots.destroy without will destroy all slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="destroy-test-1" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="destroy-test-2" data-o-ads-formats="MediumRectangle"></div>');
	const slot1 = this.ads.slots.initSlot(node1);
	const slot2 = this.ads.slots.initSlot(node2);
	assert.ok(this.ads.slots['destroy-test-1'], 'first slot to be destoryed has been initialised');
	assert.ok(this.ads.slots['destroy-test-2'], 'second slot to be destoryed has been initialised');
	const destroySpy1 = this.spy(slot1, 'destroy');
	const destroySpy2 = this.spy(slot2, 'destroy');
	this.ads.slots.destroy();
	assert.notOk(this.ads.slots['destroy-test-1'], 'first slot has been destoryed and reference to it has been removed');
	assert.notOk(this.ads.slots['destroy-test-2'], 'second slot has been destoryed and reference to it has been removed');
	assert.ok(destroySpy1.calledOnce, 'destroy method has been called on the first slot');
	assert.ok(destroySpy2.calledOnce, 'destroy method has been called on the second slot');
});

QUnit.test('Slots.clear will clear a single slot', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="clear-test" data-o-ads-formats="MediumRectangle"></div>');
	const slot = this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['clear-test'], 'slot to be cleared has been initialised');
	const clearSpy = this.spy(slot, 'clear');
	this.ads.slots.clear('clear-test');
	assert.ok(this.ads.slots['clear-test'], 'slot has been cleared and reference to it still exists');
	assert.ok(clearSpy.calledOnce, 'clear method has been called on a slot');
});

QUnit.test('Slots.clear will call clear slot method from the ad server provider when one is present', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="clear-test" data-o-ads-formats="MediumRectangle"></div>');
	const slot = this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['clear-test'], 'slot to be cleared has been initialised');
	// provide mock method on slot (usually responosbility of ad server provider)
	slot.clearSlot = function(){};
	const clearSpy = this.spy(slot, 'clear');
	const clearSlotSpy = this.spy(slot, 'clearSlot');
	this.ads.slots.clear('clear-test');
	assert.ok(this.ads.slots['clear-test'], 'slot has been cleared and reference to it still exists');
	assert.ok(clearSpy.calledOnce, 'clear method has been called on a slot');
	assert.ok(clearSlotSpy.calledOnce, 'clear slot method has been called on a slot');
});

QUnit.test('Slots.clear will clear multiple slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="clear-test-1" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="clear-test-2" data-o-ads-formats="MediumRectangle"></div>');
	const slot1 = this.ads.slots.initSlot(node1);
	const slot2 = this.ads.slots.initSlot(node2);
	assert.ok(this.ads.slots['clear-test-1'], 'first slot to be cleared has been initialised');
	assert.ok(this.ads.slots['clear-test-2'], 'second slot to be cleared has been initialised');
	const clearSpy1 = this.spy(slot1, 'clear');
	const clearSpy2 = this.spy(slot2, 'clear');
	this.ads.slots.clear(['clear-test-1', 'clear-test-2']);
	assert.ok(this.ads.slots['clear-test-1'], 'first slot has been cleared and reference to it still exists');
	assert.ok(this.ads.slots['clear-test-2'], 'second slot has been cleared and reference to it still exists');
	assert.ok(clearSpy1.calledOnce, 'clear method has been called on the first slot');
	assert.ok(clearSpy2.calledOnce, 'clear method has been called on the second slot');
});

QUnit.test('Slots.clear will clear multiple slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="clear-test-1" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="clear-test-2" data-o-ads-formats="MediumRectangle"></div>');
	const slot1 = this.ads.slots.initSlot(node1);
	const slot2 = this.ads.slots.initSlot(node2);
	assert.ok(this.ads.slots['clear-test-1'], 'first slot to be cleared has been initialised');
	assert.ok(this.ads.slots['clear-test-2'], 'second slot to be cleared has been initialised');
	const clearSpy1 = this.spy(slot1, 'clear');
	const clearSpy2 = this.spy(slot2, 'clear');
	this.ads.slots.clear();
	assert.ok(this.ads.slots['clear-test-1'], 'first slot has been cleared and reference to it still exists');
	assert.ok(this.ads.slots['clear-test-2'], 'second slot has been cleared and reference to it still exists');
	assert.ok(clearSpy1.calledOnce, 'clear method has been called on the first slot');
	assert.ok(clearSpy2.calledOnce, 'clear method has been called on the second slot');
});

QUnit.test('Slots.clear will clear a single slot', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="clear-test" data-o-ads-formats="MediumRectangle"></div>');
	const slot = this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['clear-test'], 'slot to be cleared has been initialised');
	const clearSpy = this.spy(slot, 'clear');
	this.ads.slots.clear('clear-test');
	assert.ok(this.ads.slots['clear-test'], 'slot has been cleared and reference to it still exists');
	assert.ok(clearSpy.calledOnce, 'clear method has been called on a slot');
});

QUnit.test('Slots.clear will call clear slot method from the ad server provider when one is present', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="clear-test" data-o-ads-formats="MediumRectangle"></div>');
	const slot = this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['clear-test'], 'slot to be cleared has been initialised');
	// provide mock method on slot (usually responosbility of ad server provider)
	slot.clearSlot = function(){};
	const clearSpy = this.spy(slot, 'clear');
	const clearSlotSpy = this.spy(slot, 'clearSlot');
	this.ads.slots.clear('clear-test');
	assert.ok(this.ads.slots['clear-test'], 'slot has been cleared and reference to it still exists');
	assert.ok(clearSpy.calledOnce, 'clear method has been called on a slot');
	assert.ok(clearSlotSpy.calledOnce, 'clear slot method has been called on a slot');
});

QUnit.test('Slots.clear will clear multiple slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="clear-test-1" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="clear-test-2" data-o-ads-formats="MediumRectangle"></div>');
	const slot1 = this.ads.slots.initSlot(node1);
	const slot2 = this.ads.slots.initSlot(node2);
	assert.ok(this.ads.slots['clear-test-1'], 'first slot to be cleared has been initialised');
	assert.ok(this.ads.slots['clear-test-2'], 'second slot to be cleared has been initialised');
	const clearSpy1 = this.spy(slot1, 'clear');
	const clearSpy2 = this.spy(slot2, 'clear');
	this.ads.slots.clear(['clear-test-1', 'clear-test-2']);
	assert.ok(this.ads.slots['clear-test-1'], 'first slot has been cleared and reference to it still exists');
	assert.ok(this.ads.slots['clear-test-2'], 'second slot has been cleared and reference to it still exists');
	assert.ok(clearSpy1.calledOnce, 'clear method has been called on the first slot');
	assert.ok(clearSpy2.calledOnce, 'clear method has been called on the second slot');
});

QUnit.test('Slots.clear will clear multiple slots', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="clear-test-1" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="clear-test-2" data-o-ads-formats="MediumRectangle"></div>');
	const slot1 = this.ads.slots.initSlot(node1);
	const slot2 = this.ads.slots.initSlot(node2);
	assert.ok(this.ads.slots['clear-test-1'], 'first slot to be cleared has been initialised');
	assert.ok(this.ads.slots['clear-test-2'], 'second slot to be cleared has been initialised');
	const clearSpy1 = this.spy(slot1, 'clear');
	const clearSpy2 = this.spy(slot2, 'clear');
	this.ads.slots.clear();
	assert.ok(this.ads.slots['clear-test-1'], 'first slot has been cleared and reference to it still exists');
	assert.ok(this.ads.slots['clear-test-2'], 'second slot has been cleared and reference to it still exists');
	assert.ok(clearSpy1.calledOnce, 'clear method has been called on the first slot');
	assert.ok(clearSpy2.calledOnce, 'clear method has been called on the second slot');
});

QUnit.test('Slots.submitImpression will submit and impression for a single slot', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="delayedimpression" data-o-ads-formats="MediumRectangle"></div>');
	const slot = this.ads.slots.initSlot(node);
	const submitSpy = this.spy(slot, 'submitImpression');
	slot.submitGptImpression = function(){};
	const submitGptSpy = this.spy(slot, 'submitGptImpression');
	this.ads.slots.submitImpression('delayedimpression');
	assert.ok(submitSpy.calledOnce, 'the submitImpression method has been called on a slot');
	assert.ok(submitGptSpy.calledOnce, 'the gpt submitGptImpression method has been called');
});

QUnit.test('Slots.submitImpression will submit and impression for a single slot', function(assert) {
	const node1 = this.fixturesContainer.add('<div data-o-ads-name="delayedimpression-1" data-o-ads-formats="MediumRectangle"></div>');
	const node2 = this.fixturesContainer.add('<div data-o-ads-name="delayedimpression-2" data-o-ads-formats="MediumRectangle"></div>');
	const node3 = this.fixturesContainer.add('<div data-o-ads-name="delayedimpression-3" data-o-ads-formats="MediumRectangle"></div>');
	const slot1 = this.ads.slots.initSlot(node1);
	const slot2 = this.ads.slots.initSlot(node2);
	const slot3 = this.ads.slots.initSlot(node3);
	const submitSpy1 = this.spy(slot1, 'submitImpression');
	const submitSpy2 = this.spy(slot2, 'submitImpression');
	const submitSpy3 = this.spy(slot3, 'submitImpression');
	this.ads.slots.submitImpression();
	this.ads.slots.submitImpression(['delayedimpression-1', 'delayedimpression-2']);
	assert.ok(submitSpy1.calledTwice, 'the submitImpression method has been called twice on slot1');
	assert.ok(submitSpy2.calledTwice, 'the submitImpression method has been called twice on slot2');
	assert.ok(submitSpy3.calledOnce, 'the submitImpression method has been called once on slot3');
});


QUnit.test('attempting to run an action on an unknown slot will log a warning', function(assert) {
	const warnSpy = this.spy(this.utils.log, 'warn');
	this.ads.slots.collapse('unknown-test');
	assert.ok(warnSpy.calledWith('Attempted to %s non-existant slot %s', 'collapse', 'unknown-test'), 'a warning is generated');
});

QUnit.test('attempting to run an action on a non-slot log a warning', function(assert) {
	const warnSpy = this.spy(this.utils.log, 'warn');
	this.ads.slots['test'] = {};
	this.ads.slots.clear();
	assert.ok(warnSpy.calledWith('Attempted to %s on a non-slot %s', 'clear', 'test'), 'a warning is generated when triggering a call on non-slot');
});

QUnit.test('configure refresh globally on a timer', function (assert) {
	const done = assert.async();
	const clock = this.date();
	const slotHTML = '<div data-o-ads-name="refresh-test" data-o-ads-formats="Rectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);

	document.body.addEventListener('oAds.refresh', function(event) {
		assert.equal(event.detail.name, 'refresh-test', 'our test slot is refreshed');
		done();
	});

	this.ads.init({ refresh: { time: 2 }});
	this.ads.slots.initSlot(node);
	clock.tick(2025);
});

QUnit.test('configure refresh globally on a timer with a default time of 1 second', function (assert) {
	const done = assert.async();
	const clock = this.date();
	const slotHTML = '<div data-o-ads-name="refresh-test" data-o-ads-formats="Rectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);

	document.body.addEventListener('oAds.refresh', function(event) {
		assert.equal(event.detail.name, 'refresh-test', 'our test slot is refreshed');
		done();
	});

	this.ads.init({ refresh: { time: 'invalid' } });
	this.ads.slots.initSlot(node);
	clock.tick(1025);
});


QUnit.test('configure refresh on a timer for a max number of times', function (assert) {
	const clock = this.date();
	const slotHTML = '<div data-o-ads-name="refresh-test" data-o-ads-formats="Rectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	let count = 0;
	document.body.addEventListener('oAds.refresh', function() {
		count++;
	});

	this.ads.init({ refresh: { time: 1, max: 3 }});
	this.ads.slots.initSlot(node);
	assert.equal(count, 0);
	clock.tick(1001);
	assert.equal(count, 1);
	clock.tick(1001);
	assert.equal(count, 2);
	clock.tick(1001);
	assert.equal(count, 3);
	clock.tick(1001);
	assert.equal(count, 3);
});

QUnit.test('lazy loading', function(assert) {
	const done = assert.async();
	const slotHTML = '<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);


	document.body.addEventListener('oAds.render', function(event) {
		if(event.detail.name === 'lazy-test') {
			assert.equal(event.detail.name, 'lazy-test', 'our test slot fired the render event');
			done();
		}
	});

	this.ads.init();
	this.trigger(window, 'load');
	this.ads.slots.initSlot(node);
	assert.equal(this.ads.slots['lazy-test'].lazyLoad, true);
});

QUnit.test('lazy loading global config', function(assert) {
	const done = assert.async();
	const slotHTML = '<div data-o-ads-name="lazy-test" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);

	document.body.addEventListener('oAds.render', function(event) {
		if(event.detail.name === 'lazy-test') {
			assert.equal(event.detail.name, 'lazy-test', 'our test slot fired the render event');
			done();
		}
	});

	this.ads.init({
		lazyLoad: true
	});
	this.trigger(window, 'load');
	this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['lazy-test'].lazyLoad);
});

QUnit.test('lazy loading slot config takes precedence over global config', function(assert) {
	const slotHTML = '<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="false" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);

	this.ads.init({lazyLoad: true});
	this.trigger(window, 'load');
	this.ads.slots.initSlot(node);
	assert.equal(this.ads.slots['lazy-test'].lazyLoad, false);
});




QUnit.test('lazy loading triggers event if the advert is in view', function(assert) {
	const done = assert.async();
	const slotHTML = `<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle"></div>`;
	const node = this.fixturesContainer.add(slotHTML);

	document.body.addEventListener('oAds.render', function(event) {
		if(event.detail.name === 'lazy-test') {
			assert.equal(event.detail.name, 'lazy-test', 'our test slot fired the render event');
			done();
		}
	});

	this.ads.init();
	this.trigger(window, 'load');
	this.ads.slots.initSlot(node);

});

QUnit.test('lazy loading triggers in top-down order if multiple ads in view', function(assert) {
	const done = assert.async();
	const slot1HTML = `<div data-o-ads-name="lazy-test-bottom" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle" style="width: 100%; position: absolute; top: 40px"></div>`;
	const slot2HTML = `<div data-o-ads-name="lazy-test-top" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle" style="width: 100%;"></div>`;
	const node1 = this.fixturesContainer.add(slot1HTML);
	const node2 = this.fixturesContainer.add(slot2HTML);
	let count=0;
	document.body.addEventListener('oAds.render', function(event) {
		count++;
		if(event.detail.name === 'lazy-test-bottom') {
			assert.equal(event.detail.name, 'lazy-test-bottom', 'our test slot fired the render event');
			assert.equal(count, 2, 'bottom slot is the last to fire');
			done();
		}
	});

	this.ads.init();
	this.trigger(window, 'load');
	this.ads.slots.initSlot(node1);
	this.ads.slots.initSlot(node2);

});

QUnit.test('lazy loading supports in view threshold', function(assert) {
	const done = assert.async();
	const advertHeight = 90;
	const iframe = window.top.document.querySelector('iframe').contentWindow;
	const slotHTML = `<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle"></div>`;
	const node = this.fixturesContainer.add(slotHTML);
	const advertTopPosition = iframe.innerHeight * 2;

	const element = document.querySelector('[data-o-ads-name="lazy-test"]');
	element.style.position = 'absolute';
	element.style.top = advertTopPosition + 'px';
	element.style.width = '700px';
	element.style.height = '90px';


	document.body.addEventListener('oAds.render', function(event) {
		if(event.detail.name === 'lazy-test') {
			assert.equal(event.detail.name, 'lazy-test', 'our test slot fired the render event');
			done();
		}
	});

	this.trigger(window, 'load');

	this.ads.init({
		lazyLoad: {
			threshold: [1]
		}
	});

	this.ads.slots.initSlot(node);
	window.top.scroll(0, window.top.innerHeight);
	iframe.scroll(0, iframe.innerHeight + advertHeight);
});


QUnit.test('lazy loading supports slot level config', function(assert) {
	const node = this.fixturesContainer.add(`<div data-o-ads-name="lazy-test" data-o-ads-lazy-load-threshold="0.9" data-o-ads-lazy-load-viewport-margin="10%" data-o-ads-formats="MediumRectangle"></div>`);
	const node2 = this.fixturesContainer.add(`<div data-o-ads-name="lazy-test-2"></div>`);
	this.ads.init({
		lazyLoad: {
			viewportMargin: '100% 0%',
			threshold: [1]
		},
		slots: {
			'lazy-test-2': {
				lazyLoad: {
					viewportMargin: '50%',
					threshold: [0.8],
				},
				formats: ['MediumRectangle']
			}
		}
	});

	this.ads.slots.initSlot(node);
	this.ads.slots.initSlot(node2);

	assert.deepEqual(this.ads.slots['lazy-test'].lazyLoad.threshold, [0.9], 'first slot level condifiguration for lazy load in view percent');
	assert.equal(this.ads.slots['lazy-test'].lazyLoad.viewportMargin, '10%', 'first slot level condifiguration for lazy load margin');
	assert.deepEqual(this.ads.slots['lazy-test-2'].lazyLoad.threshold, [0.8], 'second slot level condifiguration for lazy load in view percent');
	assert.equal(this.ads.slots['lazy-test-2'].lazyLoad.viewportMargin, '50%', 'second slot level condifiguration for lazy load margin');
});


QUnit.test('lazy loading works with old DOM slot level configuration', function(assert) {
	const node = this.fixturesContainer.add(`<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="true" data-o-ads-lazy-load-threshold="0.9" data-o-ads-lazy-load-viewport-margin="15%" data-o-ads-formats="MediumRectangle"></div>`);
	this.ads.init();
	this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['lazy-test'].lazyLoad);
	assert.deepEqual(this.ads.slots['lazy-test'].lazyLoad.threshold, [0.9], 'slot level condifiguration for lazy load in view percent');
	assert.equal(this.ads.slots['lazy-test'].lazyLoad.viewportMargin, '15%', 'slot level condifiguration for lazy load margin');
});


QUnit.test('lazy loading allows multiple thresholds to be configure from DOM data attribute', function(assert) {
	const node = this.fixturesContainer.add(`<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="true" data-o-ads-lazy-load-threshold="0.9,0.5" data-o-ads-lazy-load-viewport-margin="15%" data-o-ads-formats="MediumRectangle"></div>`);
	this.ads.init();
	this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['lazy-test'].lazyLoad.threshold[this.ads.slots['lazy-test'].lazyLoad.threshold.indexOf(0.9)] === 0.9, 'slot level condifiguration for lazy load in view percent first value exists');
	assert.ok(this.ads.slots['lazy-test'].lazyLoad.threshold[this.ads.slots['lazy-test'].lazyLoad.threshold.indexOf(0.5)] === 0.5, 'slot level condifiguration for lazy load in view percent second value exists');
	assert.equal(this.ads.slots['lazy-test'].lazyLoad.viewportMargin, '15%', 'slot level condifiguration for lazy load margin');
});


QUnit.test('lazy loading passes threshold to IntersectionObserver', function(assert) {
	const observeStub = this.stub();

	function IntersectionObserverFunction(callback, options) {
		assert.deepEqual(options.threshold, [0.9], 'threshold configuration is getting passed to IntersectionObserver');
	}

	IntersectionObserverFunction.prototype.observe = observeStub;
	const IntersectionObserverStub = this.stub(window, 'IntersectionObserver', IntersectionObserverFunction);

	const node = this.fixturesContainer.add(`<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="true" data-o-ads-lazy-load-threshold="0.9" data-o-ads-lazy-load-viewport-margin="15%" data-o-ads-formats="MediumRectangle"></div>`);
	this.ads.init();
	this.ads.slots.initSlot(node);
	assert.ok(this.ads.slots['lazy-test'].lazyLoad);
	assert.deepEqual(this.ads.slots['lazy-test'].lazyLoad.threshold, [0.9], 'slot level condifiguration for lazy load in view percent');
	assert.equal(this.ads.slots['lazy-test'].lazyLoad.viewportMargin, '15%', 'slot level condifiguration for lazy load margin');
	IntersectionObserverStub.restore();
});


QUnit.test('lazy loading only works if explicitely told to do so', function(assert) {
	const node = this.fixturesContainer.add(`<div data-o-ads-name="lazy-test" data-o-ads-lazy-load-threshold="80" data-o-ads-formats="MediumRectangle"></div>`);
	const node2 = this.fixturesContainer.add(`<div data-o-ads-name="lazy-test-2" data-o-ads-lazy-load-viewport-margin="15%" data-o-ads-formats="MediumRectangle"></div>`);
	this.ads.init();

	this.ads.slots.initSlot(node);
	this.ads.slots.initSlot(node2);

	assert.equal(this.ads.slots['lazy-test'].lazyLoad, false, 'first slot level condifiguration for lazy load in view percent');
	assert.equal(this.ads.slots['lazy-test-2'].lazyLoad, false, 'second slot level condifiguration for lazy load in view percent');
});


QUnit.test('lazy loading supports global config', function(assert) {
	const slotHTML = `<div data-o-ads-name="lazy-test" data-o-ads-formats="MediumRectangle"></div>`;
	const node = this.fixturesContainer.add(slotHTML);
	const config = {
		lazyLoad: {
			viewportMargin: '100% 0%',
			threshold: [1]
		}
	};
	this.ads.init(config);
	this.ads.slots.initSlot(node);
	assert.deepEqual(this.ads.slots['lazy-test'].lazyLoad, config.lazyLoad, 'slot level condifiguration for lazy load in view percent');
});

QUnit.test('lazy loading triggers event at the correct point with no intersection observer viewport margin set', function(assert) {
	const done = assert.async();
	const slotHTML = `<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle" style="position: absolute; width:728px; height:90px;"></div>`;
	const node = this.fixturesContainer.add(slotHTML);
	const advertTopPosition = window.innerHeight * 4;
	// const advertHeight = 90;
	// const triggerPoint = window.innerHeight * 3 + advertHeight;
	const element = document.querySelector('[data-o-ads-name="lazy-test"]');
	element.style.top = advertTopPosition + 'px';


	document.body.addEventListener('oAds.render', function(event) {
		if(event.detail.name === 'lazy-test') {
			assert.equal(event.detail.name, 'lazy-test', 'our test slot fired the render event');
			done();
		}
	});

	this.ads.init();
	this.trigger(window, 'load');
	this.ads.slots.initSlot(node);

	for(let step = 0; step < 5; step++) {
		window.scrollTo(0, step * window.innerHeight);
	}

});

QUnit.test('lazy loading triggers event at the correct point with intersection observer viewport margin is set', function(assert) {
	const done = assert.async();
	const advertHeight = 90;
	const iframe = window.top.document.querySelector('iframe').contentWindow;
	const slotHTML = `<div data-o-ads-name="lazy-test" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle"></div>`;
	const node = this.fixturesContainer.add(slotHTML);
	const advertTopPosition = iframe.innerHeight * 2;

	const element = document.querySelector('[data-o-ads-name="lazy-test"]');
	element.style.position = 'absolute';
	element.style.top = advertTopPosition + 'px';
	element.style.width = '700px';
	element.style.height = '90px';


	document.body.addEventListener('oAds.render', function(event) {
		if(event.detail.name === 'lazy-test') {
			assert.equal(event.detail.name, 'lazy-test', 'our test slot fired the render event');
			done();
		}
	});

	this.trigger(window, 'load');

	this.ads.init({
		lazyLoad: {
			viewportMargin : '100% 0%'
		}
	});

	this.ads.slots.initSlot(node);
	iframe.scroll(0, iframe.innerHeight + advertHeight);
});


QUnit.test('lazy loading a companion slot', function(assert) {
	const done = assert.async();
	const slotHTML = '<div data-o-ads-name="lazy-companion-test" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle" style="position: absolute; left: -1000px; top: -1000px"></div>';
	const node = this.fixturesContainer.add(slotHTML);

	document.body.addEventListener('oAds.render', function(event) {
		if(event.detail.name === 'lazy-companion-test') {
			assert.equal(event.detail.name, 'lazy-companion-test', 'our test slot fired the render event');
			done();
		}
	});

	this.ads.init();
	this.ads.slots.initSlot(node);
	this.utils.broadcast('masterLoaded', {}, node);
});


QUnit.test('lazy loading a companion slot', function(assert) {
	const done = assert.async();
	const slotHTML = '<div data-o-ads-name="lazy-companion-test" data-o-ads-lazy-load="true" data-o-ads-formats="MediumRectangle" style="position: absolute; left: -1000px; top: -1000px"></div>';
	const node = this.fixturesContainer.add(slotHTML);

	document.body.addEventListener('oAds.render', function(event) {
		if(event.detail.name === 'lazy-companion-test') {
			assert.equal(event.detail.name, 'lazy-companion-test', 'our test slot fired the render event');
			done();
		}
	});

	this.ads.init();
	this.ads.slots.initSlot(node);
	this.utils.broadcast('masterLoaded', {}, node);
});

QUnit.test('companion slots which are configured as false for a specific screensize should not render at that screensize', function(assert) {
	const slotHTML = '<div data-o-ads-name="lazy-companion-test" data-o-ads-lazy-load="true" data-o-ads-formats-default="false" data-o-ads-formats-large="false" data-o-ads-formats-small="false" data-o-ads-formats-medium="false" data-o-ads-formats-extra="false" style="position: absolute; left: -1000px; top: -1000px"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	const renderSpy = this.spy(slot, 'render');
	this.utils.broadcast('masterLoaded', {}, node);
	assert.notOk(renderSpy.calledOnce, 'slot fire method is not called');
	renderSpy.restore();
});

QUnit.test('lazy loading loads the ad normal way if IntersectionObserver is not available', function(assert) {
	const originalObserver = window.IntersectionObserver;
	delete window.IntersectionObserver;
	const slotHTML = '<div data-o-ads-name="lazy-test" data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({
		lazyLoad: true
	});
	this.trigger(window, 'load');
	this.ads.slots.initSlot(node);
	const slot = this.ads.slots['lazy-test'];
	assert.ok(slot.lazyLoad);
	assert.equal(slot.container.getAttribute('data-o-ads-loaded'), 'MediumRectangle');
	window.IntersectionObserver = originalObserver;
});


QUnit.test('complete events fire', function(assert) {
	const done = assert.async();
	const done2 = assert.async();

	const clock = this.date();
	let slotHTML = '<div data-o-ads-name="first" data-o-ads-formats="MediumRectangle"></div>';
	const first = this.fixturesContainer.add(slotHTML);
	slotHTML = '<div data-o-ads-name="second" data-o-ads-formats="MediumRectangle"></div>';
	const second = this.fixturesContainer.add(slotHTML);

	document.body.addEventListener('oAds.complete', function(event) {
		assert.ok(event.detail.name, event.detail.name + ' completed.');
		if (event.detail.name === 'first') {
			done();
		} else {
			done2();
		}
	});

	this.ads.init();
	this.ads.slots.initSlot(first);
	this.ads.slots.initSlot(second);

	clock.tick(1025);
});


QUnit.test('debug logs creatives', function(assert) {
	const first = this.fixturesContainer.add('<div data-o-ads-name="first" data-o-ads-targeting="monkey=see;monkeys=do" data-o-ads-formats="MediumRectangle"></div>');
	const second = this.fixturesContainer.add('<div data-o-ads-name="second" data-o-ads-formats="HalfPage,MediumRectangle"></div>');
	const third = this.fixturesContainer.add('<div data-o-ads-name="third" data-o-ads-formats-small="MediumRectangle" data-o-ads-formats-large="HalfPage,MediumRectangle"></div>');

	this.ads.init({
		responsive: {
			small: [0, 0],
			large: [300, 0]
		}
	});
	this.ads.slots.initSlot(first);
	this.ads.slots.initSlot(second);
	this.ads.slots.initSlot(third);

	// change slot data to make it predictable
	this.ads.slots.first.gpt.creativeId = '1234';
	this.ads.slots.first.gpt.lineItemId = '5678';
	delete this.ads.slots.second.gpt.creativeId;
	delete this.ads.slots.second.gpt.lineItemId;
	delete this.ads.slots.second.gpt.size;
	this.ads.slots.second.gpt.isEmpty = true;
	delete this.ads.slots.third.gpt.creativeId;
	delete this.ads.slots.third.gpt.lineItemId;
	delete this.ads.slots.third.gpt.size;
	this.ads.slots.third.gpt.isEmpty = false;

	const slotTableData = [{
		"name":"first",
		"unit name":"/undefined",
		"creative id":"1234",
		"line item id":"5678",
		"size":"300×250",
		"sizes":"300×250",
		"targeting":"monkey=see, monkeys=do"
	},
	{
		"name":"second",
		"unit name":"/undefined",
		"creative id":"N/A",
		"line item id":"N/A",
		"size":"empty",
		"sizes":"300×600, 300×250",
		"targeting":""
	},
	{
		"name":"third",
		"unit name":"/undefined",
		"creative id":"N/A",
		"line item id":"N/A",
		"size":"N/A",
		"sizes":"responsive slot",
		"targeting":""
	}];
	const start = this.spy(this.utils.log, 'start');
	const table = this.spy(this.utils.log, 'table');
	this.ads.slots.debug();
	assert.ok(start.calledWith('Creatives'), '`log.start` was called for `Creatives`');
	assert.ok(table.calledWith(slotTableData), '`log.table` was called with the expected data');
});

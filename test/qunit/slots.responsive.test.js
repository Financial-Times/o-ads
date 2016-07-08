/* globals QUnit: false, $: false */

'use strict'; //eslint-disable-line

QUnit.module('Responsive slots', {
	beforeEach: function() {
		window.scrollTo(0, 0);
		this.server = this.server();
		this.server.autoRespond = true;
	},

	afterEach: function() {
		window.scrollTo(0, 0);
	}
});

QUnit.test('create a slot with responsive sizes via sizes attributes', function(assert) {
	const slotHTML = '<div data-o-ads-name="mpu" data-o-ads-sizes-large="300x600,300x1050"  data-o-ads-sizes-medium="300x400, 300x600"  data-o-ads-sizes-small="false"></div>';
	const expected = { small:false, medium:[[300, 400], [300, 600]], large:[[300, 600], [300, 1050]]};
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({
		responsive: {
			small: [0, 0],
			medium: [400, 400],
			large: [600, 600]
		}
	});
	this.ads.slots.initSlot(node);
	const result = this.ads.slots.mpu;
	assert.deepEqual(result.sizes, expected, 'sizes are parsed into slot config.');
});

QUnit.test('create a slot with responsive sizes via formats attributes', function(assert) {
	const slotHTML = '<div data-o-ads-name="mpu" data-o-ads-formats-large="Leaderboard"  data-o-ads-formats-medium="MediumRectangle"  data-o-ads-formats-small="false"></div>';
	const expected = { small:false, medium:[[300, 250]], large:[[728, 90]]};
	const node = this.fixturesContainer.add(slotHTML);
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

QUnit.test('responsive slot should refresh when a new size exists for a breakpoint', function(assert) {
	const clock = this.date();
	this.viewport(700, 700);


	const slotHTML = '<div data-o-ads-name="mpu" data-o-ads-formats-large="SuperLeaderboard"  data-o-ads-formats-medium="MediumRectangle"  data-o-ads-formats-small="Billboard"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({
		responsive: {
			small: [0, 0],
			medium: [400, 400],
			large: [600, 600]
		}
	});

	this.ads.slots.initSlot(node);
	const slot = this.ads.slots.mpu;
	assert.ok(this.gpt.display.calledOnce, 'Initial ad call is made for large size.');
	let iframeSize = [slot.gpt.iframe.width, slot.gpt.iframe.height];
	assert.deepEqual(iframeSize, ['970', '90'], 'The ad slot is displayed at the correct size.');
	assert.equal(slot.container.getAttribute('data-o-ads-loaded'), 'SuperLeaderboard');
	assert.equal(this.ads.targeting.get().res, 'large');
	this.viewport(500, 500);
	window.dispatchEvent(new Event('resize'));
	clock.tick(300);
	assert.ok(this.gpt.pubads().refresh.calledOnce, 'When screen size is changed, ad call is made.');
	iframeSize = [slot.gpt.iframe.width, slot.gpt.iframe.height];
	assert.equal(slot.container.getAttribute('data-o-ads-loaded'), 'MediumRectangle');
	assert.equal(this.ads.targeting.get().res, 'medium');
	assert.deepEqual(iframeSize, ['300', '250'], 'The new size is displayed.');
	this.viewport(200,200);
	window.dispatchEvent(new Event('resize'));
	clock.tick(300);
	assert.equal(this.ads.targeting.get().res, 'small');
	assert.equal(slot.container.getAttribute('data-o-ads-loaded'), 'false');
});

QUnit.test('responsive slot should not make a call when size is false', function(assert) {
	const clock = this.date();
	this.viewport(200, 200);

	const slotHTML = '<div data-o-ads-name="mpu" data-o-ads-formats-large="Leaderboard"  data-o-ads-formats-medium="MediumRectangle"  data-o-ads-formats-small="false"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({
		responsive: {
			small: [0, 0],
			medium: [400, 400],
			large: [600, 600]
		}
	});
	this.ads.slots.initSlot(node);
	const slot = this.ads.slots.mpu;
	assert.ok(!this.gpt.display.called, 'When size is false no ad call is made.');
	assert.ok($(slot.container).hasClass('o-ads--empty'), 'The ad slot is not displayed.');

	this.viewport(500, 500);
	window.dispatchEvent(new Event('resize'));
	clock.tick(300);
	assert.ok(this.gpt.display.calledOnce, 'When screen size is changed, ad call is made.');
	assert.notOk($(slot.container).hasClass('o-ads--empty'), 'The ad slot is displayed.');

	this.viewport(700, 700);
	window.dispatchEvent(new Event('resize'));
	clock.tick(300);
	assert.ok(this.gpt.pubads().refresh.calledOnce, 'When screen size is changed to large, ad call is made.');
	assert.notOk($(slot.container).hasClass('o-ads--empty'), 'The ad slot is displayed.');

	this.viewport(200, 200);
	window.dispatchEvent(new Event('resize'));
	clock.tick(300);
	assert.ok(this.gpt.display.calledOnce, 'When screen size is change to, no ad call is made.');
	assert.ok($(slot.container).hasClass('o-ads--empty'), 'The ad slot is not displayed.');
});



QUnit.test('Responsive format type (for responsive creatives) should not refresh even when loaded in a responsive configured slot', function(assert) {
	const clock = this.date();

	this.viewport(700, 700);
	const slotHTML = '<div data-o-ads-name="mpu" data-o-ads-formats-large="Responsive"  data-o-ads-formats-medium="Responsive"  data-o-ads-formats-small="false"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({
		responsive: {
			small: [0, 0],
			medium: [400, 400],
			large: [600, 600]
		}
	});
	this.ads.slots.initSlot(node);
	const slot = this.ads.slots.mpu;
	assert.ok(this.gpt.display.calledOnce, 'Initial ad call is made.');

	//Initial ad load shows responsive ad
	let iframeSize = [slot.gpt.iframe.width, slot.gpt.iframe.height];
	assert.deepEqual(iframeSize, ['2', '2'], 'The ad slot is displayed at the correct size.');
	assert.equal(slot.container.getAttribute('data-o-ads-loaded'), 'Responsive');
	assert.equal(this.ads.targeting.get().res, 'large');

	//Resizing to medium should not make an additional call, since it is still requesting a Responsive format
	this.viewport(500, 500);
	window.dispatchEvent(new Event('resize'));
	clock.tick(300);
	assert.equal(this.gpt.pubads().refresh.callCount, 0, 'When screen size is changed no ad call is made made for Responsive format');
	iframeSize = [slot.gpt.iframe.width, slot.gpt.iframe.height];
	assert.equal(slot.container.getAttribute('data-o-ads-loaded'), 'Responsive');
	assert.equal(this.ads.targeting.get().res, 'medium');
	assert.deepEqual(iframeSize, ['2', '2'], 'The iframe size is unchanged.');
	assert.notOk($(slot.container).hasClass('o-ads--empty'), 'The ad slot is displayed.');

	//Resizing to small should collapse the ad
	this.viewport(200,200);
	window.dispatchEvent(new Event('resize'));
	clock.tick(300);
	assert.equal(this.gpt.pubads().refresh.callCount, 0, 'When screen size is changed to small (set to false) it removes the ad');
	assert.equal(this.ads.targeting.get().res, 'small');
	assert.ok($(slot.container).hasClass('o-ads--empty'), 'The ad slot is not displayed.');

	//Resizing back up to large should show the ad again
	this.viewport(700,700);
	window.dispatchEvent(new Event('resize'));
	clock.tick(300);
	assert.equal(this.ads.targeting.get().res, 'large');
	assert.notOk($(slot.container).hasClass('o-ads--empty'), 'The ad slot is displayed.');

});

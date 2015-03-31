/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

QUnit.module('utils.responsive');

QUnit.test('resizing the browser window, simple config', function (assert) {
	var clock = this.date();
	this.viewport(1, 1);

	var callback = this.stub();
	var	viewports = {
		large: [300, 200],
		medium: [200, 100],
		small: [0,0]
	};

	var responsive  = this.ads.utils.responsive(viewports, callback);

	this.viewport(201, 101);
	window.dispatchEvent(new Event('resize'));
	clock.tick(300);
	assert.ok(callback.calledOnce, 'When a breakpoint is crossed the callback function is called');
	assert.ok(callback.calledWith('medium'), 'the first arument to the callback is the expected viewport size (medium)');
	assert.equal(responsive(), 'medium', 'returns the current viewport size.');

	this.viewport(250, 101);
	window.dispatchEvent(new Event('resize'));
	clock.tick(210);
	assert.ok(callback.calledOnce, 'When the viewport is resized but a breakpoint is not crossed the callback function is not called');

	this.viewport(301, 201);
	window.dispatchEvent(new Event('resize'));
	clock.tick(210);
	assert.ok(callback.calledTwice, 'When a breakpoint is crossed the callback function is called');
	assert.ok(callback.calledWith('large'), 'the first arument to the callback is the expected viewport size (large)');
	assert.equal(responsive(), 'large', 'returns the current viewport size.');
});


QUnit.test('resizing the browser window, overlapping viewport sizes', function (assert) {
	var clock = this.date('now');
	var callback = this.spy(),
		viewports = {
			large: [300, 200],
			medium: [200, 100],
			other: [100, 200],
			small: [0,0]
		};

	this.viewport(1, 1);
	var responsive  = this.ads.utils.responsive(viewports, callback);

	this.viewport(201, 101);
	window.dispatchEvent(new Event('resize'));
	clock.tick(210);
	assert.ok(callback.calledOnce, 'When a breakpoint is crossed the callback function is called');
	assert.ok(callback.calledWith('medium'), 'the first argument to the callback is the expected viewport size (medium)');
	assert.equal(responsive(), 'medium', 'returns the current viewport size.');


	this.viewport(101, 201);
	window.dispatchEvent(new Event('resize'));
	clock.tick(210);
	assert.ok(callback.calledTwice, 'When a breakpoint is crossed the callback function is called');
	assert.ok(callback.calledWith('other'), 'the first argument to the callback is the expected viewport size (other)');
	assert.equal(responsive(), 'other', 'returns the current viewport size.');


	this.viewport(301, 201);
	window.dispatchEvent(new Event('resize'));
	clock.tick(210);
	assert.ok(callback.calledThrice, 'When a breakpoint is crossed the callback function is called');
	assert.ok(callback.calledWith('large'), 'the first argument to the callback is the expected viewport size (large)');
	assert.equal(responsive(), 'large', 'returns the current viewport size.');
});


/* jshint globalstrict: true, browser: true */
/* global QUnit: false */
"use strict";

QUnit.module('Messenger');

QUnit.test('post base context', function(assert) {
	var top = window.top || window;
	this.spy(top, 'postMessage');

	// make a default call
	this.utils.messenger.post({test: 'message'});
	assert.ok(top.postMessage.calledOnce, 'Make sure when a source is not passed to the post call it uses a default value');
	assert.ok(top.postMessage.withArgs('{"test":"message"}', '*'), 'Make post message data was stringified and source url is an *');
});

QUnit.test('post from different context', function(assert) {
	var frame = this.createDummyFrame();
	var top = window.top || window;
	this.spy(top, 'postMessage');
	this.spy(frame.window, 'postMessage');

	// make a call and pass a source
	this.utils.messenger.post('key: value', frame.window);

	assert.ok(!top.postMessage.called, 'Make sure default source postMessage has not still been called only once');
	assert.ok(frame.window.postMessage.calledOnce, 'Make sure the frame postMessage has been called');
	assert.ok(frame.window.postMessage.withArgs( 'key: value', '*'), 'Make the expected arguments are supplied');
});

QUnit.test('parse plain string', function(assert) {
	var input = 'random string';
	var output = this.utils.messenger.parse(input);

	assert.strictEqual(typeof(output), 'string', 'Make sure that output is a string');
	assert.equal(input, output, 'Make sure output is same as input');
});

QUnit.test('parse JSON string returns the equivakent JS Object', function(assert) {
	var input = '{"test": "value", "anotherKey": 2}';
	var output = this.utils.messenger.parse(input);

	assert.strictEqual(typeof(output), 'object', 'Make sure that output is an object');
	assert.deepEqual(output, {test: 'value', anotherKey: 2}, 'Make sure the returned object was parsed correctly');
});

QUnit.test('parsing an Object returns an object', function(assert) {
	var input = {"test": "value", "anotherKey": 2};
	var output = this.utils.messenger.parse(input);

	assert.strictEqual(typeof(output), 'object', 'Make sure that output is a string');
	assert.deepEqual(output, input, 'Make sure the returned object is the same as the original');
});

QUnit.test('parse Malformed JSON returns string', function(assert) {
	var input = '{"test: "value}';
	var output = this.utils.messenger.parse(input);

	assert.strictEqual(typeof(output), 'string', 'Make sure that output is a string');
	assert.equal(input, output, 'Make sure output is same as input');
});

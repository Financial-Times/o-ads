/* jshint globalstrict: true, browser: true */
/* global sinon: false, $: false, module: true, QUnit: false, require: true */
"use strict";

QUnit.module('Messenger');

QUnit.test('post', function(assert) {
	var frame = this.createPostMessageFrame();
	var top = window.top || window;
	top.postMessage = this.spy();
	frame.postMessage = this.spy();

	// make a default call
	this.utils.messenger.post({test: 'message'});

	assert.equal(window.top.postMessage.callCount, 1, 'Make sure when a source is not passed to the post call it uses a default value')
	assert.strictEqual(window.top.postMessage.firstCall.args[0], '{"test":"message"}', 'Make sure the object was transformed to a string')
	assert.equal(window.top.postMessage.firstCall.args[1], '*', 'Make sure source url is set to wildcard')

	// make a call and pass a source
	this.utils.messenger.post('key: value', frame);

	assert.equal(window.top.postMessage.callCount, 1, 'Make sure default source postMessage has still been called only once')
	assert.equal(window.postMessage.callCount, 1, 'Make sure the main window postMessage has been called')
	assert.strictEqual(window.postMessage.firstCall.args[0], 'key: value', 'Make sure the string remain a string')
	assert.equal(window.postMessage.firstCall.args[1], '*', 'Make sure source url is set to wildcard')

});

QUnit.test('parse', function(assert) {
	var input1 = 'random string';
	var output1 = this.utils.messenger.parse(input1);

	var input2 = '{"test": "value", "anotherKey": 2}';
	var output2 = this.utils.messenger.parse(input2);

	var input3 = '{"test: "value}';
	var output3 = this.utils.messenger.parse(input3);

	assert.strictEqual(typeof(output1), 'string', 'Make sure that output1 is a string');
	assert.equal(input1, output1, 'Make sure output is same as input')

	assert.strictEqual(typeof(output2), 'object', 'Make sure that output3 is a string');
	assert.deepEqual(output2, {test: 'value', anotherKey: 2}, 'Make sure the returned object was parsed correctly')

	assert.strictEqual(typeof(output3), 'string', 'Make sure that output3 is a string');
	assert.equal(input3, output3, 'Make sure output is same as input')

});

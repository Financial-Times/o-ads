/* jshint globalstrict: true */
/* globals QUnit: false */
"use strict";

QUnit.module('utils.queue');

QUnit.test('We can create a queue', function (assert) {
	var queue = this.ads.utils.queue();
	assert.ok(queue instanceof this.ads.utils.queue, 'it is a queue without new');
	queue = new this.ads.utils.queue();
	assert.ok(queue instanceof this.ads.utils.queue, 'it is a queue with new');
});

QUnit.test('We can add things to the queue', function (assert) {
	var queue = this.ads.utils.queue();
	assert.equal(queue.items, 0, 'the queue is empty');

	queue.add('hello');
	assert.equal(queue.items.length, 1, 'an item is added');
	assert.equal(queue.items[0], 'hello', 'the item is what we added');
});


QUnit.test('We can set and override the processor', function (assert) {
	var ourProcessor = this.spy();
	var overrideProcessor = this.spy();
	var queue = this.ads.utils.queue(ourProcessor);
	assert.equal(queue.processor, ourProcessor, 'the processor is our processor');

	queue.setProcessor(overrideProcessor);
	assert.equal(queue.processor, overrideProcessor, 'the processor is overriden');
});

QUnit.test('We can process the queue with our processor', function (assert) {
	var ourProcessor = this.spy();
	var queue = this.ads.utils.queue(ourProcessor);
	queue.add('hello');
	queue.process();
	assert.ok(ourProcessor.calledOnce, 'our processor is called once');
	assert.ok(ourProcessor.withArgs('hello'), 'our processor is called with the correct args');

	ourProcessor.reset();
	var multiple = this.ads.utils.queue(ourProcessor);
	multiple.add('hello');
	multiple.add('welcome');
	multiple.process();
	assert.ok(ourProcessor.calledTwice, 'our processor is called twice');
	assert.ok(ourProcessor.withArgs('hello'), 'our processor is called with the first item');
	assert.ok(ourProcessor.withArgs('welcome'), 'our processor is called with the second item');
});

QUnit.test('Items added after processing are automatically called', function (assert){
	var ourProcessor = this.spy();
	var queue = this.ads.utils.queue(ourProcessor);
	queue.process();
	queue.add('hello');
	assert.ok(ourProcessor.calledOnce, 'our processor is called once');
	assert.ok(ourProcessor.withArgs('hello'), 'our processor is called with the correct args');
});

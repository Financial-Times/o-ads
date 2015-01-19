/* jshint strict: false */
/* globals  FT, asyncTest: false, deepEqual: false, equal: false, expect: false, module: false, notDeepEqual: false, notEqual: false, notStrictEqual : false, ok: false, QUnit: false, raises: false, start: false, stop: false, strictEqual: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn of use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, document, $, undefined) {
    function runTests() {
        QUnit.module('FT._ads.utils.queue');

        test('We can create a queue', function () {
            expect(2);
            var queue = FT._ads.utils.queue();
            ok(queue instanceof FT._ads.utils.queue, 'it is a queue with new');
            queue = new FT._ads.utils.queue();
            ok(queue instanceof FT._ads.utils.queue, 'it is a queue without new');
        });

        test('We can add things to the queue', function () {
            expect(3);
            var queue = FT._ads.utils.queue();
            equal(queue.items, 0, 'the queue is empty');

            queue.add('hello');
            equal(queue.items.length, 1, 'an item is added');
            equal(queue.items[0], 'hello', 'the item is what we added');
        });


        test('We can set and override the processor', function () {
            expect(2);

            var ourProcessor = sinon.spy();
            var overrideProcessor = sinon.spy();
            var queue = FT._ads.utils.queue(ourProcessor);
            equal(queue.processor, ourProcessor, 'the processor is our processor');

            queue.setProcessor(overrideProcessor);
            equal(queue.processor, overrideProcessor, 'the processor is our processor');
        });

        test('We can process the queue with our processor', function () {
            expect(5);
            var ourProcessor = sinon.spy();
            var queue = FT._ads.utils.queue(ourProcessor);
            queue.add('hello');
            queue.process();
            ok(ourProcessor.calledOnce, 'our processor is called once');
            ok(ourProcessor.withArgs('hello'), 'our processor is called with the correct args');

            ourProcessor.reset();
            var multiple = FT._ads.utils.queue(ourProcessor);
            multiple.add('hello');
            multiple.add('welcome');
            multiple.process();
            ok(ourProcessor.calledTwice, 'our processor is called twice');
            ok(ourProcessor.withArgs('hello'), 'our processor is called with the first item');
            ok(ourProcessor.withArgs('welcome'), 'our processor is called the second item');
        });

        test('Items added after processing are automatically called', function (){
            expect(2);
            var ourProcessor = sinon.spy();
            var queue = FT._ads.utils.queue(ourProcessor);
            queue.process();
            queue.add('hello');
            ok(ourProcessor.calledOnce, 'our processor is called once');
            ok(ourProcessor.withArgs('hello'), 'our processor is called with the correct args');
        });
    }

    $(runTests);
}(window, document, jQuery));

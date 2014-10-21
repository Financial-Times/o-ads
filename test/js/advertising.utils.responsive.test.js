/* jshint strict: false */
/* globals  FT, sinon: true, asyncTest: false, deepEqual: false, equal: false, expect: false, module: false, notDeepEqual: false, notEqual: false, notStrictEqual : false, ok: false, QUnit: false, raises: false, start: false, stop: false, strictEqual: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn of use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, document, $, undefined) {
    function responsiveTests (){
        var clock;

        QUnit.module('FT._ads.utils.responsive', {
            setup: function () {
                clock = sinon.useFakeTimers();
            },
            teardown: function () {
                clock.restore();
            }
        });

        function triggerResize(){
            var event;
            if (document.createEvent) {
                event = document.createEvent("HTMLEvents");
                event.initEvent("resize", true, true);
                window.dispatchEvent(event);
            } else {
                event = document.createEventObject();
                event.eventType = "resize";
                document.body.fireEvent("on" + event.eventType, event);
            }
        }

        test('resizing the browser window, simple config', function () {
            expect(7);
            var callback = sinon.stub(),
                viewports = {
                    large: [300, 200],
                    medium: [200, 100],
                    small: [0,0]
                };

            TEST.mock.viewport(1, 1);
            var responsive  = FT._ads.utils.responsive(viewports, callback);

            TEST.mock.viewport(201, 101);
            triggerResize();
            clock.tick(210);
            ok(callback.calledOnce, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('medium'), 'the first arument to the callback is the expected viewport size (medium)');
            equal(responsive(), 'medium', 'returns the current viewport size.');

            TEST.mock.viewport(250, 101);
            triggerResize();
            clock.tick(210);
            ok(callback.calledOnce, 'When the viewport is resized but a breakpoint is not crossed the callback function is not called');

            TEST.mock.viewport(301, 201);
            triggerResize();
            clock.tick(210);
            ok(callback.calledTwice, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('large'), 'the first arument to the callback is the expected viewport size (large)');
            equal(responsive(), 'large', 'returns the current viewport size.');
        });

        test('resizing the browser window, overlapping viewport sizes', function () {
            expect(9);
            var callback = sinon.spy(),
                viewports = {
                    large: [300, 200],
                    medium: [200, 100],
                    other: [100, 200],
                    small: [0,0]
                };

            TEST.mock.viewport(1, 1);
            var responsive  = FT._ads.utils.responsive(viewports, callback);

            TEST.mock.viewport(201, 101);
            triggerResize();
            clock.tick(210);
            ok(callback.calledOnce, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('medium'), 'the first arument to the callback is the expected viewport size (medium)');
            equal(responsive(), 'medium', 'returns the current viewport size.');


            TEST.mock.viewport(101, 201);
            triggerResize();
            clock.tick(210);
            ok(callback.calledTwice, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('other'), 'the first arument to the callback is the expected viewport size (other)');
            equal(responsive(), 'other', 'returns the current viewport size.');


            TEST.mock.viewport(301, 201);
            triggerResize();
            clock.tick(210);
            ok(callback.calledThrice, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('large'), 'the first arument to the callback is the expected viewport size (large)');
            equal(responsive(), 'large', 'returns the current viewport size.');
        });
    }

   $(responsiveTests);
}(window, document, jQuery));

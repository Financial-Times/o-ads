(function (window, document, $, undefined) {
    function responsiveTests (){
        var clock;

        module('FT._ads.utils.responsive', {
            setup: function () {
                clock = sinon.useFakeTimers();
            },
            teardown: function () {
                clock.restore();
            }
        });

        function mockViewportSize(width, height) {
            //d = document.documentElement || document.body;
            window.innerWidth = width;
            window.innerHeight = height;
            //d.clientWidth = width;
            //d.clientHeight = height;
        }

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
            expect(5);
            var callback = sinon.spy(),
                viewports = {
                    large: [300, 200],
                    medium: [200, 100],
                    small: [0,0]
                };

            mockViewportSize(1, 1);
            FT._ads.utils.responsive(viewports, callback);

            mockViewportSize(201, 101);
            triggerResize();
            clock.tick(210);
            ok(callback.calledOnce, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('medium'), 'the first arument to the callback is the expected viewport size (medium)');

            mockViewportSize(250, 101);
            triggerResize();
            clock.tick(210);
            ok(callback.calledOnce, 'When the viewport is resized but a breakpoint is not crossed the callback function is not called');

            mockViewportSize(301, 201);
            triggerResize();
            clock.tick(210);
            ok(callback.calledTwice, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('large'), 'the first arument to the callback is the expected viewport size (large)');

        });

        test('resizing the browser window, overlapping viewport sizes', function () {
            expect(6);
            var callback = sinon.spy(),
                viewports = {
                    large: [300, 200],
                    medium: [200, 100],
                    other: [100, 200],
                    small: [0,0]
                };

            mockViewportSize(1, 1);
            FT._ads.utils.responsive(viewports, callback);

            mockViewportSize(201, 101);
            triggerResize();
            clock.tick(210);
            ok(callback.calledOnce, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('medium'), 'the first arument to the callback is the expected viewport size (medium)');

            mockViewportSize(101, 201);
            triggerResize();
            clock.tick(210);
            ok(callback.calledTwice, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('other'), 'the first arument to the callback is the expected viewport size (other)');

            mockViewportSize(301, 201);
            triggerResize();
            clock.tick(210);
            ok(callback.calledThrice, 'When a breakpoint is crossed the callback function is called');
            ok(callback.calledWith('large'), 'the first arument to the callback is the expected viewport size (large)');
        });
    }

   $(responsiveTests);
}(window, document, jQuery));

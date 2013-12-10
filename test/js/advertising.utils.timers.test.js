(function (window, document, $, undefined) {
    "use strict";

    function runTests() {
        module('FT._ads.utils.timers');


        test('Timer', function () {
            TEST.mock.date('now');

            var method = sinon.spy(),
            timer = FT._ads.utils.timers.create(1, method, 3),
            stop = sinon.spy(timer, 'stop');

            TEST.sinon.clock.tick(1025);
            ok(method.calledOnce, 'Tick: the method is called on the first tick');

            timer.pause();
            equal(timer.timeLeft, 975, "Pause: timer left to next tick is calculated correctly");
            equal(timer.id, undefined, 'Pause: the timeout is canceled');
            TEST.sinon.clock.tick(4000);
            ok(method.calledOnce, "Pause: when the timer is paused the method doesn't run");


            timer.resume();
            TEST.sinon.clock.tick(980);
            ok(method.calledTwice, "Resume: on resume the method is run after the amount of time left");
            TEST.sinon.clock.tick(1010);

            ok(stop.calledOnce, 'Stop: the stop method is called');
            equal(timer.id, undefined, 'Stop: the timeout is canceled');

            TEST.sinon.clock.reset();
            method.reset();
            timer.start();
            TEST.sinon.clock.tick(1025);

            timer.stop();
            equal(timer.id, undefined, 'Stop: the timeout is canceled');
            strictEqual(timer.ticks, 0, 'Stop: ticks are reset');

            TEST.sinon.clock.tick(4000);
            ok(method.calledOnce, 'Stop: the method is no longer called');


            timer.start();
            TEST.sinon.clock.tick(1300);
            timer.pause();
            equal(timer.timeLeft, 700, "Pause: time left to next tick is calculated correctly");
            timer.stop();
            equal(timer.timeLeft, undefined, "Stop: time left is deleted");
            ok(!timer.resume(), 'Stop: when stopped the timer cannot be resumed');
            equal(timer.id, undefined, 'Stop: the timeout is canceled');
        });

        test('Timers', function () {
            TEST.mock.date('now');

            var method1 = sinon.spy(),
            method2 = sinon.spy(),
            method3 = sinon.spy(),
            timer1 = FT._ads.utils.timers.create(1, method1, 3),
            timer2 = FT._ads.utils.timers.create(1, method2, 3),
            timer3 = FT._ads.utils.timers.create(1, method3, 3);

            FT._ads.utils.timers.pauseall();
            equal(timer1.id, undefined, 'Pause all: timer 1 canceled');
            equal(timer2.id, undefined, 'Pause all: timer 2 canceled');
            equal(timer3.id, undefined, 'Pause all: timer 3 canceled');
            equal(timer1.timeLeft, 1000, 'Pause all: timer 1 time left calculated correctly');
            equal(timer2.timeLeft, 1000, 'Pause all: timer 2 time left calculated correctly');
            equal(timer3.timeLeft, 1000, 'Pause all: timer 3 time left calculated correctly');

            TEST.sinon.clock.tick(4000);
            ok(!method1.called, "Pause all: method 1 didn't run");
            ok(!method2.called, "Pause all: method 2 didn't run");
            ok(!method3.called, "Pause all: method 3 didn't run");


            FT._ads.utils.timers.resumeall();
            TEST.sinon.clock.tick(1200);
            ok(!!timer1.id, 'Resume all: timer 1 resumed');
            ok(!!timer2.id, 'Resume all: timer 2 resumed');
            ok(!!timer3.id, 'Resume all: timer 3 resumed');
            ok(method1.calledOnce, "Resume all: method 1 ran");
            ok(method2.calledOnce, "Resume all: method 2 ran");
            ok(method3.calledOnce, "Resume all: method 3 ran");

            FT._ads.utils.timers.stopall();
            equal(timer1.id, undefined, 'Stop all: timer 1 canceled');
            equal(timer2.id, undefined, 'Stop all: timer 2 canceled');
            equal(timer3.id, undefined, 'Stop all: timer 3 canceled');
            TEST.sinon.clock.tick(4000);
            ok(method1.calledOnce, "Stop all: method 1 didn't run again");
            ok(method2.calledOnce, "Stop all: method 2 didn't run again");
            ok(method3.calledOnce, "Stop all: method 3 didn't run again");
        });
    }

    $(runTests);
}(window, document, jQuery));

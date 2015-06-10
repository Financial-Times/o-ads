/* jshint globalstrict: true */
/* globals QUnit: false */
"use strict";

QUnit.module('utils.timers');

QUnit.test('Timer', function(assert) {
	var clock = this.date('now');
	var method = this.spy();

	var timer = this.ads.utils.timers.create(1, method, 3);
	var stop = this.spy(timer, 'stop');

	clock.tick(1025);
	assert.ok(method.calledOnce, 'Tick: the method is called on the first tick');

	timer.pause();
	assert.equal(timer.timeLeft, 975, "Pause: time left to next tick is calculated correctly");
	assert.equal(timer.id, undefined, 'Pause: the timeout is canceled');
	clock.tick(4000);
	assert.ok(method.calledOnce, "Pause: when the timer is paused the method doesn't run");

	timer.resume();
	clock.tick(980);
	assert.ok(method.calledTwice, "Resume: on resume the method is run after the amount of time left");
	clock.tick(1010);

	assert.ok(stop.calledOnce, 'Stop: the stop method is called');
	assert.equal(timer.id, undefined, 'Stop: the timeout is canceled');

	clock.reset();
	method.reset();
	timer.start();
	clock.tick(1025);

	timer.stop();
	assert.equal(timer.id, undefined, 'Stop: the timeout is canceled');
	assert.strictEqual(timer.ticks, 0, 'Stop: ticks are reset');

	clock.tick(4000);
	assert.ok(method.calledOnce, 'Stop: the method is no longer called');

	timer.start();
	clock.tick(1300);
	timer.pause();
	assert.equal(timer.timeLeft, 700, "Pause: time left to next tick is calculated correctly");
	timer.stop();
	assert.equal(timer.timeLeft, undefined, "Stop: time left is deleted");
	assert.ok(!timer.resume(), 'Stop: when stopped the timer cannot be resumed');
	assert.equal(timer.id, undefined, 'Stop: the timeout is canceled');
});

QUnit.test('Timers', function(assert) {
	var clock = this.date('now');

	var method1 = this.spy();
	var method2 = this.spy();
	var method3 = this.spy();
	var timer1 = this.ads.utils.timers.create(1, method1, 3);
	var timer2 = this.ads.utils.timers.create(1, method2, 3);
	var timer3 = this.ads.utils.timers.create(1, method3, 3);

	clock.tick(25);
	this.ads.utils.timers.pauseall();
	assert.equal(timer1.id, undefined, 'Pause all: timer 1 canceled');
	assert.equal(timer2.id, undefined, 'Pause all: timer 2 canceled');
	assert.equal(timer3.id, undefined, 'Pause all: timer 3 canceled');
	assert.equal(timer1.timeLeft, 975, 'Pause all: timer 1 time left calculated correctly');
	assert.equal(timer2.timeLeft, 975, 'Pause all: timer 2 time left calculated correctly');
	assert.equal(timer3.timeLeft, 975, 'Pause all: timer 3 time left calculated correctly');

	clock.tick(4000);
	assert.ok(!method1.called, "Pause all: method 1 didn't run");
	assert.ok(!method2.called, "Pause all: method 2 didn't run");
	assert.ok(!method3.called, "Pause all: method 3 didn't run");

	this.ads.utils.timers.resumeall();
	assert.ok(!!timer1.id, 'Resume all: timer 1 resumed');
	assert.ok(!!timer2.id, 'Resume all: timer 2 resumed');
	assert.ok(!!timer3.id, 'Resume all: timer 3 resumed');
	clock.tick(1200);
	assert.ok(method1.calledOnce, "Resume all: method 1 ran");
	assert.ok(method2.calledOnce, "Resume all: method 2 ran");
	assert.ok(method3.calledOnce, "Resume all: method 3 ran");

	this.ads.utils.timers.stopall();
	assert.equal(timer1.id, undefined, 'Stop all: timer 1 canceled');
	assert.equal(timer2.id, undefined, 'Stop all: timer 2 canceled');
	assert.equal(timer3.id, undefined, 'Stop all: timer 3 canceled');
	clock.tick(4000);
	assert.ok(method1.calledOnce, "Stop all: method 1 didn't run again");
	assert.ok(method2.calledOnce, "Stop all: method 2 didn't run again");
	assert.ok(method3.calledOnce, "Stop all: method 3 didn't run again");
});

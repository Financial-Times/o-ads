/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Krux', {
	beforeEach: function () {
		window.Krux = this.stub();
	},
	afterEach: function () {
		delete window.Krux;
	}
});


QUnit.test( "control tag is attached when initialised", function (assert) {
	this.ads.init({krux: {id: 'hello'}});
	assert.ok(this.ads.utils.attach.withArgs('oxnso'), 'the krux control tag file is attached to the page');
});

QUnit.test('targeting data is generated correctly from localStorage', function (assert) {
	var kruxData = { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'};
	var localstorageMock = this.localStorage(kruxData);
	if (localstorageMock) {
		this.ads.init({ krux: { krux: {id: '112233'}}});
		var result = this.ads.krux.targeting();
		assert.deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "segments in localStorage returned correctly");
		assert.equal(result.kuid, kruxData.kxuser, "user id returned correctly from localStorage");
		assert.equal(result.khost, encodeURIComponent(location.hostname), "host returned correctly");
		assert.equal(result.bht, "true", "Behavioural flag is set, when local storage is used");
	} else {
		assert.ok(true, 'localStorage unavailable or unmockable in this browser');
		this.warn('Test skipped due to lack of localStorage support!');
	}
});

QUnit.test('targeting data is generated correctly from cookies', function (assert) {
	this.cookies({ kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'});
	this.ads.init({ krux: {id: '112233'}});

	var result = this.ads.krux.targeting();
	assert.deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "returns segments from cookies");
	assert.equal(result.khost, encodeURIComponent(location.hostname), "host returned correctly");
	assert.equal(result.bht, "true", "Behavioural flag is set, when cookies are used");
});

QUnit.test('number of Krux segments can be limited', function (assert) {
	this.cookies({ kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'});
	this.ads.init({ krux: {id: '112233', limit: 2}});

	var result = this.ads.krux.targeting();
	assert.deepEqual(result.ksg, ["seg1", "seg2"], "returns 2 segments");
});


QUnit.test('event pixels', function (assert) {
	this.ads.init({ krux: {id: '112233'}});
	var eventId = 'crunch',
		attrs = {snap: 'crackle'};

	this.ads.krux.events.fire(eventId);
	assert.ok(window.Krux.calledWith('admEvent', eventId), 'firing an event works!');

	this.ads.krux.events.fire(eventId, attrs);
	assert.ok(window.Krux.calledWith('admEvent', eventId, attrs), 'firing an event with attributes works!');
});

QUnit.test('events on DOM elements ', function(assert){
	if (document.addEventListener){
		this.ads.init({
			krux: {
				id: '112233',
				events: {
					delegated: {
						shareTwitter : {
							selector : '#' + this.fixturesContainer.id,
							eType: 'click',
							id : 'xyz'
						}
					}
				}
			}
		});

		this.ads.krux.events.init();
		this.trigger(window, 'load');
		this.trigger(this.fixturesContainer, 'click');
		assert.ok(window.Krux.calledWith('admEvent', 'xyz'), 'dom delegated event fired');
	} else {
		assert.ok(true, 'Browser does not support standard event listeners');
	}
});

QUnit.test('event pixel - dwell time', function (assert) {
	var dwellTimeId = 'dwell-time';
	var dwellTimeInterval = 10;
	var dwellTimeTotal = 30;
	var clock = this.date();

	this.ads.init({
		krux: {
			id: '112233',
			events: {
				dwell_time: {
					interval: dwellTimeInterval,
					id: dwellTimeId,
					total: dwellTimeTotal
				}
			}
		}
	});

	clock.tick(11000);
	assert.ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: 10}), 'fired after first interval');

	clock.tick(11000);
	assert.ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: 20}), 'fired after second interval');

	clock.tick(41000);
	assert.ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: 10}), 'if js execution is paused the event resets');

	clock.tick(11000);
	assert.ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: 20}), 'fired after second interval');

	clock.tick(11000);
	assert.ok(window.Krux.neverCalledWith('admEvent', {dwell_time: 30}), 'fired after third interval');

	clock.tick(11000);
	assert.ok(window.Krux.neverCalledWith('admEvent', {dwell_time: 40}), 'doesn\'t fire once max interval is reached');
});

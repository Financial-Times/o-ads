/* globals QUnit: false */

'use strict'; //eslint-disable-line

QUnit.module('Krux', {
	beforeEach: function() {
		window.requestIdleCallback = function(cb) { cb(); };
		window.Krux = this.stub();
	},
	afterEach: function() {
		delete window.Krux;
	}
});

QUnit.test("control tag is attached when initialised", function(assert) {
	this.ads.init({krux: {id: 'hello'}});
	const clock = this.date();
	clock.tick(1001);
	assert.ok(this.ads.utils.attach.withArgs('oxnso'), 'the krux control tag file is attached to the page');
});

QUnit.test('sets global Krux if one is not available yet', function(assert) {
	delete window.Krux;
	this.ads.init({ krux: {id: '112233', attributes: {page: {uuid: '123'}} }});
	assert.ok((window.Krux), 'Krux is set in the init');
});

QUnit.test('adds a script from url when location contains krux src', function(assert) {
	this.stub(this.utils, 'getLocation').returns('http://domain/?kxsrc=http%3A%2F%2Fcdn.krxd.net%3A123%2F');
	this.stub(this.utils, 'broadcast');
	const clock = this.date();
	this.ads.init({ krux: {id: '112233', attributes: {page: {uuid: '123'}} }});
	clock.tick(1001);
	assert.ok(this.attach.calledWith('http://cdn.krxd.net:123/', true), 'the krux script has been added to the page');
	assert.ok(this.utils.broadcast.calledWith('kruxScriptLoaded'));
});

QUnit.test('adds Krux script after a timeout if requestIdleCallback doesn\'t exist', function(assert) {
	this.stub(this.utils, 'getLocation').returns('http://domain/?kxsrc=http%3A%2F%2Fcdn.krxd.net%3A123%2F');
	this.stub(this.utils, 'broadcast');
	delete window.requestIdleCallback;
	const clock = this.date();
	this.ads.init({ krux: {id: '112233', attributes: {page: {uuid: '123'}} }});
	clock.tick(1001);
	assert.ok(this.attach.calledWith('http://cdn.krxd.net:123/', true), 'the krux script has been added to the page');
	assert.ok(this.utils.broadcast.calledWith('kruxScriptLoaded'));
});

QUnit.test('does not add a script from url when location contains krux src that is set to disable', function(assert) {
	this.stub(this.utils, 'getLocation').returns('http://domain/?kxsrc=disable');
	const clock = this.date();
	this.ads.init({ krux: {id: '112233', attributes: {page: {uuid: '123'}} }});
	clock.tick(1001);
	assert.ok(this.attach.calledWith('', true), 'the url passed to attach is empty');
});

QUnit.test('targeting data is generated correctly from localStorage', function(assert) {
	const kruxData = { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'};
	const localstorageMock = this.localStorage(kruxData);
	if (localstorageMock) {
		this.ads.init({ krux: { krux: {id: '112233'}}});
		const result = this.ads.krux.targeting();
		assert.deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "segments in localStorage returned correctly");
		assert.equal(result.kuid, kruxData.kxuser, "user id returned correctly from localStorage");
		assert.equal(result.khost, encodeURIComponent(location.hostname), "host returned correctly");
		assert.equal(result.bht, "true", "Behavioural flag is set, when local storage is used");
	} else {
		assert.ok(true, 'localStorage unavailable or unmockable in this browser');
		this.warn('Test skipped due to lack of localStorage support!');
	}
});

QUnit.test('targeting data is generated correctly from cookies', function(assert) {
	this.cookies({ kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'});
	this.ads.init({ krux: {id: '112233'}});

	const result = this.ads.krux.targeting();
	assert.deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "returns segments from cookies");
	assert.equal(result.khost, encodeURIComponent(location.hostname), "host returned correctly");
	assert.equal(result.bht, "true", "Behavioural flag is set, when cookies are used");
});

QUnit.test('number of Krux segments can be limited', function(assert) {
	this.cookies({ kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'});
	this.ads.init({ krux: {id: '112233', limit: 2}});

	const result = this.ads.krux.targeting();
	assert.deepEqual(result.ksg, ["seg1", "seg2"], "returns 2 segments");
});

QUnit.test('event pixels', function(assert) {
	this.ads.init({ krux: {id: '112233'}});
	const eventId = 'crunch';
	const attrs = {snap: 'crackle'};

	this.ads.krux.events.fire(eventId);
	assert.ok(window.Krux.calledWith('admEvent', eventId), 'firing an event works!');

	this.ads.krux.events.fire(eventId, attrs);
	assert.ok(window.Krux.calledWith('admEvent', eventId, attrs), 'firing an event with attributes works!');
});

QUnit.test('event pixels event not fire if no id is passed', function(assert) {
	this.ads.krux.events.fire();
	assert.notOk(window.Krux.calledOnce, 'does not fire and event');
});

QUnit.test('events on DOM elements ', function(assert) {
	if (document.addEventListener) {
		this.ads.init({
			krux: {
				id: '112233',
				events: {
					delegated: {
						shareTwitter: {
							selector: '#' + this.fixturesContainer.id,
							eType: 'click',
							id: 'xyz'
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

QUnit.test('event pixel - dwell time', function(assert) {
	const dwellTimeId = 'dwell-time';
	const dwellTimeInterval = 10;
	const dwellTimeTotal = 30;
	const clock = this.date();

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

	clock.tick(1001);

	clock.tick(11000);
	assert.ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: 10}), 'fired after first interval');

	clock.tick(11000);
	assert.ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: 20}), 'fired after second interval');

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

QUnit.test('event pixel - dwell time defaults', function(assert) {
	const dwellTimeId = 'dwell-time-default';
	const clock = this.date();

	this.ads.init({
		krux: {
			id: '112233',
			events: {
				dwell_time: {
					id: dwellTimeId,
				}
			}
		}
	});

	clock.tick(1001);
	clock.tick(5100);
	assert.ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: 5}), 'fired after first interval');

	clock.tick(1400000);
	assert.ok(window.Krux.calledWith('admEvent', dwellTimeId, {dwell_time: 600}), 'fired the maximum interval');
	assert.ok(window.Krux.neverCalledWith('admEvent', dwellTimeId, {dwell_time: 605}), 'doesn\'t fire once max interval is reached');
});

QUnit.test('page attributes are set correctly and sent to Krux', function(assert) {
	this.ads.init({ krux: {id: '112233', attributes: {page: {uuid: '123'}} }});

	assert.ok(window.Krux.withArgs("set", "page_attr_uuid", "123").calledOnce, "page attributes sent to Krux");
});

QUnit.test('user attributes are set correctly and sent to Krux', function(assert) {
	this.ads.init({ krux: {id: '112233', attributes: {user: {eid: '123'}} }});

	assert.ok(window.Krux.withArgs("set", "user_attr_eid", "123").calledOnce, "user attributes sent to Krux");
});

QUnit.test('custom attributes are set correctly and sent to Krux', function(assert) {
	this.ads.init({ krux: {id: '112233', attributes: {custom: {test: '123'}} }});

	assert.ok(window.Krux.withArgs("set", "test", "123").calledOnce, "custom attributes sent to Krux");
});

QUnit.test('page & user attributes are set correctly and sent to Krux', function(assert) {
	this.ads.init({ krux: {id: '112233', attributes: {page: {uuid: '123'}, user: {eid: '456'}, custom: {test: '789'}} }});

	assert.ok(window.Krux.withArgs("set", "page_attr_uuid", "123").calledOnce, "page attributes sent to Krux");
	assert.ok(window.Krux.withArgs("set", "user_attr_eid", "456").calledOnce, "user attributes sent to Krux");
	assert.ok(window.Krux.withArgs("set", "test", "789").calledOnce, "custom attributes sent to Krux");
	assert.ok(window.Krux.calledThrice, "Three calls made to Krux");
});

QUnit.test('debug returns early if no config is set', function(assert) {
	this.ads.init();
	const start = this.spy(this.utils.log, "start");

	this.ads.krux.debug();
	assert.notOk(start.called, "`utils.start` wasn't called for 'Krux'");
});

QUnit.test('debug starts logging Krux data', function(assert) {
	this.ads.init({krux: {}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.krux.debug();
	assert.ok(start.calledWith('Krux©'), "`utils.start` was called for 'Krux'");
	assert.ok(start.calledWith('Targeting'), "`utils.start` was called for 'Targeting'");
});

QUnit.test("debug doesn't log attributes data if none is set", function(assert) {
	this.ads.init({krux: {}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.krux.debug();
	assert.notOk(start.calledWith('Attributes'), "`utils.start` was called for 'Attributes'");
});

QUnit.test("debug logs attributes data if set", function(assert) {
	this.ads.init({krux: {attributes: {page: {}, user: {}, custom: {}}}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.krux.debug();
	assert.ok(start.calledWith('Attributes'), "`utils.start` was called for 'Attributes'");
	assert.ok(start.calledWith('Page'), "`utils.start` was called for 'Page'");
	assert.ok(start.calledWith('User'), "`utils.start` was called for 'User'");
	assert.ok(start.calledWith('Custom'), "`utils.start` was called for 'Custom'");
});

QUnit.test("debug doesn't log events data if none is set", function(assert) {
	this.ads.init({krux: {}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.krux.debug();
	assert.notOk(start.calledWith('Events'), "`utils.start` wasn't called for 'Events'");
});

QUnit.test("debug logs events data if set", function(assert) {
	this.ads.init({krux: {events: {}}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.krux.debug();
	assert.ok(start.calledWith('Events'), "`utils.start` was called for 'Events'");
	assert.ok(start.calledWith('Delegated'), "`utils.start` was called for 'Delegated'");
});

QUnit.test("debug doesn't log dwell time data if none is set", function(assert) {
	this.ads.init({krux: {events: {}}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.krux.debug();
	assert.notOk(start.calledWith('Dwell Time'), "`utils.start` wasn't called for 'Dwell Time'");
});

QUnit.test("debug logs dwell time data if set", function(assert) {
	this.ads.init({krux: {events: {dwell_time: {}}}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.krux.debug();
	assert.ok(start.calledWith('Dwell Time'), "`utils.start` was called for 'Dwell Time'");
});

QUnit.test('debug logs number of supertag scripts', function(assert) {
	this.fixturesContainer.add('<div class="kxinvisible"></div>');
	this.fixturesContainer.add('<div class="kxinvisible"></div>');
	this.ads.init({krux: {events: {dwell_time: {}}}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.krux.debug();
	assert.ok(start.calledWith('2 Supertag© scripts'), 'logs correct number of scripts');
});

QUnit.test("debug logs segment limit data if set", function(assert) {
	this.ads.init({krux: {limit: 10}});
	const log = this.spy(this.utils, 'log');

	this.ads.krux.debug();
	assert.ok(log.calledWith('%c segment limit:'), "segment limit was logged'");
});

/* jshint globalstrict: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Adamantx', {
	beforeEach: function () {
		this.server = this.server();
	}
});

QUnit.test('decorate InitSlot', function (assert) {
	this.ads.config.init(this.ads);
	this.ads.admantx.init(this.ads);
	this.ads.admantx.decorateInitSlot();
	assert.equal(this.ads.slots.initSlot, this.ads.admantx.initSlotDecorator, 'InitSlot is decorated with the correct method');
});

QUnit.test('process categories', function (assert) {
	var given = [
		{ "name": "US", "origin": "NORMAL", "score": 12, "type": "MAINLEMMAS" },
		{ "name": "Boris Johnson", "origin": "NORMAL", "score": 10, "type": "PEOPLE" },
		{ "name": "London", "origin": "NORMAL", "score": 8, "type": "PLACES" },
		{ "name": "United States of America", "origin": "NORMAL", "score": 7, "type": "PLACES" },
		{ "name": "tax bill", "origin": "NORMAL", "score": 6,  "type": "MAINLEMMAS"}
	];
	var returns = ["US", "Boris Johnson", "London", "United States of America", "tax bill"];
	assert.deepEqual(this.ads.admantx.processCollection(given), returns, 'Given a set from Adamantx and no max argument returns all name nodes');
	assert.deepEqual(this.ads.admantx.processCollection(given, true), returns, 'Given a set from Adamantx and a boolean max argument returns all name nodes');

	returns = ["US", "Boris Johnson", "London"];
	assert.deepEqual(this.ads.admantx.processCollection(given, 3), returns, 'Given a set from Adamantx and a numerical max argument returns the correct number of name nodes');
});

QUnit.test('resolve', function (assert) {
	var given = JSON.stringify(require('../fixtures/admantx-response.json'));
	this.ads.config.init(this.ads);
	this.ads.targeting.init(this.ads);
	this.ads.config({
		admantx: {
			id: 'someAdmantxID',
			collections: {
				admants: 3
			}
		}
	});

	this.ads.admantx.init(this.ads);
	var targetingAdd = this.spy(this.ads.targeting.add);
	var queueProcess = this.stub(this.ads.admantx.queue, 'process');

	this.ads.admantx.resolve(given);
	assert.ok(targetingAdd.withArgs({ ad: ["Professional Education", "car_lifestyle", "joy_saving", "mercedes_fashion", "safe_choices", "share_promise"]}), 'all admants are added to targeting with ad as the key');
	assert.ok(queueProcess.calledOnce, 'the queue of slots is process');

	this.ads.config({
		admantx: {
			id: 'someAdmantxID',
			collections: {
				admants: 3
			}
		}
	});

	this.ads.admantx.init(this.ads);
	this.ads.admantx.resolve(given);
	assert.ok(targetingAdd.withArgs({ ad: ["Professional Education", "car_lifestyle", "joy_saving"]}), '3 admants are added to targeting with ad as the key');
	assert.ok(queueProcess.calledOnce, 'the queue of slots is process');
});

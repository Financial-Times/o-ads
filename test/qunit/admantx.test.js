/* jshint globalstrict: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Adamantx', {
	beforeEach: function() {
		this.server = this.server();
		this.server.autoRespond = true;
	}
});

QUnit.test('process categories', function(assert) {
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

QUnit.test('admantx configured to make request and add targeting', function(assert) {
	var done = assert.async();
	var given = JSON.stringify(this.fixtures.admantx);
	this.server.respondWith("GET", {test: function(reqUrl) {
		return (new RegExp('usasync01.admantx.com/admantx/service')).test(reqUrl);
	}}, [200, { "Content-Type": "application/json" }, given]);

	this.ads.init({
		admantx: {
			id: 'someAdmantxID',
			collections: {
				admants: 3
			}
		}
	});

	var targeting = this.ads.targeting;
	var admants = ["Professional Education", "appreciation_income", "car_lifestyle"];
	setTimeout(function() {
		var result = targeting.get();
		assert.deepEqual(result.ad, admants, 'the admants are added as targeting');
		done();
	}, 20);
});

QUnit.test('debug returns early if no config is set', function(assert) {
	var start = this.spy(this.utils.log, "start");

	this.ads.admantx.debug();
	assert.notOk(start.called);
});

QUnit.test('debug starts logging Admantx data', function(assert) {
	this.ads.init({admantx: {collections: {}}});
	var start = this.spy(this.utils.log, 'start');

	this.ads.admantx.debug();
	assert.ok(start.calledWith('Admantx'));
	assert.ok(start.calledWith('Collections'));
});

QUnit.test("debug doesn't log response data if none is received", function(assert) {
	this.ads.init({admantx: {collections: {}}});
	var start = this.spy(this.utils.log, 'start');

	this.ads.admantx.debug();
	assert.notOk(start.calledWith('Response'));
	assert.notOk(start.calledWith('Admants'));
	assert.notOk(start.calledWith('Categories'));
});

QUnit.test('debug logs Admantx response', function(assert) {
	this.ads.init({admantx: {collections: {}}});
	var start = this.spy(this.utils.log, 'start');

	this.ads.admantx.xhr = {
		response: {
			admants: {},
			categories: {}
		}
	};

	this.ads.admantx.debug();
	assert.ok(start.calledWith('Response'));
	assert.ok(start.calledWith('Admants'));
	assert.ok(start.calledWith('Categories'));
});

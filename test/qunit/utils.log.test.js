/* jshint globalstrict: true, devel: true */
/* globals QUnit: false */
"use strict";

QUnit.module('utils.log', { beforeEach: function() {
	this.debugOn = this.utils.log.isOn('log');
	this.stub(this.utils.log, 'isOn').returns(true);
	this.stub(console, 'log');
	this.stub(console, 'warn');
	this.stub(console, 'error');
	this.stub(console, 'info');
	this.stub(console, 'groupCollapsed');
	this.stub(console, 'groupEnd');
}});

QUnit.test('We can log messages', function(assert) {
	if (console) {
		var log = this.utils.log;
		log('hello');
		assert.ok(console.log.called, 'the message is logged to the console');
	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.warn('Test skipped due to lack of console support!');
	}
});

QUnit.test('We can log warning messages', function(assert) {
	if (console && console.warn) {
		var log = this.utils.log;
		log.warn('uh oh!');
		assert.ok(console.warn.called, 'the warning message is logged to the console');
	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.warn('Test skipped due to lack of console.warn support!');
	}
});

QUnit.test('We can log error messages', function(assert) {
	if (console && console.error) {
		var log = this.utils.log;
		log.error('oh nein, mein knee ist kaput!');
		assert.ok(console.error.called, 'the error message is logged to the console');
	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.error('Test skipped due to lack of console.error support!');
	}
});

QUnit.test('We can log info messages', function(assert) {
	if (console && console.info) {
		var log = this.utils.log;
		log.info('Goodbye');
		assert.ok(console.info.called, 'the info message is logged to the console');
	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.error('Test skipped due to lack of console.info support!');
	}
});

QUnit.test('We can start and end groups', function(assert) {
	if (console && console.groupCollapsed) {
		var log = this.utils.log;
		log.start();
		assert.ok(console.groupCollapsed.calledWith('o-ads'), 'by default  the group o-ads is started');

		log.end();
		assert.ok(console.groupEnd.called, 'by default the group o-ads is ended');

		log.start('ABBA');
		assert.ok(console.groupCollapsed.calledWith('ABBA'), 'the group ABBA is started');

		log.end();
		assert.ok(console.groupEnd.calledTwice, 'the group ABBA is ended');

	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.error('Test skipped due to lack of console.group support!');
	}
});

QUnit.test('We can turn logging on and off', function(assert) {
	if (console) {

		var log = this.utils.log;
		this.utils.log.isOn.returns(false);
		log('hello');
		assert.ok(!console.log.called, 'when loggin is off the message is not logged');

		this.utils.log.isOn.restore();
		log('hello');
		if (this.debugOn) {
			assert.ok(console.log.called, 'the current page settings are respected');
		} else {
			assert.ok(!console.log.called, 'the current page settings are respected');
		}

	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.warn('Test skipped due to lack of console support!');
	}
});

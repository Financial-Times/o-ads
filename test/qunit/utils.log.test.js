/* jshint globalstrict: true, devel: true */
/* globals QUnit: false */

'use strict'; //eslint-ignore-line

QUnit.module('utils.log', { beforeEach: function() {
	this.debugOn = this.utils.log.isOn('log');
	this.stub(this.utils.log, 'isOn').returns(true);
	this.stub(console, 'log');
	this.stub(console, 'warn');
	this.stub(console, 'error');
	this.stub(console, 'info');
	this.stub(console, 'groupCollapsed');
	this.stub(console, 'groupEnd');
	this.stub(console, 'table');
}});

QUnit.test('We can log messages', function(assert) {
	if (console) {
		const log = this.utils.log;
		log('hello');
		assert.ok(console.log.called, 'the message is logged to the console');
	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.warn('Test skipped due to lack of console support!');
	}
});

QUnit.test('We can log warning messages', function(assert) {
	if (console && console.warn) {
		const log = this.utils.log;
		log.warn('uh oh!');
		assert.ok(console.warn.called, 'the warning message is logged to the console');
	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.warn('Test skipped due to lack of console.warn support!');
	}
});

QUnit.test('We can log error messages', function(assert) {
	if (console && console.error) {
		const log = this.utils.log;
		log.error('oh nein, mein knee ist kaput!');
		assert.ok(console.error.called, 'the error message is logged to the console');
	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.error('Test skipped due to lack of console.error support!');
	}
});

QUnit.test('We can log info messages', function(assert) {
	if (console && console.info) {
		const log = this.utils.log;
		log.info('Goodbye');
		assert.ok(console.info.called, 'the info message is logged to the console');
	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.error('Test skipped due to lack of console.info support!');
	}
});

QUnit.test('We can start and end groups', function(assert) {
	if (console && console.groupCollapsed) {
		const log = this.utils.log;

		this.utils.log.isOn.returns(false);
		assert.notOk(console.groupCollapsed.called, 'if logging is off never make a call to console');

		this.utils.log.isOn.returns(true);
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

		const log = this.utils.log;
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


QUnit.test('Fall back to log when table method is not available', function(assert) {
	if (console) {
		const log = this.utils.log;
		const save = window.console.table;

		log.table('hello');
		assert.ok(console.table.called, 'call table method when one is available');
		assert.notOk(console.log.called, 'log method has not been called');

		window.console['table'] = undefined;
		log.table('hello');
		assert.ok(console.log.calledOnce, 'falls back to calling log method');

		log.attributeTable('test');
		assert.ok(console.log.calledTwice, 'falls back to calling log method');

		window.console['table'] = save;

	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.warn('Test skipped due to lack of console support!');
	}
});

QUnit.test('When passing values passed to attribute table are arrays or objects it stringifies them', function(assert) {
	if (console) {
		const log = this.utils.log;
		const jsonSpy = this.spy(JSON, 'stringify');
		log.attributeTable({test: [1,2,3], test2: {key: 'value'}});
		assert.ok(jsonSpy.calledTwice, 'falls back to calling log method');

	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.warn('Test skipped due to lack of console support!');
	}
});

QUnit.test('Returns undefined if passed a falsy argument', function(assert) {
	if (console) {
		const log = this.utils.log;
		log.attributeTable(undefined);
		assert.notOk(console.table.called, 'table not drawn');
		assert.ok(console.log.withArgs(undefined), 'table not drawn');

	} else {
		assert.ok(true, 'console unavailable in this browser');
		this.warn('Test skipped due to lack of console support!');
	}
});

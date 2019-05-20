/* globals QUnit: false, sinon: false, sandbox: false */

'use strict'; //eslint-disable-line

const savePerformance = window.performance;

QUnit.module('Metrics', {
	before: function () {
		sandbox.restore();
		window.performance = savePerformance;
	},
	afterEach: function () {
		sandbox.restore();
		window.performance = savePerformance;
	}
});

QUnit.test('any trigger invokes the callback with the right payload', function (assert) {
	const done = assert.async();
	this.ads.init();

	const eventDefinitions = [{
		spoorAction: 'aaa',
		triggers: ['bbb', 'ccc'],
		marks: ['mark1', 'mark2', 'mark3']
	}];

	const cb = sandbox.stub();

	const getEntriesByNameStub = sandbox.stub();
	getEntriesByNameStub.withArgs('oAds.mark1').returns([{ name: 'oAds.mark1', startTime: 400 }]);
	getEntriesByNameStub.withArgs('oAds.mark2').returns([{ name: 'oAds.mark2', startTime: 500.22 }]);
	getEntriesByNameStub.withArgs('oAds.mark3').returns([{ name: 'oAds.mark3', startTime: 600.64 }]);

	window.performance = {
		getEntriesByName: getEntriesByNameStub
	};

	this.utils.setupMetrics(eventDefinitions, cb);
	document.dispatchEvent(new CustomEvent('oAds.ccc'));

	const expectedCbPayload = {
		category: 'ads',
		action: 'aaa',
		timings: {
			marks: {
				mark1: 400,
				mark2: 500,
				mark3: 601
			}
		}
	};

	setTimeout( function() {
		assert.ok(cb.called);
		assert.ok(cb.calledWith(sinon.match(expectedCbPayload)));
		done();
	}, 0);
});

QUnit.test('the callback is not called if eventDefinitions is not an array', function (assert) {
	const errorSpy = this.spy(this.utils.log, 'warn');
	const done = assert.async();
	this.ads.init();

	const eventDefinitions = {
		spoorAction: 'aaa',
		triggers: ['bbb', 'ccc'],
		marks: ['mark1', 'mark2', 'mark3']
	};

	const cb = sandbox.stub();

	this.utils.setupMetrics(eventDefinitions, cb);
	document.dispatchEvent(new CustomEvent('oAds.ccc'));

	setTimeout( function() {
		window.performance = savePerformance;
		assert.ok(!cb.called, 'the callback is not called');
		assert.ok(errorSpy.calledWith('Metrics definitions should be an array. o-Ads will not record any metrics.'), 'an error message is shown');
		errorSpy.restore();
		done();
	}, 0);
});


QUnit.test('any trigger invokes the callback with no timing in the payload', function (assert) {
	const done = assert.async();
	this.ads.init();

	const eventDefinitions = [{
		spoorAction: 'aaa',
		triggers: ['bbb', 'ccc'],
		marks: ['mark1', 'mark2', 'mark3']
	}];

	const cb = sandbox.stub();

	const getEntriesByNameStub = sandbox.stub();
	getEntriesByNameStub.withArgs('oAds.mark1').returns([{ name: 'oAds.mark1', startTime: 400 }]);
	getEntriesByNameStub.withArgs('oAds.mark2').returns([{ name: 'oAds.mark2', startTime: 500.22 }]);
	getEntriesByNameStub.withArgs('oAds.mark3').returns([{ name: 'oAds.mark3', startTime: 600.64 }]);

	window.performance = null;

	this.utils.setupMetrics(eventDefinitions, cb);
	document.dispatchEvent(new CustomEvent('oAds.ccc'));

	const expectedCbPayload = {
		category: 'ads',
		action: 'aaa',
		timings: {
			marks: { }
		}
	};

	setTimeout( function() {
		assert.ok(cb.called);
		assert.ok(cb.calledWith(sinon.match(expectedCbPayload)));
		done();
	}, 0);
});

QUnit.test('a trigger does not call the callback if user not in sample', function (assert) {
	this.stub(this.utils, 'inSample').returns(false);
	const done = assert.async();
	this.ads.init();

	const eventDefinitions = [{
		spoorAction: 'aaa',
		triggers: ['bbb', 'ccc'],
		marks: ['mark1', 'mark2', 'mark3']
	}];

	const cb = sandbox.stub();

	window.performance = null;

	this.utils.setupMetrics(eventDefinitions, cb);
	document.dispatchEvent(new CustomEvent('oAds.ccc'));

	setTimeout( function() {
		assert.notOk(cb.called);
		done();
	}, 0);
});

QUnit.test('a trigger invokes the callback only once if there is no multiple config', function (assert) {
	const done = assert.async();
	this.ads.init();

	const eventDefinitions = [{
		spoorAction: 'aaa',
		triggers: ['bbb', 'ccc'],
		marks: ['mark1', 'mark2', 'mark3']
	}];

	const cb = sandbox.stub();

	this.utils.setupMetrics(eventDefinitions, cb);
	document.dispatchEvent(new CustomEvent('oAds.ccc'));
	document.dispatchEvent(new CustomEvent('oAds.ccc'));
	document.dispatchEvent(new CustomEvent('oAds.ccc'));

	setTimeout( function() {
		assert.ok(cb.calledOnce);
		done();
	}, 0);
});

QUnit.test('a trigger invokes the callback multiple times if multiple=true', function (assert) {
	const done = assert.async();
	this.ads.init();

	const eventDefinitions = [{
		spoorAction: 'aaa',
		triggers: ['bbb', 'ccc'],
		marks: ['mark1', 'mark2', 'mark3'],
		multiple: true
	}];

	const cb = sandbox.stub();

	this.utils.setupMetrics(eventDefinitions, cb);
	document.dispatchEvent(new CustomEvent('oAds.ccc'));
	document.dispatchEvent(new CustomEvent('oAds.ccc'));
	document.dispatchEvent(new CustomEvent('oAds.ccc'));

	setTimeout( function() {
		assert.equal(cb.callCount, 3);
		done();
	}, 0);
});

QUnit.test('collects performance marks using the properties in the event payload', function (assert) {
	const done = assert.async();
	this.ads.init();

	const eventDefinitions = [{
		spoorAction: 'aaa',
		triggers: ['bbb', 'ccc'],
		marks: ['mark1', 'mark2', 'mark3']
	}];

	const cb = sandbox.stub();

	const getEntriesByNameStub = sandbox.stub();
	getEntriesByNameStub.withArgs('oAds.mark1__top__entry__300,250').returns([{ name: 'oAds.mark1__top__entry__300,250', startTime: 400 }]);
	getEntriesByNameStub.withArgs('oAds.mark2__top__entry__300,250').returns([{ name: 'oAds.mark2__top__entry__300,250', startTime: 500.22 }]);
	getEntriesByNameStub.withArgs('oAds.mark3__top__entry__300,250').returns([{ name: 'oAds.mark3__top__entry__300,25', startTime: 600.64 }]);

	window.performance = {
		getEntriesByName: getEntriesByNameStub
	};

	this.utils.setupMetrics(eventDefinitions, cb);
	const eventDetails = {
		name: 'entry',
		pos: 'top',
		size: [300,250]
	};
	this.ads.utils.broadcast('ccc', eventDetails);

	const expectedCbPayload = {
		category: 'ads',
		action: 'aaa',
		creative: {
			name: 'entry',
			pos: 'top',
			size: '300,250'
		},
		timings: {
			marks: {
				mark1: 400,
				mark2: 500,
				mark3: 601
			}
		}
	};

	setTimeout( function() {
		assert.ok(cb.called);
		assert.ok(cb.calledWith(sinon.match(expectedCbPayload)));
		done();
	}, 0);
});


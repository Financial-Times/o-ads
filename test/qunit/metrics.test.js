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

QUnit.test('any trigger invokes the metrics callback with the right payload', function (assert) {
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

QUnit.test('the metrics callback is not called if eventDefinitions is not an array', function (assert) {
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


QUnit.test('any trigger invokes the metrics callback with no timing in the payload', function (assert) {
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

QUnit.test('a trigger does not call the metrics callback if user not in sample', function (assert) {
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

QUnit.test('a trigger invokes the metrics callback only once if there is no multiple config', function (assert) {
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

QUnit.test('a trigger invokes the metrics callback multiple times if multiple=true', function (assert) {
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
	getEntriesByNameStub.withArgs('oAds.mark1__top__entry__300,250__91174576849').returns([{ name: 'oAds.mark1__top__entry__300,250__91174576849', startTime: 400 }]);
	getEntriesByNameStub.withArgs('oAds.mark2__top__entry__300,250__91174576849').returns([{ name: 'oAds.mark2__top__entry__300,250__91174576849', startTime: 500.22 }]);
	getEntriesByNameStub.withArgs('oAds.mark3__top__entry__300,250__91174576849').returns([{ name: 'oAds.mark3__top__entry__300,250__91174576849', startTime: 600.64 }]);

	window.performance = {
		getEntriesByName: getEntriesByNameStub
	};

	this.utils.setupMetrics(eventDefinitions, cb);
	const eventDetails = {
		name: 'entry',
		pos: 'top',
		size: [300,250],
		creativeId: 91174576849
	};
	this.ads.utils.broadcast('ccc', eventDetails);

	const expectedCbPayload = {
		category: 'ads',
		action: 'aaa',
		creative: {
			name: 'entry',
			pos: 'top',
			size: '300,250',
			creativeId: 91174576849
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

QUnit.only('utils.clearPerfMarks clears the expected events', function(assert) {
	const metricsDefinitions = [
		{
			spoorAction: 'group1',
			marks: ['first', 'second', 'third']
		},
		{
			spoorAction: 'group2',
			marks: ['fourth', 'fifth', 'sixth']
		},
		{
			spoorAction: 'group3',
			marks: ['seventh', 'eighth', 'ninth']
		}
	];

	const groupsToClear = ['group1', 'group3'];

	const perfMarksBefore = ['oAds.first', 'oAds.second', 'oAds.third', 'oAds.second-blah',
		'oAds.fourth', 'oAds.fifth', 'oAds.fifthblabla', 'oAds.seventh',
		'oAds.eighth', 'oAds.eighthbla', 'aa'];

	perfMarksBefore.forEach( (markName) => {
		performance.mark(markName);
	});

	const expectedMarksAfter = [ 'oAds.fourth', 'oAds.fifth', 'oAds.fifthblabla'];
	const notExpectedMarksAfter = ['oAds.first', 'oAds.second', 'oAds.third', 'oAds.second-blah',
		'oAds.seventh', 'oAds.eighth', 'oAds.eighthbla'];

	this.utils.clearPerfMarks(metricsDefinitions, groupsToClear);
	const afterMarks = performance.getEntriesByType('mark').map( m => m.name );

	console.log('-----------------------------------');
	console.log('afterMarks', afterMarks);

	expectedMarksAfter.forEach( markName => {
		assert.ok(afterMarks.includes(markName));
	});

	notExpectedMarksAfter.forEach( markName => {
		assert.notOk(afterMarks.includes(markName));
	});
});

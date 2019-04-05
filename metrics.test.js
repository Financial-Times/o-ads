/* globals QUnit: false, sinon: false */

'use strict'; //eslint-disable-line

// import ads from '../../main.js';
const metrics = require('../../src/js/metrics');
// import helpers from './helpers';
console.log('typeof metrics', typeof metrics);


// let saveWindowPerformance;
// const broadcastStub = sinon.stub();
//
// QUnit.module('Metrics', {
// 	beforeEach: function () {
// 		saveWindowPerformance = window.performance;
// 	},
//
// 	afterEach: function () {
// 		window.performance = saveWindowPerformance;
// 		broadcastStub.reset();
// 	}
// });
//
// QUnit.test('should record a performance mark for each of the expected events only once', (done) => {
// 	const pageEventMarkMap = {
// 		foo: 'fooPerfMark',
// 		bar: 'barPerfMark'
// 	};
//
// 	metrics.recordMarksForEvents(pageEventMarkMap);
//
// 	document.dispatchEvent(new CustomEvent('oAds.foo'));
// 	document.dispatchEvent(new CustomEvent('oAds.bar'));
// 	document.dispatchEvent(new CustomEvent('oAds.bar'));
//
// 	setTimeout( () => {
// 		const mark1 = window.performance.getEntriesByName('fooPerfMark');
// 		const mark2 = window.performance.getEntriesByName('barPerfMark');
// 		expect(mark1.length).to.equal(1);
// 		expect(mark2.length).to.equal(1);
// 		done();
// 	}, 0);
// });
//
// QUnit.test('should broadcast oTracking.event with the right performance marks', (done) => {
// 	const getEntriesByNameStub = sinon.stub();
// 	getEntriesByNameStub.withArgs('somethingElse').returns([{ name: 'somethingElse', startTime: 400 }]);
// 	getEntriesByNameStub.withArgs('adsInitialising').returns([{ name: 'adsInitialising', startTime: 500.22 }]);
// 	getEntriesByNameStub.withArgs('adsIVTComplete').returns([{ name: 'adsIVTComplete', startTime: 600.64 }]);
// 	getEntriesByNameStub.withArgs('adsTargetingComplete').returns([{ name: 'adsTargetingComplete', startTime: 700.45 }]);
// 	getEntriesByNameStub.withArgs('adsPreparationComplete').returns([{ name: 'adsPreparationComplete', startTime: 705.57 }]);
// 	getEntriesByNameStub.withArgs('adsServerLoaded').returns([{ name: 'adsServerLoaded', startTime: 905.57 }]);
//
// 	window.performance = {
// 		getEntriesByName: getEntriesByNameStub
// 	};
//
// 	const expectedTrackingObject = {
// 		category: 'ads',
// 		action: 'page-initialised',
// 		timings: {
// 			marks: {
// 				adsInitialising: 500,
// 				adsIVTComplete: 601,
// 				adsTargetingComplete: 700,
// 				adsPreparationComplete: 706,
// 				adsServerLoaded: 906
// 			}
// 		}
// 	};
//
// 	pageMetrics.setupPageMetrics();
// 	document.dispatchEvent(new CustomEvent('oAds.adServerLoadSuccess'));
// 	setTimeout( () => {
// 		expect(broadcastStub).to.have.been.calledWith('oTracking.event', expectedTrackingObject);
// 		done();
// 	});
// });
//
// QUnit.test('captures all the expected page metrics', (done) => {
// 	pageMetrics.setupPageMetrics();
// 	document.dispatchEvent(new CustomEvent('oAds.startInitialisation'));
// 	document.dispatchEvent(new CustomEvent('oAds.apiRequestsComplete'));
// 	document.dispatchEvent(new CustomEvent('oAds.moatIVTcomplete'));
// 	document.dispatchEvent(new CustomEvent('oAds.initialised'));
// 	document.dispatchEvent(new CustomEvent('oAds.adServerLoadSuccess'));
//
// 	setTimeout( () => {
// 		expect(broadcastStub).to.have.been.called;
// 		const marksObject = broadcastStub.firstCall.args[1].timings.marks;
// 		expect(marksObject.adsInitialising).to.be.a('number');
// 		expect(marksObject.adsIVTComplete).to.be.a('number');
// 		expect(marksObject.adsTargetingComplete).to.be.a('number');
// 		expect(marksObject.adsPreparationComplete).to.be.a('number');
// 		expect(marksObject.adsServerLoaded).to.be.a('number');
// 		done();
// 	});
// });
//
// QUnit.test('should broadcast an oTracking.event with the right krux marks when Kuid has been acknowledged', (done) => {
// 	const getEntriesByNameStub = sinon.stub();
// 	getEntriesByNameStub.withArgs('kruxScriptLoaded').returns([{ name: 'kruxScriptLoaded', startTime: 700.45 }]);
// 	getEntriesByNameStub.withArgs('kruxConsentOptinOK').returns([{ name: 'kruxConsentOptinOK', startTime: 705.57 }]);
// 	getEntriesByNameStub.withArgs('kruxKuidAck').returns([{ name: 'kruxKuidAck', startTime: 905.57 }]);
//
// 	window.performance = {
// 		getEntriesByName: getEntriesByNameStub
// 	};
//
// 	const expectedTrackingObject = {
// 		category: 'ads',
// 		action: 'krux',
// 		timings: {
// 			marks: {
// 				kruxScriptLoaded: 700,
// 				kruxConsentOptinOK: 706,
// 				kruxKuidAck: 906
// 			}
// 		}
// 	};
//
// 	pageMetrics.setupPageMetrics();
// 	document.dispatchEvent(new CustomEvent('oAds.kruxKuidAck'));
// 	setTimeout( () => {
// 		expect(broadcastStub).to.have.been.calledWith('oTracking.event', expectedTrackingObject);
// 		done();
// 	});
// });
//
// QUnit.test('should broadcast an oTracking.event with the right krux marks when Kuid has NOT been acknowledged', (done) => {
// 	const getEntriesByNameStub = sinon.stub();
// 	getEntriesByNameStub.withArgs('kruxScriptLoaded').returns([{ name: 'kruxScriptLoaded', startTime: 700.45 }]);
// 	getEntriesByNameStub.withArgs('kruxConsentOptinOK').returns([{ name: 'kruxConsentOptinOK', startTime: 705.57 }]);
// 	getEntriesByNameStub.withArgs('kruxKuidError').returns([{ name: 'kruxKuidError', startTime: 905.57 }]);
//
// 	window.performance = {
// 		getEntriesByName: getEntriesByNameStub
// 	};
//
// 	const expectedTrackingObject = {
// 		category: 'ads',
// 		action: 'krux',
// 		timings: {
// 			marks: {
// 				kruxScriptLoaded: 700,
// 				kruxConsentOptinOK: 706,
// 				kruxKuidError: 906
// 			}
// 		}
// 	};
//
// 	pageMetrics.setupPageMetrics();
// 	document.dispatchEvent(new CustomEvent('oAds.kruxKuidAck'));
// 	setTimeout( () => {
// 		expect(broadcastStub).to.have.been.calledWith('oTracking.event', expectedTrackingObject);
// 		done();
// 	});
// });
//
// QUnit.test('should broadcast an oTracking.event with the right krux marks when consent was not given', (done) => {
// 	const getEntriesByNameStub = sinon.stub();
// 	getEntriesByNameStub.withArgs('kruxScriptLoaded').returns([{ name: 'kruxScriptLoaded', startTime: 700.45 }]);
// 	getEntriesByNameStub.withArgs('kruxConsentOptinFailed').returns([{ name: 'kruxConsentOptinFailed', startTime: 705.57 }]);
//
// 	window.performance = {
// 		getEntriesByName: getEntriesByNameStub
// 	};
//
// 	const expectedTrackingObject = {
// 		category: 'ads',
// 		action: 'krux',
// 		timings: {
// 			marks: {
// 				kruxScriptLoaded: 700,
// 				kruxConsentOptinFailed: 706
// 			}
// 		}
// 	};
//
// 	pageMetrics.setupPageMetrics();
// 	document.dispatchEvent(new CustomEvent('oAds.kruxConsentOptinFailed'));
// 	setTimeout( () => {
// 		expect(broadcastStub).to.have.been.calledWith('oTracking.event', expectedTrackingObject);
// 		done();
// 	});
// });
//
// QUnit.test('captures all the expected krux metrics when Kuid has been acknowledged', (done) => {
// 	pageMetrics.setupPageMetrics();
// 	document.dispatchEvent(new CustomEvent('oAds.kruxScriptLoaded'));
// 	document.dispatchEvent(new CustomEvent('oAds.kruxConsentOptinOK'));
// 	document.dispatchEvent(new CustomEvent('oAds.kruxKuidAck'));
//
// 	setTimeout( () => {
// 		expect(broadcastStub).to.have.been.called;
// 		const marksObject = broadcastStub.firstCall.args[1].timings.marks;
// 		expect(marksObject.kruxScriptLoaded).to.be.a('number');
// 		expect(marksObject.kruxConsentOptinOK).to.be.a('number');
// 		expect(marksObject.kruxKuidAck).to.be.a('number');
// 		done();
// 	});
// });
//
// QUnit.test('captures all the expected krux metrics when Kuid has NOT been acknowledged', (done) => {
// 	pageMetrics.setupPageMetrics();
// 	document.dispatchEvent(new CustomEvent('oAds.kruxScriptLoaded'));
// 	document.dispatchEvent(new CustomEvent('oAds.kruxConsentOptinOK'));
// 	document.dispatchEvent(new CustomEvent('oAds.kruxKuidError'));
//
// 	setTimeout( () => {
// 		expect(broadcastStub).to.have.been.called;
// 		const marksObject = broadcastStub.firstCall.args[1].timings.marks;
// 		expect(marksObject.kruxScriptLoaded).to.be.a('number');
// 		expect(marksObject.kruxConsentOptinOK).to.be.a('number');
// 		expect(marksObject.kruxKuidError).to.be.a('number');
// 		done();
// 	});
// });
//
// QUnit.test('captures all the expected krux metrics when consent was not given', (done) => {
// 	pageMetrics.setupPageMetrics();
// 	document.dispatchEvent(new CustomEvent('oAds.kruxScriptLoaded'));
// 	document.dispatchEvent(new CustomEvent('oAds.kruxConsentOptinFailed'));
//
// 	setTimeout( () => {
// 		expect(broadcastStub).to.have.been.called;
// 		const marksObject = broadcastStub.firstCall.args[1].timings.marks;
// 		expect(marksObject.kruxScriptLoaded).to.be.a('number');
// 		expect(marksObject.kruxConsentOptinFailed).to.be.a('number');
// 		done();
// 	});
// });
//
//

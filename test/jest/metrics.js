import {setupMetrics, __RewireAPI__ } from '../../src/js/utils/metrics.js';
import { mark, getEntriesByName } from './testUtils/pMark.js';

test('metrics to export a "setupMetrics" function', () => {
	expect(setupMetrics).toBeDefined();
});

test('getMarksForEvents', () => {
	const getMarksForEvents = __RewireAPI__.__get__('getMarksForEvents');
	expect(getMarksForEvents).toBeDefined();
	window.performance.mark = jest.fn(mark);
	window.performance.getEntriesByName = jest.fn(getEntriesByName);

	window.performance.mark('oAds.a__suffix__');
	window.performance.mark('oAds.b__suffix__');
	window.performance.mark('oAds.c__suffix__');
	window.performance.mark('oAds.d');

	const events = ['a', 'b', 'c', 'd'];

	const marks = getMarksForEvents(events, '__suffix__');
	expect(marks).toHaveProperty('a');
	expect(marks).toHaveProperty('b');
	expect(marks).toHaveProperty('c');
	expect(marks).toHaveProperty('d');
});

import {setupMetrics, __RewireAPI__ } from '../../src/js/utils/metrics.js';
import { mark, getEntriesByType } from './pMark.js'

test('metrics to export a "setupMetrics" function', () => {
	expect(setupMetrics).toBeDefined();
});

test('getMarksForEvents', () => {
	const getMarksForEvents = __RewireAPI__.__get__('getMarksForEvents');
	expect(getMarksForEvents).toBeDefined();
	window.performance.mark = jest.fn(mark);
	window.performance.getEntriesByType = jest.fn(getEntriesByType);

	window.performance.mark('a__suffix__');
	window.performance.mark('b__suffix__');
	window.performance.mark('c__suffix__');
	window.performance.mark('d');

	const events = [
		{
			marks: ['a', 'b', 'c', 'd']
		}
	];

	const marks = getMarksForEvents(events, '__suffix__');
	expect(marks).toBeDefined();
});

// Same as n-ui-foundations's perfMark, but we don't want to have
// n-ui foundations as a dependency
export const perfMark = name => {
	const performance = window.LUX || window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
	if (performance && performance.mark) {
		performance.mark(name);
	}
};

export const getPerfMarks = (markNames) => {
	const performance = window.LUX || window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
	if (!performance || !performance.getEntriesByName) {
		return {};
	}

	const marks = {};
	markNames.forEach(mName => {
		const pMarks = performance.getEntriesByName(mName);
		if (pMarks && pMarks.length) {
			// We don't need sub-millisecond precision
			marks[mName] = Math.round(pMarks[0].startTime);
		}
	});
	return marks;
};

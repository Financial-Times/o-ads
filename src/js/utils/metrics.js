import utils from './index';

const performance = window.LUX || window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;

function getMarksForEvents(events, suffix) {
	const markNames = events.map( eventName => 'oAds.' + eventName + suffix );
	if (!performance || !performance.getEntriesByName) {
		/* istanbul ignore next  */
		return {};
	}

	const marks = {};
	markNames.forEach(function(mName) {
		const pMarks = performance.getEntriesByName(mName);
		const markName = mName.replace('oAds.', '').replace(suffix, '');
		if (pMarks && pMarks.length) {
			// We don't need sub-millisecond precision
			marks[markName] = Math.round(pMarks[0].startTime);
		}
	});
	return marks;
}

function getNavigationPerfMarks(desiredMarks) {
	if (!performance || !performance.getEntriesByType || !utils.isArray(desiredMarks)) {
		/* istanbul ignore next  */
		return {};
	}

	const navigations = performance.getEntriesByType('navigation');
	const nav = utils.isArray(navigations) && navigations[0] || {};
	const marks = {};
	desiredMarks.forEach(function(markName) {
		// if the navigation mark is zero, it means we tried to capture it too early
		// i.e. before the event happened, so it's useless
		if (nav[markName]) {
			marks[markName] = nav[markName];
		}
	});
	return marks;
}

export function setupMetrics(definitions, callback, disableSampling) {
	if (!Array.isArray(definitions)) {
		this.log.warn('Metrics definitions should be an array. o-Ads will not record any metrics.');
		return;
	}

	definitions.forEach( function(eDef) {
		if (disableSampling || utils.inSample(eDef.sampleSize)) {
			const triggers = Array.isArray(eDef.triggers) ? eDef.triggers : [];
			triggers.forEach(function(trigger) {
				sendMetricsOnEvent('oAds.' + trigger, eDef, callback);
			});
		}
	});
}

function sendMetricsOnEvent(eventName, eMarkMap, callback) {
	document.addEventListener(eventName, function listenOnInitialised(event) {
		sendMetrics(eMarkMap, event.detail, callback);
		if (!eMarkMap.multiple) {
			document.removeEventListener(eventName, listenOnInitialised);
		}
	});
}

function sendMetrics(eMarkMap, eventDetails, callback) {
	let suffix = '';
	if (eventDetails && 'pos' in eventDetails && 'name' in eventDetails) {
		suffix = '__' + [eventDetails.pos, eventDetails.name, eventDetails.size, eventDetails.creativeId].join('__');
	}

	const marks = getMarksForEvents(eMarkMap.marks, suffix);

	if (eMarkMap.navigation) {
		const navMarks = getNavigationPerfMarks(eMarkMap.navigation);
		Object.assign(marks, navMarks);
	}

	const eventPayload = {
		category: 'ads',
		action: eMarkMap.spoorAction,
		timings: { marks: marks }
	};

	if (eventDetails && 'pos' in eventDetails) {
		eventPayload.creative = {
			name: eventDetails.name,
			pos: eventDetails.pos,
			size: eventDetails.size && eventDetails.size.toString(),
			creativeId: eventDetails.creativeId && eventDetails.creativeId || 0
		};
	}

	callback(eventPayload);
}


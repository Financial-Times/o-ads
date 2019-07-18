import utils from './index';

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

export function clearPerfMarks(metricsDefinitions, groupsToClear) {
	if (!performance || !performance.getEntriesByType) {
		return;
	}

	const relevantGroups = metricsDefinitions.filter( group =>
		groupsToClear.includes(group.spoorAction)
	);
	const relevantGroupsMarks = relevantGroups.map( group => group.marks );
	// Because relevantGroupsMarks is a 2D array ...
	const eventsToClear = [].concat(...relevantGroupsMarks);

	const perfMarks = performance.getEntriesByType('mark');

	perfMarks.forEach( ({name}) => {
		eventsToClear.forEach( eventName => {
			if (name.match(`oAds.${eventName}`)) {
				performance.clearMarks(name);
			}
		});
	});
}

/* istanbul ignore next */
function getNavigationPerfMarks(desiredMarks) {
	if (!performance || !performance.getEntriesByType || !utils.isArray(desiredMarks)) {
		/* istanbul ignore next  */
		return {};
	}

	const navMarksArray = performance.getEntriesByType('navigation');
	const navMarks = utils.isArray(navMarksArray) && navMarksArray[0] || {};
	const marks = {};
	desiredMarks.forEach(function(markName) {
		marks[markName] = typeof navMarks[markName] === 'number' ? Math.round(navMarks[markName]) : 0;
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
	const suffix = utils.buildPerfmarkSuffix(eventDetails);
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
			creativeId: eventDetails.creativeId || 0,
		};

		if (typeof eventDetails.isEmpty === 'boolean') {
			eventPayload.creative.isEmpty = eventDetails.isEmpty;
		}
	}

	callback(eventPayload);
}

export function markPageChange(definitions, groupsToClear) {
	clearPerfMarks(definitions, groupsToClear);
	utils.perfMark('oAds.pageChange');
}

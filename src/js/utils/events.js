/**
 * Utility methods for o-ads events. Methods defined here are added to the utils object not the utils.event object.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils/events
 * @see utils
 */

// Creates a timestamp in the browser's performance entry buffer
// for later use
export const perfMark = name => {
	/* istanbul ignore next */
	const performance = window.LUX || window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
	if (performance && performance.mark) {
		performance.mark(name);
	}
};

// Creates a suffix for an event's performance mark based on some of the attributes on
// the event payload which help identify unequivocally the slot that originated the event
export function buildPerfmarkSuffix(eventDetailsObj) {
	let suffix = '';
	if (eventDetailsObj && typeof eventDetailsObj === 'object' && 'pos' in eventDetailsObj && 'name' in eventDetailsObj) {
		suffix = '__' + [eventDetailsObj.pos, eventDetailsObj.name, eventDetailsObj.size, eventDetailsObj.creativeId].join('__');
	}
	return suffix;
}

/**
* Broadscasts an o-ads event
* @param {string} name The name of the event
* @param {object} data The data to send as event detail
* @param {HTMLElement} target The element to attach the event listener to
*/
export function broadcast(eventName, data, target) {
	/* istanbul ignore next: ignore the final fallback as hard trigger */
	target = target || document.body || document.documentElement;
	eventName = `oAds.${eventName}`;
	const opts = {
		bubbles: true,
		cancelable: true,
		detail: data
	};

	const isSlotEvent = typeof data === 'object' && 'pos' in data;
	const evDetails = isSlotEvent ? {
		pos: data.pos,
		name: data.name,
		size: data.size && data.size.length ? data.size.toString() : '',
		creativeId: data.creativeId
	} : {};

	const suffix = buildPerfmarkSuffix(evDetails);
	const markName = eventName + suffix;
	perfMark(markName);
	target.dispatchEvent(new CustomEvent(eventName, opts));
}

/**
* Sets an event listener for an oAds event
* @param {string} name The name of the event
* @param {function} callback The function to execute on the event
* @param {HTMLElement} target The element to attach the event listener to
*/
export function on(name, callback, target) {
	name = `oAds.${name}`;
	/* istanbul ignore next: ignore the final fallback as hard trigger */
	target = target || document.body || document.documentElement;
	target.addEventListener(name, callback);
}

/**
* Removes an event listener for an oAds event
* @param {string} name The name of the event
* @param {function} callback The function on the event to be removed
* @param {HTMLElement} target The element the event listener is attached to
*/
export function off(name, callback, target) {
	name = `oAds.${name}`;
	/* istanbul ignore next: ignore the final fallback as hard trigger */
	target = target || document.body || document.documentElement;
	target.removeEventListener(name, callback);
}

/**
* Sets a one time event listener for an oAds event
* @param {string} name The name of the event
* @param {function} callback The function to execute on the event
* @param {HTMLElement} target The element to attach the event listener to
*/
export function once(name, callback, target) {
	const handler = function(event) {
		/* istanbul ignore next: ignore the final fallback as hard trigger */
		const targ = event.target || event.srcElement;
		targ.removeEventListener(name = `oAds.${name}`, callback);
		if (callback) {
			callback(event);

			// we set callback to null so if for some reason the listener isn't removed the callback will still only be called once
			callback = null;
		}
	};
	on(name, handler, target);
}

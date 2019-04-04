/**
 * Utility methods for o-ads events. Methods defined here are added to the utils object not the utils.event object.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils/events
 * @see utils
 */

// Creates a timestamp in the browser's performance entry buffer
// for later use
export const perfMark = name => {
	const performance = window.LUX || window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
	if (performance && performance.mark) {
		performance.mark(name);
	}
};

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

	const markName = data && ('pos' in data) && ('name' in data) ? [eventName, data.pos, data.name, data.size.length ? data.size.toString() : ''].join('__') : eventName;
	perfMark(markName);
	console.log('eventName', eventName);
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

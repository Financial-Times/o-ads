/**
 * Utility methods for o-ads events. Methods defined here are added to the utils object not the utils.event object.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils/events
 * @see utils
 */

/**
* Broadscasts an o-ads event
* @param {string} name The name of the event
* @param {object} data The data to send as event detail
* @param {HTMLElement} target The element to attach the event listener to
*/
export function broadcast(name, data, target) {
	/* istanbul ignore next: ignore the final fallback as hard trigger */
	target = target || document.body || document.documentElement;
	name = `oAds.${name}`;
	const opts = {
		bubbles: true,
		cancelable: true,
		detail: data
	};
	target.dispatchEvent(new CustomEvent(name, opts));
}

export function on(name, callback, target) {
	name = `oAds.${name}`;
	/* istanbul ignore next: ignore the final fallback as hard trigger */
	target = target || document.body || document.documentElement;
	target.addEventListener(name, callback);
}

export function off(name, callback, target) {
	name = `oAds.${name}`;
	/* istanbul ignore next: ignore the final fallback as hard trigger */
	target = target || document.body || document.documentElement;
	target.removeEventListener(name, callback);
}

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

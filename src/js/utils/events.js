/**
 * Utility methods for o-ads events. Methods defined here are added to the utils object not the utils.event object.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils/events
 * @see utils
 */
'use strict';

/**
* Broadscasts an o-ads event
* @param {string} name The name of the cookie to be read/written
* @param {object} data The value to set to the written cookie (if param is missing the cookie will be read)
* @param {HTMLElement} target The element to attach the event listener to
*/
module.exports.broadcast = broadcast;
function broadcast(name, data, target) {
	/* istanbul ignore next: ignore the final fallback as hard trigger */
	target = target || document.body || document.documentElement;
	name = 'oAds.' + name;
	var opts = {
		bubbles: true,
		cancelable: true,
		detail: data
	};
	target.dispatchEvent(new CustomEvent(name, opts));
}

/**
* Sets an event listener for an oAds event
* @param {string} name The name of the cookie to be read/written
* @param {function} callback The value to set to the written cookie (if param is missing the cookie will be read)
* @param {HTMLElement} target The element to attach the event listener to
*/

module.exports.on = on;
function on(name, callback, target) {
	name = 'oAds.' + name;
	/* istanbul ignore next: ignore the final fallback as hard trigger */
	target = target || document.body || document.documentElement;
	target.addEventListener(name, callback);
}

/**
* Sets a one time event listener for an oAds event
* @param {string} name The name of the cookie to be read/written
* @param {function} callback The value to set to the written cookie (if param is missing the cookie will be read)
* @param {HTMLElement} target The element to attach the event listener to
*/
module.exports.once = once;
function once(name, callback, target) {
	var handler = function(event) {
		/* istanbul ignore next: ignore the final fallback as hard trigger */
		var targ = event.target || event.srcElement;
		targ.removeEventListener('oAds.' + name, callback);
		if (callback) {
			callback(event);

			// we set callback to null so if for some reason the listener isn't removed the callback will still only be called once
			callback = null;
		}
	};
	on(name, handler, target);
}

'use strict';
/**
* Broadscasts an o-ads event
* @name broadcast
*/
function broadcast(name, data, target) {
	target = target || document.body;
	name = 'oAds.' + name;
	var opts = {
		bubbles: true,
		cancelable: true,
		detail: data
	};
	target.dispatchEvent(customEvent(name, opts));
}


/**
* Sets a one time event listener
* @name once
*/
function once(name, callback, target) {
	target = target || document.body;
	var handler = function(event){
		target.removeEventListener(name, callback);
		if (callback) {
			callback(event);
			// we set callback to null so if for some reason the listener isn't removed the callback will still only be called once
			callback = null;
		}
	};

	target.addEventListener(name, handler);
}


/*
* custom event fix for safari
*/
function customEvent(name, opts) {
	try{
			return new CustomEvent(name, opts);
	} catch(e){
			return CustomEvent.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
	}
}

module.exports.broadcast = broadcast;
module.exports.once = once;

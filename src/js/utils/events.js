'use strict';
/**
* Broadscasts an o-ads event
* @name broadcast
*/
function broadcast(name, data, target) {
	target = target || document.body ||document.documentElement;
	name = 'oAds.' + name;
	var opts = {
		bubbles: true,
		cancelable: true,
		detail: data
	};
	target.dispatchEvent(customEvent(name, opts));
}

/**
* Sets an event listener for an oAds event
* @name on
*/
function on(name, callback, target) {
	name = 'oAds.' + name;
	target = target || document.body;
	target.addEventListener(name, callback);
}

/**
* Sets a one time event listener for an oAds event
* @name once
*/
function once(name, callback, target) {
	var handler = function(event){
		event.srcElement.removeEventListener('oAds.' + name, callback);
		if (callback) {
			callback(event);
			// we set callback to null so if for some reason the listener isn't removed the callback will still only be called once
			callback = null;
		}
	};

	on(name, handler, target);
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
module.exports.on = on;
module.exports.once = once;

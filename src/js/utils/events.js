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

function once(name, callback, target) {
	target = target || document.body;
	target.addEventListener(name, function(event){
		target.removeEventListner(name, callback);
		callback(event);
	});
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
module.exports.broadcast = once;

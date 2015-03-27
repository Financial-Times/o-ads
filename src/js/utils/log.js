/* jshint devel: true */
'use strict';

function log(){
	var type, args, argsIndex;
	if('log warn error info'.indexOf(arguments[0]) === -1){
		type = 'log';
		argsIndex = 0;
	} else {
		type = arguments[0];
		argsIndex = 1;
	}

	args = [].slice.call(arguments, argsIndex);

	if(location.search.indexOf('DEBUG=OADS') === -1 || !window.console || !window.console[type]){
		return;
	}

	window.console[type].apply(window.console, args);
}

log.warn = function(){
	var args = ['warn'].concat([].slice.call(arguments, 0));
	log.apply(null, args);
};

log.error = function(){
	var args = ['error'].concat([].slice.call(arguments, 0));
	log.apply(null, args);
};

log.info = function(){
	var args = ['info'].concat([].slice.call(arguments, 0));
	log.apply(null, args);
};

log.start = function(group){
	if(!window.console || !window.console.groupCollapsed){
		return;
	}

	window.console.groupCollapsed(group || 'o-ads');
};

log.end = function(){
	if(!window.console || !window.console.groupEnd){
		return;
	}

	window.console.groupEnd();
};

module.exports = log;

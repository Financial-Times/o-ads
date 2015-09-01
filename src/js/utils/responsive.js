'use strict';

var callback, breakpoints, current;
var utils = require('./index.js');
var oViewport =  require('o-viewport');

function getNearestBreakpoint() {
	var winner;
	var dims = oViewport.getSize();
	function findCurrentBreakpoint(breakpoint) {
		var breakpointDims = breakpoints[breakpoint];
		if (dims.width >= breakpointDims[0] && dims.height >= breakpointDims[1]) {
			if (!winner || breakpointDims[0] >= breakpoints[winner][0]) {
				winner = breakpoint;
			}
		}
	}

	Object.keys(breakpoints).forEach(findCurrentBreakpoint);

	return winner;
}

function fire() {
	var winner = getNearestBreakpoint();

	if (current !== winner) {
		setCurrent(winner);
		callback(winner);
	}
}

function setCurrent(name) {
	current = name;
}

function getCurrent() {
	return current;
}

function init(brps, cb) {

	if (!utils.isFunction(cb)) {
		// must have a call back function
		return false;
	}

	breakpoints = brps;
	callback = cb;

	setCurrent(getNearestBreakpoint());
	document.body.addEventListener('oViewport.orientation', fire);
	document.body.addEventListener('oViewport.resize', fire);
	oViewport.listenTo('orientation');
	oViewport.listenTo('resize');

	return getCurrent();
}

module.exports = init;
module.exports.getCurrent = getCurrent;
module.exports.setThrottleInterval = oViewport.setThrottleInterval;

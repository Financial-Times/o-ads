'use strict';

var callback, viewPorts, current,
	timer = false,
	utils = require('./index.js');

function getViewportDims() {
	var e = window, a = 'inner';
	if (!('innerWidth' in window)) {
		a = 'client';
		e = document.documentElement || document.body;
	}
	return {w : e[a + 'Width'], h: e[a + 'Height']};
}


function getNearestBreakpoint() {
	var viewPort, viewPortDims, winner,
		dims = getViewportDims();

	for (viewPort in viewPorts){
		if(viewPorts.hasOwnProperty(viewPort)){
			viewPortDims = viewPorts[viewPort];
			if( dims.w > viewPortDims[0] && dims.h > viewPortDims[1] ){
				if(!winner || viewPortDims[0] > viewPorts[winner][0]) {
					winner = viewPort;
				}
			}
		}
	}

	return winner;
}

function fire() {
	var winner = getNearestBreakpoint();

	if (current !== winner) {
		setCurrent(winner);
		callback(winner);
	}
}

function setCurrent(name){
	current = name;
}

function onResize() {
	if (timer) {
		clearTimeout(timer);
	}
	timer = setTimeout(fire, 200);
}

function init(vps, cb) {

	if(!utils.isFunction(cb)) {
		// must have a call back function
		return false;
	}

	viewPorts = vps;
	callback = cb;

	setCurrent(getNearestBreakpoint());

	if (window.addEventListener) {
		window.addEventListener("resize", onResize, false);
	}
	else if (document.body.attachEvent) {
		document.body.attachEvent("onresize", onResize);
	}

	return function() {
		return current;
	};
}

module.exports = init;

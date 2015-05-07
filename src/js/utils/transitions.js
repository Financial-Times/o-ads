'use strict';
var utils = require('./index.js');

var animationend = whichEvent();

function fade(element, callback) {
	element.addEventListener(animationend, callback, false);
	utils.addClass(element, 'fadeOut');
}

function slide(element, callback, direction){
	direction = direction || 'Up';
	element.addEventListener(animationend, callback, false);
	utils.addClass(element, 'slideOut' + direction);
}

function whichEvent() {
	var element = document.createElement("fakeelement");
	var animationend = {
		webkitAnimation: 'webkitAnimationEnd',
		mozAnimation: 'mozAnimationEnd',
		MSAnimation: 'MSAnimationEnd',
		Animation: 'animationend'
	};
	var result = Object.keys(animationend).filter(function (item) {
		return element.style[item] !== undefined;
	});
	return animationend[result[0]];
}

module.exports = {
	fade: fade,
	slide: slide
};

/* jshint forin: false, boss: true */
//see line ~76 for explaination on for in
// boos mode used in this file, we should replace instaces with Array.map when polyfils are available


"use strict";
var ads;

/**
* The Slots class defines an FT.ads.slots instance.
* @class
* @constructor
*/
function Slots() {
}

var proto = Slots.prototype;

proto.init = function (impl){
	ads = impl;
};

/**
* Collects configuration values from data attributes set on the slots container,
* attributes should be in the format o-ads-attrname (data- can also be added)
* Only certain attribute names are parsed, all attributes without a parser are
* added to the slots targeting parameters as a key value
* parsed attributes are:
* position - is added to targeting parameters as pos
* page-type  - is added to targeting parameters as pt
* size - takes a comma separated list of sizes and parses them to an array e.g 1x1,728x60 -> [[1, 1], [728,60]]
* targeting - a list of key value pairs to be added to targeting in the format key=value; e.g name=gilbert;fruit=grape;
* out-of-page - when this attribute is present an out of page unit will be created for this slot
* //TODO collapse - see slot collapse empty options
* @name fetchSlotConfig
* @memberof Slots
* @lends Slots
*/


proto.lazyLoad = function(slotName) {
	var handler =  function() {
		if (ads.slots[slotName].inView()) {ads.gpt.defineSlot(slotName);}
	};
	if (window.addEventListener) {
		addEventListener('DOMContentLoaded', handler, false);
		addEventListener('load', handler, false);
		addEventListener('scroll', handler, false);
		addEventListener('resize', handler, false);
	} else if (window.attachEvent)  {
		window.attachEvent('onDOMContentLoaded', handler); // IE9+ :(
		window.attachEvent('onload', handler);
		window.attachEvent('onscroll', handler);
		window.attachEvent('onresize', handler);
	}
};





proto.fetchSlotConfig = function  (container, slotName, config) {
	if (slotName === "searchbox") {slotName = "newssubs";}
	var attrs, attr, attrObj, name, matches, parser,
		sizes = [],
		targeting = {pos: slotName},
		parsers = {
			'size': function (name, value){
				value.replace(/(\d+)x(\d+)/g, function (match, width, height) {
					sizes.push([ parseInt(width, 10), parseInt(height, 10)]);
				});

				return !!sizes.length ? sizes : false;
			},
			'position': function (name, value){
				targeting.pos = value;
				return value;
			},
			'out-of-page':  function (){
				config.outOfPage = true;
				return true;
			},
			'page-type':  function (name, value){
				targeting.pt = value;
				return value;
			},
			'targeting': function (name, value) {
				if (value !== undefined) {
					value = ads.utils.hash(value, ';', '=');
					targeting = ads.utils.extend(targeting, value);
				}
				return value;
			},
			'default': function (name, value) {
				targeting[name] = value;
				return value;
			}
		};

	attrs = container.attributes;
	for(attr in attrs) {
		attrObj = attrs[attr];
		/**
		/* the below is needed to make the code work in IE8,
		/* because host Objects don't inherit has own property in IE8
		/* we have to call it from the Object prototype
		*/
		if(Object.prototype.hasOwnProperty.call(attrs, attr) && attrObj.name && !!(matches = attrObj.name.match(/(data-)?(o-ads|ad|ftads)-(.+)/)) ) {
			name = matches[3];
			parser = ads.utils.isFunction(parsers[name]) ? parsers[name] : parsers['default'];
			parser(name, attrObj.value);
		}
	}

	return {
		sizes: !!(sizes.length) ? sizes : config.sizes,
		outOfPage: config.outOfPage || false,
		collapseEmpty: config.collapseEmpty,
		targeting: targeting,
		cbTrack: config.cbTrack,
		lazyLoad: config.lazyLoad
	};
};

/**
* Given a script tag the method will inject a div with the given id into the dom just before the script tag
* if the script tag has the same id as given to the method the attribute will be removed and added to the new div
* Given any other tag the method will append the new div as a child
* @name addContainer
* @memberof Slots
* @lends Slots
*/
proto.addContainer = function(node, id) {
	var container = document.createElement('div');

	container.setAttribute('id', id);

	if (node.tagName === 'SCRIPT') {
		if (node.id === id) {
			node.removeAttribute('id');
		}
		node.parentNode.insertBefore(container, node);
	} else {
		node.appendChild(container);
	}

	return container;
};


/**
* Given an element and an Array of sizes in the format [[width,height],[w,h]]
* the method will apply style rules to center the container, the rules applied are
* margin-left, margin-right: auto
* max-width: derived maximum
* min-width: 1px
* @name centerContainer
* @memberof Slots
* @lends Slots
*/
proto.centerContainer = function (container) {
	ads.utils.addClass(container, 'center');
};

/**
* Add a data-attribute for chartbeat tracking to the div element which contains the slot
* @name addChartBeatTracking
* @memberof GPT
* @lends GPT
*/
//TODO Refactor this code into the chartbeat module
proto.addChartBeatTracking = function(container, slotName) {
	container.setAttribute('data-cb-ad-id', slotName);
};
/**
* Given an array of slotnames will collapse the slots using the collapse method on the slot
* @name collapse
* @memberof Slots
* @lends Slots
*/
proto.collapse = function (slotNames) {
	var slotName, result = false;
	if (!ads.utils.isArray(slotNames)){
		slotNames = [slotNames];
	}

	while(slotName = slotNames.pop()) {
		if(this[slotName] && ads.utils.isFunction(this[slotName].collapse)) {
			this[slotName].collapse();
			result = true;
		}
	}

	return result;
};

/**
* Given an array of slotnames will uncollapse the slots using the uncollapse method on the slot
* @name uncollapse
* @memberof Slots
* @lends Slots
*/
proto.uncollapse = function (slotNames) {
	var slotName, result = false;
	if (!ads.utils.isArray(slotNames)){
		slotNames = [slotNames];
	}

	while(slotName = slotNames.pop()) {
		if(this[slotName] && ads.utils.isFunction(this[slotName].uncollapse)) {
			this[slotName].uncollapse();
			result = true;
		}
	}
	return result;
};

/**
* creates a container for the ad in the page and gathers slot config then
* calls the GPT module to define the slot in the GPT service
* @name createSlot
* @memberof Slots
* @lends Slots
*/
proto.initSlot = function (slotName) {
	if (this[slotName]) {
		return false;
	}

	var container = document.getElementById(slotName),
		formats =  ads.config('formats');

	if (!container) {
		return false;
	}

	var config = this.fetchSlotConfig(container, slotName, formats[slotName] || {});
	if (!config.sizes){
		return false;
	}

	if (container.tagName === 'SCRIPT') {
		container = this.addContainer(container, slotName);
	}


	this.centerContainer(container, config.sizes);
	if (config.cbTrack) {this.addChartBeatTracking(container, slotName);}
	if (config.lazyLoad) {this.lazyLoad(slotName);}

	this[slotName] = {
		container: container,
		config: config,
		collapse: function(){
			ads.utils.addClass(this.container, 'empty');
			ads.utils.addClass(document.body, 'no-' + container.id);
		},
		uncollapse: function(){
			ads.utils.removeClass(this.container, 'empty');
			ads.utils.removeClass(document.body, 'no-' + container.id);
		},

		inView : function() {
			var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			var rect = container.getBoundingClientRect();
			return (rect.top <= h);
		}

	};

	if (!config.lazyLoad) {ads.gpt.defineSlot(slotName);}
	return this[slotName];
};

module.exports = new Slots();

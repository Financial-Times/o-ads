'use strict';
var utils = require('./utils');
var ads = require('../../main.js');
var slots = require('./slots.js');
var config = ads.config();
var baseProperties  = {
	server: 'gpt',
	targeting: {},
	sizes: [],
	center: false,
	rendered: false,
	outOfPage: false,
	lazyLoad: false,
	collapseEmpty: false
};

var attributeParsers = {
	sizes: function(value, sizes){
		if (utils.isArray(sizes)) {
			value.replace(/(\d+)x(\d+)/g, function (match, width, height) {
				sizes.push([ parseInt(width, 10), parseInt(height, 10)]);
			});
		}
		return sizes;
	},
	formats: function(value, sizes){
		if(utils.isArray(sizes) && utils.isString(value)){
			value.split(',').forEach(function (format) {
				var size = config.formats[format.trim()];
				if (utils.isArray(size)) {
					sizes.concat();
				} else {
					sizes.push(size);
				}
			});
		}
		return sizes;
	},
	responsiveSizes: function(name, value, sizes){
		var screenName = name.replace(/^sizes/, '');
		if (!utils.isPlainObject(sizes)) {
			sizes = {};
		}
		sizes[screenName] = attributeParsers.sizes(value, sizes[screenName] || []);
		return sizes;
	},
	responsiveFormats: function(name, value, sizes){
		var screenName = name.replace(/^formats/, '');
		if (!utils.isPlainObject(sizes)) {
			sizes = {};
		}
		sizes[screenName] = attributeParsers.formats(value, sizes[screenName] || []);
		return sizes;
	},
	targeting: function (value, targeting) {
		value = utils.hash(value, ';', '=');
		utils.extend(targeting, value);
	},
	"default": function (value) {
		if (value === '' || value === 'true'){
			value = true;
		} else if (value === 'false') {
			value = false;
		}
		return value;
	}
};

/**
* The Slot class.
* @class
* @constructor
*/
function Slot(container) {
	// store the container
	this.container = container;
	// setup slot dom structure
	this.outer = this.addContainer(container, { class: 'outer' });
	this.inner = this.addContainer(this.outer, { class: 'inner'});
	utils.extend(this, baseProperties, config.slots[this.name] || {});
	// make sure the slot has a name
	this.setName();

	this.addChartBeatTracking();
	this.centerContainer();
	// if we're not lazy loading fire the ready event
	if (!this.lazyLoad) {
		this.ready();
	}
}

/**
* parse slot attribute config
*/
Slot.prototype.parseAttributeConfig = function(){
	var result = {};
	[].slice.call(this.container.attributes).forEach(function (attribute) {
		var name = utils.parseAttributeName(attribute.name);
		var value = attribute.value;
		if(attributeParsers[name]){
			this[name] = attributeParsers[name](value, this[name]);
		} else if (/^formats\w*/.test(name)) {
			this.sizes = attributeParsers.responsiveFormat(name, value, this.sizes);
		} else if (/^sizes\w*/.test(name)) {
			this.sizes = attributeParsers.responsiveSize(name, value, this.sizes);
		} else if(this[name]) {
			this[name] = attributeParsers.default(value);
		}
	});
	return result;
};


/**
*	If the slot doesn't have a name give it one
*/
Slot.prototype.setName = function () {
	this.name = this.name || 'o-ads-slot-' + (Object.keys(slots).length + 1);
};

/**
* add the empty class to the slot signifying there was no ad to load into the slot
*/
Slot.prototype.collapse = function(){
	utils.addClass(this.container, 'empty');
	utils.addClass(document.body, 'no-' + this.name);
};

/**
* remove the empty class from the slot
*/
Slot.prototype.uncollapse = function(){
	utils.removeClass(this.container, 'empty');
	utils.removeClass(document.body, 'no-' + this.name);
};

/**
*	fire the refresh event on the slot
*/
Slot.prototype.refresh = function(){
	utils.broadcast('refresh', {
		name: this.name,
		slot: this
	}, this.container);
};

/**
*	fire the ready event on the slot
*/
Slot.prototype.ready = function(){
	utils.broadcast('ready', {
		name: this.name,
		slot: this
	}, this.container);
};

/**
*	fire the complete event on the slot
* this should be fired by the ad server module
* when it's finished rendering the slot
*/
Slot.prototype.complete = function(){
	utils.broadcast('complete', {
		name: this.name,
		slot: this
	}, this.container);
};

/**
*	add a div tag into the current slot container
**/
Slot.prototype.addContainer = function(node, attrs){
	var container = '<div ';
	Object.keys(attrs || {}).forEach(function (attr) {
		var value = attrs[attr];
		container += attr + '=' + value + ' ';
	});

	container += '></div>';
	node.insertAdjacentHTML('beforeend', container);
	return node.lastChild;
};

/*
*	add the slot name as an attribute for chartbeat tracking
*/
Slot.prototype.addChartBeatTracking = function() {
	if(config.cbTrack){
		this.container.setAttribute('data-cb-ad-id', this.name);
	}
};

/**
* Add a data-attribute for chartbeat tracking to the div element which contains the slot
* @name addChartBeatTracking
* @memberof Slot
* @lends Slot
*/
Slot.prototype.centerContainer = function () {
	if(this.center){
		utils.addClass(this.container, 'center');
	}
};


//TODO: Remove reference to FT.com newssub / searchbox ad position.
// if (slotName === "searchbox") {slotName = "newssubs";}


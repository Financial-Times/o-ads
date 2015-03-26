/**
* The Slot class.
* @class
* @constructor
*/
function Slot(name, container, config) {
	this.container = container;
	this.name = name;
	this.globalConfig = config;
	this.server = 'gpt';
	this.sizes = [];
	this.targeting = {};
	this.outer = this.addContainer(container, { class: 'outer' });
	this.inner = this.addContainer(container, { class: 'inner'});

	this.sizes = this.getSizes(config.slot.sizes || []);
	this.outOfPage = this.getOutOfPage(config.slot.outOfPage);
	this.collapseEmpty = this.CollapseEmpty(config.slot.collapseEmpty);
	this.cbTrack = this.getCbTrack(config.slot.cbTrack);
	this.lazyLoad = this.getLazyLoad(config.slot.lazyLoad);

	this.targeting = config.slot.targeting || {};
	this.getTargeting();

	if (config.cbTrack) {
		this.addChartBeatTracking(container, slotName);
	}

	if (!this.lazyLoad) {
		ads.utils.broadcast('ready', {
			name: this.name,
			slot: this
		}, this.container);
	}
}

/**
* add the empty class to the slot signifying there was no ad to load into the slot
*/
Slot.prototype.collapse = function(){
	ads.utils.addClass(this.container, 'empty');
	ads.utils.addClass(document.body, 'no-' + container.id);
}

/**
* remove the empty class from the slot
*/
Slot.prototype.uncollapse = function(){
	ads.utils.removeClass(this.container, 'empty');
	ads.utils.removeClass(document.body, 'no-' + container.id);
}

/**
*	add a div tag into the current slot container
**/
Slot.prototype.addContainer = function(attrs){
	var container = '<div ';
	Object.keys(attrs || {}).forEach(function (attr) {
		var value = attrs[attr];
		container += attr + '=' + attrs[attr] + ' ';
	});

	container += '></div>';
	this.container.insertAdjacentHTML('beforeend', container);
	return node.lastChild;
};

/*
*	add the slot name as an attribute for chartbeat tracking
*/
Slot.prototype.addChartBeatTracking = function(container, slotName) {
	this.container.setAttribute('data-cb-ad-id', this.name);
};

/**
* Add a data-attribute for chartbeat tracking to the div element which contains the slot
* @name addChartBeatTracking
* @memberof Slot
* @lends Slot
*/
Slot.prototype.centerContainer = function () {
	ads.utils.addClass(this.container, 'center');
};

Slot.prototype.getSizes = function(sizes) {
	var value = this.container.getAttribute('data-o-ads-sizes') || '';
	value.replace(/(\d+)x(\d+)/g, function (match, width, height) {
		this.sizes.push([ parseInt(width, 10), parseInt(height, 10)]);
	});

	var slotFormats = (this.container.getAttribute('data-o-ads-formats') || '').split(',');
	for (var i = 0; i < slotFormats.length; i++) {
		slotFormats[i] = slotFormats[i].trim();
		slotFormats[i] = this.globalConfig[formats[i]];
		if (ads.utils.isArray(slotFormats[i].sizes[0])) {
			for (var j = 0; j < slotFormats[i].sizes.length; j++){
				sizes.push(slotFormats[i].sizes[j]);
			}
		} else {
			sizes.push(formats[i].sizes);
		}
	}
	return sizes;
};


Slot.prototype.getPosition =  function (){
	var value = this.container.getAttribute('data-o-ads-position') || false;
	if(value) {
		this.targeting.pos = value ? ;
	}
	return value;
};

Slot.prototype.getOutOfPage =  function (value){
	var attr = this.container.getAttribute('data-o-ads-out-of-page');
	if(attr) {
		value = attr;
	}
	return value;
};

Slot.prototype.getTargeting = function () {
	var attr = this.container.getAttribute('data-o-targeting');
	if (attr) {
		var value = ads.utils.hash(attr, ';', '=');
		ads.utils.extend(this.targeting, value);
	}
};

Slot.prototype.getLazyLoad =  function (){
	var attr = this.container.getAttribute('data-o-ads-lazy-load');
	if(attr) {
		value = attr;
	}
	return value;
};


//TODO: Remove reference to FT.com newssub / searchbox ad position.
// if (slotName === "searchbox") {slotName = "newssubs";}


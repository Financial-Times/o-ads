/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@com
 */
/**
 * ads.admantx provides admantx contextual data target information
 * @name targeting
 * @memberof ads
*/
'use strict';

var utils = require('../utils');
var config = require('../config');
var targeting = require('../targeting');

/**
 * The Admantx class defines an ads.admantx instance
 * @class
 * @constructor
*/
function Admantx() {
}

/**
 * initialise Admantx functionality
 * calls Admantx api for targeting information
 * @name init
 * @memberof Admantx
 * @lends Admantx
*/
Admantx.prototype.init = function () {
	this.config = config('admantx') || {};
	if (this.config.id) {
		this.collections = this.config.collections || {admants: true};
		this.api = this.config.url || 'http://usasync01.admantx.com/admantx/service?request=';
		this.makeAPIRequest();
	}
};


Admantx.prototype.makeAPIRequest = function () {
	var requestData = {
		"key": this.config.id,
		"method":"descriptor",
		"mode":"async",
		"decorator":"template.ft",
		"filter":["default"],
		"type":"URL",
		"body": encodeURIComponent(utils.getLocation())
	};
	var url = this.api + encodeURIComponent(JSON.stringify(requestData));
	this.xhr = utils.createCORSRequest(url, 'GET', this.resolve.bind(this), this.resolve.bind(this));
};

Admantx.prototype.processCollection = function(collection, max) {
	var names = [];
	var i = 0;
	var j = utils.isNumeric(max) ? Math.min(max, collection.length) : collection.length;
	for (;i < j; i++) {
		names.push(collection[i].name || collection[i]);
	}
	return names;
};

Admantx.prototype.resolve = function (response) {
	var collection;
	var collections = this.collections;
	var shortName;
	var targetingObj = {};
	if (utils.isString(response)) {
		try {
			response = JSON.parse(response);
		} catch (e){
			// if the response is not valid JSON;
			response = false;
		}
	}

	//parse required targetting data from the response
	if(response) {
		for(collection in collections) {
			if (collections.hasOwnProperty(collection) && collections[collection] && response[collection]) {
				shortName = collection.substr(0, 2);
				targetingObj[shortName] = this.processCollection(response[collection], collections[collection]);
			}
		}
		targeting.add(targetingObj);
	}
};

module.exports = new Admantx();

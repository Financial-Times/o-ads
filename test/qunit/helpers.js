/* jshint globalstrict: true, browser: true */
/* global sinon: false, $: false, module: true, QUnit: false, require: true */
"use strict";

/* a URL that can be used in tests without causing 404 errors */
module.exports.nullUrl = 'base/test/qunit/mocks/null.js';

/* container for fixtures */
module.exports.fixturesContainer = document.getElementById('qunit-fixtures');

/* the google library mock*/
var gpt = require('./mocks/gpt-mock');

module.exports.gpt = gpt.mock;

/* A method for logging warnings about tests that didn't run for some reason */
/* such as tests that mock read only properties in a browser that doesn't allow this */
module.exports.warn = function (message) {
	/* jshint devel: true */
	if (console) {
		var log = console.warn || console.log;
		log.call(console, message);
	}
};

/* trigger a dom event */
module.exports.trigger = function (element, eventType, bubble, cancelable) {
	var event;
	element = element || document.body;
	element = $.type(element) === 'string' ? document.querySelector(element) : element;
	if (document.createEvent) {
		event = document.createEvent("HTMLEvents");
		event.initEvent(eventType, bubble || true, cancelable || true);
		element.dispatchEvent(event);
	} else {
		event = document.createEventObject();
		event.eventType = eventType;
		event.cancelBubble = bubble ? false : true ;
		element.fireEvent("on" + event.eventType, event);
	}
	return event;
};

/* Setup a sinon sandbox to easily clear mocks */
var sandbox = QUnit.sandbox = module.exports.sandbox = sinon.sandbox.create();
/* Shortcuts to Sinon sandbox methods */
module.exports.spy = function () {
	return sandbox.spy.apply(sandbox, [].slice.call(arguments));
};

module.exports.stub = function () {
	return sandbox.stub.apply(sandbox, [].slice.call(arguments));
};

module.exports.mock = function () {
	return sandbox.mock.apply(sandbox, [].slice.call(arguments));
};

/* decorate document.body add/remove EventListener so we can remove any attached events */
var _addEventListener = document.body.addEventListener;
var _removeEventListener = document.body.removeEventListener;
sandbox._eventListeners = [];
document.body.addEventListener = function(type, listener){
	sandbox._eventListeners.push({type: type, listener: listener});
	_addEventListener.apply(document.body, [].slice.call(arguments));
};

document.body.removeEventListener = function(type, listener){
	var remove;
	sandbox._eventListeners.forEach(function(item, index){
		if(item.type === type && listener === listener) {
			remove = index;
		}
	});

	if (remove) {
		sandbox._eventListeners.splice(remove, 1);
	}
	_removeEventListener.apply(document.body, [].slice.call(arguments));
};

/* mock dates */
module.exports.date = function (time) {
	var clock;
	if (isNaN(time)){
		clock = sandbox.useFakeTimers();
	} else {
		clock = sandbox.useFakeTimers(time);
	}
	return clock;
};

/* mock xml http requests */
module.exports.server = function (clock) {
	if (clock) {
		return sandbox.useFakeServerWithClock();
	} else {
		return sandbox.useFakeServer();
	}
};

/* mock viewport dimensions */
// In order to mock the results from oViewport.getSize we stub Math.max
// and return the mocked width or height when the actual width and height are provided as arguments
// this could go bad if your code is using Math.max and happens to provide the window width/height as an argument
module.exports.viewport = function (width, height) {
	if (Math.max.restore) {
		Math.max.restore();
	}

	var _max = Math.max;
	this.stub(Math, 'max', function (){
		if(document.documentElement.clientWidth === arguments[0] || window.innerWidth === arguments[0]){
			return width;
		}

		if (document.documentElement.clientHeight === arguments[0] || window.innerHeight === arguments[0]) {
			return height;
		}

		return _max.apply(null, [].slice.call(arguments));
	});
};

/* Add meta data to the page */
module.exports.meta = function (data) {
	var name, attr, content, metatag;
	var attrs = '';
	if ($.isPlainObject(data)) {
		for (name in data) {
			if (data.hasOwnProperty(name)) {
				if ($.type(data[name]) === 'string'){
					attrs += 'content="' + data[name] + '"';
				} else if ($.isPlainObject(data[name])){
					content = JSON.stringify(data[name].content);
					for (attr in data[name]) {
						if(data[name].hasOwnProperty(attr)) {
							attrs += attr + '=\'' + data[name][attr] + '\' ';
						}
					}
				}
				metatag = '<meta name="' + name + '" ' + attrs + ' remove>';
				$(metatag).appendTo('head');
			}
		}
	} else {
		throw new MetaException('invalid data to build meta tags');
	}
	return data;
};

/* Mock cookies */
module.exports.cookies = function (data) {
	if ($.isPlainObject(data)){
		sandbox._cookies = this.ads.utils.cookies;
		this.ads.utils.cookies = data;
	} else {
		throw new CookiesException('Invalid data for cookies.');
	}
};

/* Mock global vars */
module.exports.window = function (data) {
	if ($.isPlainObject(data)){
		sandbox._globals = data;
		Object.keys(data).forEach(function (name) {
			window[name] = data[name];
		});
	} else {
		throw new GlobalsException('Invalid data for globals.');
	}
};


/* Mock localStorage */
module.exports.localStorage = function (data) {
	var canMock = !!window.localStorage;
	var fake;
	if (canMock) {
		sandbox._localStorage = window.localStorage;
		if ($.isPlainObject(data)) {
			var fakes = {
				getItem: function (key) {
					return data[key] || null;
				},
				setItem: function (key, value) {
					data[key] = value;
					return;
				},
				removeItem: function (key) {
					delete data[key];
				},
				key : function (index) {
					var keys = Object.keys(data);
					index = index || 0;
					return data[keys[index]] || null;
				}
			};

			try {
				Object.defineProperty(window , 'localStorage', { value: fakes, configurable: true, writable: true });
			} catch (err) {
				// this will fail in some browsers where you can't override host properties (Safari)
				// localStorage tests need to be skipped in those browsers
				canMock = false;
				delete sandbox._localStorage;
			}

			// replaces the original set of fakes with stubs
			for (fake in fakes) {
				if (fakes.hasOwnProperty(fake)) {
					sandbox.stub(window.localStorage, fake, fakes[fake]);
				}
			}
		} else {
			new LocalStorageException('Invalid data for localStorage');
		}
	}
	return canMock;
};

/* clear out anyting added to the page by tests */
/* and reset all the sinon mocks in the sandbox */
module.exports.clear = function () {
	// remove any tags added during testing
	$('[remove],[o-ads]').remove();
	// empty the fixtures container
	$('#qunit-fixtures').empty();

	// clear localStorage mock
	if (sandbox._localStorage) {
		window.localStorage = sandbox._localStorage;
		delete sandbox._localStorage;
	}

	// restore cookies
	if (sandbox._cookies){
		this.ads.utils.cookies = sandbox._cookies;
	}

	// delete gloval vars
	if(sandbox._globals){
		Object.keys(sandbox._globals).forEach(function (name) {
			delete window[name];
		});
	}

	sandbox._eventListeners.forEach(function (item) {
		_removeEventListener.call(document.body, item.type, item.listener);
	});
	sandbox._eventListeners = [];

	gpt.restore();
	sandbox.restore();
};

/* exception to be thrown by meta if invalid data is supplied */
function MetaException(message) {
	this.message = message;
	this.name = "MetaException";
}

/* exception to be thrown by localStorage if invalid data is supplied */
function LocalStorageException(message) {
	this.message = message;
	this.name = "LocalStorageException";
}

/* exception to be thrown by cookies if invalid data is supplied */
function CookiesException(message) {
	this.message = message;
	this.name = "CookiesException";
}


/* exception to be thrown by cookies if invalid data is supplied */
function GlobalsException(message) {
	this.message = message;
	this.name = "CookiesException";
}



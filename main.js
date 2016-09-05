function Ads() {
	addDOMEventListener();
}

// bung all our modules on the protoype
Ads.prototype.config = require('./src/js/config');
Ads.prototype.slots = require('./src/js/slots');
Ads.prototype.gpt = require('./src/js/ad-servers/gpt');
Ads.prototype.krux = require('./src/js/data-providers/krux');
Ads.prototype.rubicon = require('./src/js/data-providers/rubicon');
Ads.prototype.admantx = require('./src/js/data-providers/admantx');
Ads.prototype.targeting = require('./src/js/targeting');
Ads.prototype.utils = require('./src/js/utils');

/**
* Initialises the ads library and all sub modules
* @param config {object} a JSON object containing configuration for the current page
*/
const buildObjectFromArray = (targetObject) =>
	targetObject.reduce((prev, data) => {
			prev[data.key] = data.value;
			return prev;
		}, {});

Ads.prototype.init = function(config) {
	const targetingApi = config.targetingApi
	if(targetingApi) {
		fetch(targetingApi.user, {
			timeout: 2000,
			useCorsProxy: true
		})
		.then(res => res.json())
		.then(response => {
			config.dfp_targeting = this.utils.keyValueString(buildObjectFromArray(response.dfp.targeting));
			if(config.krux && config.krux.id) {
				if(!config.krux.attributes) { config.krux.attributes = {}; }
				config.krux.attributes.user = buildObjectFromArray(response.krux.attributes);
			}

			// check if krux id has been passed
			// if true, add krux *user* attributes
			// if not - nada
			this.things(config);
		})
		.catch((e) => console.log('WHYYYYYYYYYYY!', e) );
	} else {
		this.things(config);
	}

	return this;
	// we need to check if targetinApi has been passed as part of config
	// if it was passed we need to make a fetch request to targetingApi.user
	// once we get a respose we need to parse/format it
	// then add it to the config.dfp_targeting and config.krux.attributes?
	// then we init the rest

	// if no config.targetingApi was passed, behave as before and just init
};

Ads.prototype.things = function (config) {
	console.log('NOW YOU SEE ME!');
	this.config.init();
	this.config(config);
	this.slots.init();
	this.gpt.init();
	this.krux.init();
	this.rubicon.init();
	this.admantx.init();
	this.utils.on('debug', this.debug.bind(this));
	this.utils.broadcast('initialised', this);
	removeDOMEventListener();
	return this;

};

const initAll = function() {
	const metas = Array.from(document.getElementsByTagName('meta'));
	const stop = metas.filter(function(meta) {
		return meta.name === 'o-ads-stop';
	});
	/* istanbul ignore else  */
	if (!stop.length) {
		ads.init();
		const slots = Array.from(document.querySelectorAll('.o-ads, [data-o-ads-name]'));
		slots.forEach(ads.slots.initSlot.bind(ads.slots));
	}
};

Ads.prototype.debug = function (){
	let remove = true;
	if (localStorage.getItem('oAds')) {
		remove = false;
	} else {
		localStorage.setItem('oAds', true);
	}
	this.admantx.debug();
	this.gpt.debug();
	this.krux.debug();
	this.slots.debug();
	this.targeting.debug();

	if (remove) {
		localStorage.removeItem('oAds');
	}
};

function addDOMEventListener() {
	document.addEventListener('o.DOMContentLoaded', initAll);
}
function removeDOMEventListener() {
	document.removeEventListener('o.DOMContentLoaded', initAll);
}

const ads = new Ads();
module.exports = ads;

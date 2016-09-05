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
	if(!config){
		config = {};
	}
	const targetingApi = config.targetingApi
	// make request if targetingApi available
	if(targetingApi) {
		fetch(targetingApi.user, {
			timeout: 2000,
			useCorsProxy: true
		})
		//return json object
		.then(res => res.json())
		// convert json object to correct data format
		.then(response => {
			//if no config present, generate string accordingly
			if(!config.dfp_targeting) {
				config.dfp_targeting = this.utils.keyValueString(buildObjectFromArray(response.dfp.targeting));
			} else {
				// if data present, append 'custom' parameters
				let customObject = this.utils.hash(config.dfp_targeting, ';', '=');
				config.dfp_targeting = this.utils.keyValueString(this.utils.extend(customObject, buildObjectFromArray(response.dfp.targeting)));

			}

			// if krux present, and id present, assign *user* attributes
			if(config.krux && config.krux.id) {
				//if no attributes present, create object && assign user attributes.
				if(!config.krux.attributes) {
					config.krux.attributes = {};
					config.krux.attributes.user = buildObjectFromArray(response.krux.attributes);
				} else {
				//if attributes present, append user attributes
					this.utils.extend(config.krux.attributes.user, buildObjectFromArray(response.krux.attributes));
				}
			}
			//run all the other things.
			this.initLibrary(config);
		})
		.catch((e) => console.log('WHYYYYYYYYYYY!', e) );
	} else {
		//run all the other things
		this.initLibrary(config);
	}

	return this;
};

Ads.prototype.initLibrary = function (config) {
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

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


Ads.prototype.init = function(options) {
	this.config.init();
	this.config(options);
	const targetingApi = this.config().targetingApi
	if(targetingApi) {
		return Promise.all([fetchData(targetingApi.user), fetchData(targetingApi.page)])
		.then(response => {

			for(let i = 0; i < response.length; i++){
				let responseObj = response[i]
				let keys = ['user', 'page'];
				let kruxObj = {}

				if(responseObj.krux && responseObj.krux.attributes) {
					kruxObj[keys[i]] = this.utils.buildObjectFromArray(responseObj.krux.attributes)
					this.krux.add(kruxObj)
				}

				if(responseObj.dfp && responseObj.dfp.targeting) {
					this.targeting.add(this.utils.buildObjectFromArray(responseObj.dfp.targeting));
				}
			}
			return this.initLibrary();
		})
		.catch(this.initLibrary);
	} else {
		return Promise.resolve(this.initLibrary());
	}
};

const fetchData = function(target) {
  if(!target) { return Promise.resolve({}) };
  return fetch(target, {
    timeout: 2000,
  })
  .then(res => {return res.json()})
  .catch(() => {});
};

Ads.prototype.initLibrary = function() {
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

		ads.init().then(() => {
			const slots = Array.from(document.querySelectorAll('.o-ads, [data-o-ads-name]'));
			slots.forEach(ads.slots.initSlot.bind(ads.slots));
		})

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

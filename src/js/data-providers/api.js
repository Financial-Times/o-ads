const utils = require('../utils');

function Api() {
	this.data = [];
	this.config = {};
}

Api.prototype.getUserData = function(target) {
	if(!target) { return Promise.resolve({}); }
	return fetch(target, {
		timeout: 2000,
		useCorsProxy: true,
		credentials: 'include'
	})
		.then( res => res.json())
		.catch(() => Promise.resolve({}));

};

Api.prototype.getPageData = function(target, timeout) {
	if(!target) { return Promise.resolve({}); }

	timeout = timeout || 2000;
	return fetch(target, {
		timeout: timeout,
		useCorsProxy: true
	})
		.then( res => res.json())
		.catch(() => Promise.resolve({}));
};

Api.prototype.handleResponse = function(response) {
	utils.broadcast('apiRequestsComplete');
	this.data = response;

	for(let i = 0; i < response.length; i++) {
		const responseObj = response[i];
		const keys = ['user', 'page'];
		const kruxObj = {};

		if(responseObj.krux && responseObj.krux.attributes) {
			kruxObj[keys[i]] = this.instance.utils.buildObjectFromArray(responseObj.krux.attributes);
			this.instance.krux.add(kruxObj);
		}

		if(responseObj.dfp && responseObj.dfp.targeting) {
			this.instance.targeting.add(this.instance.utils.buildObjectFromArray(responseObj.dfp.targeting));
		}

		if(this.config.usePageZone && responseObj.dfp && responseObj.dfp.adUnit) {
			const gpt = this.instance.config('gpt');

			/* istanbul ignore else  */
			if(gpt && gpt.zone) {
				gpt.zone = responseObj.dfp.adUnit.join('/');
			}
		}
	}

	return response;
};

Api.prototype.init = function(config, oAds) {
	this.config = config;
	this.instance = oAds;

	if(!config) {
		return Promise.resolve();
	}

	return Promise.all([this.getUserData(config.user), this.getPageData(config.page)])
		.then(this.handleResponse.bind(this));
};

Api.prototype.reset = function() {
	this.instance.krux.resetAttributes();
	this.data.forEach(responseObj => {
		if(responseObj.dfp && responseObj.dfp.targeting) {
			responseObj.dfp.targeting.forEach(kv => {
				this.instance.targeting.remove(kv.key);
				this.instance.gpt.clearPageTargetingForKey(kv.key);
			});
		}
	});
};

module.exports = new Api();

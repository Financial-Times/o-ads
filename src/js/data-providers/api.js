
function Api() {
	this.data = [];
	this.config = {};
}

Api.prototype.getUserData = function(target) {
	if(!target) { return Promise.resolve({}) };
	return fetch(target, {
		timeout: 2000,
		useCorsProxy: true,
		credentials: 'include'
	})
	.then( res => res.json())
	.catch(() => Promise.resolve({}));

}

Api.prototype.getPageData = function(target) {
	if(!target) { return Promise.resolve({}) };

	return fetch(target, {
		timeout: 2000,
		useCorsProxy: true
	})
	.then( res => res.json())
	.catch(() => Promise.resolve({}));
}

Api.prototype.handleResponse = function(response) {
	this.data = response;

	for(let i = 0; i < response.length; i++) {
		let responseObj = response[i]
		let keys = ['user', 'page'];
		let kruxObj = {}

		if(responseObj.krux && responseObj.krux.attributes) {
			kruxObj[keys[i]] = this.instance.utils.buildObjectFromArray(responseObj.krux.attributes);
			this.instance.krux.add(kruxObj)
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
}

Api.prototype.init = function(config, oAds) {
	this.config = config;
	this.instance = oAds;

	if(!config) {
		return Promise.resolve();
	}

	return Promise.all([this.getUserData(config.user), this.getPageData(config.page)])
	.then(this.handleResponse.bind(this))
}

Api.prototype.reset = function() {
	this.instance.krux.resetAttributes();
	this.data.forEach(responseObj => {
		if(responseObj.dfp && responseObj.dfp.targeting) {
			responseObj.dfp.targeting.forEach(kv => {
				this.instance.targeting.remove(kv.key);
			});
		}
	})
}

module.exports = new Api();

import utils from '../utils';

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
	utils.broadcast('adsAPIComplete');
	this.data = response;

	window.smartmatch = { creative: { matches: {} } };

	for(let i = 0; i < response.length; i++) {
		const responseObj = response[i];
		const keys = ['user', 'page'];
		const behavioralMetaObj = {};
		const apiResponseBehavioral = responseObj.krux && responseObj.krux.attributes;
		if(apiResponseBehavioral) {
			behavioralMetaObj[keys[i]] = this.instance.utils.buildObjectFromArray(apiResponseBehavioral);
			this.instance.config({'behavioralMeta' : behavioralMetaObj});
		}

		if(responseObj.dfp && responseObj.dfp.targeting) {
			const dfpTargetingObj = this.instance.utils.buildObjectFromArray(responseObj.dfp.targeting);
			this.instance.targeting.add(dfpTargetingObj);
		}

		if (responseObj.content && responseObj.content.smartmatch) {
			const { targeting, matches } = responseObj.content.smartmatch;
			if (targeting && matches) {
				const { key, value } = targeting;
				if (key === 'smid' && typeof value !== 'undefined') {
					this.instance.targeting.add({[key]: value});
					window.smartmatch.creative.matches = matches;
				}
			}
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
	this.data.forEach(responseObj => {
		if(responseObj.dfp && responseObj.dfp.targeting) {
			responseObj.dfp.targeting.forEach(kv => {
				this.instance.targeting.remove(kv.key);
				this.instance.gpt.clearPageTargetingForKey(kv.key);
			});
		}
	});
};

export default new Api();

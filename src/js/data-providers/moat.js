/**
 * we use a third party script from moat to determine invalid traffic.
 * In ft.com this lives in n-ui.
 * The script exposes `window.moatPrebidApi` object which we check for here.
 * The script essentially ads some extra targeting parameters to the ad calls,
 * and if the validateAdsTraffic option is enabled, we need to wait for it to
 * be available before making any ad calls.
 */
const Moat = function() {}; // eslint-disable-line no-empty-function

Moat.prototype.init = function() {
	return new Promise((resolve, reject) => {
		const intervalId = setInterval(() => {
			if(window.moatPrebidApi) {
				clearInterval(intervalId);
				clearTimeout(timeoutId);
				resolve();
			}
		}, 50);
		const timeoutId = setTimeout(() => {
			clearInterval(intervalId);
			reject(new Error('Timeout while fetching moat invalid traffic script'));
		}, 1000);
	});
};

module.exports = new Moat();

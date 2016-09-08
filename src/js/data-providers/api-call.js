function AdsApi() {};

AdsApi.prototype.targeting = require('../targeting');
AdsApi.prototype.utils = require('../utils');
AdsApi.prototype.krux = require('./krux');

AdsApi.prototype.fetchData = function (target) {
  return fetch(target, {
    timeout: 2000,
    useCorsProxy: true
  })
  .then(res => {return res.json()})
  .catch(() => {});
};

module.exports = new AdsApi();

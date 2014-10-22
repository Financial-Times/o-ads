'use strict';
function Ads() {
    if (!(this instanceof Ads)){
        return new Ads();
    }
}


// bung all our modules on the protoype
Ads.prototype.config = require('./src/js/config');
Ads.prototype.gpt = require('./src/js/ad-servers/gpt');
Ads.prototype.krux = require('./src/js/data-providers/krux');
Ads.prototype.cb = require('./src/js/data-providers/chartbeat');
Ads.prototype.slots = require('./src/js/slots');
Ads.prototype.targeting = require('./src/js/targeting');
Ads.prototype.metadata = require('./src/js/metadata');
Ads.prototype.version = require('./src/js/version');
Ads.prototype.buildURLForVideo = require('./src/js/video');
Ads.prototype.utils = require('./src/js/utils');

Ads.prototype.init = function (config){
    // use `this` as our internal namespace
    // it's passed into each module so we can to maintain state in each module
    this.config.init(this);
    this.config(config);
    this.metadata.init(this);
    this.targeting.init(this);
    this.slots.init(this);
    this.krux.init(this);
    this.gpt.init(this);
    this.buildURLForVideo.init(this);
    return this;
};

module.exports = Ads();


function Ads() {
}

Ads.init = function (config){
    // this is our internal namespace
    // we passed into each module so we can to maintain state in each module
    // it enavles us to keep config as the single source of truth while stil maintaing the ability to change it on the fly
    this.config = require('./src/js/config');
    this.gpt = require('./src/js/ad-servers/gpt');
    this.krux = require('./src/js/data-providers/krux');
    this.cb = require('./src/js/data-providers/chartbeat');
    this.slots = require('./src/js/slots');
    this.targeting = require('./src/js/targeting');
    this.metadata = require('./src/js/metadata');
    this.version = require('./src/js/version');
    this.buildURLForVideo = require('./src/js/video');
    
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

module.exports = Ads;

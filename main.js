/**
 * O-ADS - the origami advertising library
 * @author Advertising Technology origami.advertising.technology@ft.com
 *
 */
'use strict';

/**
 * Represents an instance of the o-ads on the page.
 * @constructor
 */
function Ads() {
}


// bung all our modules on the protoype
Ads.prototype.config = require('./src/js/config');
Ads.prototype.gpt = require('./src/js/ad-servers/gpt');
Ads.prototype.krux = require('./src/js/data-providers/krux');
Ads.prototype.cb = require('./src/js/data-providers/chartbeat');
Ads.prototype.rubicon = require('./src/js/data-providers/rubicon');
Ads.prototype.admantx = require('./src/js/data-providers/admantx');
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
    this.cb.init(this);
    this.rubicon.init(this);
    this.admantx.init(this);
    this.gpt.init(this);
    this.buildURLForVideo.init(this);
    return this;
};

var ads = new Ads();
var initAll = function() {
    ads.init();
    var slots = document.querySelectorAll(".o-ads-slot");
  //  console.log(slots);
    for (var i = 0; i < slots.length; i++) {
   //     console.log(slots[i].dataset.oAdsSlotname);
        if (slots[i].dataset.oAdsSlotname){
            ads.slots.initSlot(slots[i].dataset.oAdsSlotname);
        }
    }
    document.removeEventListener('o.DOMContentLoaded', initAll);
};

document.addEventListener('o.DOMContentLoaded', initAll);

module.exports = ads;

/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
/**
 * FT.ads.targeting is an object providing properties and methods for accessing targeting parameters from various sources including FT Track and Audience Science and passing them into DFP
 * @name targeting
 * @memberof FT.ads
 // dependant modules ?

*/
"use strict";
var ads;
var proto = Krux.prototype;
var delegate, Delegate;
Delegate = require('dom-delegate');

//myDel.on('click', 'body', function(){alert('ok');})




/**
 * The Krux class defines an FT.ads.krux instance
 * @class
 * @constructor
*/
function Krux() {

}

proto.init = function (impl) {
    ads = impl;
    if (ads.config('krux') && ads.config('krux').id) {
        if (!window.Krux) {
            ((window.Krux = function(){
                    window.Krux.q.push(arguments);
                }).q = []
            );
        }

        var m,
        src= (m=location.href.match(/\bkxsrc=([^&]+)/)) && decodeURIComponent(m[1]),
        finalSrc = /^https?:\/\/([^\/]+\.)?krxd\.net(:\d{1,5})?\//i.test(src) ? src : src === "disable" ? "" :  "//cdn.krxd.net/controltag?confid=" + ads.config('krux').id;

        ads.utils.attach(finalSrc, true);
        this.events.init();
    } else {
        // can't initialize Krux because no Krux ID is configured, please add it as key id in krux config.
    }
};
    
/**
* retrieve Krux values from localstorage or cookies in older browsers.
* @name retrieve
* @memberof Krux
* @lends Krux
*/
proto.retrieve = function (name) {
    var value;
    name ='kx'+ name;

    if (window.localStorage && localStorage.getItem(name)) {
        value = localStorage.getItem(name);
    }  else if (ads.utils.cookie(name)) {
        value = ads.utils.cookie(name);
    }

    return value;
};

/**
* retrieve Krux segments
* @name segments
* @memberof Krux
* @lends Krux
*/
proto.segments = function () {
    return this.retrieve('segs');
};

/**
* Retrieve all Krux values used in targeting and return them in an object
* Also limit the number of segments going into the ad calls via krux.limit config
* @name targeting
* @memberof Krux
* @lends Krux
*/
proto.targeting = function (){
    var bht = false,
    segs = this.segments();
    if (segs) {
        segs = segs.split(',');
        if (ads.config('krux').limit) {
            segs = segs.slice(0, ads.config('krux').limit);
        }
    }

    return {
        "kuid" : this.retrieve('user'),
        "ksg" : segs,
        "khost": encodeURIComponent(location.hostname),
        "bht": segs && segs.length > 0 ? 'true' : 'false'
    };
};


/**
* An object holding methods used by krux event pixels
* @name events
* @memberof Krux
* @lends Krux
*/
proto.events = {
    dwell_time: function (config) {
        if (config) {
            var fire = this.fire,
                interval = config.interval || 5,
            max = (config.total / interval) || 120,
            uid = config.id;
            ads.utils.timers.create(interval, (function () {
                return function () {
                    fire(uid, {dwell_time: ( this.interval * this.ticks ) / 1000 });
                };
            }()), max, {reset: true});
        }
    },
    delegated : function(config){
        if (config) {
            window.addEventListener('load', function(){
                console.log(Object.keys(kevent));
                for (var kevent in config){console.log(kevent);
                    var delegate = new Delegate(document.body); 
                    delegate.on(config[kevent].eType, config[kevent].selector, function(){console.log('fire: ' + kevent);});
                }
            }, false);
        }
    }
};

proto.events.fire = function (id, attrs) {
    if(id) {
        attrs = ads.utils.isPlainObject(attrs) ? attrs : {};
        return window.Krux('admEvent', id, attrs);
    }
    return false;
};



proto.events.init = function() {
    var event, configured = ads.config('krux') && ads.config('krux').events;
    if (ads.utils.isPlainObject(configured)) {
        for(event in configured) {
            if(ads.utils.isFunction(this[event])) {
                this[event](configured[event]);
            } else if (ads.utils.isFunction(configured[event].fn)) {
                configured[event].fn(configured[event]);
            }
        }
    }
};


module.exports = new Krux();
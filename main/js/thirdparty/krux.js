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
*/
(function (win, doc, undefined) {
    "use strict";
    var proto = Krux.prototype;
/**
 * The Krux class defines an FT.ads.krux instance
 * @class
 * @constructor
*/
    function Krux() {
        this.config = FT.ads.config('krux');
        if (this.config.id) {
            if (!window.Krux) {
                ((window.Krux = function(){
                        window.Krux.q.push(arguments);
                    }).q = []
                );
                this._krux = window.Krux;
            } else {
                this._krux = window.Krux;
            }

            var m,
            src= (m=location.href.match(/\bkxsrc=([^&]+)/)) && decodeURIComponent(m[1]),
            finalSrc = /^https?:\/\/([^\/]+\.)?krxd\.net(:\d{1,5})?\//i.test(src) ? src : src === "disable" ? "" :  "//cdn.krxd.net/controltag?confid=" + this.config.id;

            FT._ads.utils.attach(finalSrc,true);
        } else {
            // can't initialize Krux because no Krux ID is configured, please add it as key id in krux config.
        }
    }


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
        }  else if (FT._ads.utils.cookie(name)) {
            value = FT._ads.utils.cookie(name);
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
        var segs = this.retrieve('segs'),
            limit = this.config.limit;

        return segs;
    };

/**
 * Retrieve all Krux values used in targeting and return them in an object
 * Also limit the number of segments going into the ad calls via krux.limit config
 * @name getFromConfig
 * @memberof Krux
 * @lends Krux
*/
    proto.targeting = function (){
        var bht = false,
        segs = this.segments();
        if (segs) {
            segs = segs.split(',');
            if (this.config.limit) {
                segs = segs.slice(0, this.config.limit);
            }
            return segs;
        }

        return  {
            "kuid" : this.retrieve('user'),
            "ksg" : segs,
            "khost": encodeURIComponent(location.hostname),
            "bht": segs && segs.length > 0 ? 'true' : 'false'
        };
    };

  FT._ads.utils.extend(FT.ads, {krux: new Krux()});
}(window, document));

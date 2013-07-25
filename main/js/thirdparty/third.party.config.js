/**
 * @fileOverview
 * Third party library for use with google publisher tags.
 *
 * @author Robin Marr, robin.marr@ft.com
 */

(function (win, doc, undefined) {
    "use strict";

    function Config() {

<<<<<<< HEAD
        var defaults = {
=======
        this.defaults = {
>>>>>>> efd686c4e4c864b08ccd5953d37c319b45a194b0
          network: '5887',
          collapseEmpty: true,
          formats:  {
                banlb: [[728,90], [468,60], [970,90]],
                mpu: [[300,250],[336,280]],
                doublet: [[342,200]],
                hlfmpu: [[300,600],[336,850],[300,250],[336,280]],
                intro: [[1,1]],
                newssubs: [[239,90]],
                refresh: [[1,1]],
                searchbox: [[200,28]],
                tlbxrib: [[336,60]]
          },
          audSciLimit : 2
        };

       // this.store = {};
    var store = {};

    var fetchMetaConfig = function() {
        var meta,
            results = {},
            metas = doc.getElementsByTagName('meta');

        for (var i= 0; i < metas.length; i++) {
            meta = metas[i];
            if (meta.name) {
               results[meta.name] = meta.content;
            }
        }

        return results;
    };

    var fetchGlobalConfig = function() {
        return FT._ads.utils.isObject(FT.env) ? FT.env : {};
    };

    var access= function(k,v){
        var result;
        if (typeof v==="undefined") {
            // envoke the getter
            if (typeof k ==="undefined"){result = store;}
            else {
                if (k === 'clear') {
                    store={};
                    result=store;
                }
                else {result = store[k];}
            }
        }
        if (typeof v !== "undefined"){
            store[k] = v;
            result = v;
        }
    return result;
  };


    var clear = function() {
        store = {};
    };

    var init = function() {
        store = FT._ads.utils.extend({}, defaults, fetchMetaConfig(), fetchGlobalConfig());
    };

   init();
        return access;
    }

    if (!win.FT && FT._ads.utils.isObject(win.FT)) {
        FT = win.FT = {};

    }

    if (!FT.ads) {
        FT.ads = {};
    }

    FT._ads.utils.extend(FT.ads, {config: new Config()});
}(window, document));

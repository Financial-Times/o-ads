(function (window, document, FT, undefined) {
    /**
     * @namespace All public functions are stored in the FT._ads.utils object for global access.
     */
    FT = FT || {};

    /**
     * @namespace All public functions are stored in the FT._ads.utils object for global access.
     */
    FT._ads = FT._ads || {};

    /**
     * @namespace All public functions are stored in the FT._ads.utils object for global access.
     */
    utils = FT._ads.utils = FT._ads.utils || {};

    var callback, viewPorts, current,
        timer = false;

    function getViewportDims() {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {w : e[a + 'Width'], h: e[a + 'Height']};
    }


    function getNearestBreakpoint() {
        var viewPort, viewPortDims, current, winner,
            dims = getViewportDims();
        console.log('dims:', dims.w, dims.h);
        for (viewPort in viewPorts){
            viewPortDims = viewPorts[viewPort];
            if(dims.w > viewPortDims[0] && dims.h > viewPortDims[1]){
                if(!winner || viewPortDims[0] > viewPorts[winner][0]) {
                    winner = viewPort;
                }
            }
        }

       return winner;
    }

    function fire() {
        var winner = getNearestBreakpoint();

        if (current !== winner) {
            setCurrent(winner);
            callback(winner);
        }
    }

    function setCurrent(name){
        current = name;
    }

    function onResize() {
        if (timer) {clearTimeout(timer); }
        timer = setTimeout(function () {fire();}, 200);
    }

    function init(vps, cb) {

        if(!utils.isFunction(cb)) {
            // must have a call back function
            return false;
        }

        viewPorts = vps;
        callback = cb;

        setCurrent(getNearestBreakpoint());

        if (window.addEventListener) {
            window.addEventListener("resize", onResize, false);
        }
        else if (document.body.attachEvent) {
            document.body.attachEvent("onresize", onResize);
        }
    }

    utils.responsive = init;
})(window, document, FT);

/**
 * Created with JetBrains WebStorm.
 * User: andrew.tekle-cadman
 * Date: 05/04/2013
 * Time: 16:31
 * To change this template use File | Settings | File Templates.
 */

/**
 * Created with JetBrains WebStorm.
 * User: andrew.tekle-cadman
 * Date: 25/03/13
 * Time: 11:12
 * To change this template use File | Settings | File Templates.
 */

/*jshint strict: false */

/*globals FT, doTrackRefresh */

/*members onVisibilityChange, enableVisibilitySupportForOlderBrowsers, pop,
 event, isVisible, type, addEventListener, onblur, onfocus, onfocusin,
 onfocusout, hasOwnProperty, detectPageVisibility, Refresh, refreshTime, runningTimer, log,
  startRefreshTimer, handleW3CVisibility, handleAlentyVisibility, getElementById, innerHTML,
  env,asset, handleRefreshLogic, origOnFocusIn, origOnFocusOut, origOnFocus, origOnBlur, name,
 pageVisibilityScope
 */

FT.Refresh = (function () {

    var browserPrefixes = ['', 'moz', 'ms', 'o', 'webkit'],
    // event name which varies per browser (mozvisibilitychange, webkitvisibilitychange, msvisibilitychange, visibilitychange)
        eventName = 'visibilitychange',
    // the hidden property name which varies per browser (hidden, mozHidden, webkitHidden, msHidden)
        hiddenPropName,
    // boolean if the browser supports page visibility api or not
        pvFlag = false;

    /*commented to satsfy jshint..... */
        //origOnFocusIn = document.onfocusin,

        //origOnFocusOut = document.onfocusout,

       // origOnFocus = window.onfocus,

        //origOnBlur = window.onblur;

    /**
     * This function checks if the browser has support for Page Visibility API.
     * Checks the hidden property in document (whose name varies per browser).
     * This also identifies the correct event name per browser.
     */
    function hasPageVisibilityAPI() {
        var property, prefix;
        while ((prefix = browserPrefixes.pop()) !== undefined) {
            property = (prefix ? prefix + 'H' : 'h') + 'idden';
            if (typeof document[property] === 'boolean') {
                hiddenPropName = property;
                eventName = prefix + 'visibilitychange';
                pvFlag = true;
                break;
            }
        }
    }

    return {

        /**
         * Boolean if page is visible or not, defaults to true
         */
        isVisible: true,
        refreshTime: null,
        runningTimer: null,

        /**
         * This function handles the visibility change, setting the appropriate
         * isVisible value
         */
        onVisibilityChange: function (evt) {
            evt = evt || window.event;

            if (typeof window.pageVisibilityScope !== "undefined")  {
                scope = window.pageVisibilityScope;
            }  else {
                scope = this;
            }

            if (pvFlag === true) {
                scope.isVisible = !document[hiddenPropName];
            } else {
                if (evt.type === "focus" || evt.type === "focusin") {
                    scope.isVisible = true;
                } else if (evt.type === "blur" || evt.type === "focusout") {
                    scope.isVisible = false;
                }
            }

            if (!scope.isVisible) {
                //now we stop the timer if it is running down
                if (scope.runningTimer !== null){
                    clearTimeout(scope.runningTimer);
                }
                scope.log('The page has lost visibility.');
            } else {
                //restart the timer when visibility is regained
                if (scope.refreshTime !== null)  {
                    scope.startRefreshTimer(scope.refreshTime);
                }
                scope.log('The page has gained visibility.');
            }

        },

        /**
         * This function enables visibility detection for older browsers by
         * attaching onVisibilityChange() from onfocusin/onfocusout (for IE 9 lower)
         * or onfocus/onblur
         *
         * TODO: decorator pattern
         */

        enableVisibilitySupportForOlderBrowsers: function () {
            // IE9 and lower:
            if ('onfocusin' in document) {
                /*
                 document.onfocusin = function() {
                 //origOnFocusIn();
                 onVisibilityChange();
                 return;
                 }

                 document.onfocusout = function () {
                 //origOnFocusOut();
                 onVisibilityChange();
                 return;
                 }*/

                document.onfocusin = document.onfocusout = this.onVisibilityChange;
            } else {
                /*
                 window.onfocus = function() {
                 // origOnFocus();
                 onVisibilityChange();
                 return;
                 }

                 window.onblur = function() {
                 // origOnBlur();
                 onVisibilityChange();
                 return;
                 }
                 */
                window.onfocus = window.onblur = this.onVisibilityChange;
            }
        },

        /**
         * This function handles page visibility detection. It sets isVisible and
         * attach the proper event handlers.
         *
         * flag is false: the page is visible
         * flag = w3: use w3c to detect page visibility
         * flag = alenty: use alenty standards to detect page visibility
         */
        detectPageVisibility: function(flag) {

            //preserve scope for window events
            window.pageVisibilityScope = this;

            hasPageVisibilityAPI();

            if (flag === "w3c") {
                this.handleW3CVisibility();
            } else if (flag === "alenty") {
                this.handleAlentyVisibility();
            }
        },

        /**
         * W3C's definition of page visibility: http://www.w3.org/TR/page-visibility/
         * Non-visible (Inactive)
         * - The User Agent is minimized.
         * - The User Agent is not minimized, but the page is on a background tab.
         * - The User Agent is about to unload the page.
         * - The User Agent is about to traverse to a session history entry.
         * - The Operating System lock screen is shown.
         *
         * Visible (Active)
         * - The User Agent is not minimized and the page is on a foreground tab.
         * - The User Agent is fully obscured by an Accessibility Tool, like a magnifier, but a view of the page is shown.
         */

        handleW3CVisibility: function() {
            if (pvFlag === true) {
                if (document.addEventListener) { document.addEventListener(eventName, this.onVisibilityChange); }
            } else {
                this.enableVisibilitySupportForOlderBrowsers();
            }
        },

        /**
         * ALENTY's definition of inactive page:
         * - pages that do not have the focus (invisible pages)
         * - pages that are visible but no one is using the computer (no mouse-keyboard activity in the last minute for instance)
         */
        handleAlentyVisibility: function () {
            pvFlag = false;
            this.enableVisibilitySupportForOlderBrowsers();
        },

        log: function(text) {
            var div = document.getElementById('fullpage-container');
            div.innerHTML = div.innerHTML + text + '<br>';
        },

        /** handle refresh logic migrated from FT.advertising */
        handleRefreshLogic: function (obj, timeout) {
            this.log("FT.Refresh.handleRefreshLogic(" + obj.name + ", " + timeout + ")");
            // TODO: no test case for this yet.
            timeout = timeout || 30 * 60 * 1000;  // give it 30 minutes
            if ((obj.name === 'refresh') && (FT.env.asset === 'page')) {
                this.refreshTime = timeout;
            }
        },

        /** startRefreshTimer logic transferred from FT.advertising namespace */
        startRefreshTimer: function (delay) {
            this.log("FT.Refresh.startRefreshTimer(" + delay + ")");
            // call doTrackRefresh from Track.js
            var preservedScope = this;
            this.runningTimer = setTimeout(function () {
                preservedScope.log("refreshTimer callback()");
                doTrackRefresh(delay);
            }, delay);
        }



    };
}());

//FT.Refresh.detectPageVisibility('w3c');

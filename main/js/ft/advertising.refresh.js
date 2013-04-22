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

/*globals FT, clientAds */

/*members onVisibilityChange, enableVisibilitySupportForOlderBrowsers, pop,
 event, isVisible, type, addEventListener, onblur, onfocus, onfocusin,
 onfocusout, hasOwnProperty, detectPageVisibility, Refresh, refreshTime, runningTimer, log,
  startRefreshTimer, handleW3CVisibility, handleAlentyVisibility, getElementById, innerHTML,
  env,asset, handleRefreshLogic, name, pageVisibilityScope,decorateHandler, pageVisibilityScope,
 refreshDelayMs,pageRefresh,userInteracting,cookie, location,href,reloadWindow,userInteractionTimer,
 reload */

FT.Refresh = (function () {

    var browserPrefixes = ['', 'moz', 'ms', 'o', 'webkit'],
        // event name which varies per browser (mozvisibilitychange, webkitvisibilitychange, msvisibilitychange, visibilitychange)
        eventName = 'visibilitychange',
        // the hidden property name which varies per browser (hidden, mozHidden, webkitHidden, msHidden)
        hiddenPropName,
        // boolean if the browser supports page visibility api or not
        pvFlag = false,
        //variable for preserving scope for event handlers
        preservedScope = "pageVisibilityScope";

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

    function returnPreservedScope () {
        if (typeof window[preservedScope] !== "undefined")  {
            return window[preservedScope];
        }  else {
            return null;
        }
    }

    return {

        /**
         * Boolean if page is visible or not, defaults to true
         */
        isVisible: true,
        refreshTime: null,
        runningTimer: null,
        refreshDelayMs: 2000,

        //function to preserve any events prevously attached to the document.onfocusin + document.onfocusout or window.onfocus +  window.onblur objects.
        decorateHandler: function (documentOrWindowProperty,func) {

            var existingHandler = documentOrWindowProperty || null;

            if (typeof existingHandler !== null) {
                return function () {
                    if (typeof existingHandler === 'function' ) {
                       existingHandler();
                    }
                    func();
                    return;
                    };
            }   else {
                return func;
            }
        },

        /**
         * This function handles the visibility change, setting the appropriate
         * isVisible value
         */
        onVisibilityChange: function (evt) {
            evt = evt || window.event;

            var scope = returnPreservedScope() || this;

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
                clientAds.log('The page has lost visibility.');
            } else {
                //restart the timer when visibility is regained
                if (scope.refreshTime !== null)  {
                    scope.startRefreshTimer(scope.refreshTime);
                }
                clientAds.log('The page has gained visibility.');
            }

        },

        /**
         * This function enables visibility detection for older browsers by
         * attaching onVisibilityChange() from onfocusin/onfocusout (for IE 9 lower)
         * or onfocus/onblur
         *
         */

        enableVisibilitySupportForOlderBrowsers: function () {

            //event handlers properties document.onfocusin is for IE9 and lower
            if ('onfocusin' in document) {
                //document.onfocusin = this.decorateHandler(document.onfocusin,this.onVisibilityChange);
                //document.onfocusout = this.decorateHandler(document.onfocusout,this.onVisibilityChange);
                document.onfocusin = document.onfocusout = this.onVisibilityChange;
            } else {
                //window.onfocus =  this.decorateHandler(window.onfocus,this.onVisibilityChange);
                //window.onblur =  this.decorateHandler(window.onblur,this.onVisibilityChange);
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
            window[preservedScope] = this;

            //purely for decorator testing  - uncomment and amend as necessary
            //window.onfocus = function () { window.pageVisibilityScope.log("decorated onfocus event"); };
            //window.onblur = function () { window.pageVisibilityScope.log("decorated onblur event"); };

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
        //removed from scope for US28820 - implement later
        handleAlentyVisibility: function () {
            //pvFlag = false;
            //this.enableVisibilitySupportForOlderBrowsers();

        },

        /*
        log: function(text) {
            //refactor this at some stage - put logs under utils?
            if ((typeof clientAds !== "undefined") && typeof clientAds.log !== "undefined") {
                clientAds.log(text);
            }
        },*/

        /** handle refresh logic migrated from FT.advertising */
        handleRefreshLogic: function (obj, timeout) {
            clientAds.log("FT.Refresh.handleRefreshLogic(" + obj.name + ", " + timeout + ")");
            // TODO: no test case for this yet.
            timeout = timeout || 30 * 60 * 1000;  // give it 30 minutes
            if ((obj.name === 'refresh') && (FT.env.asset === 'page')) {
                this.refreshTime = timeout;
            }
        },

        /** startRefreshTimer logic transferred from FT.advertising namespace */
        startRefreshTimer: function (delay) {
            clientAds.log("FT.Refresh.startRefreshTimer(" + delay + ")");
            var scope = returnPreservedScope() || this;

            this.runningTimer = setTimeout(function () {
                // call doTrackRefresh from Track.js
                clientAds.log("refreshTimer callback()");
                scope.pageRefresh(delay);
            }, delay);
        },

        /** pageRefresh logic transferred from FT.advertising namespace */
        pageRefresh: function(delay) {
            var scope = returnPreservedScope() || this;
            if (!FT.userInteracting) {
                document.cookie = "TRK_REF=" + window.location.href;
                setTimeout(function () { scope.reloadWindow(false); }, this.refreshDelayMs);
            } else {
                // Kick page refresh timer off again
                scope.userInteractionTimer = setTimeout(function () {
                    scope.pageRefresh(delay);
                }, delay);

            }

        },

        /** reloadWindow logic transferred from FT.advertising namespace */
        reloadWindow: function(b) {
            window.location.reload(b);
        }

    };

}());

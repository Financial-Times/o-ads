FT.PageVisibility = (function () {
	
	// browser prefixes
    var browserPrefixes = ['', 'moz', 'ms', 'o', 'webkit'],
    // event name which varies per browser (mozvisibilitychange, webkitvisibilitychange, msvisibilitychange, visibilitychange)
    eventName = 'visibilitychange',
    // the hidden property name which varies per browser (hidden, mozHidden, webkitHidden, msHidden)
    hiddenPropName,
    // boolean if the browser supports page visibility api or not
    pvFlag = false;

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
        if (typeof FT.preservedScope !== "undefined")  {
            return FT.preservedScope;
        }  else {
            return null;
        }
    }
    
    return {
    	
        /**
         * Boolean if page is visible or not, defaults to true
         */
        isVisible: true,
        
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

        },
        
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
         * This function enables visibility detection for older browsers by
         * attaching onVisibilityChange() from onfocusin/onfocusout (for IE 9 lower)
         * or onfocus/onblur
         *
         */

        enableVisibilitySupportForOlderBrowsers: function () {

            //event handlers properties document.onfocusin is for IE9 and lower
            if ('onfocusin' in document) {
                document.onfocusin = this.decorateHandler(document.onfocusin,this.onVisibilityChange);
                document.onfocusout = this.decorateHandler(document.onfocusout,this.onVisibilityChange);
            } else {
                window.onfocus =  this.decorateHandler(window.onfocus,this.onVisibilityChange);
                window.onblur =  this.decorateHandler(window.onblur,this.onVisibilityChange);
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
         * This function handles page visibility detection. It sets isVisible and
         * attach the proper event handlers.
         *
         * flag is false: the page is visible
         * flag = w3: use w3c to detect page visibility
         */
        detectPageVisibility: function(flag) {

            //preserve scope for window events
            FT.preservedScope = this;

            hasPageVisibilityAPI();

            if (flag === "w3c") {
                this.handleW3CVisibility();
            } 
        }
    	
    }
	
	
}());
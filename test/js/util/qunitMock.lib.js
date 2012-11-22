/* Global namespace in order to not let mockups create global variables */
var QUnitMockupResults = {};


/**
 *  Initalizes mocked versions of the following parts of the FT framework:
 *  - FT.$.ajax
 *  - FT.Page
 *  - FT.connectionManager
 *  - FT.eventManager
 *  - FT.uidEventManager
 *  - FT.shortcutManager
 *  - FT.statusPoller
 */
function mockInit() {
    mockAjax();
    FT.eventManager         = mockEventManager( new FT.EventManager() );
    FT.uidEventManager = mockObject( new FT.UidEventManager() );
    FT._draggableData       = undefined;

    if( FT.ShortcutManager ) {
        FT.shortcutManager = mockObject( new FT.ShortcutManager() );
    } else {
        FT.shortcutManager = mockObject({
            register:   function() {},
            unregister: function() {}, 
            trigger:    function() {} 
        });
    }

    if( FT.StatusPoller ) {
        FT.statusPoller = mockObject( new FT.StatusPoller({ disabled: true }) );
    } else {
        FT.statusPoller = mockObject({
            register:   function() {},
            unregister: function() {}, 
            trigger:    function() {} 
        });
    }

    if( !FT.connectionManager ) {
        FT.connectionManager = mockObject({
            getURL: function(url) { return url; } 
        });
    }
    
    // FT.Page has a dependancy on FT.shortcutManager
    if( FT.Page ) {
        FT.page = mockObject( new FT.Page() );
    } else {
        FT.page = mockObject({
            username: "myself",
            uid:      "page-uid",
            enable:   function() {},
            disable:  function() {}        
        });
    }

}

var _setTimeout = setTimeout;
function mockSetTimeout() {
    if( !FT.$.browser.msie ) {
        try {
            setTimeout = function( func, ms ) { func(); };
        } catch(e) {}
    }
}
function restoreSetTimeout() {
    if( !FT.$.browser.msie ) {
        try {
            setTimeout = _setTimeout;
        } catch(e) {}
    }
}


/**
 *  Create a mock object, with wrappers around all functions such that function.called is incremented
 *  
 *  @return {Function}  function             a wrapper function, that updates called and lastArgs, and then calls the parent function
 *  @return {Integer}   function.called      the number of times the function has been called
 *  @return {Array}     function.lastArgs    a copy of the last arguments passed into the function
 *  @return {Anything}  function.lastReturn  a copy of the last value to be returned from the function
 */
function mockObject( instance ) {
    for( var key in instance ) {
        if( instance[key] instanceof Function ) {
            instance[key] = mockFunction( instance, instance[key] );
        }
    }
    return instance;
};


/**
 *  Wraps a function in the mock framework, a form of AOP to inspect the number of times the function has been called, 
 *  plus the last arguments and last return value
 *
 *  @param  {Object}    [optional] context  Context to for the function to be called in, defaults to this 
 *  @param  {Function}  function            Function to be wrapped    
 *  @return {Function}  function            a function that behaves exactly like the original function, but sets various parameters
 *          {Function}  function.orig       reference to the original function 
 *          {Number}    function.called     number of times the function has been called
 *          {Array}     function.lastArgs   Array version of the last arguments the function returned
 *          {Object}    function.lastReturn Last value returned by the function
 */
function mockFunction( context, func ) {
    if( !func && context instanceof Function ) {
        func = context;
        context = null;
    }
    if( typeof func === "string" && context && context[func] ) {
        func = context[func];
    }
    if(!( func instanceof Function )) {
        return func;
    }

    var originalFunction;
    if( typeof func.orig == 'undefined' ) {
        originalFunction = func;
        func.orig = originalFunction;
    } else {
        originalFunction = func.orig;
    }
    func = function() {
        func.orig = originalFunction;
        func.called++;
        func.lastArgs   = FT.$.makeArray(arguments);
        func.lastReturn = func.orig.apply( this, arguments );
        return func.lastReturn;
    };

    for( var prop in originalFunction ) {
        func[prop] = originalFunction[prop]; 
    } 
    func.orig = originalFunction;
    func.called     = 0;
    func.lastArgs   = [];
    func.lastReturn = undefined;

    return func;
}

/**
 *  Mocks a <form>'s submit handler, to convert the submit data into a hash,
 *  accessable via form[0].data on the DOM object
 *  @param {element} form 
 */
var mockForm = function( form ) {
    form = FT.$(form);
    form.submitted = 0;
    form.data      = {};
    form.unbind("submit").bind("submit", function(event) {
        this.submitted++;
        this.data = {};
        for( var i=0, n=this.elements.length; i<n; i++ ) {
            if( this.elements[i].name ) {
                switch( this.elements[i].type ) {
                    case "checkbox":
                        this.data[ this.elements[i].name ] = !!this.elements[i].value;
                        break;
                    default: 
                        this.data[ this.elements[i].name ] = FT.$(this.elements[i]).val(); // .val() needed for IE
                        break;
                }
            }
        }
        event.preventDefault();
        return this.data;
    });
    return form;
};

/**
 *  @param  {FT.EventManager} eventManager                              an instance of FT.eventManager
 *  @return {Function}  eventManager                                    a modified instance of FT.eventManager
 *  @return {Integer}   eventManager.trigger.called[eventName]          the number of times the eventName has been triggered
 *  @return {Array}     eventManager.trigger.lastArgs[eventName]        list of additional args last passed to trigger, excluding eventName
 *  @return {Anything}  eventManager.trigger.lastReturn[eventName]      the last value to be returned from the eventName, usually undefined
 *  @return {Integer}   eventManager.register.called[eventName]         the number of times the eventName has been registered
 *  @return {Array}     eventManager.register.lastArgs[eventName]       list of args last passed to register [context, eventName, handler]
 *  @return {Integer}   eventManager.register.lastContext[eventName]    the number of times the eventName has been registered
 *  @return {Integer}   eventManager.unregister.called[eventName]       the number of times the eventName has been unregistered
 *  @return {Array}     eventManager.unregister.lastArgs[eventName]     list of args last passed to unregister [context, eventName, handler]
 *  @return {Integer}   eventManager.unregister.lastContext[eventName]  the number of times the eventName has been unregistered
 */
function mockEventManager( eventManager ) {
 
    var eventManagerTrigger = eventManager.trigger;
    eventManager.trigger = function( eventName ) {
        if( !eventManager.trigger.called[eventName] ) { 
            eventManager.trigger.called[eventName]     = 0;
            eventManager.trigger.lastArgs[eventName]   = [];
            eventManager.trigger.lastReturn[eventName] = undefined;
        }
        eventManager.trigger.called[eventName]++;
        eventManager.trigger.lastArgs[eventName]   = FT.$.makeArray(arguments).slice(1); // doesn't include eventName
        eventManager.trigger.lastReturn[eventName] = eventManagerTrigger.apply( eventManager, arguments );
        return eventManager.trigger.lastReturn[eventName];
    };
    eventManager.trigger.called     = {};
    eventManager.trigger.lastArgs   = {};
    eventManager.trigger.lastReturn = {};


    var eventManagerRegister = eventManager.register;
    eventManager.register = function( context, eventName, handler ) {
        if( !eventManager.register.called[eventName] ) { 
            eventManager.register.called[eventName]      = 0;
            eventManager.register.lastArgs[eventName]    = [];
            eventManager.register.lastContext[eventName] = undefined;
        }
        eventManager.register.called[eventName]++;
        eventManager.register.lastArgs[eventName]    = FT.$.makeArray(arguments);
        eventManager.register.lastContext[eventName] = context;
        return eventManagerRegister.apply( eventManager, arguments );
    };
    eventManager.register.called      = {};
    eventManager.register.lastArgs    = {};
    eventManager.register.lastContext = {};


    var eventManagerUnregister = eventManager.unregister;
    eventManager.unregister = function( context, eventName, handler ) {
        if( !eventManager.unregister.called[eventName] ) { 
            eventManager.unregister.called[eventName]      = 0;
            eventManager.unregister.lastArgs[eventName]    = [];
            eventManager.unregister.lastContext[eventName] = undefined;
        }
        eventManager.unregister.called[eventName]++;
        eventManager.unregister.lastArgs[eventName]    = FT.$.makeArray(arguments);
        eventManager.unregister.lastContext[eventName] = context;
        return eventManagerUnregister.apply( eventManager, arguments );
    };
    eventManager.unregister.called      = {};
    eventManager.unregister.lastArgs    = {};
    eventManager.unregister.lastContext = {};

    return eventManager;
}


/**
 *  Mocks FT.$.ajax function, and defines the FT.$.ajaxServer hash to allow tests to fake an ajax response
 *
 *  {Function} FT.$.ajax                    Will query FT.$.ajaxServer rather than the server when making ajax calls
 *  {Number}   FT.$.ajax.called[url]        Number of times each url has been called
 *  {Hash}     FT.$.ajax.lastOptions[url]   The last ajaxOptions for each url
 *  {Object}   FT.$.ajax.lastResponse[url]  The last FT.$.ajaxServer.response for each url, undefined if last response was error
 *  {Object}   FT.$.ajax.lastError[url]     The last FT.$.ajaxServer.error for each url, undefined if last response was success
 *
 *  {Number}          FT.$.ajaxCalled        Number of times FT.$.ajax has been called
 *  {String}          FT.$.ajaxLastUrl       Last url requested via FT.$.ajax 
 *  {Hash}            FT.$.ajaxLastOptions   Last ajaxOptions passed to FT.$.ajax 
 *  {Object}          FT.$.ajaxLastResponse  Last response returned via FT.$.ajaxServer
 *  {Object}          FT.$.ajaxLastError     Last error returned via FT.$.ajaxServer
 *
 *  {Hash}            FT.$.ajaxServer           A mock version of the ajax server
 *  {String}          FT.$.ajaxServer.status    "success", "timeout", "error", "notmodified" or "parsererror"
 *  {Object|Function} FT.$.ajaxServer.response  function(ajaxOptions): fake server response value for "success" state, default ""
 *  {Object|Function} FT.$.ajaxServer.error     function(ajaxOptions): fake server response value for "error" state,   default {}
 *  {Hash}            FT.$.ajaxServer.xhr       fake xhr object, defaults to empty hash 
 *  {Boolean}         FT.$.ajaxServer.logging   if true, print additional logging to console.log()
 *  {Boolean}         FT.$.ajaxServer.suspend   if true, wait for FT.$.ajaxRespond(url) or FT.$.ajaxRespondAll() before processing each request
 *  {Array}           FT.$.ajaxServer.queue     internal array for storing suspended ajax requests 
 *
 *  @example
 *    var handler = function(html) {};
 *    FT.$.ajaxServer.suspend = true;
 *    FT.$.ajaxServer.response = function(ajaxOptions) {
 *        switch( ajaxOptions.url ) {
 *            case "example.do": return "Hello World";
 *            case "invalid.do": return { action: "invalid", message: "I'm sorry, Dave. I'm afraid I can't do that." };
 *        }
 *    }
 *    FT.$.ajax({ url: "example.do", success: handler });
 *    FT.$.ajax({ url: "example.do", success: handler });
 *    FT.$.ajax({ url: "invalid.do", success: handler });
 *    equal( FT.$.ajax.called,  3 );
 *    equal( handler.called, 0 );
 *    FT.$.ajaxRespond("example.do");
 *    equal( handler.called, 1 );
 *    FT.$.ajaxRespondAll();
 *    equal( handler.called, 3 );
 */
function mockAjax() {
    if( FT && FT.ajax && FT.ajax.request ) {
        FT.ajax.flags = {}; // reset ajax queue
        FT.ajax.makeRequest = mockFunction( FT, FT.ajax.makeRequest );
    }
    
    FT.$.ajaxServer  = { 
        response: "",
        status:   "success", // "timeout", "error", "notmodified" or "parsererror"
        xhr:      {},
        error:    {},
        suspend:  false,
        logging:  false,
        queue:    []
    };
    
    FT.$.ajaxCalled       = 0;
    FT.$.ajaxLastOptions  = null;
    FT.$.ajaxLastResponse = null;
    FT.$.ajaxLastError    = null;

    // Store FT.$.makeRequest for unmocking purposes
    if( !FT.$.makeRequest ) {
        FT.$.makeRequest = FT.$.ajax;
    }

    /**
     *  This is a mocked version of FT.$.ajax that allows unit tests to fake ajax responses.
     *  It will call options.beforeSend(), options.success() then options.complete()
     *  It will pass the string or return value of FT.$.ajaxServer.response to options.success()
     *  If FT.$.ajaxServer.status === "error", then options.error() will be called instead of "sucess"
     *  If FT.$.ajaxServer.suspend === true, then the ajax call will be held until FT.$.ajaxRespond() is called
     *  FT.$.ajaxReturn() handles part of the response that happens after the server has responded
     */
    FT.$.ajax = function(options) {
        if( FT.$.ajaxServer.logging ) { console.log("FT.$.ajax(", options, "), FT.$.ajaxServer: ", FT.$.ajaxServer); }

        if( !FT.$.ajax.called[options.url] ) {
            FT.$.ajax.called[options.url]       = 0;
            FT.$.ajax.lastOptions[options.url]  = {};
            FT.$.ajax.lastResponse[options.url] = {};
            FT.$.ajax.lastError[options.url]    = {};
        }
        FT.$.ajaxCalled++;
        FT.$.ajax.called[options.url]++;
        FT.$.ajax.lastOptions[options.url] = options;
        FT.$.ajaxLastOptions = options;

        if( options.beforeSend instanceof Function ) { 
            options.beforeSend( FT.$.ajaxServer.xhr ); 
        }

        if( FT.$.ajaxServer.suspend ) {
            FT.ajax.async = true; // queuing messes suspended ajax calls up
            FT.$.ajaxServer.queue.push( options );
        } else {
            FT.$.ajaxReturn( options );
        }
    };

    /**
     *  This is the part of FT.$.ajax that happens after the server has responded
     */
    FT.$.ajaxReturn = function(options) {
        FT.$.ajax.lastOptions[options.url] = options;
        FT.$.ajaxLastUrl     = options.url;
        FT.$.ajaxLastOptions = options;

        if( FT.$.ajaxServer.status === "success" ) {
            FT.$.ajax.lastResponse[options.url] = FT.$.ajaxLastResponse = (FT.$.ajaxServer.response instanceof Function) ? FT.$.ajaxServer.response(options) : FT.$.ajaxServer.response;
            FT.$.ajax.lastError[options.url]    = FT.$.ajaxLastError    = undefined;
            if( options.success instanceof Function ) { 
                options.success( FT.$.ajaxLastResponse, FT.$.ajaxServer.status ); 
            }
        } else {
            FT.$.ajax.lastError[options.url]    = FT.$.ajaxLastError    = (FT.$.ajaxServer.error instanceof Function) ? FT.$.ajaxServer.error(options) : FT.$.ajaxServer.error;
            FT.$.ajax.lastResponse[options.url] = FT.$.ajaxLastResponse = undefined;
            if( options.error instanceof Function ) { 
                options.error( FT.$.ajaxServer.xhr, FT.$.ajaxServer.status, FT.$.ajaxServer.error ); 
            }
        }
        if( options.complete instanceof Function ) { 
            options.complete( FT.$.ajaxServer.xhr, FT.$.ajaxServer.status ); 
        }
    };

    /**
     *  Respond "server-side" to an ajax call when FT.$.ajaxServer.suspend has been set,
     *  only triggers one ajax response
     *  @param {String} url  if set, respond to the given ajax url, else pick the next one on the queue
     */
    FT.$.ajaxRespond = function( url ) {
        if( typeof url === "string" ) {
            for( var i=0, n=FT.$.ajaxServer.queue.length; i<n; i++ ) {
                var ajaxOptions = FT.$.ajaxServer.queue[i];
                if( ajaxOptions.url === url ) {
                    if( FT.$.ajaxServer.logging ) { console.log( "FT.$.ajaxRespond("+url+"): ", FT.$.ajaxServer.queue[0] ); }
                    FT.$.ajaxServer.queue.remove(i);  // remove before firing, just in case we go recursive
                    FT.$.ajaxReturn( ajaxOptions );
                    return;
                }
            }
            console.warn( "FT.$.ajaxRespond( "+url+" ): unknown url: ", FT.$.ajaxServer.queue );
        } else {
            if( FT.$.ajaxServer.queue.length ) {
                if( FT.$.ajaxServer.logging ) { console.log( "FT.$.ajaxRespond(): ", FT.$.ajaxServer.queue[0] ); }
                FT.$.ajaxReturn( FT.$.ajaxServer.queue.shift() ); // pluck the first one from the queue
            } else {
                console.warn( "FT.$.ajaxRespond(): FT.$.ajaxServer.queue.length === 0", FT.$.ajaxServer.queue );
            }
        }
    };

    /**
     *  Respond "server-side" to an ajax call when FT.$.ajaxServer.suspend has been set,
     *  Triggers all remaining ajax responses
     *  @param  {String} url  if set, respond to the given ajax url, else pick the next one on the queue
     */    
    FT.$.ajaxRespondAll = function() {
        if( FT.$.ajaxServer.queue.length ) {
            if( FT.$.ajaxServer.logging ) { console.log( "FT.$.ajaxRespondAll(): ", FT.$.map(FT.$.ajaxServer.queue, function(item){return item;}) ); }
            while( FT.$.ajaxServer.queue.length ) {
                FT.$.ajaxReturn(  FT.$.ajaxServer.queue.shift() );
            }
        } else {
            console.warn( "FT.$.ajaxRespond(): FT.$.ajaxServer.queue.length === 0", FT.$.ajaxServer.queue );
        }
        
    };

    FT.$.ajax.called       = {};
    FT.$.ajax.lastOptions  = {};
    FT.$.ajax.lastResponse = {};
    FT.$.ajax.lastError    = {};
 
}

/**
 *  Undoes the mocking of FT.$.ajax
 */
function restoreAjax() {
    if( FT.$.makeRequest ) {
        FT.$.ajax = FT.$.makeRequest;
    }
}


/**
 *  The first time this function is called, it stores a copy of the innerHTML of each selector
 *  The second or subsequent time it is called, it empties the html and restores the stored innerHTML
 */
function restoreSelectors( selectors ) {
    selectors = FT.$.makeArray( selectors );
    for( var i=0, n=selectors.length; i<n; i++ ) {
        var selector = selectors[i];
        var nodes    = FT.$(selector);

        // First time round, archive the html, after that restore it
        if( typeof restoreSelectors.data[selector] === "undefined" ) {
            restoreSelectors.data[selector] = [];
            for( var i=0, n=nodes.length; i<n; i++ ) {
                restoreSelectors.data[selector][i] = nodes[i].innerHTML;
            }
        } else {
            for( var i=0, n=nodes.length; i<n; i++ ) {
                nodes[i].innerHTML = restoreSelectors.data[selector][i];
            }
        }
    }
}
restoreSelectors.data = {};

function queryStringToHash( data ) {
    var hash = {};
    if ( typeof data === "string" ) {
        var pairs = data.split(/&/);
        for( var i=0, n=pairs.length; i<n; i++ ) {
            var keyValue = pairs[i].split(/=/);
            hash[keyValue[0]] = keyValue[1];
        }
    }
    return hash;
}


function assertHashOfArraysEquals( actual, expected, message ) {
    for( var key in expected ) {
        if( expected[key] instanceof Array ) {
            deepEqual( actual[key], expected[key], "actual["+key+"] != expected["+key+"]: " + message );

        } else if( typeof expected[key] !== "object" ) {
            deepEqual( actual[key], expected[key], "actual["+key+"] != expected["+key+"]: " + message );

        } else {
            equal( actual[key], expected[key], "actual["+key+"] != expected["+key+"]: " + message );
        }
    }
    for( var key in actual ) {
        if( expected[key] instanceof Array ) {
            deepEqual( actual[key], expected[key], "expected["+key+"] != actual["+key+"]: " + message );
        
        } else if( typeof expected[key] !== "object" ) {
            deepEqual( actual[key], expected[key], "expected["+key+"] != actual["+key+"]: " + message );
        
        } else {
            equal( actual[key], expected[key], "expected["+key+"] != actual["+key+"]: " + message );
        }
    }
}






/* window.open mockup */

QUnitMockupResults.windowOpen = {
    originalFunction: window.open,
    lastUrl: undefined,
    lastName: undefined,
    lastParams: undefined,
    lastWindow: undefined
};
QUnitMockupResults.windowOpen.WindowOpenPopupReference = function(href, name, params) {
    QUnitMockupResults.windowOpen.lastHref = href;
    QUnitMockupResults.windowOpen.lastName = name;
    QUnitMockupResults.windowOpen.lastParams = params;
    
    var myself = this;

    this.focusCalled = false;
    this.closeCalled = false;
    this.reloadCalled = false;
    this.closed = false;
    
    this.location = {
        href: href,
        reload: function() {
            myself.reloadCalled = true;
        }
    };
    
    this.name = name;
    this.params = params;
    
    this.moveTo = function() {
        
    }
    
    this.resizeTo = function() {
        
    }
    
    this.focus = function() {
        myself.focusCalled = true;
    }
    
    this.close = function() {
        myself.closeCalled = true;
        myself.closed = true;
    }
}

function mockupWindowOpen() {
    window.open = function(href, name, params) {
        QUnitMockupResults.windowOpen.lastWindow = new QUnitMockupResults.windowOpen.WindowOpenPopupReference(href, name, params);
        return QUnitMockupResults.windowOpen.lastWindow;
    }
}

function restoreWindowOpen() {
    window.open = QUnitMockupResults.windowOpen.originalFunction;
    
    QUnitMockupResults.windowOpen.lastUrl = undefined;
    QUnitMockupResults.windowOpen.lastName = undefined;
    QUnitMockupResults.windowOpen.lastParams = undefined;
    QUnitMockupResults.windowOpen.lastWindow = undefined;
}



/* screen mockup */
QUnitMockupResults.screen = {
    availWidth: {
        value: 800
    },
    availHeight: {
        value: 600
    }
};

function mockupScreen() {    
    if (Object.defineProperty) {
        Object.defineProperty(screen, "availWidth", {
            get: getAvailWidth,
            configurable: true
        });
    } else if (Object.__defineSetter__) {
        screen.__defineGetter__("availWidth", getAvailWidth);
    }
    
    function getAvailWidth() {
        return QUnitMockupResults.screen.availWidth.value;
    }
    
    
    
    if (Object.defineProperty) {
        Object.defineProperty(screen, "availHeight", {
            get: getAvailHeight,
            configurable: true
        });
    } else if (Object.__defineSetter__) {
        screen.__defineGetter__("availHeight", getAvailHeight);
    }
    
    function getAvailHeight() {
        return QUnitMockupResults.screen.availHeight.value;
    }
}

function restoreScreen() {
    QUnitMockupResults.screen.availWidth.value = 800;
    QUnitMockupResults.screen.availHeight.value = 600;
}


/* current Date mockup */
QUnitMockupResults.currentDate = {
    originalClass: Date,
    lastDateCreated: undefined,
    dateToBeReturned: undefined
}

function mockupCurrentDate() {
    Date = function() {
        if (arguments.length == 0) {
            return new QUnitMockupResults.currentDate.originalClass(QUnitMockupResults.currentDate.dateToBeReturned);
        } else {
            var date,
                constructString = "date = new QUnitMockupResults.currentDate.originalClass(";
            
            for (var i in arguments) {
                constructString += i+",";
            }
            constructString = constructString.substr(0, constructString.length-1);
            constructString += ")";
            
            eval(constructString);
            return date;
        }
    }
}

function restoreCurrentDate() {
    Date = QUnitMockupResults.currentDate.originalClass;
    QUnitMockupResults.currentDate.lastDateCreated = undefined;
}


/**
 *  Deletes all keys from the mock cookie object, essentially clearing all the cookies
 *  @return {Boolean}  true if cookies were cleared false if the mockCookie object doesn't exist so can't be cleared 
 */
function clearMockCookies() {
    if (mockCookies){
        for(cookie in mockCookies) {
            if(mockCookies.hasOwnProperty(cookie)){
                delete mockCookies[cookie];
            }
        }
        return true;
    }
    return false;
}

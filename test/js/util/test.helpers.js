
//console.log(FT);
(function (window, document, $, undefined) {
   var ua = navigator.userAgent, browser = jQuery.uaMatch(ua);
   if ((browser.browser === 'msie' && browser.version < 10) || (browser.browser !== 'msie' && !ua.match(/Trident.*rv\:(\d+)/))) "use strict";

    var localstorage = {},
    globalVars = {},
    cookies = {},
    test = {
        /* holds sinon stubs and spies */
        sinon: {},
        /* detect wether we're in integration or unit test mode */
        mode: function (){
            var FTQA = $.cookie('FTQA'),
                node = $('#mode'),
                mode = (FTQA === 'integration') ? 'integration' :  'unit';

            if (node.size() && !(node.hasClass(mode))) {
                node.addClass(mode).append(mode.toUpperCase() + ' MODE');
            }

            return 'unit';
        },
        /* methods for mocking things */
        mock: {
            viewport: function (width, height){
                window.innerWidth = width;
                window.innerHeight = height;
                // in firefox we can't overwrite these props so need to use defineProperty
                if (Object.defineProperty && (window.innerWidth || window.innerHeight !== height) ) {
                    Object.defineProperty(window, 'innerWidth', {
                        value: width,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(window, 'innerHeight', {
                        value: height,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
            },
            global: function(data) {
                FT.env = data || {};
            },
            window: function(data){
                var prop;
                for (prop in data){
                     if(data.hasOwnProperty(prop)){
                        window[prop] = data[prop];
                        globalVars[prop]=data[prop];
                    }
                }
            },
            config: function (data) {
                FT.ads.config.init();
                return FT.ads.config(data);
            },
            meta: function(data) {
                var name;
                if (data) {
                    for (name in data) {
                        var content, other = "", metatag;
                        if (FT._ads.utils.isString(data[name])){
                            content = data[name];
                        } else {
                            content = data[name].content;
                            other = data[name].other;
                        }
                        metatag = '<meta name="' + name + "\" content='" + content + "' " + other + ' remove>';
                        $(metatag).appendTo('head');
                    }
                }
                return data;
            },
            container: function(data) {
              var name;
              if (data) {
                $('<div id="' + data + '" ftads></div>').appendTo('#adCalls');
              }
              return data;
            },
            cookie: function (name, value){
                cookies[encodeURIComponent(name)] = value;
            },
            cookies: function (data) {
                var cookie;
                cookies = {};
                if ($.isPlainObject(data)) {
                    for (cookie in data) {
                        test.mock.cookie(cookie, data[cookie]);
                    }
                }
                FT._ads.utils.cookies = cookies;
                return cookies;
            },
            localStorage: function (data) {
                if (FT._ads.utils.isStorage(window.localStorage) || test.sinon.localStorage) {
                    var stub, key,
                    stubs = {
                        getItem: function (key) {
                            return localstorage[key] || null;
                        },
                        setItem: function (key, value) {
                            localstorage[key] = value;
                            return;
                        },
                        removeItem: function () {
                            delete localstorage[key];
                        },
                        clear: function () {
                                localstorage = {};
                        },
                        key : function (index) {
                            var keys = Object.keys(localstorage);
                            index = index || 0;
                            return localstorage[keys[index]] || null;
                        }
                    };

                    localstorage = $.isPlainObject(data) ? data : {};

                    if (!test.sinon.localStorage) {
                        test.sinon.localStorage = {};
                        if (FT._ads.utils.isFunction(Object.defineProperty)) {
                            Object.defineProperty(window , 'localStorage', { value: stubs, configurable: true, writable: true });
                        }

                        for(stub in stubs) {
                            test.sinon.localStorage[stub] = sinon.stub(window.localStorage, stub, stubs[stub]);
                        }
                    }
                }
            },
            referrer: function (data){
                data = data || '';
                if (!test.sinon.referrer) {
                    test.sinon.referrer = sinon.stub(
                        FT._ads.utils,
                        'getReferrer'
                    ).returns(data);
                } else {
                    test.sinon.referrer.returns(data);
                }
            },
            location: function (data){
                data = data || '';
                if (!test.sinon.location) {
                    test.sinon.location = sinon.stub(
                        FT._ads.utils,
                        'getLocation'
                    ).returns(data);
                } else {
                    test.sinon.getLocation.returns(data);
                }
            },
            querystring: function (data){
                data = data || '';
                if (!test.sinon.querystring) {
                    test.sinon.querystring = sinon.stub(
                        FT._ads.utils,
                        'getQueryString'
                    ).returns(data);
                } else {
                    test.sinon.querystring.returns(data);
                }
            },
            date: function (data) {
                if (data === false || data === undefined){
                    // if it's false don't fake times
                    return false
                } else if(isNaN(parseInt(data, 10))){
                    // if it's not a number just start the fake timer from now
                    test.sinon.clock = sinon.useFakeTimers();
                } else {
                    // if it's a number start from then
                    test.sinon.clock = sinon.useFakeTimers(parseInt(data, 10));
                }

                return test.sinon.clock;
            },
            attach: function () {
                if (!test.sinon.attach) {
                    var attach = FT._ads.utils.attach;

                    test.sinon.attach = sinon.stub(
                        FT._ads.utils,
                        'attach',
                        function (scriptUrl, async) {
                            function matchFile(url) {
                                var mockFiles = {
                                    'controltag': 'krux.js'
                                },
                                splitUrl = url.split('?')[0].split('/'),
                                filename =  splitUrl.pop();
                                return mockFiles[filename] || 'null.js';
                            }

                            return attach('../js/util/' + matchFile(scriptUrl), async);
                        }
                    );
                }
                return this;
            }
        },
        /* methods for clearing things */
        clear: {
            viewport: function (){
                if (TEST.winWidth !== window.innerWidth) {
                    TEST.mock.viewport(TEST.winWidth, TEST.winHeight);
                }
            },
            meta: function () {
                $('meta[remove]').remove();
            },
            scripts: function () {
                $('script[ftads]').remove();
            },
            container: function (){
                $('div[ftads]').remove();
            },
            gpt: function () {
                if(window.googletag && googletag.sinon){
                    var len = googletag.sinon.fakes.length;
                    while (len--) {
                        googletag.sinon.fakes[len].reset();
                    }
                }
            },
            sinon: function (mocks) {
                var mock, func,
                    restore = ['clock'];
                mocks = mocks || test.sinon;

                for(mock in mocks) {
                    func = mocks[mock];
                    if (~mock.indexOf(restore)) {
                        func.restore();
                    } else if ($.isFunction(func.reset)) {
                        func.reset()
                    } else if($.isPlainObject(mock)) {
                        test.clear.sinon(mock);
                    }
                }
            },
            cookies: function () {
                FT._ads.utils.cookies = cookies = {};
            },
            config: function () {
                if (FT && FT.ads && FT.ads.config) {
                    FT.ads.config.clear();
                }
            },
            window: function(){
                var prop;
                for(prop in globalVars){
                    window[prop] = undefined;
                    //delete globalVars[prop];
                }
            },
            gptCmd: function () {
                if (window.googletag && googletag.cmd){
                    googletag.cmd.length = 0;
                }
            },
            all: function all() {
                var func, funcName, funcStr;
                for(funcName in test.clear) {
                    func = test.clear[funcName];
                    funcStr = func.toString() || '';

                    if ($.isFunction(func) && !(/function\sall\(/.test(funcStr))) {
                        func();
                    }
                }
            }
        },


        /*
        * Reset the library, config, cookies and meta data can be passed in
        * to be added to the page before the library reloads config and starts a new
        * set of ad requests
        *
        */
        beginNewPage: function (mockData) {
            var method, data;
            if (test.mode() === 'unit') {
                test.clear.all();
                mockData = $.extend(true, {
                    cookies: {},
                    localStorage: {},
                    global: {},
                    window: {},
                    referrer: '',
                    querystring: ''
                }, mockData);

                for (method in mockData) {
                    var data = mockData[method];
                    if (method !== 'config'){
                        test.mock[method](data);
                    }
                }
                test.mock.config(mockData.config || {});
                test.mock.attach();
            }
            return true;
        }
        /* Don't look at this */
        /* it's only here because the build fails if we try to access anything external */
        /*suppressExternalScripts: function () {
            var _createElement = document.createElement;
            document.createElement = function () {

                    var parent,_insertBefore,
                        node = _createElement.apply(this, arguments);

                    if (arguments[0] === 'script') {

                        parent = document.getElementsByTagName('script')[0].parentNode;
                        _insertBefore = parent.insertBefore;
                        parent.insertBefore = function (tag, node) {
                            var exp = new RegExp('^https?:\/\/' + location.hostname);
                            if (exp.test(tag.src)) {
                                 return _insertBefore.call(this, tag, node);
                            }
                            if (!exp.test(tag.src)) { tag.src = "empty.js"; return _insertBefore.call(this, tag, node);}
                         }
                      }
                    return node;
            };

        }*/
    };

    window.TEST = {
        beginNewPage: test.beginNewPage,
        sinon: test.sinon,
        mock: test.mock,
        mode: test.mode(),
        winWidth: window.innerWidth,
        winHeight: window.innerHeight
    };

    if (test.mode() === 'unit') {
     //   test.suppressExternalScripts();
    }

    $(function () {
        QUnit.testDone(function () {
            if (test.mode() === 'unit') {
                    test.clear.all();
            }
        });

        test.mode();
    });
}(window, document, jQuery))


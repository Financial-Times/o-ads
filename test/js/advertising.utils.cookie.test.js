/* jshint strict: false */
/* globals  FT, jQuery, $, asyncTest: false, deepEqual: false, equal: false, expect: false, module: false, notDeepEqual: false, notEqual: false, notStrictEqual : false, ok: false, QUnit: false, raises: false, start: false, stop: false, strictEqual: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn of use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */


(function (window, document, undefined) {
    function cookieTests (){
        var callbacks = {
            setup: function () {
                FT._ads.utils.cookie.defaults = {};
                delete FT._ads.utils.cookie.raw;
                delete FT._ads.utils.cookie.json;
            }
        };

        QUnit.module('FT._ads.utils.cookie', callbacks);

        test('read simple value', function () {
            expect(1);
            FT._ads.utils.cookie('c','v');
            equal(FT._ads.utils.cookie('c'), 'v', 'should return value');
        });

        test('read empty value', function () {
            expect(1);
            // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, which
            // resulted in a bug while reading such a cookie.
            FT._ads.utils.cookie('c', '');
            equal(FT._ads.utils.cookie('c'), '', 'should return value');
        });

        test('read not existing', function () {
            expect(1);
            equal(FT._ads.utils.cookie('whatever'), null, 'should return null');
        });

        test('read decode', function () {
            expect(1);
            FT._ads.utils.cookie('c',' v');
            equal(FT._ads.utils.cookie('c'), ' v', 'should decode key and value');
        });


        test('read decode pluses to space for server side written cookie', 1, function () {
            expect(1);
            FT._ads.utils.cookie('c','foo bar');
            equal(FT._ads.utils.cookie('c'), 'foo bar', 'should convert pluses back to space');
        });

        test('read [] used in name', 1, function () {
            FT._ads.utils.cookie('c[999]','foo');
            equal(FT._ads.utils.cookie('c[999]'), 'foo', 'should return value');
        });

        test('read raw: true', 2, function () {
            FT._ads.utils.cookie.raw = true;

            FT._ads.utils.cookie('c','%20v');
            equal(FT._ads.utils.cookie('c'), '%20v', 'should not decode value');

            // see https://github.com/carhartl/jquery-cookie/issues/50
            FT._ads.utils.cookie('c', 'foo=bar');
            equal(FT._ads.utils.cookie('c'), 'foo=bar', 'should include the entire value');
        });

        test('read json: true', 1, function () {
            FT._ads.utils.cookie.json = true;

            if ('JSON' in window) {
                FT._ads.utils.cookie('c', { foo: 'bar' });
                deepEqual(FT._ads.utils.cookie('c'), { foo: 'bar'}, 'should parse JSON');
            } else {
                ok(true);
            }
        });

       var ua = navigator.userAgent, browser = jQuery.uaMatch(ua);
       if ((browser.browser === 'msie' && browser.version < 10) || (browser.browser !== 'msie' && !ua.match(/Trident.*rv\:(\d+)/))) {
           asyncTest('read malformed cookie value in IE (#88, #117)', 1, function() {
               // Sandbox in an iframe so that we can poke around with document.cookie.
               var iframe = document.createElement('iframe'),
                   iframeSrc = location.href.split('/');

               $(iframe).load(function() {
                   start();
                   if (iframe.contentWindow.loaded) {
                       equal(iframe.contentWindow.testValue, '2nd', 'reads all cookie values, skipping duplicate occurences of "; " and preserving the last value of any duplicated keys');
                   } else {
                       // Skip the test where we can't stub document.cookie using
                       // Object.defineProperty. Seems to work fine in
                       // Chrome, Firefox and IE 8+.
                       ok(true, 'N/A');
                   }
               });
               iframeSrc.pop(); //remove the current file name from the location
               iframeSrc.push('/base/test/lib/cookie-iframe.html'); // add the file name of our iframe doc
               iframe.src = iframeSrc.join('/');
               document.body.appendChild(iframe);
           });
       }

        test('write String primitive', 1, function () {
            FT._ads.utils.cookie('c', 'v');
            equal(FT._ads.utils.cookie('c'), 'v', 'should write value');
        });

        test('write String object', 1, function () {
            /* jshint -W053 */
            // using the string constructor is a silly thing to do, we use it to make sure if someone esle is silly enough to try this our code will work
            FT._ads.utils.cookie('c', new String(2));
            /* jshint +W053 */
            equal(FT._ads.utils.cookie('c'), '2', 'should write value');
        });

        test('write value "[object Object]"', 1, function () {
            FT._ads.utils.cookie('c', '[object Object]');
            equal(FT._ads.utils.cookie('c'), '[object Object]', 'should write value');
        });

        test('write number', 1, function () {
            FT._ads.utils.cookie('c', 1234);
            equal(FT._ads.utils.cookie('c'), '1234', 'should write value');
        });

        test('write expires option as days from now', 1, function() {
            var sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            equal(FT._ads.utils.cookie('c', 'v', { expires: 7 }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
                'should write the cookie string with expires');
        });

        test('write expires option as Date instance', 1, function() {
            var sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            equal(FT._ads.utils.cookie('c', 'v', { expires: sevenDaysFromNow }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
                'should write the cookie string with expires');
        });

        test('write invalid expires option (in the past)', 1, function() {
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            FT._ads.utils.cookie('e', 'v', { expires: yesterday });
            equal(FT._ads.utils.cookie('e'), null, 'should not save already expired cookie');
        });

        test('write return value', 1, function () {
            equal(FT._ads.utils.cookie('c', 'v'), 'c=v', 'should return written cookie string');
        });

        test('write defaults', 2, function () {
            FT._ads.utils.cookie.defaults.path = '/';
            ok(FT._ads.utils.cookie('d', 'v').match(/path=\//), 'should use options from defaults');
            ok(FT._ads.utils.cookie('d', 'v', { path: '/foo' }).match(/path=\/foo/), 'options argument has precedence');
        });

        test('write raw: true', 1, function () {
            FT._ads.utils.cookie.raw = true;
            equal(FT._ads.utils.cookie('c', ' v').split('=')[1], ' v', 'should not encode');
        });

        test('write json: true', 1, function () {
            FT._ads.utils.cookie.json = true;
            if (!!window.JSON) {
                var cookieValue = 'c=' + encodeURIComponent(JSON.stringify({ foo: 'bar' }));
                FT._ads.utils.cookie('c', { foo: 'bar' });
                ok(document.cookie.indexOf(cookieValue) > -1, 'should stringify JSON');
            } else {
                ok(true);
            }
        });

        test('removeCookie delete', 1, function() {
            FT._ads.utils.cookie('c','v');
            FT._ads.utils.removeCookie('c');

            equal(FT._ads.utils.cookie('c'), null,'should delete the cookie');
        });

        test('removeCookie return', 2, function() {
            equal(FT._ads.utils.removeCookie('c'), false, "should return false if a cookie wasn't found");

            FT._ads.utils.cookie('c','v');
            equal(FT._ads.utils.removeCookie('c'), true, 'should return true if the cookie was found');
        });

        test("getCookieParam non-existent cookie", function() {
            FT._ads.utils.removeCookie('FT_U');
            FT._ads.utils.removeCookie('FT_Remember');
            FT._ads.utils.removeCookie('FT_User');
            FT._ads.utils.removeCookie('AYSC');
            FT._ads.utils.removeCookie('FTQA');
            equal($.type(FT._ads.utils.getCookieParam("FT_U", "999")), "undefined");
            equal($.type(FT._ads.utils.getCookieParam("FT_Remember", "EMAIL")), "undefined");
            equal($.type(FT._ads.utils.getCookieParam("FT_User", "EMAIL")), "undefined");
            equal($.type(FT._ads.utils.getCookieParam("AYSC", "999")), "undefined");
            equal($.type(FT._ads.utils.getCookieParam("FTQA", "fish")), "undefined");
        });

        test("getCookieParam non-existent param", function() {
            FT._ads.utils.cookie.raw = true;
            FT._ads.utils.cookie('FT_U','_EID=75203762_PID=4075203762_TIME=%5BTue%2C+14-Feb-2012+11%3A14%3A43+GMT%5D_SKEY=PVedi41jJoMsqbaU%2B4BlyQ%3D%3D_RI=1_I=1_');
            equal($.type(FT._ads.utils.getCookieParam("FT_U", "999")), "undefined");
            equal(FT._ads.utils.getCookieParam("FT_U", "EID"), "75203762");

            FT._ads.utils.cookie('FT_Remember','3485306:TK5440152026926272944:FNAME=:LNAME=:');
            equal($.type(FT._ads.utils.getCookieParam("FT_Remember", "EMAIL")), "undefined");

            FT._ads.utils.cookie('FT_User','USERID=4001448514:FNAME=Nick:LNAME=Hayes:TIME=[Sat, 06-Jun-2009 09:59:20 GMT]:USERNAME=conchango1:REMEMBER=_REMEMBER_:');
            equal($.type(FT._ads.utils.getCookieParam("FT_User", "EMAIL")), "undefined");

            FT._ads.utils.cookie('AYSC','_04greater%2Blondon_13GBR_14GBR_15gb_17london_18islington_24europe_25PVT_26PVT_27PVT_96PVT_98PVT_');
            equal($.type(FT._ads.utils.getCookieParam("AYSC", "999")), "undefined");

            FT._ads.utils.cookie('FTQA','debug=true,env=live,breakout=banlb');
            equal($.type(FT._ads.utils.getCookieParam("FTQA", "fish")), "undefined");
        });

        test("getCookieParam existent param", function() {
            FT._ads.utils.cookie.raw = true;
            FT._ads.utils.cookie('FT_Remember', '3485306:TK5440152026926272944:FNAME=:LNAME=:EMAIL=dan.searle@ft.com');
            equal(FT._ads.utils.getCookieParam("FT_Remember", "EMAIL"), "dan.searle@ft.com");

            FT._ads.utils.cookie('FT_User', 'USERID=4001448514:EMAIL=nick.hayes@ft.com:FNAME=Nick:LNAME=Hayes:TIME=[Sat, 06-Jun-2009 09:59:20 GMT]:USERNAME=conchango1:REMEMBER=_REMEMBER_:');
            equal(FT._ads.utils.getCookieParam("FT_User", "EMAIL"), "nick.hayes@ft.com");

            FT._ads.utils.cookie('AYSC', '_04greater%2Blondon_13GBR_14GBR_15gb_17london_18islington_24europe_25PVT_26PVT_27PVT_96PVT_98PVT_');
            equal(decodeURIComponent(FT._ads.utils.getCookieParam("AYSC", "04")), "greater+london");

            FT._ads.utils.cookie('AYSC', '_04_13GBR_14GBR_15gb_17london_18islington_24europe_25PVT_26PVT_27PVT_96PVT_98PVT_');
            equal(FT._ads.utils.getCookieParam("AYSC", "04"), "");

            FT._ads.utils.cookie('AYSC', '_0490_13GBR_14GBR_15gb_17london_18islington_24europe_25PVT_26PVT_27PVT_96PVT_98PVT_');
            equal(FT._ads.utils.getCookieParam("AYSC", "04"), "90");

            FT._ads.utils.cookie('FTQA', 'debug=true,env=live,breakout=banlb');
            equal(FT._ads.utils.getCookieParam("FTQA", "debug"), "true");
        });
    }

   $(cookieTests);
}(window, document));

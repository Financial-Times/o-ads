(function (window, document, $, undefined) {
    function cookieTests (){
        var cookies, oldCookies,
        callbacks = {
            setup: function () {
                FT._ads.utils.cookie.defaults = {};
                delete FT._ads.utils.cookie.raw;
                delete FT._ads.utils.cookie.json;
            }
        };

        module('FT._ads.utils.cookie', callbacks);

        test('read simple value', function () {
            expect(1);
            document.cookie = 'c=v';
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
            document.cookie = encodeURIComponent(' c') + '=' + encodeURIComponent(' v');
            equal(FT._ads.utils.cookie(' c'), ' v', 'should decode key and value');
        });

        test('read decode pluses to space for server side written cookie', 1, function () {
            document.cookie = 'c=foo+bar'
            equal(FT._ads.utils.cookie('c'), 'foo bar', 'should convert pluses back to space');
        });

        test('read [] used in name', 1, function () {
            document.cookie = 'c[999]=foo';
            equal(FT._ads.utils.cookie('c[999]'), 'foo', 'should return value');
        });

        test('read raw: true', 2, function () {
            FT._ads.utils.cookie.raw = true;

            document.cookie = 'c=%20v';
            equal(FT._ads.utils.cookie('c'), '%20v', 'should not decode value');

            // see https://github.com/carhartl/jquery-cookie/issues/50
            FT._ads.utils.cookie('c', 'foo=bar');
            equal(FT._ads.utils.cookie('c'), 'foo=bar', 'should include the entire value');
        });

        test('read json: true', 1, function () {
            FT._ads.utils.cookie.json = true;

            if ('JSON' in window) {
                document.cookie = 'c=' + JSON.stringify({ foo: 'bar' });
                deepEqual(FT._ads.utils.cookie('c'), { foo: 'bar'}, 'should parse JSON');
            } else {
                ok(true);
            }
        });

        asyncTest('read malformed cookie value in IE (#88, #117)', 1, function() {
            // Sandbox in an iframe so that we can poke around with document.cookie.
            var iframe = document.createElement('iframe'),
                iframeSrc = location.href.split('/');

            $(iframe).load(function() {
                start();
                if (iframe.contentWindow.loaded) {
                    equal(iframe.contentWindow.testValue, 'two', 'reads all cookie values, skipping duplicate occurences of "; "');
                } else {
                    // Skip the test where we can't stub document.cookie using
                    // Object.defineProperty. Seems to work fine in
                    // Chrome, Firefox and IE 8+.
                    ok(true, 'N/A');
                }
            });
            iframeSrc.pop(); //remove the current file name from the location
            iframeSrc.push('cookie-iframe.html'); // add the file name of our iframe doc
            iframe.src = iframeSrc.join('/');
            document.body.appendChild(iframe);
        });

        test('write String primitive', 1, function () {
            FT._ads.utils.cookie('c', 'v');
            equal(FT._ads.utils.cookie('c'), 'v', 'should write value');
        });

        test('write String object', 1, function () {
            FT._ads.utils.cookie('c', new String('v'));
            equal(FT._ads.utils.cookie('c'), 'v', 'should write value');
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
            FT._ads.utils.cookie('c', 'v', { expires: yesterday });
            equal(FT._ads.utils.cookie('c'), null, 'should not save already expired cookie');
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
            document.cookie = 'c=v';
            FT._ads.utils.removeCookie('c');

            equal(FT._ads.utils.cookie('c'), null,'should delete the cookie');
        });

        test('removeCookie return', 2, function() {
            equal(FT._ads.utils.removeCookie('c'), false, "should return false if a cookie wasn't found");

            document.cookie = 'c=v';
            equal(FT._ads.utils.removeCookie('c'), true, 'should return true if the cookie was found');
        });
    }

   $(cookieTests);
}(window, document, jQuery))

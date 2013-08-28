/* jshint strict: false */

/*globals $,ok,equal,console,QUnit,initCookies,asyncTest,expect */

(function (window, document, $, undefined) {
    function runTests() {
        module('Third party targeting - Krux Control tag');

        test( "Krux Config ID is set", function() {
            strictEqual( $.type(FT.ads.kruxConfigId), "string", "FT.ads krux config id is defined and is a string.");
        });
        test( "Krux function exists", function() {
            strictEqual( $.type(Krux), "function", "Krux is a function.");
        });
    }

    $(runTests);
}(window, document, jQuery));

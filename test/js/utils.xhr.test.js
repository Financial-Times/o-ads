/* jshint strict: false */
/* globals  FT, asyncTest: false, deepEqual: false, equal: false, expect: false, module: false, notDeepEqual: false, notEqual: false, notStrictEqual : false, ok: false, QUnit: false, raises: false, start: false, stop: false, strictEqual: false, test: false, TEST: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn of use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

(function (window, document, $, undefined) {
    function runTests() {
        var server;
        QUnit.module('FT.ads.utils.createCORSRequest method');

        test('We can make a CORS request', function () {
            expect(1);

            server = sinon.fakeServer.create();
            server.respondWith("GET", "/some/article/comments.json",
                [200, { "Content-Type": "application/json" }, '[{ "id": 12, "comment": "Hey there" }]']);

            var callback = sinon.spy();
            FT.ads.utils.createCORSRequest('/some/article/comments.json', 'GET', callback);
            server.respond();
            ok(callback.withArgs('[{ "id": 12, "comment": "Hey there" }]'), 'We can make an xhr a request');
            server.restore();
        });
    }

    $(runTests);
}(window, document, jQuery));

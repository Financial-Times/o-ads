(function (window, document, $, undefined) {
    function runTests() {
        module('Third party aud sci');

        test('true is not false', function () {
            expect(1);
            deepEqual(true === false, false, 'phew!');
        });
    }

    $(runTests);
}(window, document, jQuery));

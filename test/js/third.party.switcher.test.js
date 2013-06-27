(function (window, document, $, undefined) {
    function runTests() {
        module('Third party switcher');

        test('true is not false', function () {
            expect(1);
            ok(true === false, false, 'phew!');
        });
    }

    $(runTests);
}(window, document, jQuery));

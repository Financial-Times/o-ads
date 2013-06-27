(function (window, document, $, undefined) {
    function runTests() {
        module('Third party gpt');

        test('false is not true', function () {
            expect(1);
            ok(false === true, false, 'phew!');
        });
    }

    $(runTests);
}(window, document, jQuery));

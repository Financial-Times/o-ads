(function (window, document, $, undefined) {
    function runTests() {
        module('Third party gpt');

        test('Attach GPT library to page', function () {
            expect(2);

            // initial number of async
            var initialScripts = $('script').size();

            FT.ads.gpt.attach();
            deepEqual($('script').size() - initialScripts, 1, 'a new async script tag has been added to the page.' );

            // wait for a maximum of 5 seconds for the google code to load
            // the display methods is tested to see if the lib is available
            QUnit.stop();

            var totalTime = 0,
                maxTime = 5000,
                interval = 100,
                timer = setInterval(function () {
                    totalTime += interval;
                    if (!!googletag.display) {
                        ok(true, 'GPT available after ' + totalTime / 1000 + ' seconds');
                        clearInterval(timer);
                        QUnit.start();
                    } else if (interval === maxTime) {
                        ok(false, 'GPT was not available after ' + maxTime / 1000 + ' seconds');
                        clearInterval(timer);
                        QUnit.start();
                    }
                }, interval);
        });
    }

    $(runTests);
}(window, document, jQuery));

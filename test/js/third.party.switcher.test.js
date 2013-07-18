(function (win, document, $, undefined) {
    win.testMode  = win.unitOrIntegrationMode(FT._ads.utils.cookies.FTQA);

    function runTests() {

        module('Third party switcher', {
            setup: function () {
                win.iframe = $('<iframe>').appendTo('body');
            },
            teardown: function () {
                //win.iframe.remove();
            }
        });

        test( "global switch", function() {
          QUnit.stop();
          iframe.load(function () {
                // Use the iframe context for our assertions
                var win = this.contentWindow,
                    FT = win.FT;

                deepEqual(FT.ads.config.get('ftads:mode'), 'gpt', 'Library is configured for GPT');
                ok(FT.spies.adCallSpy.called, 'adCall method is still called (for backwards compatability)');
                ok(!FT.spies.getTagSpy.called, 'getTag method is no longer called');
                ok(!FT.spies.getAudSciSpy.called, 'getAudSci method is no longer called');
            QUnit.start();
          });
          iframe.attr('src', '../iframes/third.party.switcher.global.html');
        });

        test( "meta switch", function() {
            QUnit.stop();
            iframe.load(function () {
                // Use the iframe context for our assertions
                var win = this.contentWindow,
                    FT = win.FT;

                deepEqual(win.$('meta[name="ftads:mode"]').attr('content'), 'gpt', 'the meta configuration is present');
                deepEqual(FT.ads.config.get('ftads:mode'), 'gpt', 'Library is configured for GPT');

                ok(FT.spies.adCallSpy.called, 'adCall method is called (for backwards compatability)');
                ok(!FT.spies.getTagSpy.called, 'getTag method is no longer called');
                ok(!FT.spies.getAudSciSpy.called, 'getAudSci method is no longer called');
                QUnit.start();
            });
            iframe.attr('src', '../iframes/third.party.switcher.meta.html');
        });

        test( "switch off", function() {
            QUnit.stop();
            iframe.load(function () {
                // Use the iframe context for our assertions
                var win = this.contentWindow,
                    FT = win.FT;

                deepEqual(FT.ads.config.get('ftads:mode'), undefined, 'Library is not configured for GPT');

                ok(FT.spies.adCallSpy.called, 'adCall method is called');
                ok(FT.spies.getTagSpy.called, 'getTag method is called');
                ok(FT.spies.getAudSciSpy.called, 'getAudSci method is called');
                QUnit.start();
            });
            iframe.attr('src', '../iframes/third.party.switcher.off.html');
        });
    }

    $(runTests);
}(window, document, jQuery));

(function (){
    /*jshint devel:true */

    /*globals FT,io */
    "use strict";
    var testResultsList, jshintMenu,
    socket = false,
    socketEventHandlers = {
        news: function (data) {
        },
        fileChange: function (data) {
            var matches = FT.iframe.contents().find('[src*="'+ data +'"]');
            if(!!matches.size() || FT.iframe.attr('src').indexOf(data) > -1) {
              FT.iframeWindow.location.reload();
            }
        },
        testModeChange: function (data) {
            FT.changeTestMode(data);
        },
        iframeChange: function (data) {
            FT.iframe.attr('src', decodeURI(location.origin + data));
        },
        jshint : function (data) {
            var badge = jshintMenu.find('.badge');
            if(!data.length) {
                jshintMenu.removeClass('error');
                badge.text('');
            } else {
                jshintMenu.addClass('error');
                badge.text(data.length);
            }
        },
        results: function (data) {
            var browser = data.browser,
            result = data.result,
            badge = testResultsList.find('[data-browser-name="' + browser.name + '"][data-browser-version="' + browser.version + '"] .badge');
            if(!badge.size()) {
                badge = '<li data-browser-name="' + browser.name + '" data-browser-version="' + browser.version + '">' + browser.name + ' ' + browser.version + ' <span class="badge"></span></li>';
                badge = testResultsList.append(badge).find('.badge');
            }

            if(result.failed === 0) {
                badge.removeClass()
                    .addClass('badge badge-success')
                    .text(result.total);
            } else{
                badge.removeClass()
                    .addClass('badge badge-important')
                    .text(result.failed + '/' + result.total);
            }
        }
    };

    function testModeEvent() {
        var testMode = $('#testMode');
        testMode.on('click', '.dropdown-menu a', function (){
            console.log('testMode');
            FT.socket.emit('testModeChange', $(this).text().trim());
        });
    }

    function iframeChangeEvent() {
        function emitChangeEvent(ev) {
            var url = ev.currentTarget.href.replace(location.origin, '');

            return FT.socket.emit('iframeChange', url);
        }

        $('body').on('click', 'a[target="content"]', emitChangeEvent);

        FT.iframe.load(function () {
            var iframe$;
            try{
                iframe$ = FT.iframeWindow.$;
            }
            catch(err){

            }

            if(iframe$){
                FT.iframeWindow.$('body').on('click', 'a', emitChangeEvent);
            }
        });
    }

    function initSocketEvents() {
        var event;
        FT.socket = io.connect(location.origin);
        FT.socket.emit('online', navigator.userAgent);
        testModeEvent();
        iframeChangeEvent();

        for(event in socketEventHandlers){
            FT.socket.on(event, socketEventHandlers[event]);
        }
    }

    function socketFail() {
        testResultsList.remove();
    }

    function onReady() {
        testResultsList = $('#test-results');
        jshintMenu = $('#jshint');

        $.getScript('/socket.io/socket.io.js')
            .done(initSocketEvents)
            .fail(socketFail);
    }

    $(onReady);
}());

(function (){
    /*jshint devel:true */

    /*globals iframe,io */
    "use strict";
    var testResultsList, jshintMenu,
    socket = false,
    socketEventHandlers = {
        news: function(data) {
            console.log(data);
        },
        change: function(data){
            var matches = $(iframe).contents().find('[src*="'+ data +'"]');
            console.log('change', data, matches);
            if(!!matches.size() || iframe.src.indexOf(data) > -1) {
              console.log('reloading iframe');
              iframe.contentWindow.location.reload();
            }
        },
        jshint : function(data){
            var badge = jshintMenu.find('.badge');
            if(!data.length) {
                jshintMenu.removeClass('error');
                badge.text('');
            } else {
                jshintMenu.addClass('error');
                badge.text(data.length);
            }
            console.log('jshint', data);
        }
    };

    function initSocketEvents() {
        var event;
        socket = io.connect(location.origin);
        socket.emit('online', navigator.userAgent);

        for(event in socketEventHandlers){
            socket.on(event, socketEventHandlers[event]);
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

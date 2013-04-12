//check that the audience code hasn't already been downloaded and executed
if (typeof window.J07717 === "undefined") {

    //from Mathias Bynens, js performance guru
    // replacement for jQuery for asynchronous downloading revenue science code
    (function(d, t, src) {
        var g = d.createElement(t),
            s = d.getElementsByTagName(t)[0];
        g.src = src;
        s.parentNode.insertBefore(g, s);
    }(document, 'script','//js.revsci.net/gateway/gw.js?csid=J07717'));
}
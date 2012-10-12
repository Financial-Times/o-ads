/*global $, QUnit*/

var FT = FT || {};

FT.lib = {

    /**
     * Create an object hash from a delimited string
     * Beware all properties on the resulting object will have  string values.
     * @param {String}        str       The string to transform
     * @param {String/RegExp} delimiter The character that delimits each name/value pair
     * @param {String}        pairing   The character that separates the name from the value
     * @return {object}
     */
    hash: function (str, delimiter, pairing) {
        var hash = {};
        $.each(str.split(delimiter), function (i, value) {
            var pair = value.split(pairing);
            if (pair.length > 1) { hash[$.trim(pair[0])] = Array.prototype.slice.call(pair, 1).join(pairing); }
        });
        //if there is a key with no value then that key will be dropped
        return hash;
    },

    /**
     * Turns a document.cookie string into an object hash
     * @deprecated Use FT.cookie.get() instead
     * @param  {String} fakeCookies The cookie string (optional). If not passed, then document.cookie is used
     * @return {object}
     */
    hashCookies: function (fakeCookies) {
        FT.cookies = FT.lib.hash(fakeCookies || document.cookie, ";", "=");
        return FT.cookies;
    },

    /**
     * Get a querystring parameter's value.
     * @param {string} name The name of the param.
     * @param {string} [url] A url to look in. If not passed, uses window.location.href.
     * @return {string}
     */
    getQueryStringParam: function (name, url) {
        if (!name) {
            return undefined;
        }
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/\[/, "\\[").replace(/\]/, "\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)",
            regex = new RegExp(regexS),
            results = regex.exec(url);
        if (!results) {
            return undefined;
        } else {
            return results[1];
        }
    },

    /**
     * Turns a querystring into a object hash.
     * @param {String} [fakeQueryString] The querystring to use (optional)
     *                                   Defaults to window.location.search
     * @return {object}
     */
    hashQueryString: function (fakeQueryString) {
        FT.queryString = FT.lib.hash(fakeQueryString || window.location.search, /[?&]/, "=");
        return FT.queryString;
    },

    /**
     * Tests current page to see if it was sent over http
     * @param  {document} doc The document to test, defaults to current document
     * @return {boolean}
     */
    isSecure: function (doc) {
        var d = doc || document;
        return (d.location.protocol === 'https:');
    },

    /**
     * Writes a script tag into the document.
     * This type of script tag is synchronous, page rendering will be blocked
     * until the script has loaded (or failed to load)
     * @param {String} url The src of the script file
     */
    writeScript: function (url) {
        // Stop document.write() from happening after page load (unless QUnit is present)
        if (document.readyState !== "complete" || typeof QUnit === "object") {
            /*jshint evil:true*/
            document.write('<scr' + 'ipt src="' + url + '"></scr' + 'ipt>');
            /*jshint evil:false*/
        }
    },

    /**
     * Clears any text selection on the page
     */
    clearSelection: function () {
        if (document.selection && document.selection.empty) {
            document.selection.empty();
        } else if (window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
        }
    },

    /**
     * Recursively searches for the first textnode that isn't only whitespaces.
     * @param  {html} pnode   The node in which to search for the textnode
     * @return {html|Null} returns the textnode. Returns null if no such node is found. Returns false if a link is opened before the first letter.
     */
    getFirstLetterNode: function (pnode) {
        var i,
            node,
            next;
        for (i = 0; i < pnode.childNodes.length; i++) {
            node = pnode.childNodes[i];
            if (node.nodeType === 3) {
                if ($.trim(node.nodeValue) !== '') {
                    if ($(node).parents('#storyContent>p').length > 0) {
                        if ($(node).parents('a').length > 0) {
                            return false;
                        } else {
                            return node;
                        }
                    }
                    return null;
                }
            } else if (node.nodeType === 1) {
                next = FT.lib.getFirstLetterNode(node);
                if (next !== null) {
                    return next;
                }
            }
        }
        return null;
    },

    /**
     * Wraps the first letter of an article in a span.firstletter
     * @param  {html} pnode   The node in which to perform the operation
     */
    separateFirstLetter: function (pnode) {
        var tnode,
            text,
            components;
        if (pnode) {
            tnode = FT.lib.getFirstLetterNode(pnode);
            if (tnode) {
                text = tnode.nodeValue;
                components = text.match(/^\s*(\S)(.*)$/);
                if (/[a-z]/i.test(components[1])) {
                    tnode.nodeValue = components[2];
                    tnode.parentNode.insertBefore($('<span class="firstletter">' + components[1] + '</span>')[0], tnode);
                }
            }
        }
    }
};

FT.lib.hashCookies();
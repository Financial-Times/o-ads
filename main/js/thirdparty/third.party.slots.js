(function (win, doc, undefined) {
    "use strict";
    var proto = Slots.prototype;
/**
 * The Slots class defines an FT.ads.slots instance.
 * @class
 * @constructor
*/
    function Slots() {
        //this.slots = {};
    }
/**
 * Collects configuration values from data attributes set on the slots container,
 * attributes should be in the format ftads-attrname (data- can also be added)
 * Only certain attribute names are parsed, all attributes without a parser are
 * added to the slots targeting parameters as a key value
 * parsed attributes are:
 * position - is added to targeting parameters as pos
 * page-type  - is added to targeting parameters as pt
 * size - takes a comma separated list of sizes and parses them to an array e.g 1x1,728x60 -> [[1, 1], [728,60]]
 * targeting - a list of key value pairs to be added to targeting in the format key=value; e.g name=gilbert;fruit=grape;
 * out-of-page - when this attribute is present an out of page unit will be created for this slot
 * //TODO collapse - see slot collapse empty options
 * @name fetchSlotConfig
 * @memberof Slots
 * @lends Slots
*/
    proto.fetchSlotConfig = function  (container, config) {
        var attrs, attr, attrObj, name, matches, parser,
            sizes = [],
            targeting = {},
            parsers = {
                'size': function (name, value){
                    value.replace(/(\d+)x(\d+)/g, function (match, width, height) {
                      sizes.push([ parseInt(width, 10), parseInt(height, 10)]);
                    });

                    return !!sizes.length ? sizes : false;
                },
                'position': function (name, value){
                    targeting.pos = value;
                    return value;
                },
                'out-of-page':  function (name, value){
                    config.outOfPage = true;
                    return true;
                },
                'page-type':  function (name, value){
                    targeting.pt = value;
                    return value;
                },
                'targeting': function (name, value) {
                    if (value !== undefined) {
                        value = FT._ads.utils.hash(value, ';', '=');
                        targeting = FT._ads.utils.extend(targeting, value);
                    }
                    return value;
                },
                'default': function (name, value) {
                    targeting[name] = value;
                    return value;
                }
            };

        attrs = container.attributes;
        for(attr in attrs) {
            attrObj = attrs[attr];
            if(attrs.hasOwnProperty(attr) && attrObj.name &&  !!(matches = attrObj.name.match(/(data-)?(ad|ftads)-(.+)/))) {
                name = matches[3];
                parser = FT._ads.utils.isFunction(parsers[name]) ? parsers[name] : parsers['default'];
                parser(name, attrObj.value);
            }
        }

        return {
            sizes: !!(sizes.length) ? sizes : config.sizes,
            outOfPage: config.outOfPage || false,
            collapseEmpty: config.collapseEmpty,
            targeting: targeting
        };
    };

/**
 * Given a script tag the method will inject a div with the given id into the dom just before the script tag
 * if the script tag has the same id as given to the method the attribute will be removed and added to the new div
 * Given any other tag the method will append the new div as a child
 * @name addContainer
 * @memberof Slots
 * @lends Slots
*/
    proto.addContainer = function(node, id) {
        var container = doc.createElement('div');

        container.setAttribute('id', id);

        if (node.tagName === 'SCRIPT') {
            if (node.id === id) {
                node.removeAttribute('id');
            }
            node.parentNode.insertBefore(container, node);
        } else {
            node.appendChild(container);
        }

        return container;
    };

/**
 * Given an element and an Array of sizes in the format [[width,height],[w,h]]
 * the method will apply style rules to center the container, the rules applied are
 * margin-left, margin-right: auto
 * max-width: derived maximum
 * min-width: 1px
 * @name centerContainer
 * @memberof Slots
 * @lends Slots
*/
    proto.centerContainer = function (element, sizes) {
        element.style.marginRight = 'auto';
        element.style.marginLeft = 'auto';

        function getMaximums(sizes) {
            var result = [0, 0];

            if (FT._ads.utils.isArray(sizes[0])) {
                for (var i = 0; i < sizes.length; i++){
                    result[0] = Math.max(sizes[i][0], result[0]);
                    result[1] = Math.max(sizes[i][1], result[1]);
                }
            } else {
                result = sizes;
            }

            return result;
        }

        var max = getMaximums(sizes);
        element.style.minWidth = '1px';
        element.style.maxWidth = max[0] + 'px';
    };

/**
 * creates a container for the ad in the page and gathers slot config then
 * calls the GPT module to define the slot in the GPT service
 * @name createSlot
 * @memberof Slots
 * @lends Slots
*/
    proto.initSlot = function (slotName) {
        var container = doc.getElementById(slotName),
            formats =  FT.ads.config('formats');

        if (!container) {
            return false;
        }

        var config = this.fetchSlotConfig(container, formats[slotName] || {});

        if (container.tagName === 'SCRIPT') {
            container = this.addContainer(container, slotName);
        }

        this[slotName] = {
            container: container,
            config: config
        };

        FT.ads.gpt.defineSlot(slotName);
        return this[slotName];
    };

    FT._ads.utils.extend(FT.ads, { slots: new Slots()});
} (window, document));

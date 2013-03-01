/**
 * Facade for Audience Science global functions.
 * @namespace FT.analytics.audienceScience
 */

FT.analytics = FT.analytics || {};

FT.analytics.audienceScience = {

    addEncToLoc: function () {
        if (typeof DM_addEncToLoc === "function") {
            return DM_addEncToLoc.apply(this, arguments);
        }
    },

    addToLoc: function () {
        if (typeof DM_addToLoc === "function") {
            DM_addToLoc.apply(this, arguments);
        }
    },

    cat: function () {
        if (typeof DM_cat === "function") {
            DM_cat.apply(this, arguments);
        }
    },

    name: function () {
        if (typeof DM_name === "function") {
            DM_name.apply(this, arguments);
        }
    },

    keywords: function () {
        if (typeof DM_keywords === "function") {
            DM_keywords.apply(this, arguments);
        }
    },

    event: function () {
        if (typeof DM_event === "function") {
            DM_event.apply(this, arguments);
        }
    },

    setLoc: function () {
        if (typeof DM_setLoc === "function") {
            DM_setLoc.apply(this, arguments);
        }
    },

    tag: function () {
        if (typeof DM_tag === "function") {
            return DM_tag.apply(this, arguments);
        }
    }
};
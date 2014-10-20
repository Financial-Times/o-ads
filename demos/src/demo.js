/*global require*/

window.FT = {
    env: {'dfp_site' : 'test.5887.origami', 'dfp_zone' : '', 'site': 'test'}
};
window.FT.ads = require('../../main.js').init({
    collapseEmpty: 'ft',
    // these are all targeting options
    metadata: true,
    audSci: true,
    krux: {
        limit: 70,
        id: '',
        events: {
            dwell_time: {
                interval: 5,
                id: 'JCadw18P',
                total: 600
            }
        }
    },
    socialReferrer: true,
    pageReferrer: true,
    cookieConsent:  true,
    timestamp: true,
    version: true,
    eid : 'oads',
    refresh: {
        time: false,
        max: 0,
        art: {
            time: false
        },
        ind: {
            time: 900
        }
    }
});
FT.ads.slots.initSlot('leaderboard');

document.addEventListener('DOMContentLoaded', function() {
   'use strict';
   document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
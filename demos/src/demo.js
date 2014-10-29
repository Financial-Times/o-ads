/*global require, FT*/
var ads = require('../../main.js').init({ 
    dfp_site: 'test.5887.origami', 
    eid: 'oads', 
    formats: 'leaderboard' 
});

ads.slots.initSlot('leaderboard');


/*global require, FT*/
var ads = require('../../main.js').init({
    dfp_site: 'test.5887.origami', 
    eid: 'oads', 
    formats: {
       leaderboard: {
         sizes: [[970,90]]
       },
       leaderboardOop: {
          sizes: [[970,90]],
          outOfPage: true
       }
    }
});

ads.slots.initSlot('leaderboard');
ads.slots.initSlot('leaderboardOop');         */


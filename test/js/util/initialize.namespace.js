window.FT = {
    _ads:{}
};
window.FT.ads = require('./../../../main.js').init({
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
//console.log(FT);



window.FT._ads = window.FT.ads;

'use strict';

var ads = require('../../main.js').init({
        dfp_site: 'test.5887.origami',
        responsive: {
            large: [400, 0],
            small: [0, 0]
        },
        formats: {
            responsivePos1: {
                sizes: {
                    large: [[300, 600]],
                    small: [[300, 600]]
                }
            },
            responsivePos2: {
                sizes: {
                 large: [[728,90]],
                 small: false
                }
            }
        }
    });

    ads.slots.initSlot('responsivePos1');
    ads.slots.initSlot('responsivePos2');


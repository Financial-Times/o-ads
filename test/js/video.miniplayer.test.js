/*(function (window, document, $, undefined) {
    function runTests() {
        module('Video Miniplayer');
        test("Video Miniplayer Targeting with Krux, audSci, AYSC and eid set", function () {
            var result;
            TEST.beginNewPage({
                config: { krux: true, metadata: true, audSci: true, audSciLimit :3, kruxLimit: 3},
                localStorage: { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'},
                cookies:{AYSC : "_011981_02M_04greater%2520london_05ITT_06TEC_07MA_12SE19HL_13GBR_14GBR_15UK_17london_18london_190500_20n_2112_22P0P2Tools_24europe_25PVT_26PVT_273f5a2e_40forty_41fortyone_42fortytwo_43fortythree_44fortyfour_45fortyfive_46fortysix_47fortyseven_48fortyeight_49fortynine_50fifty_51fiftyone_52fiftytwo_53fiftythree_54fiftyfour_55fiftyfive_56fiftysix_57fiftyseven_58fiftyeight_59fiftynine_60sixty_",
                            "rsi_segs" : "J07717_10089|J07717_10236|J07717_10288|J07717_10295|J07717_10299|J07717_10369|J07717_10555|J07717_10545|J07717_10633|J07717_10644|J07717_10645",
                            FT_U: '_EID=1111111_PID=4009036331_TIME=%5BTue%2C+06-Aug-2013+11%3A54%3A53+GMT%5D_SKEY=lUM4QDoONobvNQGGJP3ETA%3D%3D_RI=0_I=1',kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'}
            });
            result = FT.ads.buildURLForVideo("uk","video",{});
            strictEqual(result.additionalAdTargetingParams,'07=ma;ksg=seg1;ksg=seg2;ksg=seg3;a=z89;a=z236;a=z288;06=tec;slv=lv2;eid=1111111;05=itt;19=500;21=12;27=3f5a2e;20=n;02=m;14=gbr;cn=eur;01=1981');
        });

        test("Video Miniplayer URL Stem", function () {
            var result;
            TEST.beginNewPage({
              global: {'dfp_site': 'ftcom.5887.home', 'dfp_zone': 'dev', 'dfp_targeting': 'XXXX;pt=ind'}
            });
            result = FT.ads.buildURLForVideo("uk","video",{});
            strictEqual(result.urlStem,'http://ad.uk.doubleclick.net/N5887/pfadx/ftcom.5887.home/dev;sz=592x333,400x225;pos=video;XXXX;pt=ind');
        });
   }
    $(runTests);
}(window, document, jQuery));
*/





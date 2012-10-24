// Just a few functions to help regression testing ads libraries with mock ads.
// Note this is an .html.js because the make file will automatically copy .htm*
// files from the test directory to the build target directory but won't do
// .js files by themself and we couldn't work out now to change the pom to make
// it so.

/*jslint evil: true, white: true, browser: true, undef: true, nomen: false,
    onevar: false, plusplus: false, eqeqeq: true, bitwise: true,
    regexp: false, newcap: true, immed: true, maxerr: 1000, indent: 3
*/

/*globals FT, CheckAds, doit, ok, equal, jQuery, window, alert, env,
    dfp_site, asset, timeoutTolerance, alert, document, jQuery, mockAdContent,
    mockFalconAd, unitOrIntegrationMessage, unitOrIntegrationMode
*/

/*members append, appendChild, banlb, corppop, createTextNode,
    getElementById, intro, join, match, newssubs, payload, test,
    regex, description, adName, type, src, createElement, tlbxrib,
    mktsdata, hlfmpu, doublet, oob, refresh, mpu, banlb2, banlb3,
    banlbmaster, banlbflash, newssubscompanion, hlfmpuflash, doubletcompanion,
    corppop2, newssubs2, hlfmpucompanion
*/
//=========================================================================
// Objects to mock different ad calls depending on test plan being used
//=========================================================================

var TestMockNoAd = {
   'intro': {
      'regex': /ft-no-ad-1x1\.gif/i,
      'description': 'ft-no-ad-1x1.gif',
      'adName': "no ad booked for 1x1",
      'payload': mockFalconAd('intro', 'empty', '218967783', '33850112', 'no ad booked for 1x1', '\n<img src=\"../images/ft-no-ad-1x1.gif\">')
   },
   'banlb': {
      'regex': /ft-no-ad-(468x60|728x90)\.gif$/i,
      'description': 'ft-no-ad-728x90.gif or ft-no-ad-468x60.gif',
      'adName': /collapsed banlb master for (728x90|468x60)/,
      'payload': mockFalconAd('banlb', 'empty', '219082734', '33903246', 'collapsed banlb master for 728x90', '\n<img src=\"../images/ft-no-ad-728x90.gif\">')
   },
   'newssubs': {
      'regex': /ft-no-ad-239x90\.gif$/i,
      'description': 'newssubs-239x90.gif',
      'adName': "companion collapsed newssubs 239x90",
      'payload': mockFalconAd('newssubs', 'empty', '219082642', '33903203', 'companion collapsed newssubs 239x90', '<img src=\"../images/ft-no-ad-239x90.gif\">')
   },
   'tlbxrib': {
      'regex': /ft-no-ad-336x60\.gif$/i,
      'description': 'ft-no-ad-336x60.gif',
      'adName': "no ad booked for 336x60",
      'payload': mockFalconAd('tlbxrib', 'empty', '226109795', '34509945', 'no ad booked for 336x60', '\n<img src=\"../images/ft-no-ad-336x60.gif\">')
   },
   'mktsdata': {
      'regex': /ft-no-ad-75x25\.gif$/i,
      'description': 'ft-no-ad-75x25.gif',
      'adName': "no ad booked for 75x25",
      'payload': mockFalconAd('mktsdata', 'empty', '220081467', '34510856', 'no ad booked for 75x25', '\n<img src=\"../images/ft-no-ad-75x25.gif\">')
   },
   'hlfmpu': {
      'regex': /ft-no-ad-(300|336)x(250|280|600|850)\.gif$/i,
      'description': 'valid halfmpu gif',
      'adName': /no ad booked for (300|336)x(250|280|600|850)/,
      'payload': mockFalconAd('hlfmpu', 'empty', '218968055', '33850352', 'no ad booked for 300x600', '\n<img src=\"../images/ft-no-ad-300x600.gif\">')
   },
   'doublet': {
      'regex': /ft-no-ad-342x200\.gif$/i,
      'description': 'ft-no-ad-342x200.gif',
      'adName': "no ad booked for 342x200",
      'payload': mockFalconAd('doublet', 'empty', '220081514', '34510893', 'no ad booked for 342x200', '\n<img src=\"../images/ft-no-ad-342x200.gif\">')
   },
   'oob': {
      'regex': /ft-no-ad-1x1\.gif$/i,
      'description': 'ft-no-ad-1x1.gif',
      'adName': "no ad booked for 1x1"
   },
   'corppop': {
      'regex': /ft-no-ad-1x1-corppop\.gif$/i,
      'description': 'ft-no-ad-1x1-corppop.gif',
      'adName': "no ad booked for 1x1 corppop"
   },
   'refresh': {
      'regex': /ft-no-ad-1x1-refresh\.gif/i,
      'description': 'ft-no-ad-1x1-refresh.gif',
      'adName': /default refresh ad with no handleRefreshLogic/i,   // |refresh adjustment \d
      'payload': mockFalconAd('refresh', 'empty', '218897402', '35979816', 'default refresh ad with no handleRefreshLogic', '\n<img src=\"../images/ft-no-ad-1x1-refresh.gif\">')
   },
   'mpu': {
      'regex': /ft-no-ad-(300|336)x(250|280)\.gif$/i,
      'description': 'ft-no-ad-(300|336)x(250|280).gif',
      'adName': /no ad booked for (300|336)x(250|280)/,
      'payload': mockFalconAd('mpu', 'empty', '218968131', '33850438', 'no ad booked for 336x280', '<a target="_blank" href="http://ad.doubleclick.net/click;h=v8/3a08/0/0/%2a/h;219980817;0-0;1;40911646;4252-336/280;34558440/34576318/1;;~sscs=%3fhttp://www.ft.com"><img src="../images/ft-no-ad-336x280.gif" border=0 alt="FT.com Test Ads DEV"></a>')
   }

};


var TestMockAd = {
   'intro': {
      'regex': /\/adj\/N1397\.ft\.com\.pe\/B3882203/i,
      'description': 'blahblahblah',
      'payload': mockFalconAd('intro', '', '', '', '', '<!-- ad ID: 219975130 creative ID: 34492273 -->\n<style type=\"text/css\">\n   #intro_overlay {\n      position: absolute; \n      top: 350px; \n      left: 600px; \n      width: 400px; \n      height: 250px;\n      border: 4px solid black;\n      padding: 4px;\n      background: yellow;\n      color:black;\n      font-family: verdana, arial, helvetica, sans-serif;\n      z-index: 100000;\n   }\n   #intro_overlay a {\n      text-decoration: none;\n   }\n   #intro_overlay a:hover {\n      text-decoration: underline;\n   }\n   #intro_overlay .close_button {\n      float: right;\n      margin: 5px 10px 0 0;\n      font-weight: bold;\n   }\n   #intro_overlay .logo {\n      float: left;\n      margin: 5px 10px 0 0;\n      font-weight: bold;\n   }\n</style>\n<div id=\"intro_overlay\">\n   <div class=\"logo\"><img src=\"../images/favicon.ico\" width=\"64\" height=\"64\"></div>\n   <div class=\"close_button\" onclick=\"javascript: this.parentNode.style.display=\'none\';\">\n      <a href=\"#\">X</a>\n   </div>\n   <h2>intro</h2>\n   <!-- The percent u macro below inserts the click through URL -->\n   <h3><a href=\"http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/3/0/%2a/f%3B219975130%3B0-0%3B1%3B40911646%3B31-1/1%3B34492273/34510151/1%3B%3B%7Esscs%3D%3fhttp://www.ft.com/\">1x1</a></h3>\n</div>')
   },
   'banlb': {
      'regex': /ft-no-ad-(468x60|728x90)\.gif$/i,
      'description': 'ft-no-ad-728x90.gif or ft-no-ad-468x60.gif',
      'adName': /collapsed banlb master for (728x90|468x60)/,
      'payload': mockFalconAd('banlb', 'empty', '219082734', '33903246', 'collapsed banlb master for 728x90', '<img src="../images/ft-no-ad-728x90.gif"><!-- Begin Interstitial Ad --><!-- ad ID: 220435672  creative ID: 34653048 -->\n<style type="text/css">\n         #interstitial_overlay {\n            position: absolute; \n            top: 20px; \n            left: 100px; \n            width: 500px; \n            height: 300px;\n            border: 4px solid red;\n            padding: 4px;\n            background: black;\n            color:white;\n            font-family: verdana, arial, helvetica, sans-serif;\n            z-index: 100000;\n         }\n         #interstitial_overlay a {\n            text-decoration: none;\n         }\n         #interstitial_overlay a:hover {\n            text-decoration: underline;\n         }\n         #interstitial_overlay .close_button {\n            float: right;\n            margin: 5px 10px 0 0;\n            font-weight: bold;\n         }\n         #interstitial_overlay .logo {\n            float: left;\n            margin: 5px 10px 0 0;\n            font-weight: bold;\n         }\n      </style>\n<div id="interstitial_overlay" class="new_interstitial">\n         <!-- The percent i macro below records the interstitial impression when served -->\n         <div class="logo"><img src="../images/favicon.ico" width="64" height="64"></div>\n         <div class="close_button" onclick="javascript: this.parentNode.style.display=' + "'none'" + ';">\n            <a href="#">X</a>\n         </div>\n         <h2>interstitial</h2>\n         <!-- The percent u macro below inserts the click through URL -->\n         <h3><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/39d6/2/0/%2a/z%3B220435672%3B0-0%3B0%3B46484925%3B255-0/0%3B34653048/34670926/1%3B%3B%7Esscs%3D%3fhttp://www.ft.com">1x1</a></h3>\n      </div>\n')
   },
   'banlb2': {
      'regex': /banlb-(468x60|728x90)\.gif$/i,
      'description': 'banlb-728x90.gif or banlb-468x60.gif',
      'payload': mockFalconAd('banlb', '', '', '', '', '<img src="../images/banlb-728x90.gif" border=0 alt="Markets"></a><!-- Begin Interstitial Ad --><!-- Begin Interstitial Ad -->\n<!-- ad ID: 220442740  creative ID: 34653879 -->\n<style type=\"text/css\">\n   #corppop_overlay {\n      position: absolute; \n      top: 420px; \n      left: 680px; \n      width: 400px; \n      height: 250px;\n      border: 4px solid green;\n      padding: 4px;\n      background: blue;\n      color:white;\n      font-family: verdana, arial, helvetica, sans-serif;\n      z-index: 120000;\n   }\n   #corppop_overlay a {\n      text-decoration: none;\n   }\n   #corppop_overlay a:hover {\n      text-decoration: underline;\n   }\n   #corppop_overlay .close_button {\n      float: right;\n      margin: 5px 10px 0 0;\n      font-weight: bold;\n   }\n   #corppop_overlay .logo {\n      float: left;\n      margin: 5px 10px 0 0;\n      font-weight: bold;\n   }\n</style>\n<div id=\"corppop_overlay\" class=\"corppop_single_occurence\">\n   <!-- The percent i macro below records the interstitial impression when served -->\n   <div class=\"logo\"><img src=\"../images/favicon.ico\"width=\"64\" height=\"64\"></div>\n   <div class=\"close_button\" onclick=\"javascript: this.parentNode.style.display=\'none\';\">\n      <a href=\"#\">X</a>\n   </div>\n   <h2>corppop</h2>\n   <!-- The percent u macro below inserts the click through URL percent c allows DFP to track the click itself -->\n   <h3><a href=\"http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/2/0/%2a/l%3B220442740%3B0-0%3B1%3B40911646%3B255-0/0%3B34653879/34671757/1%3B%3B%7Esscs%3D%3fhttp://www.ft.com\">interstitial (dcopt=ist)</a></h3>\n   <h3>AYSC 27=gggggg</h3>\n</div>')
   },
   'banlb3': {
      'regex': /banlb-(468x60|728x90|normal-ad)\.gif$/i,
      'description': 'banlb-728x90.gif or banlb-468x60.gif',
      'payload': mockFalconAd('banlb', '', '220435672', '34653048', '', '<img src="../images/banlb-728x90.gif" border=0 alt="Markets"><!-- ad ID: 220435672  creative ID: 34653048 -->\n      <style type=\"text/css\">\n         #interstitial_overlay {\n            position: absolute; \n            top: 20px; \n            left: 100px; \n            width: 500px; \n            height: 300px;\n            border: 4px solid red;\n            padding: 4px;\n            background: black;\n            color:white;\n            font-family: verdana, arial, helvetica, sans-serif;\n            z-index: 100000;\n         }\n         #interstitial_overlay a {\n            text-decoration: none;\n         }\n         #interstitial_overlay a:hover {\n            text-decoration: underline;\n         }\n         #interstitial_overlay .close_button {\n            float: right;\n            margin: 5px 10px 0 0;\n            font-weight: bold;\n         }\n         #interstitial_overlay .logo {\n            float: left;\n            margin: 5px 10px 0 0;\n            font-weight: bold;\n         }\n      </style>\n      <div id=\"interstitial_overlay\" class=\"new_interstitial\">\n         <!-- The percent i macro below records the interstitial impression when served -->\n         <div class=\"logo\"><img src=\"../images/favicon.ico\" width=\"64\" height=\"64\"></div>\n         <div class=\"close_button\" onclick=\"javascript: this.parentNode.style.display=\'none\';\">\n            <a href=\"#\">X</a>\n         </div>\n         <h2>interstitial</h2>\n         <!-- The percent u macro below inserts the click through URL -->\n         <h3><a href=\"http://ad.doubleclick.net/click%3Bh%3Dv8/3a06/2/0/%2a/v%3B220435672%3B0-0%3B0%3B40911646%3B255-0/0%3B34653048/34670926/1%3B%3B%7Esscs%3D%3fhttp://www.ft.com\">1x1</a></h3>\n      </div>\n')
   },
   'banlbmaster': {
     'regex' : /3-banlb-master-728x90\.GIF$/i,
      'payload': mockFalconAd('banlb', '', '', '', '', '<a target="_blank" href="http://ad.doubleclick.net/click;h=v8/3a06/0/0/%2a/i;219337529;0-0;9;42538302;3454-728/90;34066927/34084808/1;;~sscs=%3fhttp://www.ft.com"><img src="../images/3-banlb-master-728x90.GIF" border=0 alt="FT.com Test Ads DEV"></a>')
   },
   'banlbflash': {
      'regex': /FLASH_AD|flashfirebug\d|eb(Reporting|Banner)Flash(_0_)?/i,
      'description': 'flash ad ebBannerFlash_0_*',
      'payload': mockFalconAd('banlb', 'flash', '', '', '', '<!-- Copyright DoubleClick Inc., All rights reserved. -->\n<!-- This code was autogenerated @ Tue May 11 11:41:47 EDT 2010 -->\n<script src=\"flashwrite_1_2.js\"><\/script>\n\n')
   },
   'newssubs': {
      'regex': /ft-no-ad-239x90\.gif$/i,
      'description': 'newssubs-239x90.gif',
      'adName': "companion collapsed newssubs 239x90",
      'payload': mockFalconAd('newssubs', 'empty', '219082642', '33903203', 'companion collapsed newssubs 239x90', '<img src="../images/ft-no-ad-239x90.gif">')
   },
   'newssubs2': {
      'regex': /newssubs-239x90\.gif$/i,
      'description': 'newssubs-239x90.gif',
      'payload': mockFalconAd('newssubs', '', '', '', '', '<img src="../images/3-newssubs-239x90.GIF" border=0 alt="FT.com Test Ads DEV">')
   },
   'newssubscompanion': {
      'payload': mockFalconAd('newssubs', '', '', '', '', '<a target="_blank" href="http://ad.doubleclick.net/click;h=v8/3a06/0/0/%2a/g;219337406;0-0;9;42538302;19263-239/90;34024806/34042684/1;;~sscs=%3fhttp://www.ft.com"><img src="../images/1-newssubs-companion-239x90.GIF" border=0 alt="FT.com Test Ads DEV"></a>')
   },
   'tlbxrib': {
      'regex': /tlbxrib-336x60\.gif|tlb-xrib-normal\.gif/i,
      'description': 'tlbxrib-336x60.gif',
      'payload': mockFalconAd('tlbxrib', '', '', '', '', '<!-- Template ID = 12548 Template Name = FT Default House Ad (non-Falcon) -->\n<!-- Ad ID: 219975011 Creative ID: 35188481 -->\n<span class=\"dfp-ad-details\" style=\"display:none\">AdvId: 2389285 AdId: 219975011 CrId: 35188481</span>\n<a href=\"http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/3/0/%2a/c%3B219975011%3B0-0%3B1%3B40911646%3B2383-336/60%3B35188481/35206299/1%3B%3B%7Esscs%3D%3fhttp://www.google.com\" target=\"_top\">\n<img border=\"0\" alt=\"FT.com Test Ads DEV\" src=\"../images/tlbxrib-336x60.GIF\"/></a>\n')
   },
   'mktsdata': {
      'regex': /mktsdata-75x25\.gif|mktsdata-normal-ad\.gif/i,
      'description': 'mktsdata-75x25.gif',
      'payload': mockFalconAd('mktsdata', 'htmlscript', '219975169', '34598218', 'mktsdata test logo', '<span class="sponsor" style="margin: 2px 0pt 0pt -75px; position: absolute;">Sponsored by</span><a target="_blank" href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/3/0/%2a/v%3B219975169%3B0-0%3B1%3B40911646%3B486-75/25%3B34598218/34616096/1%3B%3B%7Esscs%3D%3fhttp://www.ft.com"><img width="75" height="25" border="0" src="../images/mktsdata-75x25.gif"/></a>')
   },
   'hlfmpu': {
      'regex': /(1-)?halfmpu([-]*)(300|336)x(250|280|600|850)\.gif|mpu-normal-ad\.gif/i,
      'description': 'valid halfmpu gif',
      'payload': mockFalconAd('hlfmpu', '', '', '', '', '<a target="_blank" href="http://ad.doubleclick.net/click;h=v8/3a03/0/0/%2a/k;218040804;0-0;2;40911646;4252-336/280;33373875/33391753/1;;~sscs=%3fhttp://www.ft.com"><img src="../images/1-halfmpu336x280.gif" border=0 alt="FT.com Test Ads DEV"></a>')
   },
   'hlfmpucompanion': {
      'payload': mockFalconAd('hlfmpu', '', '', '', '', '<a target="_blank" href="http://ad.doubleclick.net/click;h=v8/3a06/0/0/%2a/x;219471237;0-0;9;42538302;4252-336/280;34088404/34106285/1;;~sscs=%3fhttp://www.ft.com"><img src="../images/mpu-336x280-companion.GIF" border=0 alt="FT.com Test Ads DEV"></a>')
   },
   'hlfmpuflash': {
      'regex': /flashfirebug\d|eb(Reporting|Banner)Flash(_1_)?/i,
      'description': 'flash ad ebBannerFlash_1_*'
   },
   'doublet': {
      'regex': /something/i,
      'description': 'blahblahblah',
      'payload': mockFalconAd('doublet', 'htmlscript', '220021083', '34473321', 'doublet DOUBLET AD', '[<div class="doublet"  style="background: cyan"><h3>DOUBLET AD</h3><div class="doublet-wrapper doublet_first"><div class="doublet-content"><h4><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/3/0/%2a/t%3B220021083%3B0-0%3B1%3B40911646%3B16843-342/200%3B34473321/34491199/1%3B%3B%7Esscs%3D%3fhttp://politicalhumor.about.com/od/barackobama/ig/Barack-Obama-Cartoons/">DOUBLET ADVERT 1</a></h4><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/3/0/%2a/t%3B220021083%3B0-0%3B1%3B40911646%3B16843-342/200%3B34473321/34491199/1%3B%3B%7Esscs%3D%3fhttp://politicalhumor.about.com/od/barackobama/ig/Barack-Obama-Cartoons/"><img src="../images/doublet-1-169x96.jpg" alt="Ad 1 Alt Text"/></a><p><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/3/0/%2a/t%3B220021083%3B0-0%3B1%3B40911646%3B16843-342/200%3B34473321/34491199/1%3B%3B%7Esscs%3D%3fhttp://politicalhumor.about.com/od/barackobama/ig/Barack-Obama-Cartoons/">Advert 1 Subheading</a></p></div></div><div class="doublet-wrapper doublet_last"><div class="doublet-content"><h4><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/3/0/%2a/t%3B220021083%3B0-0%3B1%3B40911646%3B16843-342/200%3B34473321/34491199/1%3B%3B%7Esscs%3D%3fhttp://xkcd.com/">DOUBLET ADVERT 2</a></h4><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/3/0/%2a/t%3B220021083%3B0-0%3B1%3B40911646%3B16843-342/200%3B34473321/34491199/1%3B%3B%7Esscs%3D%3fhttp://xkcd.com/"><img src="../images/doublet-2-169x96.jpg" alt="Advert 2 Alt Text"/></a><p><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a03/3/0/%2a/t%3B220021083%3B0-0%3B1%3B40911646%3B16843-342/200%3B34473321/34491199/1%3B%3B%7Esscs%3D%3fhttp://xkcd.com/">Advert 2 Subheading</a></p></div></div></div>].join("\n")')
   },
   'doubletcompanion': {
      'payload': mockFalconAd('doublet', 'htmlscript', '220013387', '34472542', 'doublet DOUBLET COMPANION', '[<div class="doublet"><h3>DOUBLET COMPANION</h3><div class="doublet-wrapper doublet_first"><div class="doublet-content"><h4><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a06/3/0/%2a/v%3B220013387%3B0-0%3B9%3B42538302%3B16843-342/200%3B34472542/34490420/1%3B%3B%7Esscs%3D%3fhttp://politicalhumor.about.com/od/barackobama/ig/Barack-Obama-Cartoons/">ADVERT 1</a></h4><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a06/3/0/%2a/v%3B220013387%3B0-0%3B9%3B42538302%3B16843-342/200%3B34472542/34490420/1%3B%3B%7Esscs%3D%3fhttp://politicalhumor.about.com/od/barackobama/ig/Barack-Obama-Cartoons/"><img src="../images/doublet-companion-1-167x96.jpg" alt="Ad 2 Alt Text"/></a><p><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a06/3/0/%2a/v%3B220013387%3B0-0%3B9%3B42538302%3B16843-342/200%3B34472542/34490420/1%3B%3B%7Esscs%3D%3fhttp://politicalhumor.about.com/od/barackobama/ig/Barack-Obama-Cartoons/">Ad 1 Subheading</a></p></div></div><div class="doublet-wrapper doublet_last"><div class="doublet-content"><h4><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a06/3/0/%2a/v%3B220013387%3B0-0%3B9%3B42538302%3B16843-342/200%3B34472542/34490420/1%3B%3B%7Esscs%3D%3fhttp://xkcd.com/">ADVERT 2</a></h4><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a06/3/0/%2a/v%3B220013387%3B0-0%3B9%3B42538302%3B16843-342/200%3B34472542/34490420/1%3B%3B%7Esscs%3D%3fhttp://xkcd.com/"><img src="../images/doublet-companion-2-167x96.jpg" alt="Ad 2 Alt Text"/></a><p><a href="http://ad.doubleclick.net/click%3Bh%3Dv8/3a06/3/0/%2a/v%3B220013387%3B0-0%3B9%3B42538302%3B16843-342/200%3B34472542/34490420/1%3B%3B%7Esscs%3D%3fhttp://xkcd.com/">Ad 2 Subheading</a></p></div></div></div>].join("\n")')
   },
   'oob': {
      'regex': /\/adj\/N3756\.FT\/B3298716/i,
      'description': 'valid oob position',
      'payload': ''
   },
   'corppop': {
      'regex': /x/i,
      'description': 'xxxx'
   },
   'corppop2': {
      'regex': /something/i,
      'description': 'blahblahblah'
   },
   'refresh': {
      'regex': /ft-refresh-1x1\.gif/i,
      'description': 'ft-refresh-1x1.gif',
      'adName': "refresh adjustment 32767",
      'payload': mockFalconAd('refresh', 'empty', '219975885', '34532543', 'refresh adjustment 32767', '<img src=\"../images/ft-refresh-1x1.gif\">')
   },
   'refreshTrovus': {
         'regex': /ft-refresh-1x1\.gif/i,
         'description': 'ft-refresh-1x1.gif',
         'adName': "refresh adjustment 32767",
         'payload': mockFalconAd('refreshTrovus', 'empty', '219975885', '34532543', 'refresh adjustment 32767','<img src=\"ft-refresh-1x1.gif\">')
      },
   'mpu': {
      'regex': /[24]-mpu-(300|336)x(250|280)\.gif|mpu-normal-ad\.gif$/i,
      'description': 'valid mpu gif',
      'payload': mockFalconAd('mpu', '', '', '', '', '<a target="_blank" href="http://ad.doubleclick.net/click;h=v8/3a08/0/0/%2a/h;219980817;0-0;1;40911646;4252-336/280;34558440/34576318/1;;~sscs=%3fhttp://www.ft.com"><img src="../images/4-mpu-336x280.GIF" border=0 alt="FT.com Test Ads DEV"></a>')
   },
   'mpuBehav': {
      'regex': /behavioural-mpu\.gif$/i,
      'description': 'mpu image in template allowing behavioural targetting with ePrivacy icon',
      'payload': mockFalconAd('mpu','','','','','<img src="http://s0.2mdn.net/2389285/behavioural-mpu.gif"><div id=\"collision_marker\"><img src="ACollisionAdMarker.png"></div>')
   }
};

var LegacyPlaceholders = {
      'banlb': 'ad-placeholder-banlb',
      'newssubs': 'ad-container-newssubs',
      'mpu': 'ad-container-mpu',
      'refresh': 'ad-placeholder-refresh'
   };

//=========================================================================
// Functions to mock ad content from the server
//=========================================================================

function unitOrIntegrationMode(FTQAcookie, insertCookie)
{
   //FTQAcookie = 'integration';
   if (FTQAcookie  === undefined) {
      FTQAcookie = '';
   }
   var result = 'unit';
   var Match = FTQAcookie.match(/integration/);
   if (Match)
   {
      result = (insertCookie === 'no') ? 'int_nocookieurl': 'integration';
   }
   return result;
}

function unitOrIntegrationMessage(testMode)
{

   var modeDiv = document.getElementById("mode");
   var dcCookieDiv = document.getElementById("dccookie");

   if ((testMode === 'integration') || (testMode === 'int_nocookieurl'))
   {
      modeDiv.appendChild(document.createTextNode("You are in INTEGRATION MODE. Set cookie FTQA=unit to return to unit test mode."));
   }

   if (testMode === 'integration')
   {

      var dcCookieURLScript1 = document.createElement('script');
      dcCookieURLScript1.type = 'text/javascript';
      dcCookieURLScript1.src = 'http://ad.doubleclick.net/adj/test.5887.dev/cookie-jar;sz=1x1;ord=1029676508775?';

      var dcCookieURLScript2 = document.createElement('script');
      dcCookieURLScript2.type = 'text/javascript';
      dcCookieURLScript2.src = 'http://ad.doubleclick.net/adj/test.5887.dev/cookie-jar;sz=1x1;ord=1029676500775?';

      dcCookieDiv.appendChild(dcCookieURLScript1);
      dcCookieDiv.appendChild(dcCookieURLScript2);

   } else {
      modeDiv.appendChild(document.createTextNode("You are in UNIT TEST MODE. Set cookie FTQA=integration to switch to integration test mode."));
   }

}

function mockAdContent(URL, Tests, LegacyBoolean)
{
   var NoAds = {
      'intro':    'ft-no-ad-1x1.gif',
      'banlb':    'ft-no-ad-728x90.gif',
      'newssubs': 'ft-no-ad-239x90.gif',
      'corppop':  'ft-no-ad-1x1.gif'
   };

   var pos = URL.match(/pos=(\w+);/)[1];
   var placeholder;

   //we assume DFP page unless LegacyBoolean is set to 'yes'
   if (LegacyBoolean === 'yes') {
      //ads on legacy pages have to be mapped to different placeholders
      placeholder = LegacyPlaceholders[pos];
   } else {
      placeholder = pos;
   }

   var html = '<!-- No Ad Payload -->';
   var image;
   if (Tests[pos] && Tests[pos].payload)
   {
      html = Tests[pos].payload;

      if (! /</.test(html))
      {
         image = html;
      }
   }
   else
   {
      image = NoAds[pos] || 'ft-no-ad-0x0.gif';
   }

   if (image)
   {
      html = [
         '<a target="_blank" href="http://ad.doubleclick.net/">',
         '<img src="../images/' + image + '" alt="Regression Test" border="0">',
         '</a>'
      ].join('');
   }

   if (pos === "intro") {
      //there is no intro div, so we append to a wrapping div to
      //place it in the right location at the same level as the
      //fullpage-container div
      jQuery('#' + "father-of-intro").append(html);
   }  else {
      jQuery('#' + placeholder).append(html);
   }

}

function mockFalconAd(name, type, flight, adId, adName, more)
{
   var scr = 'script';
   //added to stop stripping off of ../ infront of img subdir
   var MockSubdir = true;

   if (! more)
   {
      more = '';
   }
   if (!MockSubdir) {
      more = more.replace(/\.\.\//, '');
   }

   var ad = '';
   if (type === 'flash') {

      //at the moment cant find a way of running flash ads in unit test mode
   }
   else if (name === 'refresh') {

      var Match = adName.match(/no handleRefreshLogic/);
      var RefreshLogic = '';
      if (!Match) {
         RefreshLogic = 'FT.ads.handleRefreshLogic(obj, 32767 * 1000);';
      }

      ad = [ '<', scr, ' language="javascript">\n',
                'var obj = {',
                '"name": "' + name + '",\n',
                '"type": "' + type + '",\n',
                '"flight": "' + flight + '",\n',
                '"adId": "' + adId + '",\n',
                '"adName": "' + adName + '"\n',
                '};\n',
                'if (window.FT && window.FT.ads && window.FT.ads.handleRefreshLogic && window.FT.ads.callback && window.FT.ads.breakout){\n',
                'FT.ads.breakout(obj);\n',
                RefreshLogic + '\n',
                'FT.ads.callback(obj);\n',
                '}\n',
                '</' + scr + '>\n',
                more
             ].join('');

   }
   else if (name === 'refreshTrovus') {

    var Match = adName.match(/no handleRefreshLogic/);
    var RefreshLogic = '';
    if (!Match) {
       RefreshLogic = 'FT.ads.handleRefreshLogic(obj, 32767 * 1000);';
    }

    ad = [ '<', scr, ' language="javascript">\n',
              'var obj = {',
              '"name": "' + name + '",\n',
              '"type": "' + type + '",\n',
              '"flight": "' + flight + '",\n',
              '"adId": "' + adId + '",\n',
              '"adName": "' + adName + '"\n',
              '};\n',
              'if (window.FT && window.FT.ads && window.FT.ads.handleRefreshLogic && window.FT.ads.callback && window.FT.ads.breakout){\n',
              'FT.ads.breakout(obj);\n',
              RefreshLogic + '\n',
              'FT.ads.callback(obj);\n',
              '}\n',
              'var splatScript = document.createElement(\'script\');',
              'splatScript.src = ((\'https:\' == document.location.protocol) ? \'https://\' : \'http://\') + \'revelations.trovus.co.uk/tracker/677.js\';',
              'splatScript.type = \'text/javascript\';',
              'document.getElementsByTagName(\'head\')[0].appendChild(splatScript);',
              '</' + scr + '>\n',
              more
           ].join('');

 }
   else {

      ad = [ '<', scr, ' language="javascript">\n',
                 'var obj = {',
                 '"name": "' + name + '",\n',
                 '"type": "' + type + '",\n',
                 '"flight": "' + flight + '",\n',
                 '"adId": "' + adId + '",\n',
                 '"adName": "' + adName + '"\n',
                 '};\n',
                 'if (window.FT && window.FT.ads && window.FT.ads.callback && window.FT.ads.breakout) {\n',
                 'FT.ads.breakout(obj);\n',
                 'FT.ads.callback(obj);\n',
                 '}\n',
                 '</' + scr + '>\n',
                 more
              ].join('');

   }
   return ad;
}

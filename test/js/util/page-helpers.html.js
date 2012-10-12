// Just a few functions to help regression testing the ads on a page test plans
// Note this is an .html.js because the make file will automatically copy .htm*
// files from the test directory to the build target directory but won't do
// .js files by themself and we couldn't work out now to change the pom to make
// it so.

/*jslint evil: true, white: true, browser: true, undef: true, nomen: false,
    onevar: false, plusplus: false, eqeqeq: true, bitwise: true,
    regexp: false, newcap: true, immed: true, maxerr: 1000, indent: 3
*/

/*globals FT, CheckAds, doit, ok, equal, jQuery, window, alert, env,
    dfp_site, asset, timeoutTolerance, Tests, matches, locateDiv, differs
*/

//=========================================================================
// Ad on a page test plan helpers
//=========================================================================

function initTest(pos)
{
   if (!Tests[pos])
   {
      //p ending();
      Tests[pos] = {};
      Tests[pos].regex = /xyzzy will never match/;
      Tests[pos].description = 'Tests implemented';
   }
}

function checkImagesInAd(pos, rDiv, display, totalImagesExpected, srcMatch, rImg)
{
   var cssSel = "div#" + pos + ".advertising";
   if (!rImg)
   {
      rImg = rDiv.find("img");
   }
   var firstImgSrc;

   var idx = 0;
   var validImages = 0;
   
   for (idx = 0;idx < rImg.length;idx++)
   {
      var imgSrc = rImg[idx].src;
      var imgMatch = imgSrc.match(/ft-cookie-jar/);
      if (!imgMatch) {
         if (!firstImgSrc)
         {
            firstImgSrc = rImg[idx].src;
         }
         validImages++;
      }
   }

   if (display)
   {
      equal(rDiv.css("display"),                                                              display, cssSel + " should have display");
   }
   equal(validImages, totalImagesExpected,                                                    "div#" + pos + " should contain img tags totalling");
   matches(firstImgSrc, srcMatch,                                                              "img src should match " + Tests[pos].description);
}

function testNoAd(pos, args, prefix, totalImagesExpected, visible,localcorppop)
{
   var cssSel = "div#" + pos + ".advertising";
   totalImagesExpected = totalImagesExpected || 1;
   visible = visible || 'none';
   initTest(pos);
   var rDiv, rImg;
   if (!args)
   {
      rDiv = locateDiv(pos, prefix);
      rImg = rDiv.find("img");
   }
   else
   {
      rDiv = args.div;
      rImg = args.img;
   }

   var expected;
   
   var expected = pos === 'intro' ? 'block' : visible;
   
   //special case if we have a locally served corppop
   if ((localcorppop === 'yes') && (pos === 'banlb')){
	   expected = 'block';
   }
   equal(rDiv.css("display"),                                                            expected, cssSel + " should have display");

   if (FT.ads.adverts[pos].response)
   {
      equal(FT.ads.adverts[pos].response.name, pos,                                               "obj.name should be");
      equal(FT.ads.adverts[pos].response.type, 'empty',                                           "obj.type should be");

      if (Tests[pos].adName.constructor === RegExp)
      {
         ok(FT.ads.adverts[pos].response.adName, Tests[pos].adName,                           "obj.adName should match " + Tests[pos].adName + " regexp");
      }
      else
      {
         equal(FT.ads.adverts[pos].response.adName, Tests[pos].adName,                            "obj.adName should be");
      }

      checkImagesInAd(pos, rDiv, undefined, totalImagesExpected, Tests[pos].regex, rImg);
   }
}

function testNoIntro()
{
   // Intro ad doesn't have an advertising class wrapped around it.
   var id = 'fullpage-container';
   var rDiv = jQuery(document.getElementById(id));
   equal(rDiv.length, 1, "'" + id + "' div exists within the document");
   var rImg = rDiv.siblings("img:first");

   testNoAd('intro', {div: rDiv, img: rImg});
}

function testNoDoublet()
{
   // Doublet ad doesn't have an advertising class around the div that is hidden.
   // The hlfmpu div immediately precedes the doublet's containing div.
   var id = 'hlfmpu';
   var rDiv = jQuery(document.getElementById(id)).next("div");
   equal(rDiv.length, 1, "'doublet' containing div exists within the document");
   var rDoublet = rDiv.find("#doublet");
   equal(rDoublet.length, 1, "'doublet' div is contained in sibling of " + id);
   var rImg = rDoublet.find("img:first");

   testNoAd('doublet', {div: rDiv, img: rImg});
}

function testNoInterstitial()
{
   equal(jQuery('#interstitial_overlay').length, 0,                                               'interstitial ad should not be present in DOM');
   // the following check is in to check for interstitial corppop regression:
   equal(jQuery('#popad').length, 0,                                                              '#popad should not be present');
}

function testImageAd(pos, totalImagesExpected, prefix)
{
   initTest(pos);
   var rDiv = locateDiv(pos, prefix);

   checkImagesInAd(pos, rDiv, "block", totalImagesExpected || 1, Tests[pos].regex);
}

function testRichMediaAd(pos, rDiv, rScript, prefix)
{
   initTest(pos);
   if (!rDiv)
   {
      rDiv = locateDiv(pos, prefix);
      rScript = rDiv.find("script");
   }
   equal(rScript.length, 3,                                                              "script tag for " + pos + " should contain script tags totalling");
   matches(rScript.slice(2).attr("src"), Tests[pos].regex,                                "script src should match " + Tests[pos].description);
   equal(rScript.nextAll('script').length, 2,                                            "div#" + pos + " next script should contain script tags totalling");
}

function testFlashAd(pos, prefix)
{
   var cssSel = "div#" + pos + ".advertising";
   initTest(pos);
   var rDiv = locateDiv(pos, prefix);

   var length = 0;
   var id = 'none-found';
   var css = 'nope';

   // Different browsers embed Flash as an <embed> or <object> tag.
   // we need to find one which has an id
   var Flash = [];

   var tag = "embed";
   var rEmbed = rDiv.find(tag);
   for (var idx = 0; idx < rEmbed.length; ++idx)
   {
      if (rEmbed[idx].id)
      {
         Flash.push(rEmbed[idx].id);
      }
   }
   tag = "object";
   rEmbed = rDiv.find(tag);
   for (idx = 0; idx < rEmbed.length; ++idx)
   {
      if (rEmbed[idx].id)
      {
         Flash.push(rEmbed[idx].id);
      }
   }

   if (rDiv)
   {
      css = rDiv.css("display");
   }
   if (Flash)
   {
      length = Flash.length;
      if (length)
      {
         id = Flash[0];
      }
   }

   matches(tag, /^embed|object$/i,                                           "tag name should");
   equal(css,                                                            "block", cssSel + " should have display");
   ok(length !== 0,                                           "div#" + pos + " should contain some embed tags");
   matches(id, Tests[pos].regex,                                            "first embed id should match " + Tests[pos].description);
}

function testRefreshAd(pos,containsCode)
{
   initTest(pos);
   
   //default
   var adResponseName = "refresh adjustment 32767";
   
   //some refresh ads now contain injection code and have different properties
   if ((typeof(containsCode) !== "undefined") &&  (containsCode === "contains_trovus")){
	   adResponseName = "refresh plus trovus company by IP tracking";   
   }

   var rDiv;
   var AdContainers = FT.ads.getAdContainers(pos);
   differs(AdContainers.length, 0, pos + " div exists within the document");
   var scripts = 0;
   var scriptsExpected = AdContainers.length === 2 ? 3 : 2;
   var rImg;
   for (var idx = 0; idx < AdContainers.length; ++idx)
   {
      rDiv = jQuery(AdContainers[idx].div);
      equal(rDiv.css("display"),                                                            "none", AdContainers[idx].name + " should have display");
      var rScript = rDiv.find("script");
      scripts += rScript.length;
      var rHasImg = rDiv.find("img");
      if (rHasImg.length)
      {
         rImg = rHasImg;
      }
   }

   //equal(scripts, scriptsExpected,                                                       "div#" + pos + " should contain script tags totalling");
   ok(true);

   equal(FT.ads.adverts[pos].response.name,                                              "refresh", pos + "response object name property should be ");
   equal(FT.ads.adverts[pos].response.type,                                              "empty", pos + "response object type property should be ");
   equal(FT.ads.adverts[pos].response.adName,                                            adResponseName, pos + "response object adName property should be ");
   matches(rImg.attr('src'), Tests[pos].regex,                                            "document written img tag should match " + Tests[pos].description);
}

function testAYSC22(AYSC, regex) {
	
   var m = AYSC.match(/^(_22)([^_]+)/);
   var val = '';
   var flag = 'true';
	  
   if (m) {
      val = m[2];
   }
      
	if ((val.match(regex.cor)) || (val.match(regex.lv1)) || (val.match(regex.lv2))) {
	   //corppop should not be served
	   flag = 'false';
	}
 
	equal(flag, 'true',																			"corpop ad should only be served depending on AYSC field 22 settings");
}

//html ads are injected within div #popads and class ..corpSignPopad
//we should not expect popads elsewhere
function testPopAds(totalPopAds, totalPopAdsinCorpClass) {
	
	var flag = 'true';
	if (totalPopAds > totalPopAdsinCorpClass) {
		flag = 'false';
	}
	
	equal(flag, 'true',																			"no popads served within div of popads except with a class of .corpSignPopad");
}

function testObjectParam(oId,paramName,expectedValue)   {

    var objt = document.getElementById(oId);

    //var param =  objt[paramName];
    //var actualParamValue = param.value;

    //equal(actualParamValue,expectedValue,                                                          "parameter is correctly injected");

}


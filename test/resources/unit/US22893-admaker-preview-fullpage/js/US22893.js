/*jslint regexp: true, browser: true, debug: false, sloppy: true, evil: true, white: true, maxerr: 1000, indent: 3 */

/*global
  $, same, expect, BDD: true, matches, notMatches, jQuery, FT, initPage, sinon, fileLoad, window, escape,
  deepEqual
*/

/*properties
   VERSION, length, val, trigger, css, selectAd, genericFunctions,
   cookies, FT_U, activateDivs, deepEqual, html, indexOf, parse, IsJsonString,

   enableAdMaker, injectFullpageAdValuesIntoForm, givenTheUserHasTheAdMakerOpen,
   andHeHasSelectedTheFullPageImageAdItemWithinTheDropDownList, andHeHasFilledInAllTheMandatoryFields,
   andHeHasClickedOnConvertToJSONAd, whenHeClicksOnTheReviewLandscapeAdButton,
   thenIExpectToSeeTheLandscapeImageAdDisplayed, previewingTheFullPageAdInLandscapeMode,
   whenHeClicksOnTheReviewPortraitAdButton, thenIExpectToSeeThePortraitImageAdDisplayed,
   previewingTheFullPageAdInPortraitMode
*/
var tmpChildrenIdx = 0, tmpChildrenMap = {};
var BDD = {
   'VERSION': "$Id: $",
   'genericFunctions': {
     'enableAdMaker' : function () {
        FT.cookies.FT_U = 'eid=7038802';
         initPage.activateDivs(FT.cookies);
          // reset the form
          jQuery("#resetReviewButton").trigger('click');
          // FT Web App JSON Ad Builder Tool should be visible
          deepEqual(jQuery('#container').html().indexOf('FT Web App JSON Ad Builder Tool') !== -1, true,    'FT Web App JSON Ad Builder Tool should be present' );
     },
      'selectAd' : function (selectVal) {
         deepEqual(jQuery("#adTypeChoice").length > 0, true, 'select button does exist on page');
         jQuery("#adTypeChoice").val(selectVal);
         jQuery("#adTypeChoice").trigger('change');
         deepEqual(jQuery('#adMaker').css('display'), 'block', 'after selection, div #adMaker should be display:block');
      },
      'injectFullpageAdValuesIntoForm' : function () {
         jQuery("#adName").val("Test Fullpage Ad");
         jQuery("#clickUrl").val(jQuery("#clickUrl").val() + "http:\/\/www.ft.com");
         jQuery("#imageLandscapeUrl").val("http://ft-ad-enablement.appspot.com/img/fpads/fullpage-920x640-ferrari.jpg");
         jQuery("#imagePortraitUrl").val("http://ft-ad-enablement.appspot.com/img/fpads/fullpage-620x960-fashion.jpg");
         jQuery("#imageAltText").val(jQuery("#imageAltText").val() + "Test Fullpage Ad Help Text");
      },
      'IsJsonString' : function (str) {
          var result = true;
          try {
             JSON.parse(str);
          } catch (e) {
             result = false;
          }
          return result;
       }
   },
   // Scenario1
   'previewingTheFullPageAdInLandscapeMode': {
      'givenTheUserHasTheAdMakerOpen': function () {
         BDD.genericFunctions.enableAdMaker();
      },
      'andHeHasSelectedTheFullPageImageAdItemWithinTheDropDownList': function () {
         BDD.genericFunctions.selectAd('fullpageAd');
         deepEqual(jQuery('#convertAndResetButtonsDiv').css('display'), 'block',                           'After selection, div #convertAndResetButtonsDiv should be display:block');
         deepEqual(jQuery('#adNameDiv').css('display'), 'block',                                           'div #adNameDiv should be display:block');
         deepEqual(jQuery('#clickUrlDiv').css('display'), 'block',                                         'div #clickUrlDiv should be display:block');
         deepEqual(jQuery('#imageLandscapeUrlDiv').css('display'), 'block',                                'div #imageLandscapeUrlDiv should be display:block');
         deepEqual(jQuery('#imagePortraitUrlDiv').css('display'), 'block',                                 'div #imagePortraitUrl should be display:block');
         deepEqual(jQuery('#imageAltTextDiv').css('display'), 'block',                                     'div #imageAltText should be display:block');
      },
      'andHeHasFilledInAllTheMandatoryFields': function () {
         BDD.genericFunctions.injectFullpageAdValuesIntoForm();

         jQuery("#thirdPartyImpressionUrl").val(jQuery("#thirdPartyImpressionUrl").val() + "http://www.ft.com/c.gif?3rdparty-fullpage-omnioriented");

         deepEqual(jQuery('#formWarnings').css('display'), 'none',                                          'div #formWarnings should be visible');
      },
      'andHeHasClickedOnConvertToJSONAd': function () {
         jQuery("#convertButton").trigger('click');

         deepEqual(jQuery('#outputDiv').css('display'), 'block', 'div #outputDiv should be display=block');
         deepEqual(BDD.genericFunctions.IsJsonString(jQuery('#outputJSON').val()), true, 'contents of JSON object should be valid JSON string');

         // review button should be hidden
         deepEqual(jQuery('#reviewButton').css('display'), 'none',                                         'div #reviewButton should be display:none');

         // resetReviewButton, copyAdButton, testZButton should be visible
         deepEqual(jQuery('#resetReviewButton').css('display'), 'inline-block',                            'div #resetReviewButton should be display:inline-block');
         deepEqual(jQuery('#copyAdButton').css('display'), 'inline-block',                                 'div #copyAdButton should be display:inline-block');
         deepEqual(jQuery('#testZButton').css('display'), 'inline-block',                                  'div #testZButton should be display:inline-block');

         deepEqual(jQuery('#reviewLandscapeButton').css('display'), 'inline-block',                        'div #reviewLandscapeButton should be display:inline-block');
         deepEqual(jQuery('#reviewPortraitButton').css('display'), 'inline-block',                         'div #reviewPortraitButton should be display:inline-block');
      },
      'whenHeClicksOnTheReviewLandscapeAdButton': function () {
        expect(0)
        jQuery("#reviewLandscapeButton").trigger('click');
      },
      'thenIExpectToSeeTheLandscapeImageAdDisplayed': function () {
         deepEqual(jQuery('#adDiv').css('display'), 'block',                                               'div #adDiv should be display:block');
         deepEqual(jQuery('#adDiv div.dfp-landscape img.dfp-fullpage-landscape').css('display'), 'block',  'div.dfp-landscape img.dfp-fullpage-landscape should be display:block');
         deepEqual(jQuery('#adDiv div.dfp-landscape img.dfp-fullpage-portrait').css('display'), 'none',    'div.dfp-landscape img.dfp-fullpage-portrait should be display:none');
      }
   },
   'previewingTheFullPageAdInPortraitMode': {
      'givenTheUserHasTheAdMakerOpen': function () {
         BDD.previewingTheFullPageAdInLandscapeMode.givenTheUserHasTheAdMakerOpen();
      },
      'andHeHasSelectedTheFullPageImageAdItemWithinTheDropDownList': function () {
         BDD.previewingTheFullPageAdInLandscapeMode.andHeHasSelectedTheFullPageImageAdItemWithinTheDropDownList();
      },
      'andHeHasFilledInAllTheMandatoryFields': function () {
         BDD.previewingTheFullPageAdInLandscapeMode.andHeHasFilledInAllTheMandatoryFields();
      },
      'andHeHasClickedOnConvertToJSONAd': function () {
         BDD.previewingTheFullPageAdInLandscapeMode.andHeHasClickedOnConvertToJSONAd();
      },
      'whenHeClicksOnTheReviewPortraitAdButton': function () {
        expect(0)
        jQuery("#reviewPortraitButton").trigger('click');
      },
      'thenIExpectToSeeThePortraitImageAdDisplayed': function () {
         deepEqual(jQuery('#adDiv').css('display'), 'block',                                               'div #adDiv should be display:block');
         deepEqual(jQuery('#adDiv div.dfp-portrait img.dfp-fullpage-portrait').css('display'), 'block',    'div.dfp-portrait img.dfp-fullpage-portrait should be display:block');
         deepEqual(jQuery('#adDiv div.dfp-portrait img.dfp-fullpage-landscape').css('display'), 'none',    'div.dfp-portrait img.dfp-fullpage-landscape should be display:none');
      }
   }

};


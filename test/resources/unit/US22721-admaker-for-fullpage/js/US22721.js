/*jslint regexp: true, browser: true, debug: false, sloppy: true, evil: true, white: true, maxerr: 1000, indent: 3 */

/*global
  $, same, expect, BDD: true, matches, notMatches, jQuery, FT, initPage, sinon, fileLoad, window, escape,
  deepEqual
*/

/*properties
   VERSION, length, val, trigger, css, selectAd, genericFunctions,
   cookies, FT_U, activateDivs, deepEqual, html, indexOf,

   givenTheUserHasTheAdMakerOpen, whenTheUserOpensTheComboBox,
   thenIExpectToSeeANewValueWithinTheDropDownList, andTheValueIsFullPageImageAd,
   admakerFullpageStaticImageSupport, text, whenTheUserSelectsTheFullPageImageAdWithinTheDropDownList,
   thenIExpectToSeeSixTextFields, andTheFirstFieldIsCalledNameOfAdvert,
   andTheSecondFieldIsCalledClickThroughURL, andTheThirdFieldIsCalledLandscapeImageURL,
   andTheFourthFieldIsCalledPortraitImageURL, andTheFifthFieldIsCalledImageHelpText,
   andTheSixthFieldIsCalledThirdPartyImpressionURL, staticFullPageImageAdsFormFields,
   andHeHasSelectedTheFullPageImageAdItemWithinTheDropDownList, andHeHasNotEnteredAnyValuesForTheFormFields,
   whenHeClicksOnConvertToJSONAd, thenIExpectToSeeFiveWarningMessagesForTheFourMandatoryFields,
   andTheFieldsAreAdnameClickURLImagelandscapeURLImageURLAndImageAlttext,
   andThereIsNoJSONGenerated, mandatoryFieldsForFullPageImageAds, andHeHasFilledInAllTheMandatoryFields,
   thenIExpectToSeeTheOutputOfTheJSONConversion, andIExpectToSeeTwoNewButtonsCalledReviewLandscapeAdAndReviewPortraitAd,
   andTheJSONContainsIs_centeredTrue, andTheJSONContainsImageLandscapeURL, andTheJSONContainsOrientationKort,
   convertToJSONAd, enableAdMaker, parse, IsJsonString, injectFullpageAdValuesIntoForm, children, each, attr,
   thenIExpectToSeeFiveWarningMessagesForTheFiveMandatoryFields, andTheJSONContainsImpressionUrlIhdotgif
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
      'IsJsonString' : function (str) {
         var result = true;
         try {
            JSON.parse(str);
         } catch (e) {
            result = false;
         }
         return result;
      },
      'injectFullpageAdValuesIntoForm' : function () {
         jQuery("#adName").val("Test Fullpage Ad");
         jQuery("#clickUrl").val(jQuery("#clickUrl").val() + "http:\/\/www.ft.com");
         jQuery("#imageLandscapeUrl").val("http://ft-ad-enablement.appspot.com/img/fpads/fullpage-920x640-ferrari.jpg");
         jQuery("#imagePortraitUrl").val("http://ft-ad-enablement.appspot.com/img/fpads/fullpage-620x960-fashion.jpg");
         jQuery("#imageAltText").val(jQuery("#imageAltText").val() + "Test Fullpage Ad Help Text");
      }
   },
   // Scenario1
   'admakerFullpageStaticImageSupport': {
      'givenTheUserHasTheAdMakerOpen': function () {
         BDD.genericFunctions.enableAdMaker();
      },
      'whenTheUserOpensTheComboBox': function () {
         // select adTypeChoice should be visible
         deepEqual(jQuery('#adTypeChoice') !== null, true,                                                 'select adTypeChoice should be present' );
      },
      'thenIExpectToSeeANewValueWithinTheDropDownList': function () {
         // there should be 4 options in the dropdown list
         deepEqual(jQuery("#adTypeChoice option[value!='']").length, 4,                                    'Admaker should have 4 options in the dropdown list');
      },
      'andTheValueIsFullPageImageAd': function () {
         // there should be a 'Fullpage Ad' in the dropdown list
         deepEqual(jQuery("#adTypeChoice option[value='fullpageAd']").length, 1,                           'Admaker should have fullpageAd option value present');
         deepEqual(jQuery("#adTypeChoice option[value='fullpageAd']").text(), 'Full Page Ad',               'Admaker should have Fullpage Ad option text present');
      }
   },
   // Scenario2
   'staticFullPageImageAdsFormFields': {
      'givenTheUserHasTheAdMakerOpen': function () {
          BDD.genericFunctions.enableAdMaker();
       },
      'whenTheUserSelectsTheFullPageImageAdWithinTheDropDownList': function () {
         BDD.genericFunctions.selectAd('fullpageAd');
         deepEqual(jQuery('#convertAndResetButtonsDiv').css('display'), 'block',                           'After selection, div #convertAndResetButtonsDiv should be display:block');
      },
      'thenIExpectToSeeSixTextFields': function () {
         var visibleFieldsCount = 0;
         jQuery('#fields').children().each(function (index, element) {
         if (jQuery(element).css('display') === 'block' &&
            jQuery(element).attr('id').indexOf('Buttons') === -1) {
            tmpChildrenMap[tmpChildrenIdx] = jQuery(element).attr('id');
            tmpChildrenIdx += 1;
            visibleFieldsCount += 1;
          }
         });
         deepEqual(visibleFieldsCount, 6,                                                                 'There should be 5 visible text fields');
      },
      'andTheFirstFieldIsCalledNameOfAdvert': function () {
        deepEqual(tmpChildrenMap[0], 'adNameDiv',                                                        'First visible div should be adNameDiv');
      },
      'andTheSecondFieldIsCalledClickThroughURL': function () {
        deepEqual(tmpChildrenMap[1], 'clickUrlDiv',                                                      'Second visible div should be clickUrlDiv');
      },
      'andTheThirdFieldIsCalledLandscapeImageURL': function () {
        deepEqual(tmpChildrenMap[2], 'imageLandscapeUrlDiv',                                             'Third visible div should be imageLandscapeUrlDiv');
      },
      'andTheFourthFieldIsCalledPortraitImageURL': function () {
        deepEqual(tmpChildrenMap[3], 'imagePortraitUrlDiv',                                              'Fourth visible div should be imagePortraitUrlDiv');
      },
      'andTheFifthFieldIsCalledImageHelpText': function () {
        deepEqual(tmpChildrenMap[4], 'imageAltTextDiv',                                                  'Fifth visible div should be imageAltTextDiv');
      },
      'andTheSixthFieldIsCalledThirdPartyImpressionURL': function () {
         deepEqual(tmpChildrenMap[5], 'thirdPartyImpressionUrlDiv',                                       'Sixth visible div should be thirdPartyImpressionUrlDiv');
      }
   },
   // Scenario3
   'mandatoryFieldsForFullPageImageAds': {
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
      'andHeHasNotEnteredAnyValuesForTheFormFields': function () {
        deepEqual(jQuery('#adName').val(), '',                                              'input adName should be blank');
        deepEqual(jQuery('#clickUrl').val(), '%c%u',                                           'input clickUrl should be the default %c%u');
        deepEqual(jQuery('#imageLandscapeUrl').val(), 'http://',                                  'input imageLandscapeUrl should be the default http://');
        deepEqual(jQuery('#imagePortraitUrl').val(),  'http://',                                  'input imagePortraitUrl should be the default http://');
        deepEqual(jQuery('#imageAltText').val(),  '',                                              'input imageAltText should be blank');
      },
      'whenHeClicksOnConvertToJSONAd': function () {
        expect(1);
        jQuery('#convertButton').trigger('click');
        equal(jQuery('#convertButton').size(), 1, 'the user clicks the convert button');
      },
      'thenIExpectToSeeFiveWarningMessagesForTheFiveMandatoryFields': function () {
        jQuery('#convertButton').trigger('click');
        deepEqual(jQuery('#formWarnings').css('display'), 'block',                                        'div #formWarnings should be visible');
        deepEqual(jQuery('#formWarnings').children().length, 5,                                           'div #formWarnings should have 5 warnings');
      },
      'andTheFieldsAreAdnameClickURLImagelandscapeURLImageURLAndImageAlttext': function () {
        matches(jQuery('#adName').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\)|rgb\(255, 0, 0\))$/,            'the background color of the adName field should be set to red');
        matches(jQuery('#clickUrl').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\)|rgb\(255, 0, 0\))$/,          'the background color of the clickUrl field should be set to red');
         matches(jQuery('#imageLandscapeUrl').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\)|rgb\(255, 0, 0\))$/, 'the background color of the imageLandscapeUrl field should be set to red');
         matches(jQuery('#imagePortraitUrl').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\)|rgb\(255, 0, 0\))$/,  'the background color of the imagePortraitUrl field should be set to red');
         matches(jQuery('#imageAltText').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\)|rgb\(255, 0, 0\))$/,      'the background color of the imageAltText field should be set to red');
      },
      'andThereIsNoJSONGenerated': function () {
         deepEqual(BDD.genericFunctions.IsJsonString(jQuery('#outputJSON').val()), false, 'no JSON object should be created');
      }
   },
   // Scenario4
   'convertToJSONAd': {
      'givenTheUserHasTheAdMakerOpen': function () {
         BDD.genericFunctions.enableAdMaker();
      },
      'andHeHasSelectedTheFullPageImageAdItemWithinTheDropDownList': function () {
         BDD.genericFunctions.selectAd('fullpageAd');
         deepEqual(jQuery('#convertAndResetButtonsDiv').css('display'), 'block',                           'After selection, div #convertAndResetButtonsDiv should be display:block');
      },
      'andHeHasFilledInAllTheMandatoryFields': function () {
         deepEqual(jQuery('#adNameDiv').css('display'), 'block',                                           'div #adNameDiv should be display:block');
         deepEqual(jQuery('#clickUrlDiv').css('display'), 'block',                                         'div #clickUrlDiv should be display:block');
         deepEqual(jQuery('#imageLandscapeUrlDiv').css('display'), 'block',                                'div #imageLandscapeUrlDiv should be display:block');
         deepEqual(jQuery('#imagePortraitUrlDiv').css('display'), 'block',                                 'div #imagePortraitUrl should be display:block');
         deepEqual(jQuery('#imageAltTextDiv').css('display'), 'block',                                     'div #imageAltText should be display:block');

         BDD.genericFunctions.injectFullpageAdValuesIntoForm();

         jQuery("#thirdPartyImpressionUrl").val(jQuery("#thirdPartyImpressionUrl").val() + "http://www.ft.com/c.gif?3rdparty-fullpage-omnioriented");

         deepEqual(jQuery('#formWarnings').css('display'), 'none',                                          'div #formWarnings should be visible');
      },
      'whenHeClicksOnConvertToJSONAd': function () {
        expect(0);
        jQuery("#convertButton").trigger('click');
      },
      'thenIExpectToSeeTheOutputOfTheJSONConversion': function () {
         deepEqual(jQuery('#outputDiv').css('display'), 'block', 'div #outputDiv should be display=block');
         deepEqual(BDD.genericFunctions.IsJsonString(jQuery('#outputJSON').val()), true, 'contents of JSON object should be valid JSON string');
      },
      'andIExpectToSeeTwoNewButtonsCalledReviewLandscapeAdAndReviewPortraitAd': function () {
         // review button should be hidden
         deepEqual(jQuery('#reviewButton').css('display'), 'none',                                         'div #reviewButton should be display:none');

         // resetReviewButton, copyAdButton, testZButton should be visible
         deepEqual(jQuery('#resetReviewButton').css('display'), 'inline-block',                            'div #resetReviewButton should be display:inline-block');
         deepEqual(jQuery('#copyAdButton').css('display'), 'inline-block',                                 'div #copyAdButton should be display:inline-block');
         deepEqual(jQuery('#testZButton').css('display'), 'inline-block',                                  'div #testZButton should be display:inline-block');

         deepEqual(jQuery('#reviewLandscapeButton').css('display'), 'inline-block',                        'div #reviewLandscapeButton should be display:inline-block');
         deepEqual(jQuery('#reviewPortraitButton').css('display'), 'inline-block',                         'div #reviewPortraitButton should be display:inline-block');
      },
      'andTheJSONContainsIs_centeredTrue': function () {
         var isCenteredRegex = /"is_centered":true/;
         matches(jQuery('#outputJSON').val(), isCenteredRegex,                                             'centering should be present = "is_centered" : "true"');
      },
      'andTheJSONContainsImageLandscapeURL': function () {
         var imageLandscapeUrlRegex = /"imageLandscapeUrl":"http:\/\//;
         matches(jQuery('#outputJSON').val(), imageLandscapeUrlRegex,                                    'imageLandscapeUrl should be present');
      },
      'andTheJSONContainsOrientationKort': function () {
         var orientationRegex = /"orientation":"%kort=!;"/;
         matches(jQuery('#outputJSON').val(), orientationRegex,                                         'orientation should be present');
      },
      'andTheJSONContainsImpressionUrlIhdotgif': function () {
         var impressionUrlRegex = /"impressionUrl":"%i%h\/dot\.gif/;
         matches(jQuery('#outputJSON').val(), impressionUrlRegex,                                           'impressionUrl should be present');
      }
   }
};


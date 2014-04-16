/*jslint regexp: true, browser: true, debug: false, sloppy: true, evil: true, white: true, maxerr: 1000, indent: 3 */

/*global $, same, expect, BDD: true, matches, notMatches, jQuery, FT, initPage, sinon, fileLoad, window, escape
*/

/*properties
   FT_U, IsJsonString, JSONLoad, activateDivs, advertConversionErrors,
   advertConversionWarnings,
   andAfterTheFieldsAreCompletedTheWarningsWillDisappearAndTheAdConverted,
   andAnyWarningsAreDeemedToBeAcceptable, andNoOtherFormFieldsWillBeVisible,
   andTheAdvertWillRenderWithinTheTestPageAsAPreview,
   andTheUserClicksTheButtonConvertToJSONWithErrors,
   andTheUserClicksTheButtonConvertToJSONWithWarnings,
   andTheUserHasCreatedAJSONObject, andTheUserHasDisplayedTheAd,
   andTheUserHasSelectedHTML5AdvertAndPopulatedAllFields,
   andTheUserHasSelectedSimpleImageGifAndPopulatedAllFields,
   andTheUserIsLookingToCreateASimpleImageAdvert,
   andTheUserIsLookingToCreateAnHTML5Advert,
   andTheUserWillBeAbleToOpenAFileAndPreview,
   andUsedTheSelectAllOptionToHighlightAllText, attr, callCount, cookies,
   copyToClipboard, css, ensuringCopyFunctionIncludesAllJSONObjectCode, expects,
   fieldsNotEntered, genericFunctions, givenAUserHasCreatedJSONObjectCode,
   givenAUserOnTheAdvertBuilderPage, hTML5Advert, hTML5AdvertJSONConversion,
   hTML5FieldsNotPopulated, hasClass, html, indexOf, informativeHelpText,
   initialFormPopulation, injectImageAdValuesIntoForm, injectJSONAd,
   injectRichAdValuesIntoForm, injectRichAdValuesIntoFormForZIndex,
   injectRichAdValuesIntoFormWithDocWrites,
   injectRichAdValuesIntoFormWithIframe, length, mock, once, parse, restore,
   reviewExistingJSONObject, selectAd, selectAllJSONObjectCode,
   simpleImageAdvert, simpleImageJSONConversion, spy, spyGenericTearDown,
   spyMockSetUp, spySetUp, spyStubSetUp, stub, testZIndex,
   thenABrowseFunctionWillDisplay,
   thenErrorTextWillBeDisplayedWithNoPreviewOfTheAdvert,
   thenHelpTextWithRegardsToTheProcessAndHowToCopyAndPasteWillBeAvailable,
   thenOnlyTheFieldsRequiredForASimpleImageAdvertWillBeAvailableForDataEntry,
   thenOnlyTheFieldsRequiredForTheHTML5AdvertShouldDisplay,
   thenTheAdvertWillBeConcealedBeneathAScreeningLayerWithAZIndexOfOneMillionAndOne,
   thenTheCompleteJSONObjectCodeIsSelectedAndHighlighted,
   thenTheCompleteJSONObjectCodeWillBeCopied,
   thenTheJSONObjectCodeWillBeDisplayed, thenTheSelectionBoxWillBeEmpty,
   thenWarningTextWillBeDisplayedAlongsideThePreviewOfTheAdvert,
   thenWarningTextWillDisplayToEnsureAnyMandatoryFieldsAreCompleted,
   theseFieldsBeingAdNameAltTextAndAdvertCode,
   theseFieldsBeingImageURLClickURLAdNameAndAltText, tinkerTaylorSoldierSpies,
   trigger, val, verify, whenAUserFirstViewsThePage, whenAUserPressesCTRLC,
   whenAUserSelectsAnOptionToSelectAll,
   whenAUserSelectsToCreateASimpleImageAdvert,
   whenAUserSelectsToCreateAnHTML5Advert,
   whenAUserSelectsToViewAnExistingJSONObject,
   whenTheAdvertContainsDocumentwriteIframesOrOtherElementsThatWillCauseTheAdvertNotToFunction,
   whenTheAdvertContainsDocumentwriteWhichNeedsGhostwriter,
   whenTheAdvertContainsIframesOrOtherElementsThatWillCauseTheAdvertNotToFunction,
   whenTheUserClicksTheButtonConvertToJSON, whenTheUserForgetsToEnterAField,
   whenTheUserIsReadyToPasteTheObjectIntoDFP, whenTheUserOptsToTextTheZIndex, VERSION
*/

var BDD = {
   'VERSION': "$Id$",
   'genericFunctions': {
      'selectAd' : function (selectVal) {
         same(jQuery("#adTypeChoice").length > 0, true, 'select button does exist on page');
         jQuery("#adTypeChoice").val(selectVal);
         jQuery("#adTypeChoice").trigger('change');
         same(jQuery('#adMaker').css('display'), 'block', 'after selection, div #adMaker should be display:block');
      },
      'injectImageAdValuesIntoForm' : function () {
         jQuery("#adName").val("TestAd");
         jQuery("#clickUrl").val(jQuery("#clickUrl").val() + "http:\/\/www.ft.com");
         jQuery("#imageUrl").val("%h/2389285/banlb-master-2-728x90.GIF");
         jQuery("#imageAltText").val(jQuery("#imageAltText").val() + "Test Ad Image Help Text");
      },
      'injectRichAdValuesIntoForm' : function () {
         jQuery("#adName").val("Test Rich Ad");
         jQuery("#imageAltText").val(jQuery("#imageAltText").val() + "Test Rich Image Ad");
         jQuery("#customHtml").val('RICH MEDIA AD CONTENT GOES <a href="http://www.ft.com">HERE</a>');
      },
      'injectRichAdValuesIntoFormWithDocWrites' : function () {
         jQuery("#adName").val("Test Rich Ad With Doc writes in Ad");
         jQuery("#imageAltText").val(jQuery("#imageAltText").val() + "Test Rich Image with Doc Writes Help Text");
         jQuery("#customHtml").val('this will give a warning but still allow conversion of ad to json<script>document.write("hello");</script>');
      },
      'injectRichAdValuesIntoFormWithIframe' : function () {
         jQuery("#adName").val("Test Rich Ad With Iframe in Ad");
         jQuery("#imageAltText").val(jQuery("#imageAltText").val() + "Test Rich Image with Iframe Help Text");
         jQuery("#customHtml").val('this will give a warning and prevent conversion of ad to json<iframe></iframe>//comment');
      },
      'injectRichAdValuesIntoFormForZIndex' : function () {
          jQuery("#adName").val("Test Rich Ad: z-index");
          jQuery("#imageAltText").val(jQuery("#imageAltText").val() + "Test Rich Ad Image: z-index");
          jQuery("#customHtml").val('<div style="z-index: 900000">TEST BELOW</div><div style="position:absolute; z-index: 1001002; color:red; background-color: blue">TEST ELEVATED</div>');
       },
      'injectJSONAd' : function () {
         jQuery('#outputJSON').val('{"pos":"%kpos=!;","size":"%ksz=!;","adId":"%eaid!","advertiserId":"%eadv!","creativeId":"%ecid!","clickUrl":"%chttp:\/\/www.cityam.com/news-and-analysis/allister-heath/eurozone-learnt-nothing-2008","imageUrl":"%h/2389285/banlb-master-2-728x90.GIF","imageAltText":"Master Companion banlb 728x90 Master Test","impressionUrl":"%ihttp:\/\/www.ft.com/c.gif?integration-test-impression","thirdPartyImpressionUrl":"http:\/\/www.ft.com/c.gif?integration-test-impression-3pty"}');
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
   'tinkerTaylorSoldierSpies' : {
      'spySetUp' : function (obj, method) {
         sinon.spy(obj, method);
      },
      'spyStubSetUp' : function (obj, method, func) {
         sinon.stub(obj, method, func);
      },
      'spyMockSetUp' : function (obj) {
         var mock = sinon.mock(obj);
         return mock;
      },
      'spyGenericTearDown' : function (obj, method) {
         if (typeof method === "undefined") {
            obj.restore();
         } else {
            obj[method].restore();
         }
      }
   },
   // Scenario0
   'initialFormPopulation': {
      'givenAUserOnTheAdvertBuilderPage': function () {
         expect(0);
         // check for existence of FT_U cookie and eid?
          FT.cookies.FT_U = 'eid=6197937';
          initPage.activateDivs(FT.cookies);
          // reset the form
          jQuery("#resetReviewButton").trigger('click');
          same(jQuery('#container').html().indexOf('FT Web App JSON Ad Builder Tool') !== -1, true, 'FT Web App JSON Ad Builder Tool should be present' );
          same(jQuery('#adTypeChoice') !== null, true, 'select adTypeChoice should be present' );

      },
      'whenAUserFirstViewsThePage': function () {
         expect(1);
         // check that the master div for the page is open and that the div containing
          same(jQuery('#main').css('display'), 'block', 'div #main should be display:block');
      },
      'thenTheSelectionBoxWillBeEmpty': function () {
         same(jQuery('#adTypeChoice').val(), '', 'dropdown adTypeChoice should have no selected value');
      },
      'andNoOtherFormFieldsWillBeVisible': function () {
         // the sorry you dont have permissions message is closed
          same(jQuery('#no_permission').css('display'), 'none', 'div #no_permission should be display:none');
          // the div no_jquery should be hidden
          same(jQuery('#no_jquery').hasClass('hidden'), true, 'div #no_jquery should be hidden');
          // the div adMaker should be hidden
          same(jQuery('#adMaker').css('display'), 'none', 'div #adMaker should be hidden');
          // the div adCheckerDiv should be hidden
          same(jQuery('#adCheckerDiv').hasClass('hidden'), true, 'div #adCheckerDiv should be hidden');
          // the div adDiv should be hidden
          same(jQuery('#adDiv').css('display'), 'none', 'div #adDiv should be hidden');
          // zblat should be hidden
          same(jQuery('#zblat').css('visibility'), 'hidden', 'div #zblat should not be visible');
          // formWarnings should be hidden
          same(jQuery('#formWarnings').css('visibility'), 'hidden', 'div #formWarnings should not be visible');
           // helpTextDiv should be hidden
          same(jQuery('#helpTextDiv').css('display'), 'none', 'div #helpTextDiv should be hidden');

      }
   },
   'simpleImageAdvert': {
      'givenAUserOnTheAdvertBuilderPage': function (noexpect) {
         if (typeof noexpect === "undefined") {
            expect(2);
         }

         // check for existence of FT_U cookie and eid?
         FT.cookies.FT_U = 'eid=6197937';
         initPage.activateDivs(FT.cookies);
         // reset the form
         jQuery("#resetButton").trigger('click');
         // check that the master div for the page is open and that the div containing
         same(jQuery('#main').css('display'), 'block', 'div #main should be display:block');
         // the sorry you dont have permissions message is closed
         same(jQuery('#no_permission').css('display'), 'none', 'div #no_permission should be display:none');
      },
      'whenAUserSelectsToCreateASimpleImageAdvert': function () {
         expect(2);
         // check that adTypeChoice select button exists
         BDD.genericFunctions.selectAd('imageAd');
      },
      'thenOnlyTheFieldsRequiredForASimpleImageAdvertWillBeAvailableForDataEntry': function () {
         expect(5);
         // check that all other fields are collapsed         
         same(jQuery('#customHtmlDiv').css('display'), 'none', 'div #customHtmlDiv should be display=none');
         same(jQuery('#outputDiv').css('display'), 'none', 'div #outputDiv should be display=none');
         same(jQuery('#loadFileDiv').css('display'), 'none', 'div #loadFileDiv should be display=none');
         same(jQuery('#reviewAndResetReviewButtonsDiv').css('display'), 'none', 'div #reviewAndResetReviewButtonsDiv should be display=none');
         same(jQuery('#zblat').css('display'), 'none', 'div #zblat should be display=none');
      },
      'theseFieldsBeingImageURLClickURLAdNameAndAltText': function () {
         expect(7);
         // check that the fields for adding an image exist and are editable
         same(jQuery('#impressionUrlDiv').css('display'), 'none', 'div #impressionUrlDiv should be display=none');
         same(jQuery('#thirdPartyImpressionUrlDiv').css('display'), 'block', 'div #thirdPartyImpressionUrlDiv should be display=block');
         same(jQuery('#adNameDiv').css('display'), 'block', 'div #adNameDiv should be display=block');
         same(jQuery('#imageUrlDiv').css('display'), 'block', 'div #imageUrlDiv should be display=block');
         same(jQuery('#clickUrlDiv').css('display'), 'block', 'div #clickUrlDiv should be display=block');
         same(jQuery('#imageAltTextDiv').css('display'), 'block', 'div #imageAltTextDiv should be display=block');
         same(jQuery('#convertAndResetButtonsDiv').css('display'), 'block', 'div #convertResetButtons should be display=block');
      }
   },
   'hTML5Advert': {
      'givenAUserOnTheAdvertBuilderPage': function () {
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage();
      },
      'whenAUserSelectsToCreateAnHTML5Advert': function () {
         expect(2);
         BDD.genericFunctions.selectAd('richAd');
      },
      'thenOnlyTheFieldsRequiredForTheHTML5AdvertShouldDisplay': function () {
         expect(7);
         same(jQuery('#impressionUrlDiv').css('display'), 'none', 'div #impressionUrlDiv should be display=none');
         same(jQuery('#thirdPartyImpressionUrlDiv').css('display'), 'none', 'div #thirdPartyImpressionUrlDiv should be display=none');
         same(jQuery('#imageUrlDiv').css('display'), 'none', 'div #imageUrlDiv should be display=none');
         same(jQuery('#clickUrlDiv').css('display'), 'none', 'div #clickUrlDiv should be display=none');
         same(jQuery('#outputDiv').css('display'), 'none', 'div #customHtmlDiv should be display=none');
         same(jQuery('#loadFileDiv').css('display'), 'none', 'div #loadFileDiv should be display=none');
         same(jQuery('#reviewAndResetReviewButtonsDiv').css('display'), 'none', 'div #reviewAndResetReviewButtonsDiv should be display=none');
      },
      'theseFieldsBeingAdNameAltTextAndAdvertCode': function () {
         expect(4);
         same(jQuery('#adNameDiv').css('display'), 'block', 'div #adNameDiv should be display=block');
         same(jQuery('#imageAltTextDiv').css('display'), 'block', 'div #imageAltTextDiv should be display=block');
         same(jQuery('#customHtmlDiv').css('display'), 'block', 'div #customHtmlDiv should be display=block');
         same(jQuery('#convertAndResetButtonsDiv').css('display'), 'block', 'div #convertAndResetButtons should be display=block');
      }
   },

   'reviewExistingJSONObject': {
      'givenAUserOnTheAdvertBuilderPage': function () {
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage();
      },
      'whenAUserSelectsToViewAnExistingJSONObject': function () {
         expect(2);
         BDD.genericFunctions.selectAd('browseJSONAd');
      },
      'thenABrowseFunctionWillDisplay': function () {
         expect(9);
         // other divs should be shut
         same(jQuery('#impressionUrlDiv').css('display'), 'none', 'div #impressionUrlDiv should be display=none');
         same(jQuery('#thirdPartyImpressionUrlDiv').css('display'), 'none', 'div #thirdPartyImpressionUrlDiv should be display=none');
         same(jQuery('#imageUrlDiv').css('display'), 'none', 'div #imageUrlDiv should be display=none');
         same(jQuery('#clickUrlDiv').css('display'), 'none', 'div #clickUrlDiv should be display=none');
         same(jQuery('#adNameDiv').css('display'), 'none', 'div #adNameDiv should be display=none');
         same(jQuery('#imageAltTextDiv').css('display'), 'none', 'div #imageAltTextDiv should be display=none');
         same(jQuery('#customHtmlDiv').css('display'), 'none', 'div #customHtmlDiv should be display=none');
         // output div should be open
         same(jQuery('#loadFileDiv').css('display'), 'block', 'div #loadFileDiv should be display=block');
         same(jQuery('#outputDiv').css('display'), 'block', 'div #outputDiv should be display=block');
      },
      'andTheUserWillBeAbleToOpenAFileAndPreview' : function () {
         expect(2);
         // we have to mock the object browsed as jQuery wont allow us to
         // sniff for fils on someones desktop
         // BDD.genericFunctions.mockJSONAd();
         BDD.tinkerTaylorSoldierSpies.spyStubSetUp(fileLoad, "JSONLoad", BDD.genericFunctions.injectJSONAd());
         jQuery('#loadFileButton').trigger('change');
         same(fileLoad.JSONLoad.callCount, 1, 'should be one call to FileLoad.JSONLoad');
         same(jQuery('#output').hasClass('hidden'), false, 'output div should not have class .hidden');
      }
   },
   // Scenario4
   'simpleImageJSONConversion': {
      'givenAUserOnTheAdvertBuilderPage': function () {
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage();
      },
      'andTheUserHasSelectedSimpleImageGifAndPopulatedAllFields' : function () {
         expect(3);
         // check that adTypeChoice select button exists
         BDD.genericFunctions.selectAd('imageAd');
         same(jQuery("#adTypeChoice").val(), 'imageAd', 'selected ad type should be imageAd');
      },
      'whenTheUserClicksTheButtonConvertToJSON': function () {
         expect(4);
         // inject test values
         BDD.genericFunctions.injectImageAdValuesIntoForm();
         jQuery("#convertButton").trigger('click');

         same(jQuery('#adNameDiv').css('display'), 'block', 'div #adName should be display=block');
         same(jQuery('#clickUrlDiv').css('display'), 'block', 'div #clickUrl should be display=block');
         same(jQuery('#imageUrlDiv').css('display'), 'block', 'div #imageUrl should be display=block');
         same(jQuery('#imageAltTextDiv').css('display'), 'block', 'div #imageAltText should be display=block');
      },
      'thenTheJSONObjectCodeWillBeDisplayed': function () {
         expect(2);
         same(jQuery('#outputDiv').css('display'), 'block', 'div #outputDiv should be display=block');
         // check if what is injected is valid JSON
         same(BDD.genericFunctions.IsJsonString(jQuery('#outputJSON').val()), true, 'contents of JSON object should be valid JSON string');
      },
      'andTheAdvertWillRenderWithinTheTestPageAsAPreview' : function () {
         expect(1);
         // check for contents injected into div
         jQuery("#reviewButton").trigger('click');
         var imageUrl = '<a href="http:\/\/www.ft.com" target="_blank"><img src="http:\/\/s0.2mdn.net\/2389285\/banlb-master-2-728x90.GIF" title="Test Ad Image Help Text" alt="Test Ad Image Help Text"></a>';
         same(jQuery('#adDiv').html(), imageUrl, 'Contents of div should be image ad');
      }
   },
   // Scenario5
   'advertConversionWarnings': {
      'givenAUserOnTheAdvertBuilderPage': function () {
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage('noexpect');
         // the div no_jquery should be hidden
        same(jQuery('#no_jquery').hasClass('hidden'), true, 'div #no_jquery should be hidden');
      },
      'andTheUserClicksTheButtonConvertToJSONWithWarnings' : function () {
         expect(5);
         BDD.genericFunctions.selectAd('richAd');
         BDD.genericFunctions.injectRichAdValuesIntoFormWithDocWrites();
         // we trigger a change on the text area here as injecting values via jQuery wont do so
         // in the same way a user doing so would
         jQuery("#customHtml").trigger('change');
         jQuery("#convertButton").trigger('click');
         jQuery("#reviewButton").trigger('click');


         same(jQuery('#adNameDiv').css('display'), 'block', 'div #adNameDiv should be display=block');
         same(jQuery('#imageAltTextDiv').css('display'), 'block', 'div #imageAltTextDiv should be display=block');
         same(jQuery('#customHtmlDiv').css('display'), 'block', 'div #customHtmlDiv should be display=block');
      },
      'whenTheAdvertContainsDocumentwriteWhichNeedsGhostwriter': function () {
         expect(3);
         // check that the ad we have called does indeed have document.writes within it.
         var docwriteRegex = /document\.write/, iFrameRegex = /iframe/, commentsRegex = /([\s]*)\/\// ;

         matches(jQuery('#customHtml').val(), docwriteRegex, 'The rich ad does contain some document.write code');
         notMatches(jQuery('#customHtml').val(), iFrameRegex, 'The rich ad does not contain forbidden iFrame code');
         notMatches(jQuery('#customHtml').val(), commentsRegex, 'The rich ad does not contain forbidden comment code');         
         
      },
      'thenWarningTextWillBeDisplayedAlongsideThePreviewOfTheAdvert': function () {
         expect(7);
         same(jQuery('#formWarnings').css('display'), 'block', 'div #formWarnings should be visible');

         var docwriteRegex = "Warning! forbidden document\\.write found in advert",
            iFrameRegex = "Warning! forbidden &lt;iframe&gt;",
            commentsRegex = "Warning! comment line //";

         matches(jQuery('#formWarnings').html(), docwriteRegex, 'A warning concerning a document.write is displayed');
         notMatches(jQuery('#formWarnings').html(), iFrameRegex, 'A warning concerning an iFrame tag is not displayed');
         notMatches(jQuery('#formWarnings').html(), commentsRegex, 'A warning concerning a comment tag is not displayed');
         matches(jQuery('#customHtml').css('background-color'), /^rgb\(255, 0, 0\)$/, 'the background color of the customHtml textarea shoud be red');
         matches(jQuery('#customHtml').css('color'), /^rgb\(255, 255, 255\)$/, 'the font color of the customHtml textarea shoud be white');

         // should be able to continue with convrsion so convert/reset buttons should be visible
         same(jQuery('#convertAndResetButtonsDiv').css('display'), 'block', 'div #convertAndResetButtonsDiv should be visible');
      }
   },
   // Scenario5b
   'advertConversionErrors': {
      'givenAUserOnTheAdvertBuilderPage': function () {
         BDD.advertConversionWarnings.givenAUserOnTheAdvertBuilderPage();
      },
      'andTheUserClicksTheButtonConvertToJSONWithErrors': function () {
         expect(5);
         BDD.genericFunctions.selectAd('richAd');
         BDD.genericFunctions.injectRichAdValuesIntoFormWithIframe();
         // we trigger a change on the text area here as injecting values via jQuery wont do so
         // in the same way a user doing so would
         jQuery("#customHtml").trigger('change');

         same(jQuery('#adNameDiv').css('display'), 'block', 'div #adNameDiv should be display=block');
         same(jQuery('#imageAltTextDiv').css('display'), 'block', 'div #imageAltTextDiv should be display=block');
         same(jQuery('#customHtmlDiv').css('display'), 'block', 'div #customHtmlDiv should be display=block');
      },
      'whenTheAdvertContainsIframesOrOtherElementsThatWillCauseTheAdvertNotToFunction': function () {
         expect(3);
         // check that the ad we have called does indeed have ifreames and comments within it.
         var docwriteRegex = /document\.write/, iFrameRegex = /iframe/, commentsRegex = /([\s]*)\/\// ;
         notMatches(jQuery('#customHtml').val(), docwriteRegex, 'The rich ad does NOT contain some document.write code');
         matches(jQuery('#customHtml').val(), iFrameRegex, 'The rich ad does contain forbidden iFrame code');
         matches(jQuery('#customHtml').val(), commentsRegex, 'The rich ad does contain forbidden comment code');
      },
      'thenErrorTextWillBeDisplayedWithNoPreviewOfTheAdvert': function () {
         expect(7);
         same(jQuery('#formWarnings').css('display'), 'block', 'div #formWarnings should be visaible');

         var docwriteRegex = "Advert contains document\\.write and will use ghostwriter when rendered. \\(This is not an error.\\)", iFrameRegex = "Warning! forbidden &lt;iframe&gt;", commentsRegex = "Warning! comment line //";

         notMatches(jQuery('#formWarnings').html(), docwriteRegex, 'A warning concerning a document.write is displayed');
         matches(jQuery('#formWarnings').html(), iFrameRegex, 'A warning concerning an iFrame tag is displayed');
         matches(jQuery('#formWarnings').html(), commentsRegex, 'A warning concerning a comment tag is displayed');
         matches(jQuery('#customHtml').css('background-color'), /^(red|rgb\(255, 0, 0\))$/, 'the background color of the customHtml textarea shoud be red');
         matches(jQuery('#customHtml').css('color'), /^(white|rgb\(255, 255, 255\))$/, 'the font color of the customHtml textarea shoud be white');

         // shouldnt be able to continue with convrsion so convert/reset buttons should be hidden
         same(jQuery('#convertAndResetButtonsDiv').css('display'), 'none', 'div #convertAndResetButtonsDiv should be hidden');

         return;
         /*
         setTimeout(function () {
            var mysame = function (val,exp,msg) { alert(msg + "\n\nval: " + val + "\nexp: " + exp); };
            var mynotsame = function (val,exp,msg) { alert(msg + "\n\nval: " + val + "\nnot exp: " + exp); };
            mynotsame(jQuery('#formWarnings').html(), docwriteRegex, 'A warning concerning a document.write is displayed');
            mysame(jQuery('#formWarnings').html(), iFrameRegex, 'A warning concerning an iFrame tag is displayed');
            mysame(jQuery('#formWarnings').html(), commentsRegex, 'A warning concerning a comment tag is displayed');
            mysame(jQuery('#customHtml').css('background-color'), /^(red|rgb\(255, 0, 0\))$/, 'the background color of the customHtml textarea shoud be red');
            mysame(jQuery('#customHtml').css('color'), /^(white|rgb\(255, 255, 255\))$/, 'the font color of the customHtml textarea shoud be white');
            mysame(jQuery('#convertAndResetButtonsDiv').css('display'), 'none', 'div #convertAndResetButtonsDiv should be hidden');
         }, 5000);
         */
      }
   },
   // Scenario6
   'fieldsNotEntered': {
      'givenAUserOnTheAdvertBuilderPage': function () {
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage('noexpect');
         // the div no_jquery should be hidden
        same(jQuery('#no_jquery').hasClass('hidden'), true, 'div #no_jquery should be hidden');
      },
      'andTheUserIsLookingToCreateASimpleImageAdvert' : function () {
         expect(2);
         BDD.genericFunctions.selectAd('imageAd');
      },
      'whenTheUserForgetsToEnterAField': function () {
         expect(3);
         same(jQuery('#adName').val(), '', 'input #adName should be empty');
         matches(jQuery('#imageUrl').val(), 'http:\/\/', 'input #imageUrl should be http://');
         matches(jQuery('#clickUrl').val(), '%c%u', 'input #clickUrl should be empty');
      },
      'thenWarningTextWillDisplayToEnsureAnyMandatoryFieldsAreCompleted': function () {
         expect(7);
         jQuery("#convertButton").trigger('click');

         matches(jQuery('#adName').css('background-color'), /^(red|rgb\(255, 0, 0\))$/, 'the background color of the adName field should be set to red');
         matches(jQuery('#imageUrl').css('background-color'), /^(red|rgb\(255, 0, 0\))$/, 'the background color of the imageUrl field should be set to red');
         matches(jQuery('#clickUrl').css('background-color'), /^(red|rgb\(255, 0, 0\))$/, 'the background color of the clickUrl field should be set to red');
         matches(jQuery('#imageAltText').css('background-color'), /^(red|rgb\(255, 0, 0\))$/, 'the background color of the imageAltText field should be set to red');
         // shouldnt be able to continue with convrsion so convert/reset buttons should be hidden
         same(jQuery('#convertAndResetButtonsDiv').css('display'), 'block', 'div #convertResetButtonsdiv should be display=block');

         var warningRegex = "You must give a value for mandatory fields";
         // form warnings should be present
         matches(jQuery('#formWarnings').html(), warningRegex, 'Warnings concerning missing field(s) is displayed');
         // check no JSON object in outputJSON text area
         same(BDD.genericFunctions.IsJsonString(jQuery('#outputJSON').val()), false, 'no JSON object should be created');
      },
      'andAfterTheFieldsAreCompletedTheWarningsWillDisappearAndTheAdConverted' : function () {
         expect(8);
         // now inject a valid image ad
         BDD.genericFunctions.injectImageAdValuesIntoForm();
         // conversion buttons should now be present, so click to display JSON
         jQuery("#convertButton").trigger('click');

         matches(jQuery('#adName').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\))$/, 'the background color of the adName field should be set to red');
         matches(jQuery('#imageUrl').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\))$/, 'the background color of the imageUrl field should be set to red');
         matches(jQuery('#clickUrl').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\))$/, 'the background color of the clickUrl field should be set to red');
         matches(jQuery('#imageAltText').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\))$/, 'the background color of the imageAltText field should be set to red');
         // should  be able to continue with conversion so convert/reset buttons should be displayed
         same(jQuery('#convertAndResetButtonsDiv').css('display'), 'block', 'div #convertResetButtonsdiv should be display=block');

         var warningRegex = "You must give a value for mandatory fields";
         matches(jQuery('#formWarnings').attr('class'), /warnings handle hidden|warnings hidden handle/, 'div #formWarnings should have class=warnings hidden handle');
         notMatches(jQuery('#formWarnings').html(), warningRegex, 'No warning should now be present');

         // check a JSON object is now in the outputJSON text area
         same(BDD.genericFunctions.IsJsonString(jQuery('#outputJSON').val()), true, 'a JSON object should be created in the outputJSON textarea');
      }
   },
   // Scenario7
   'hTML5AdvertJSONConversion': {
      'givenAUserOnTheAdvertBuilderPage': function () {
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage('noexpect');
         // the div no_jquery should be hidden
        same(jQuery('#no_jquery').hasClass('hidden'), true, 'div #no_jquery should be hidden');
      },
      'andTheUserHasSelectedHTML5AdvertAndPopulatedAllFields' : function () {
         expect(6);
         BDD.genericFunctions.selectAd('richAd');
         BDD.genericFunctions.injectRichAdValuesIntoForm();

         same(jQuery('#adTypeChoice').val(), 'richAd', 'select adTypeChoice: Rich Media Ad should be selected');
         same(jQuery('#adName').val() !== null, true, 'input #adName should be populated');
         same(jQuery('#imageAltText').val() !== null, true, 'input #imageAltText should be populated');
         same(jQuery('#customHtml').val() !== null, true, 'textarea #customHtml should be populated');
      },
      'whenTheUserClicksTheButtonConvertToJSON' : function () {
         // expect(0);
         jQuery("#convertButton").trigger('click');
      },
      'thenTheJSONObjectCodeWillBeDisplayed': function () {
         expect(1);
         same(BDD.genericFunctions.IsJsonString(jQuery('#outputJSON').val()), true, 'a JSON object should be created in the outputJSON textarea');
      },
      'andTheAdvertWillRenderWithinTheTestPageAsAPreview' : function () {
         expect(4);

         jQuery("#reviewButton").trigger('click');

         var warningRegex = "Warning", content = jQuery("#adDiv").html();
         matches(escape(content) , escape('RICH MEDIA AD CONTENT GOES'), "#adDiv should contain HTML");
         matches(escape(content) , escape('<a href="http://www.ft.com">HERE</a>'), "#adDiv should contain a URL");

         matches(jQuery('#formWarnings').attr('class'), /warnings handle hidden|warnings hidden handle/, 'div #formWarnings should have class=warnings hidden handle');
         notMatches(jQuery('#formWarnings').html(), warningRegex, 'No warning should now be present');
      }
   },
   // Scenario8
   'hTML5FieldsNotPopulated': {
      'givenAUserOnTheAdvertBuilderPage': function () {
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage('noexpect');
         // the div no_jquery should be hidden
        same(jQuery('#no_jquery').hasClass('hidden'), true, 'div #no_jquery should be hidden');
      },
      'andTheUserIsLookingToCreateAnHTML5Advert' : function () {
         expect(3);
         BDD.genericFunctions.selectAd('richAd');
         same(jQuery('#adTypeChoice').val(), 'richAd', 'select adTypeChoice: Rich Media Ad should be selected');
      },
      'whenTheUserForgetsToEnterAField': function () {
         expect(3);
         same(jQuery('#adName').val().length, 0, 'input #adName should be empty');
         same(jQuery('#imageAltText').val().length, 0, 'input #imageAltText should be empty');
         same(jQuery('#customHtml').val().length, 0, 'input #imageAltText should be empty');

         jQuery("#convertButton").trigger('click');

      },
      'thenWarningTextWillDisplayToEnsureAnyMandatoryFieldsAreCompleted': function () {
         expect(6);
         jQuery("#convertButton").trigger('click');

         matches(jQuery('#adName').css('background-color'), /^(red|rgb\(255, 0, 0\))$/, 'the background color of the adName field should be set to red');
         matches(jQuery('#imageAltText').css('background-color'), /^(red|rgb\(255, 0, 0\))$/, 'the background color of the imageAltText field should be set to red');
         matches(jQuery('#customHtml').css('background-color'), /^(red|rgb\(255, 0, 0\))$/, 'the background color of the customHtml field should be set to red');
         // shouldnt be able to continue with convrsion so convert/reset buttons should be hidden
         same(jQuery('#convertAndResetButtonsDiv').css('display'), 'block', 'div #convertResetButtonsdiv should be display=block');

         var warningRegex = "You must give a value for mandatory fields";
         matches(jQuery('#formWarnings').html(), warningRegex, 'A warning concerning missing field(s) is displayed');
         // check no JSON object in outputJSON text area
         same(BDD.genericFunctions.IsJsonString(jQuery('#outputJSON').val()), false, 'no JSON object should be created');
      },
      'andAfterTheFieldsAreCompletedTheWarningsWillDisappearAndTheAdConverted' : function () {
         expect(6);
         // now inject a valid rich ad
         BDD.genericFunctions.injectRichAdValuesIntoForm();
         // conversion buttons should now be present, so click to display JSON
         jQuery("#convertButton").trigger('click');

         matches(jQuery('#adName').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\))$/, 'the background color of the adName field should be reset');
         matches(jQuery('#imageAltText').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\))$/, 'the background color of the imageAltText field should be set to reset');
         matches(jQuery('#customHtml').css('background-color'), /^(#d7e5f2|rgb\(215, 229, 242\))$/, 'the background color of the customHtml field should be set to reset');

         // should  be able to continue with conversion so convert/reset buttons should be displayed
         same(jQuery('#convertAndResetButtonsDiv').css('display'), 'block', 'div #convertResetButtonsdiv should be display=block');

         var warningRegex = "";
         matches(jQuery('#adDiv').html(), warningRegex, 'No warning should now be present');

         // check a JSON object is now in the outputJSON text area
         same(BDD.genericFunctions.IsJsonString(jQuery('#outputJSON').val()), true, 'a JSON object should be created in the outputJSON textarea');
      }
   },
   // Scenario9
   'selectAllJSONObjectCode': {
      'givenAUserHasCreatedJSONObjectCode' : function () {
         expect(4);

         // we must override the expected numbers of tests in the delegate';
         var noexpect = 1;
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage(noexpect);

         BDD.genericFunctions.selectAd('richAd');
         BDD.genericFunctions.injectRichAdValuesIntoForm();
         jQuery("#convertButton").trigger('click');
      },
      'andAnyWarningsAreDeemedToBeAcceptable' : function () {
         expect(4);

         same(jQuery('#adName').val().length > 0, true, 'input #adName should not be empty');
         same(jQuery('#imageAltText').val().length > 0, true, 'input #imageAltText should not be empty');
         same(jQuery('#customHtml').val().length >0, true, 'input #imageAltText should not be empty');

         matches(jQuery('#formWarnings').attr('class'), /warnings handle hidden|warnings hidden handle/, 'div #formWarnings should have class=warnings hidden handle');
      },
      'whenAUserSelectsAnOptionToSelectAll': function () {
         expect(2);
         BDD.tinkerTaylorSoldierSpies.spySetUp(window, "copyToClipboard");
         var mock = BDD.tinkerTaylorSoldierSpies.spyMockSetUp(window);
         mock.expects('prompt').once();

         // select to copy the json object
         jQuery("#copyAdButton").trigger('click');
         same(window.copyToClipboard.callCount, 1, 'copyToClipboard function called once');
         same(mock.verify(), true, 'Window.prompt should be called once (sinon stub)');

         // tear down spies
         BDD.tinkerTaylorSoldierSpies.spyGenericTearDown(window, "copyToClipboard");
         BDD.tinkerTaylorSoldierSpies.spyGenericTearDown(mock);
      },
      'thenTheCompleteJSONObjectCodeIsSelectedAndHighlighted': function () {
         // TODO: how to test this?
         expect(0);
      }
   },
   // Scenario10
   'ensuringCopyFunctionIncludesAllJSONObjectCode': {
      'givenAUserHasCreatedJSONObjectCode': function () {
         expect(7);
         // we must override the expected numbers of tests in the delegate';
         var noexpect = 1;
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage(noexpect);
         BDD.genericFunctions.selectAd('richAd');
         BDD.genericFunctions.injectRichAdValuesIntoForm();

         same(jQuery('#adName').val().length > 0, true, 'input #adName should not be empty');
         same(jQuery('#imageAltText').val().length > 0, true, 'input #imageAltText should not be empty');
         same(jQuery('#customHtml').val().length >0, true, 'input #imageAltText should not be empty');

         // conversion buttons should now be present, so click to display JSON
         jQuery("#convertButton").trigger('click');
      },
      'andUsedTheSelectAllOptionToHighlightAllText' : function () {
         BDD.selectAllJSONObjectCode.whenAUserSelectsAnOptionToSelectAll();
      },
      'whenAUserPressesCTRLC': function () {
        // TODO: how to test this?
         expect(0);
      },
      'thenTheCompleteJSONObjectCodeWillBeCopied': function () {
        // TODO: how to test this?
         expect(0);
      }
   },
   // Scenario11
   'informativeHelpText': {
      'givenAUserOnTheAdvertBuilderPage' : function () {
         expect(2);
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage();
      },
      'andTheUserHasCreatedAJSONObject' : function () {
        expect(5);
         BDD.genericFunctions.selectAd('richAd');
         BDD.genericFunctions.injectRichAdValuesIntoForm();

         same(jQuery('#adName').val().length > 0, true, 'input #adName should not be empty');
         same(jQuery('#imageAltText').val().length > 0, true, 'input #imageAltText should not be empty');
         same(jQuery('#customHtml').val().length >0, true, 'input #imageAltText should not be empty');

         // conversion buttons should now be present, so click to display JSON
         jQuery("#convertButton").trigger('click');
      },
      'whenTheUserIsReadyToPasteTheObjectIntoDFP' : function () {
         // no need for tests here
         expect(0);
      },
      'thenHelpTextWithRegardsToTheProcessAndHowToCopyAndPasteWillBeAvailable' : function () {
         expect(2);
         // test help div is now open
         same(jQuery('#helpTextDiv').css('display'), 'block', 'div #helpTextDiv should be display=block');
         // make sure contains help text
         var helpTextRegex = 'To place this ad in DFP, please follow the following steps';
         matches(jQuery('#helpTextDiv').html(), helpTextRegex, 'div #helpTextDiv should have content');
      }
   },
   // Scenario12
   'testZIndex' : {
      'givenAUserOnTheAdvertBuilderPage' : function () {
         BDD.simpleImageAdvert.givenAUserOnTheAdvertBuilderPage('noexpect');
      },
      'andTheUserHasCreatedAJSONObject' : function () {

         BDD.genericFunctions.selectAd('richAd');
         BDD.genericFunctions.injectRichAdValuesIntoFormForZIndex();

         same(jQuery('#adName').val().length > 0, true, 'input #adName should not be empty');
         same(jQuery('#imageAltText').val().length > 0, true, 'input #imageAltText should not be empty');
         same(jQuery('#customHtml').val().length >0, true, 'input #imageAltText should not be empty');

         // conversion buttons should now be present, so click to display JSON
         jQuery("#convertButton").trigger('click');
         same(jQuery('#adDiv').css('display'), 'none', '#adDiv should have style="display:none"');
      },
      'andTheUserHasDisplayedTheAd' : function () {

         jQuery("#reviewButton").trigger('click');
         same(jQuery('#adDiv').css('display'), 'block', '#adDiv should have style="display:block"');
      },
      'whenTheUserOptsToTextTheZIndex' : function () {

         jQuery("#testZButton").trigger('click');
      },
      'thenTheAdvertWillBeConcealedBeneathAScreeningLayerWithAZIndexOfOneMillionAndOne' : function () {

         jQuery('#zblat').attr('offsetTop'); // Force a DOM update NOW
         setTimeout(function () {
            // test the zblat div is now visible
            same(jQuery('#zblat').css('visibility'), 'visible', 'div #zblat should now be visible');
            // test the z-index of the div is 1,000,001
            closeToYou(jQuery('#zblat').css('z-index'), '1000001', 2, 'div #zblat should have an index of 1,000,001 or close enough (£$@%£$ firefox)');
         }, 100);
      }
   }
};


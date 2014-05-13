/* Author: Andrew C. Cadman, Brent S.A. Cowgill
   Functions for processing the form
   $Id$
*/

/*global
*/

//module code
var initPage = (function () {
   var checkPermissions = function (cookiesUnused) {
      return 1;
      // if (cookies.FT_U.match(/eid=6197937/)) {
      //   return 1;
      //}
      //return 0;
   };
   return {
      activateDivs: function (cookies) {
         var mainDisplay = 'none', permissionDisplay = 'block';

         if (checkPermissions(cookies)) {
            mainDisplay = 'block';
            permissionDisplay = 'none';
         }
         jQuery('#main').css({ 'display': mainDisplay});
         jQuery('#no_permission').css({ 'display': permissionDisplay});
      }
   };
}());

//new function for cssControl
var cssControl = (function () {

   var cssAction = function (theList) {
      var id, cssProperty, cssPropertyVal, prefixedId;
      for (id in theList) {
         if (theList.hasOwnProperty(id)) {
            for (cssProperty in theList[id]) {
               if (theList[id].hasOwnProperty(cssProperty)) {
                  cssPropertyVal = theList[id][cssProperty];
                  prefixedId = '#' + id;
                  jQuery(prefixedId).css(cssProperty, cssPropertyVal);
               }
            }
         }
      }
   };
   return {
      initialPageState: function () {
         var divList = {
             //expand
            'adMaker' : { 'display' : 'block'},
            'convertAndResetButtonsDiv' : { 'display' : 'block' },
            //collapse
            'reviewAndResetReviewButtonsDiv' : { 'display' : 'none' },
            'helpTextDiv' : {'display' : 'none'},
            'adDiv' : {'display' : 'none'}
         };
         cssAction(divList);
         // put the focus on the initial form field
         jQuery('.initfocus')[0].focus();
         jQuery('#zblat').addClass('hidden');
      },
      imageAdSelected: function () {
         var divList = {
            //expand
            'adNameDiv' : { 'display' : 'block'},
            'imageUrlDiv' : { 'display' : 'block'},
            'clickUrlDiv' : { 'display' : 'block'},
            'imageAltTextDiv' : { 'display' : 'block'},
            'thirdPartyImpressionUrlDiv': {'display' : 'block'},
             //collapse            
            'impressionUrlDiv' : {'display' : 'none'},
            'customHtmlDiv' : {'display' : 'none'},
            'loadFileDiv' : {'display' : 'none'},
            'outputDiv' : {'display' : 'none'},
            'imageLandscapeUrlDiv' : {'display' : 'none'},
            'imagePortraitUrlDiv' : {'display' : 'none'}
         };
         cssAction(divList);
         // put the focus on the initial form field
         jQuery('.initfocusform')[0].focus();
      },
      richAdSelected: function () {
         var divList = {
            //expand
            'adNameDiv' : { 'display': 'block'},
            'imageAltTextDiv' : { 'display': 'block'},
            'customHtmlDiv' : { 'display': 'block'},
            //collapse
            'imageUrlDiv' : { 'display': 'none'},
            'clickUrlDiv' : { 'display': 'none'},
            'impressionUrlDiv' : { 'display': 'none'},
            'thirdPartyImpressionUrlDiv' : { 'display': 'none'},
            'loadFileDiv' : { 'display': 'none'},
            'outputDiv' : { 'display': 'none'},
            'imageLandscapeUrlDiv' : {'display' : 'none'},
            'imagePortraitUrlDiv' : {'display' : 'none'}
         };
         cssAction(divList);
         // put the focus on the initial form field
         jQuery('.initfocusform')[0].focus();
      },
      browseJSONAdSelected: function () {
         var divList, buttonsList;
         divList = {
            //expand
            'loadFileDiv' : { 'display': 'block'},
            'outputDiv' : { 'display': 'block'},
            //collapse
            'adNameDiv' : { 'display': 'none'},
            'imageAltTextDiv' : { 'display': 'none'},
            'customHtmlDiv' : { 'display': 'none'},
            'imageUrlDiv' : { 'display': 'none'},
            'clickUrlDiv' : { 'display': 'none'},
            'impressionUrlDiv' : { 'display': 'none'},
            'thirdPartyImpressionUrlDiv' : { 'display': 'none'},
            'convertAndResetButtonsDiv' : { 'display': 'none'},
            'imageLandscapeUrlDiv' : {'display' : 'none'},
            'imagePortraitUrlDiv' : {'display' : 'none'}
         };
         buttonsList = {
            // expand
            'reviewButton' : {'display' : 'inline' },
            'resetReviewButton' : {'display' : 'inline' },
            'copyAdButton' : {'display' : 'inline' },
            'testZButton' : {'display' : 'inline' },
            // collapse
            'reviewLandscapeButton' : {'display' : 'none' },
            'reviewPortraitButton' : {'display' : 'none' }
         };
         cssAction(buttonsList);
         cssAction(divList);
         jQuery('.initfocusbrowse')[0].focus();
      },
      fullpageAdSelected: function () {
         var divList = {
            //expand
            'adNameDiv' : { 'display' : 'block'},
            'imageLandscapeUrlDiv' : {'display' : 'block'},
            'imagePortraitUrlDiv' : {'display' : 'block'},
            'imageAltTextDiv' : { 'display' : 'block'},
            'clickUrlDiv' : { 'display' : 'block'},
            'thirdPartyImpressionUrlDiv': {'display' : 'block'},
            //collapse     
            'impressionUrlDiv' : {'display' : 'none'},
            'imageUrlDiv' : { 'display' : 'none'},
            'customHtmlDiv' : {'display' : 'none'},
            'loadFileDiv' : {'display' : 'none'},
            'outputDiv' : {'display' : 'none'}
         };
         cssAction(divList);
         jQuery('.initfocusform')[0].focus();
      },
      warningFormField : function (id) {
         var List = {};
         List[id] = {'background-color' : 'red', 'color' : 'white' };
         cssAction(List);
      },
      resetFormField : function (id) {
         var List = {};
         List[id] = { 'background-color' : '#D7E5F2', 'color': '#102132'};
         cssAction(List);
      },
      resetReviewButtonClicked : function () {
         var divList = {
            'adDiv' : { 'display': 'none' }
         };
         cssAction(divList);
         jQuery('#zblat').addClass('hidden');
      },
      testZButtonClicked : function () {
         jQuery('#zblat').removeClass('hidden');
      },
      convertButtonClickedNoWarnings : function (adType) {
         var divList, buttonsList, fullpageButtonsList;
         divList = {
            'outputDiv' : { 'display' : 'block' },
            'convertAndResetButtonsDiv' : { 'display' : 'block' },
            'reviewAndResetReviewButtonsDiv' : { 'display' : 'block' },
            'adDiv' : { 'display': 'none'},
            'helpTextDiv' : { 'display' : 'block' }
         };
         buttonsList = {
            // expand
            'reviewButton' : {'display' : 'inline' },
            'resetReviewButton' : {'display' : 'inline' },
            'copyAdButton' : {'display' : 'inline' },
            'testZButton' : {'display' : 'inline' },
            // collapse
            'reviewLandscapeButton' : {'display' : 'none' },
            'reviewPortraitButton' : {'display' : 'none' }
         };
         fullpageButtonsList = {
            // expand
            'reviewLandscapeButton' : {'display' : 'inline' },
            'reviewPortraitButton' : {'display' : 'inline' },
            'resetReviewButton' : {'display' : 'inline' },
            'copyAdButton' : {'display' : 'inline' },
            'testZButton' : {'display' : 'inline' },
            // collapse
            'reviewButton' : {'display' : 'none' }
         };

         if (adType === 'fullpageAd') {
            cssAction(fullpageButtonsList);
         } else {
            cssAction(buttonsList);
         }

         cssAction(divList);
      },
      expandDiv : function (id) {
         var List = {};
         List[id] = { 'display': 'block'};
         cssAction(List);
      },
      collapseDiv : function (id) {
         var List = {};
         List[id] = { 'display': 'none'};
         cssAction(List);
      },
      divHeightAndWidth : function (id, xpx, ypx) {
         var List = {};
         List[id] = { 'width' : xpx, 'height' : ypx };
         cssAction(List);
      }

   };
}());

var requiredFields = (function () {

   var adFormFields = {
      'richAd' : {
         'adName' : 1,
         'imageAltText' : 1,
         'customHtml' : 1,
         'clickUrl' : 0,
         'imageUrl' : 0
      },
      'imageAd' : {
         'adName' : 1,
         'imageAltText' : 1,
         'customHtml' : 0,
         'clickUrl' : 1,
         'imageUrl' : 1
      },
      'fullpageAd' : {
         'adName' : 1,
         'clickUrl' : 1,
         'imageLandscapeUrl' : 1,
         'imagePortraitUrl' : 1,
         'imageAltText' : 1
      }
   };

   return {
      checkIfRequiredField: function (adType, field) {
         return adFormFields[adType] && adFormFields[adType][field];
      }
   };
}());

//adapted from https://developer.mozilla.org/en/DOM/FileReader
//should work in at least firefox, safari
var fileLoad = (function () {
   var oFReader,
      rFilter = /(\.txt|\.htm|\.html|\.json)$/i,
      // Safari (Mac Safari/534.50) doesn't have this object'
      FileReader = window.FileReader || function () { return { onload: function () {}, readAsText: function () {} }; };

   oFReader = new FileReader();
   oFReader.onload = function (oFREvent) {
      jQuery('#outputJSON').val(oFREvent.target.result);
   };
   return {
      JSONLoad : function () {
         if (jQuery('#loadFileButton').length === 0) { return; }
         //need to find the jQuery eqivalent to this
         var oFile = document.getElementById("loadFileButton").files[0];

         if (!rFilter.test(oFile.name)) {
            alert(oFile + "You must select a valid JSON, txt, htm or html file!");
            return;
         }
         oFReader.readAsText(oFile);
      }
   };

}());

var zblatDrag = (function () {
   var drag = 0, xdif = "0px", ydif = "0px", left = 750, stopDrag = 0;

   return {
      beginDrag  : function (event) {

         if (drag === 0) {
            drag = 1;
            xdif = event.clientX - left;
            ydif = event.clientY;
         } else {
            drag = 0;
         }
      },
      mousePos : function () {
         if ((drag === 1) && (stopDrag === 0)) {
            var xpx = xdif + "px", ypx = ydif + "px";
            return [xpx, ypx];
         }
      },
      startMouseDrag : function () {
         stopDrag = 0;
      },
      stopMouseDrag : function () {
         stopDrag = 1;
      }
   };
}());
//end of module code

//disparate functions
function checkIfEmpty(fieldValue) {
   //remove leading standard chars
   fieldValue = fieldValue.replace(/%c/, '');
   fieldValue = fieldValue.replace(/%u/, '');
   fieldValue = fieldValue.replace(/%h/, '');
   fieldValue = fieldValue.replace(/%i/, '');
   fieldValue = fieldValue.replace(/http:\/\//, '');

   if (!fieldValue.match(/[a-zA-Z]+/)) {
      return true;
   }
   return false;
}

function setupAdLibrary() {
   FT.env.cookie = '';
   // Set up the ad library for the 'test' screen mode
   FT.env.setup('large', false, 'ios');
}

function populateJSONField(rObj) {
   // Put the JSON text into the output text area
   var jsonStr = JSON.stringify(rObj);
   jQuery('#outputJSON')[0].value = jsonStr;
}

function getAdJSON(mode) {
   var Obj, jsonObj, cleanedJSONObj;
   if (mode === 'fromTextArea') {
      Obj = jQuery('#outputJSON').val();
   } else if ((mode === 'fromStorage') && (Modernizr.localstorage)) {
      //clearAd();
      Obj = getObjFromLocalStorage('html5play-ad');
   } else if ((mode === 'fromStorage') && (!Modernizr.localstorage)) {
      alert('Your browser does not appear to have local storage capabilties');
   }

   if (Obj) {
      //d-stringify back to JSON object and clean it of DFP placeholders
      jsonObj = JSON.parse(Obj);
      cleanedJSONObj = previewCleanUp(jsonObj);
   }
   return cleanedJSONObj;
}

function showAdUsingLibrary(rJSONAd, adDiv) {
   var error, html = "[ADVERT SHOULD BE HERE]", width, height, message;
   adDiv = adDiv || 'adDiv';
   if (rJSONAd) {
      // Begin ad calls for the home page after releasing previous ad preview if present
      FT.env.releaseAds();
      FT.env.startPage('home', 'home');
      if (typeof rJSONAd.orientation !== "undefined") {
         // Full Page ad being rendered. Inject a measurement grid/rectangle.
         // These sizes taken using a grid ad targeted to FTQA=debug,env=test,zone=fullpage-grid-test
         // http://ft-ad-enablement.appspot.com/img/fpads/test-grid-768x1024.png
         // http://ft-ad-enablement.appspot.com/img/fpads/test-grid-1024x768.png
         if (rJSONAd.orientation === 'l') {
            width = 1024;
            height = 748;
            message = 'Landscape';
         } else {
            width = 768;
            height = 1005;
            message = 'Portrait';
         }
         message = "iPad " + message + " Preview " + width + 'x' + height + ". Please ensure the image is not protruding outside the screen area.";
         showWarning(message);
         html = '<div class="fullpage-advert-container" style="height:' + height + 'px; width:' + width + 'px;"><div class="dfpadplaceholder"><div id="fullpage" class="advertising">' + html + '</div></div></div>';
         jQuery('#' + adDiv).html(html);
         adDiv = "fullpage";
      } else {
         jQuery('#' + adDiv).html(html);
      }
      try {
         FT.env.injectAd(adDiv, rJSONAd);
      } catch (exception) {
         error = exception.message;
      }
   }
   return error;
}

function checkForDocWrite() {
   // Use ad library to render the ad into a hidden div and check if document.write was called.
   var error, rJSONAd = getAdJSON("fromTextArea");
   FT.env.doc_write_calls = 0;
   error = showAdUsingLibrary(rJSONAd, 'adCheckerDiv');
   return { 'docwrite': FT.env.doc_write_calls, 'error': error};
}

function showAd(mode, orientation) {
   log('showAd()');

   // Sample URL we can use for an Image ad when testing ad maker
   // http://ft-ad-enablement.appspot.com/img/dont-panic-mpu-300x250.GIF
   var rJSONAd = getAdJSON(mode);
   if (rJSONAd) {
      if (typeof orientation !== "undefined") {
         rJSONAd.orientation = orientation;
     }
      showAdUsingLibrary(rJSONAd);
   }
}

// Adjust parameters of JSON ad so that we can perform a preview in the ad maker tool itself.
function previewCleanUp(Obj) {

   if (typeof Obj.clickUrl !== "undefined") {
      Obj.clickUrl = Obj.clickUrl.replace(/%c%u/, '');
   }
   // substitute the DFP image server name in for %h so we can preview.
   if (typeof Obj.imageUrl !== "undefined") {
      Obj.imageUrl = Obj.imageUrl.replace(/%h/, 'http://s0.2mdn.net');
   }

   if (typeof Obj.imageLandscapeUrl !== "undefined") {
     Obj.imageLandscapeUrl = Obj.imageLandscapeUrl.replace(/%h/, 'http://s0.2mdn.net');
   }

   return Obj;
}

// Get the text from the hidden span with class .fieldhelp and create an on-
// focus method to show that help text when you move into the input field
// <input ...><span class="fieldhelp visuallyhidden">HELP TEXT</span>
function addFieldHelp(element) {
   var help = '';

   element = jQuery(element);
   help = element.siblings('.fieldhelp').text() || '';

   if (help && help !== '') {
      element.focus(function () {
         window.status = help;
         jQuery('#toolHelpText').html(help);
      });
      element.blur(function () {
         window.status = "";
         jQuery('#toolHelpText').html('');
      });
   }
}

function copyToClipboard(text) {
   window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function showWarning(message) {
   jQuery('#formWarnings').html(message).removeClass('hidden');
   jQuery('#supportEmail').removeClass('hidden');
}

function hideWarning() {
   jQuery('#formWarnings').html('').addClass('hidden');
   jQuery('#supportEmail').addClass('hidden');
}

function resetWarnings() {
   var idx, Fields = ['customHtml', 'adName', 'clickUrl', 'imageUrl', 'imageLandscapeUrl', 'imagePortraitUrl', 'imageAltText'];
   hideWarning();
   for (idx = Fields.length - 1; idx >= 0; idx -= 1) {
      cssControl.resetFormField(Fields[idx]);
   }
}

function simpleDrag(event) {
   jQuery(this).css({
      'top': event.offsetY,
      'left': event.offsetX
   });
}

// Install all jQuery event handlers. Must wait until document ready
// before we try this or you are racing against time.
function installEventHandlers() {
   // drag handlers for z-index screen (proxy drag: http://threedubmedia.com/demo/drag/)
   jQuery('#zblat').bind('dragstart', function (event) {
      if (!jQuery(event.target).is('.handle')) {
         return false;
      }
      return jQuery(this).css('opacity', 0.5).clone().addClass('active').insertAfter(this);
   }).bind('drag', function (event) {
      jQuery(event.dragProxy).css({
         top: event.offsetY,
         left: event.offsetX
      });
   }).bind('dragend', function (event) {
      // Give it some color when it's dropped.
      var red, green, blue, color;
      red   = event.offsetX % 256;
      green = event.offsetY % 256;
      blue  = (event.offsetX + event.offsetY) % 256;
      color = ["rgb(", Math.round(red), ",", Math.round(green), ",", Math.round(blue), ")"].join("");

      jQuery(event.dragProxy).remove();
      jQuery(this).css({
         'background-color': color
      }).animate({
         'top': event.offsetY,
         'left': event.offsetX,
         'opacity': 1
      });
   });

   // Help text div can get in the way, let the user move it.
   jQuery('#helpTextDiv').bind('drag', simpleDrag);
   jQuery('#documentationDiv').bind('drag', simpleDrag);

   // Ad preview div should be movable as well
   jQuery('#adDiv').bind('drag', simpleDrag);

   // Just for fun, warning div and email support
   jQuery('#formWarnings').bind('drag', simpleDrag);
   jQuery('#supportEmail').bind('drag', simpleDrag);
   
   // Kudos to April -- jQuery ready in side body causes click event to fire twice
   // http://yuji.wordpress.com/2010/02/22/jquery-click-event-fires-twice/
   jQuery('#loadFileButton').unbind('change').bind('change', function () {
      fileLoad.JSONLoad();
      jQuery('.output').removeClass('hidden');
      cssControl.expandDiv('reviewAndResetReviewButtonsDiv');
   });

   jQuery('#customHtml').change(function () {
      // replace %3A with : so that http%3A// is not detected as a javascript comment.
      var customHTML = jQuery('#customHtml').val().replace(/%3a/gi, ':'),
         iFrameRegex = /iframe/,
         commentRegex = /(^|[^:])\/\/.?/,  // jslint insecure ok
         warningRegex = /Warning/,
         warning = '';

      if (customHTML.match(iFrameRegex)) {
         warning += 'Warning! forbidden &lt;iframe&gt; element found in advert.<br>';
      }
      if (customHTML.match(commentRegex)) {
         warning += 'Warning! comment line // found in advert which could be a problem.<br>';
      }

      // may add further conditions here.
      //....
      if (warning.match(warningRegex)) {
         showWarning(warning);
         cssControl.warningFormField('customHtml');

         // hide the conversion button
         cssControl.collapseDiv('convertAndResetButtonsDiv');

      } else {
         // we are ok -- make sure backgrounds are set / reset to normal colors
         resetWarnings();
         // display the convert and reset buttons again
         cssControl.expandDiv('convertAndResetButtonsDiv');
      }
   });

   // give some help when entering data -- attach help to all input and textarea elements
   jQuery('input,textarea').each(function (idxUnused, element) {
      addFieldHelp(element);
   });

   // put the focus on the initial form field
   jQuery('.initfocus')[0].focus();

   jQuery('#no_jquery').addClass('hidden');

   // Handle the convert button click by gathering the data from the form fields
   // building it into a Javascript object and converting to JSON along with some
   // default fields for pasting into DFP
   jQuery('#convertButton').click(function () {
      var input = {
            "pos" : "%kpos=!;",
            "size" : "%ksz=!;",
            "adId" : "%eaid!",
            "advertiserId" : "%eadv!",
            "creativeId" : "%ecid!",
            "hasDocWrite": false
         },
         warningStatement = '',
         rDocWriteCheck;
      resetWarnings();

      if (jQuery("#adTypeChoice").val() === 'fullpageAd') {
         input.orientation = "%kort=!;";
         input.is_centered = true;
      }

      jQuery('#fields .input').each(function (idxUnused, element) {
         var value = element.value, adTypeChosen = jQuery("#adTypeChoice").val();

         if (value === 'http://') {
            // untouched URL fields are skipped
            value = '';
         }

         if (value && value !== '') {
            // for click-thru URL, add a %c if not yet existing or was omitted
            if (element.id === 'clickUrl' && !/^%c/.test(value)) {
               value = '%c' + value;
            }

            if (element.id !== element.name) {
               input[element.name] = value;
            } else {
               input[element.id] = value;
            }
         }

         if ((checkIfEmpty(value)) && (requiredFields.checkIfRequiredField(adTypeChosen, element.id))) {
            //set the field colour to red..
            cssControl.warningFormField(element.id);

            warningStatement += 'You must give a value for mandatory fields. (' + element.id + ') <br>';

            showWarning(warningStatement);
         } else {
            cssControl.resetFormField(element.id);
         }
      });

      if (!warningStatement.match(/[A-Za-z]/)) {
         // Put the JSON text into the output text area and reveal it
         populateJSONField(input);
         // document.write detection
         rDocWriteCheck = checkForDocWrite();
         if (rDocWriteCheck.docwrite) {
            input.hasDocWrite = true;
            populateJSONField(input);
            if (warningStatement) {
               warningStatement += "\n<br>";
            }
            warningStatement += "Warning! forbidden document.write found in advert";
            showWarning(warningStatement);
            cssControl.warningFormField('customHtml');
         }
         /*
         if (rDocWriteCheck.error) {
            if (warningStatement) {
               warningStatement += "<br>";
            }
            warningStatement += "Advert contains Javascript errors: " + rDocWriteCheck.error;
            showWarning(warningStatement);
         }
         */
      }
      
      if (!warningStatement.match(/[A-Za-z]/)) {
         jQuery('.output').removeClass('hidden');
         cssControl.convertButtonClickedNoWarnings(jQuery("#adTypeChoice").val());
         jQuery('#adDiv').html('');
      }
   });

   // Handle the reset button by hiding the output fields after the browser has restored the
   // form fields to their original values
   jQuery('#resetButton').click(function () {
      resetWarnings();
      jQuery('.output').addClass('hidden');
      cssControl.collapseDiv('reviewAndResetReviewButtonsDiv');
      jQuery('.initfocusform')[0].focus();
   });

   //review the ad diplayed in the text area
   jQuery('#reviewButton').click(function () {
      cssControl.expandDiv('adDiv');
      showAd("fromTextArea");
   });

   jQuery('#reviewLandscapeButton').click(function () {
      cssControl.expandDiv('adDiv');
      showAd("fromTextArea", "l");
   });

   jQuery('#reviewPortraitButton').click(function () {
      cssControl.expandDiv('adDiv');
      showAd("fromTextArea", "p");
   });

   jQuery('#resetReviewButton').click(function () {
      jQuery('#adDiv').html('');
      cssControl.resetReviewButtonClicked();
   });

   jQuery('#copyAdButton').click(function () {
      //copy to clipboard
      var jsonObj = jQuery('#outputJSON')[0].value;
      copyToClipboard(jsonObj);
   });

   jQuery('#testZButton').click(function () {
      cssControl.testZButtonClicked();
   });

   jQuery('#adTypeChoice').change(function () {
      cssControl.initialPageState();

      // reset all fields
      jQuery('#resetReviewButton').trigger('click');

      jQuery('#adDiv').html('');
      jQuery('#outputDiv').val('');
      resetWarnings();

      if (jQuery("#adTypeChoice option[value='imageAd']").attr('selected')) {
         // image Ad is selected
         cssControl.imageAdSelected();
      } else if (jQuery("#adTypeChoice option[value='richAd']").attr('selected')) {
         // rich ad selected
         cssControl.richAdSelected();
      } else if (jQuery("#adTypeChoice option[value='browseJSONAd']").attr('selected')) {
         //browsing a JSON object from disk is selected
         cssControl.browseJSONAdSelected();
      } else if (jQuery("#adTypeChoice option[value='fullpageAd']").attr('selected')) {
         //browsing a JSON object from disk is selected
         cssControl.fullpageAdSelected();
      }
   });
}

// end of event handlers

// Initialize controls on the Ad Maker
// Some test plans do not need full initialisation so we check for that.
function initAdMakerState() {
   if (typeof Plan !== "undefined" && Plan.no_admaker_init) {
      // do not initialize admaker for the unit test plan.
      return;
   }
   setupAdLibrary();
   initPage.activateDivs(FT.cookies);
   jQuery(document).ready(function () {
      installEventHandlers();
   });
}

initAdMakerState();

// Just a few functions to help regression testing ads libraries.
// Note this is an .html.js because the make file will automatically copy .htm*
// files from the test directory to the build target directory but won't do
// .js files by themself and we couldn't work out now to change the pom to make
// it so.

/*jslint evil: true, white: true, browser: true, undef: true, nomen: false,
    onevar: false, plusplus: false, eqeqeq: true, bitwise: true,
    regexp: false, newcap: true, immed: true, maxerr: 1000, indent: 3
*/

/*globals FT, CheckAds, doit, ok, equal, jQuery, window, alert, env,
    dfp_site, asset, timeoutTolerance
*/

// We used to have a pending() method added to qunit which would allow selenium
// tests to pass the test plan even though some tests would expectedly fail
// This was useful for TODO items.
if (!window.pending)
{
   window.pending =
   function (tests)
   {
      for (var idx = 0; idx < tests; ++idx)
      {
         ok(true, "skipping pending tests");
      }
      return true;
   };
   // Enable this line to execute pending tests and thus cause them to fail.
   //window.pending = function () {};
}

//=========================================================================
// Some type checking functions which were used in the test plan
//=========================================================================

function getType(obj)
{
   if (obj === undefined)
   {
      return 'undefined';
   }
   if (obj === null)
   {
      return 'null';
   }
   if (obj === window)
   {
      return 'window';
   }
   return (Object.prototype.toString.apply(obj)).match(/\[object (\w+)\]/)[1].toLowerCase();
}
function arrayLike(obj)
{
   return (typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length')));
}
function type(unk)
{
   var t = getType(unk);
   return unk === undefined ? "undefined" : unk === null ? "null" : t === "object" && arrayLike(unk) ? "arraylike" : t;
}
// This helper determines the type of object and its 'length' if relevant.
// length of string, numbers are the number of characters in the string
// length of an array is the number of entries in the array
// length of an object is the number of properties in the object
// all else has no length
function type_size(unk)
{
   var t = getType(unk);
   if (t === 'array' || t === 'string') {
      t = t + '[' + unk.length + ']';
   }
   else if (t === 'number') {
      var s = '' + unk;
      t = t + '[' + s.length + ']';
   }
   else if (t === 'object') {
      var num = 0;
      if (arrayLike(unk)) {
         // If object has its own length function, use it.
         num = unk.length;
      }
      else
      {
         // Just an object, count up the properties it has.
         for (var prop in unk) {
            if (true || prop) {
               num++;
            }
         }
      }
      t = t + '[' + num + ']';
   }
   return t;
}

//=========================================================================
// Testing functions qunit doesn't have
//=========================================================================

// Perform a regular expression match against a string.
// Output is nice, showing the regex you are matching against.
// Also useful if your regex is too complex to do
// ok(/my complex regex/.test(string), message);
function matches(string, regex, message, result)
{
   // Assume we want to check if it matches.
   if (typeof result === 'undefined')
   {
      result = true;
   }

   // Remove should not match if at end of string
   message = message.replace(/\s$/i, "");
   message = message.replace(/\s*(match|be)\s*$/i, "");
   message = message.replace(/\s*not\s*$/i, "");
   message = message.replace(/\s*should\s*$/i, "");

   var rRegex = typeof regex === 'string' ? new RegExp(regex) : regex;
   var match = ' should ' + (result ? 'match' : 'not match');
   if (rRegex.test(string) === result)
   {
      equal(result, result, message + match);
   }
   else
   {
      if (typeof regex === 'string')
      {
         regex = regex.replace(/^\/\s*/, '');
         regex = regex.replace(/\/\s*$/, '');
         regex = regex.replace(/&/g, '&amp;');
         regex = regex.replace(/</g, '&lt;');
         regex = regex.replace(/>/g, '&gt;');
         regex = '/' + regex + '/';
      }
      var showString = string || typeof string;
      showString = showString.replace(/&/g, '&amp;');
      showString = showString.replace(/</g, '&lt;');
      showString = showString.replace(/>/g, '&gt;');
      equal(rRegex.test(string), result, message + ": " + "is [" + showString + "] " + match + " " + regex);
   }
}
function notmatches(string, regex, message)
{
   matches(string, regex, message, false);
}
// Check that values differ. Opposite of equal()
function differs(got, expect, message)
{
   if (got !== expect) {
      ok(true, message + ': "' + got + '" !== "' + expect + '"');
   }
   else
   {
      ok(false, message + ', identical: "' + got + '"');
   }
}
// Check that any exception happens, or a specific exception
function assertException(exception, func, msg)
{
   try {
      func();
      ok(false, msg + ": exception '" + exception + "' not thrown");
   }
   catch (error)
   {
      if (exception === undefined)
      {
         ok(true, msg);
      }
      else
      {
         equal(error, exception, msg);
      }
   }
}
// Check that NO exception happens
function assertNoException(func, msg)
{
   try {
      func();
      ok(true, msg);
   }
   catch (error)
   {
      ok(false, msg + ": an exception '" + error + "' was thrown");
   }
}

//=========================================================================
// Miscellaneous
//=========================================================================

function flatten(obj) {
   var results = [];
   for (var item in obj) {
      if (obj.hasOwnProperty(item)) {
         results.push(item);
      }
   }
   return results;
}

function debug(msg)
{
   // Cross brower console.log support.
   if (window.console && window.console.log)
   {
      window.console.log(msg);
   }
   else if (window.opera)
   {
      window.opera.postError(msg);
   }
}

//=========================================================================
// Ads library specific functions
//=========================================================================

function initCookies(FTQA)
{
   FTQA = FTQA || "debug,dfp_ads,interval=25,timeout=20000";
   FT._ads.utils.cookies.FTQA = FTQA;
   FT._ads.utils.FT_U = undefined;
   FT._ads.utils.AYSC = undefined;
   FT._ads.utils.rsi_segs = undefined;
}

function locateDiv(pos, prefix)
{
   if (typeof prefix === 'undefined')
   {
      prefix = '';
   }
   var rDiv = jQuery(null);
   var AdContainers = FT.ads.getAdContainers(pos);
   for (var idx = 0; idx < AdContainers.length; ++idx)
   {
      if (AdContainers[idx].name === prefix + pos)
      {
         rDiv = jQuery(AdContainers[idx].div);
      }
   }
   var id = rDiv.attr('id');
   if (id !== prefix + pos)
   {
      rDiv = rDiv.find('#' + pos);
   }
   id = id || pos;
   equal(rDiv.length, 1, "'" + id + "' div exists within the document");
   return rDiv;
}

function showDiagnosis()
{
   alert(FT.ads.showDiagnostics());
}

function stopTimer()
{
   FT.ads.clearAllIntervals('Manually stopped interval timer');
}

function expandAll()
{
   for (var idx = 0; idx < CheckAds.length; ++idx)
   {
      FT.ads.expand(CheckAds[idx]);
   }
   alert('Ads divs expanded:\n   ' + CheckAds.join("\n   "));
}

function get_diagnostic(pos, diag)
{
   if (FT && FT.ads && FT.ads.adverts && FT.ads.adverts[pos] && FT.ads.adverts[pos].diagnostics && FT.ads.adverts[pos].diagnostics[diag]) {
      return FT.ads.adverts[pos].diagnostics[diag];
   }
   return undefined;
}

function getParams() {
  var idx = document.URL.indexOf('?');
  var params = new Array();
	if (idx != -1) {
	  var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
	  for (var i=0; i<pairs.length; i++) {
		nameVal = pairs[i].split('=');
		params[nameVal[0]] = nameVal[1];
	  }
	}
	return params;
}

function setCookies() {
   var params = getParams();
   var cookie_string = '';
   document.cookie = '';

   for (var key in params) {
      var values = params[key].split(':');
      var value = values[0];
      var expiry = values[1];
      var domain = values[2];
  
      var date = new Date();
      var timeOut = expiry * 1000;
  
       //of course timeout should be properly set but anyway
      if (value === "undef"){
        //delete cookie by setting timeout in the past
        timeOut = -1;
      } 
      date.setTime(date.getTime() + (timeOut));
      var expires = "; expires=" + date.toGMTString();
      cookie_string = key + "=" + value + expires + "; domain=" + domain + "; path=/";
      document.cookie = cookie_string;
   }
}

//=========================================================================
// Consent cookie helper functions
//=========================================================================

// cookie consent is required for corporate popup to function
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function createConsentCookie(){
   createCookie('cookieconsent','accepted',2);
}

function eraseConsentCookie(){
   eraseCookie('cookieconsent');
}

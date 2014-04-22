//=========================================================================
// Testing functions qunit doesn't have
// $Id$
//=========================================================================
/*jslint sloppy: true, white: false, maxerr: 1000, indent: 3 */

// Snipped from online/website/ft-cms/trunk/ft-cmsWeb/src/test/js/qunit/lib/Advertising/test-helpers.html.js

// Perform a regular expression match against a string.
// Output is nice, showing the regex you are matching against.
// Also useful if your regex is too complex to do
// ok(/my complex regex/.test(string), message);
function matches(string, regex, message, result) {
   message = message || '';
   // Assume we want to check if it matches.
   if (result === undefined) {
      result = true;
   }

   // Remove should not match if at end of string
   message = message.replace(/\s$/i, "");
   message = message.replace(/\s*(match|be)\s*$/i, "");
   message = message.replace(/\s*not\s*$/i, "");
   message = message.replace(/\s*should\s*$/i, "");

   var showString, rRegex = typeof regex === 'string' ? new RegExp(regex) : regex,
      match = ' should ' + (result ? 'match' : 'not match');
   if (rRegex.test(string) === result) {
      regex = (result ? "" : "not to match ") + rRegex.toString();
      deepEqual(regex, regex, message + match);
   } else {
      if (typeof regex === 'string') {
         regex = regex.replace(/^\/\s*/, '');
         regex = regex.replace(/\/\s*$/, '');
         regex = regex.replace(/&/g, '&amp;');
         regex = regex.replace(/</g, '&lt;');
         regex = regex.replace(/>/g, '&gt;');
         regex = '/' + regex + '/';
      }
      showString = string || typeof string;
      showString = showString.replace(/&/g, '&amp;');
      showString = showString.replace(/</g, '&lt;');
      showString = showString.replace(/>/g, '&gt;');
      if (rRegex.test(string) === result) {
         // TODO I (who?) don't think it is possible to get here we're already
         // in the negative branch for this regex test!!!
         // And yet, the unknown I didn't remove the code... I (BSAC) will look
         // to recover the test plan for this from the repository and see what is up.
         deepEqual(rRegex.test(string), result, message + ": " + "is [" + showString + "] " + match + " " + regex);
      } else {
         deepEqual(string, (result ? "" : "not to match ") + rRegex.toString(), message + ": " + "is [" + showString + "] " + match + " " + regex);
      }
   }
}

function notMatches(string, regex, message) {
   matches(string, regex, message, false);
}

// Convert a css value to a number. i.e. 245px becomes 245 and 34.23em becomes 34.23
function makeNumber(css_value) {
   var RADIX = 10;
   if (css_value.toString().match(/\./)) {
      css_value = parseFloat(css_value);
   } else {
      css_value = parseInt(css_value, RADIX);
   }
   return css_value;
}

// Perform a test to see if a value is close enough to another value
// This is useful when computations are inexact due to rounding errors
// like 0.1 + 0.2 != 0.3
// When the test passes the expected value shown is expected +/- tolerance
// and also shows the actual value. When the test fails you also see the
// expected value as expected +/- tolerance
// both number and expected can be css strings with unit suffixes like px
function closeToYou(number, expected, tolerance, message) {
   var diff = Math.abs(makeNumber(number) - makeNumber(expected)),
      info = expected + ' +/- ' + tolerance;
   if (diff <= tolerance) {
      // Test pass, show a meaningful expected value with actual value
      info += ' was ' + number;
      deepEqual(info, info, message);
   } else {
      // Test fails, show meaningful expected value
      deepEqual(number, info, message);
   }
}

function capitalize(str) {
   return str.replace(/(^|\s)([a-z])/g, function (unused, p1, p2) {
      return p1 + p2.toUpperCase();
   });
}

function lcfirst(str) {
   var firstLetter = str.slice(0, 1);
   return firstLetter.toLowerCase() + str.substring(1);
}

function parseToCode(obj) {
   // The Scenario matching code needs to be compatible with what Qucumber does.
   // The scenarioRegExp is grabbed from Qucumber code.
   var Match, str = capitalize(String(obj)),
      scenarioRegExp = /^\s*scenario\s*([\da-z]\s*[\):;,\.\-_\da-z]+)\s+(.*)$/i; // jslint insecure ok
   if (/^\s*scenario/i.test(str)) {
      Match = str.match(scenarioRegExp);
      if (Match && Match.length) {
         // String is a Scenario name, try to parse it
         str = Match[2];
      } else {
         throw "parseToCode: '" + str + "' Unable to extract a Scenario name from string using RegExp " + scenarioRegExp.toString();
      }
   }
   // Extract all non-word characters and make a function name
   str = str.replace(/[\s,\.\-]+/g, "");

   return lcfirst(str);
}

function runBDD(scenario, step) {

   var scenarioFunction = parseToCode(scenario), stepFunction = parseToCode(step);

   // HEY, maybe some error checking would have been a good idea.
   // Things don't always just work, you know.
   if (!BDD[scenarioFunction]) {
      throw "runBDD: There is no BDD." + scenarioFunction + " in existence to run this test.";
   }
   if (!BDD[scenarioFunction][stepFunction]) {
      throw "runBDD: There is no BDD." + scenarioFunction + "." + stepFunction + " in existence to run this test.";
   }
   BDD[scenarioFunction][stepFunction]();

   return true;
}

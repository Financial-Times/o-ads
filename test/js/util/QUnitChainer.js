/*
   Functions to chain qunit test plans one after another
   By: Brent S.A. Cowgill

   Assumes jQuery has been included prior to this module

   http://docs.jquery.com/Qunit

   Legacy browsers will require Douglas Crockford's json2.js for JSON() support
   https://github.com/douglascrockford/JSON-js

   Expects your test page to have this object present:

   var Plan = {
     // Specify the test plan to run after this one
     nextTestPlan: 'q-test2.html',

     // Optional things you can turn from the control page or here for an individual test plan
     bLog:   true,  // turns on console logging with global window.log() function
     bPause: true,  // turns on a pause before chaining to the next test plan
     bAlertStorage: true, // turns on debugging of browser storage,

     // Optional things you can turn on for individual test plans
     bTrace: true,     // turns on QUnitChainer.trace() logging
     bLogEvent: true,  // turns on QUnitChainer.logEvent() logging

     '-': '-'
   };
 */
/*jslint browser: true, sloppy: true, white: false, plusplus: true, regexp: true, maxerr: 1000, indent: 3 */

/*globals Plan, QUnit, QUnitChainer, clearInterval, console, document, jscoverage_report, jQuery, setInterval, window
*/

/*properties
    '-', Plan, Properties, QUnit, QUnitHandlers, Tests, UICheckBoxes, VERSION,
    addClass, autoRunInterval, autoRunIntervalTimer, bAlertStorage, bAutoRun,
    bControl, bDumpStorage, bFollowChain, bHasHandlers, bIsControlPage, bIsFF,
    bIsIE, bLog, bLogEvent, bPause, bShowFailTitle, bShowFixture, bShowPassed,
    bTrace, begin, bindUIEvents, browserIsFF, browserIsIE, cancelAutoRun,
    change, checkStorage, checked, cleanTestPlan, cleanUserAgent, clear,
    clearAllStorage, clearProperties, clearStorage, clearTestResults, click,
    clickAlertStorage, clickAutoRun, clickClearStorage, clickClearTests,
    clickDumpStorage, clickLog, clickPause, clickRunTests, clickShowFailTitle,
    clickShowFixture, clickShowPassed, console, css, debugStorage, done,
    dumpStorage, failed, fetchItem, getAllStorage, getDefaultProperties,
    getItem, getProperties, getProperty, getStorage, getTestResults,
    handleAutoRun, header, host, href, html, in, init, initBrowser,
    initControlPage, initTests, injectControlPage, installAutoRun,
    installQUnitHandlers, jqInjectAt, jscoverage_report, key, location, log,
    logEvent, logIt, match, maybeAlertStorage, message, module, moduleDone,
    moduleIdx, moduleStart, my, myAlert, name, nextTestPlan, noModuleName,
    passed, plan, protocol, pushArray, ready, removeClass, removeItem,
    renderPage, replace, reset, result, saveJSCoverage, saveToStorage,
    'self.Tests', setControlPageTestStatus, setItem, setLocation, setProperty,
    showControlPage, showFixture, showHidePassedTests, showTestSummary, skey,
    sskey, storage, storeItem, storeProperties, storeTestResults, stringifyObj,
    testDone, testFailures, testIdx, testPasses, testStart, testStatus, text,
    title, total, trace, updateControlFields, userAgent, value, wipeQUnitOutput
*/

/*
 * QUnitChainer - a Singleton object for chaining one QUnit test plan after
 * another and then providing a control page to view the results.
 */
var QUnitChainer = {
   VERSION: '1.5.5 $Id: QUnitChainer.js 93140 2011-10-12 15:05:29Z bcowgill $',
   storage: 'localStorage',  // which type of storage to store the test results in
   skey:    'QUnitChainer',  // which key name to store the test results in the storage
   sskey:   '',              // which key name to store the settings in the storage
   hskey:   '',              // which key name to store the test plan history list in
   bIsControlPage:  false,   // flag set when in control page mode
   bHasHandlers:    false,   // flag set when QUnit handlers are installed
   bAlertStorage:   false,   // flag set if alert boxes with browser storage should be displayed when storage is manipulated
   bPause:          false,   // flag set to pause before chaining to next test plan (storage and Plan.bPause are checked)
   bLog:            false,   // flag set if the global log() function should output to the console
   bLogEvent:       false,   // flag set to log QUnit and Control page events
   bTrace:          false,   // flag set to trace internal method calls
   bIsIE:           undefined, // flag set if browser is Internet Explorer
   bIsFF:           undefined,   // flag set if browser is Firefox

   jqInjectAt:      'body',  // Default jQuery search to inject the control page at
   autoRunInterval: 15000,   // auto run the test plans every 15 seconds
   moduleIdx:       -1,      // Index value for module being tested
   testIdx:         -1,      // Index value for test being tested
   testStatus:      'qunit-fail', // Overall testing status
   testPasses:      0,       // Overall test plans which passed
   testFailures:    0,       // Overall test plans which failed
   nextTestPlan:    undefined, // next test plan to invoke

   Properties: {},           // properties saved to storage under skey
   Tests: {},                // test plan results saved to storage under sskey
   History: [],              // history of test plans typed into the edit box

   UICheckBoxes: ['bAutoRun', 'bAlertStorage', 'bPause', 'bLog', 'bDumpStorage', 'bShowPassed', 'bShowFixture', 'bShowFailTitle'],
   QUnitHandlers: ['begin', 'done', 'moduleStart', 'moduleDone', 'testStart'],
   noModuleName: 'Unknown Test Module, add a call to module() to this test plan',

   /*
    * QUnitChainer.init()
    *
    * Initialise the object
    */
   init: function (rParams) {
      rParams = rParams || {};
      this.Plan = rParams;
      this.bTrace = this.bTrace || (rParams.bTrace || false);
      this.trace('QUC.init(' + JSON.stringify(rParams) + ')');

      this.bAlertStorage = rParams.bAlertStorage || false;
      this.maybeAlertStorage('QUC.init()');

      this.bIsControlPage = false;
      this.bHasHandlers   = false;
      this.bLogEvent      = this.bLogEvent || (rParams.bLogEvent || false);
      this.bLog           = this.bLog || (rParams.bLog || false);
      this.nextTestPlan   = rParams.nextTestPlan || false;

      this.initBrowser();
      this.getBrowser();

      this.storage    = rParams.storage || this.storage;
      this.skey       = rParams.skey || this.skey;
      this.jqInjectAt = rParams.jqInjectAt || this.jqInjectAt;
      this.sskey      = this.skey + 'Settings';
      this.hskey      = this.skey + 'History';

      this.Properties    = this.getProperties();
      this.History       = this.getHistory();
      this.bPause        = this.getProperty('bPause') || (rParams.bPause || false);
      this.bAlertStorage = this.getProperty('bAlertStorage') || (Plan.bAlertStorage || false);
      this.maybeAlertStorage('QUC.init() - getProperties()');

      // If control page flag is set, initialize the control page when document is ready.
      if (rParams.bControl) {
         this.bIsControlPage = true;
         if (this.getProperty('bFollowChain')) {
            this.saveJSCoverage();
         }
         jQuery('document').ready(function () {
            QUnitChainer.initControlPage(this.jqInjectAt);
         });
      }
      // When QUnit exists initialise testing data and install the handlers,
      // unless the control mode flag is turned on.
      if (!this.bIsControlPage && window.QUnit) {
         this.initTests();
         this.showFixture(this.getProperty('bShowFixture'));
         this.installQUnitHandlers();
      }

      this.trace('leaving QUC.init() - this.Properties ' + JSON.stringify(this.Properties));
   },

   /*
    * QUnitChainer.reset()
    *
    * Reset property state after a test suite
    */
   reset: function () {
      this.bAlertStorage = false;
      this.bPause = false;
      this.bLog = false;
   },

   /*
    * QUnitChainer.browserIsIE()
    *
    * Check if browser is IE
    */
   browserIsIE: function () {
      if (typeof this.bIsIE === 'undefined') {
         this.initBrowser();
      }
      return this.bIsIE;
   },

   /*
    * QUnitChainer.browserIsFF()
    *
    * Check if browser is Firefox
    */
   browserIsFF: function () {
      if (typeof this.bIsFF === 'undefined') {
         this.initBrowser();
      }
      return this.bIsFF;
   },


   /*
    * QUnitChainer.getBrowser()
    *
    * Initialise the browser detection properties.
    * Needed because jasmine testing framework is very strange in the order it executes
    * beforeEach(), and it() functions
    */

    getBrowser: function() {
      var browser,
        ua = navigator.userAgent;
      switch(true) {
        case !!(browser = ua.match(/msie\s\d+/i)):
            browser[0] = browser[0].replace(' ', '/');
        break;
        case !!(browser = ua.match(/chrome\/\d{3}/i)):
          browser[0] = browser[0].replace(/chrome/i, 'canary');
        break;
        case !!(browser = ua.match(/chrome\/\d{2}\./i)):
          browser[0] = browser[0].slice(0, -1);
        break;
        case !!(browser = ua.match(/safari\/\d+/i)):
        break;
        case !!(browser = ua.match(/opera\/\d+/i)):
        break;
        case !!(browser = ua.match(/firefox\/\d+/i)):
        break;
        default:
          browser = 'unknown/0';
        break;
      }
      browser = browser[0].split('/');
      this.browser = {name: browser[0].toLowerCase(), version: browser[1]};

      return this.browser;
    },

   /*
    * QUnitChainer.initBrowser()
    *
    * Initialise the browser detection properties.
    * Needed because jasmine testing framework is very strange in the order it executes
    * beforeEach(), and it() functions
    */
   initBrowser: function () {
      // Thanks for browser detection at http://github.com/ded/browser
      var ua = navigator.userAgent;
      this.bIsIE = /msie/i.test(ua);
      //      chrome = /chrome/i.test(ua),
      //      safari = /safari/i.test(ua) && !chrome,
      //      opera = /opera/i.test(ua),
      this.bIsFF = /firefox/i.test(ua);
      //      gecko = /gecko\//i.test(ua);
   },

   /*
    * QUnitChainer.showFixture(bShowFixture)
    *
    * Show the qunit-fixture div so that you can see what is happening
    * during tests which manipulate the DOM
    *
    * bShowFixture - false hides the fixture, true shows it. defaults to true
    */
   showFixture: function (bShowFixture) {
      bShowFixture = bShowFixture === undefined ? true : bShowFixture;
      if (bShowFixture) {
         jQuery('#qunit-fixture').css('position', 'relative').css('top', 0).css('left', 0);
      } else {
         jQuery('#qunit-fixture').css('position', 'absolute').css('top', -10000).css('left', -10000);
      }
   },

   /*
    * QUnitChainer.getDefaultProperties()
    *
    * Retrieve the default values to use for the object Properties
    */
   getDefaultProperties: function () {
      this.trace('QUC.getDefaultProperties() - this.Properties ' + JSON.stringify(this.Properties));
      var rProperties = {
         bFollowChain:   false,  // flag set to follow the chain to the next test plan in the sequence
         bAutoRun:       false,  // flag set to cause the control page to automatically run the tests every 15 seconds
         bPause:         false,  // flag set to pause with an alert message after test plan execution
         bLog:           false,  // flag set to log results to the console log
         bDumpStorage:   false,  // flag set to dump the QUnitChainer storage on the control page output
         bAlertStorage:  false,  // flag set to alert with browser storage values for debugging
         bShowPassed:    false,  // flag set to show the test plans which have passed. Usually hidden.
         bShowFailTitle: false,  // flag set to show FAIL in the title instead of unicode check/cross marks
         bShowFixture:   false,  // flag set to show the qunit-fixture DIV in test plans
         '-': '-'
      };
      delete (rProperties['-']);
      return rProperties;
   },

   /*
    * QUnitChainer.initTests()
    *
    * Initialize the Tests data for the object
    */
   initTests: function () {
      this.Tests = {
         plan:      '',         // URL of test plan
         userAgent: '',         // browser user agent
         header:    '',         // test plan header name
         module:    '',         // current module being tested
         test:      '',         // current test name
         failed:    0,          // total failed tests
         passed:    0,          // total passed tests
         total:     0,          // total tests run

         log:       {}  // log of all QUnit events keyed by user agent and test plan URL
      };
      this.moduleIdx = -1;      // Index value for module currently being tested
      this.testIdx   = -1;      // Index value for test currently being tested
   },

   /*
    * QUnitChainer.initControlPage()
    *
    * Initialise the object when it is being used as the test control page.
    * jqInjectAt - optional jquery selector string identifying where to inject the content. Defaults to 'body' to wipe all the page content.
    */
   initControlPage: function (jqInjectAt) {
      this.trace('QUC.initControlPage(' + jqInjectAt + ')');
      jqInjectAt = jqInjectAt || this.jqInjectAt;
      this.bIsControlPage = true;
      this.showControlPage(jqInjectAt);
      this.bindUIEvents();
      this.installAutoRun();
   },

   /*
    * QUnitChainer.installQUnitHandlers()
    *
    * Install the QUnit handlers for intercepting events:
    * We implement begin, done, moduleStart, moduleDone, and testStart.
    * NOT - log, testDone, reset
    */
   installQUnitHandlers: function () {
      var idx, key;
      window.QUnit = window.QUnit || {};

      for (idx = 0; idx < this.QUnitHandlers.length; ++idx) {
         key = this.QUnitHandlers[idx];
         QUnit[key] = QUnitChainer[key];
      }

      this.bHasHandlers = true;
   },

   /*
    * QUnitChainer.getStorage()
    *
    * Get a storage object if supported by the browser.
    */
   getStorage: function () {
      var rStorage;
      try {
         // firefox on local file gives an error.
         rStorage = window[this.storage];
      } catch (exception) {
         rStorage = null;
      }
      return rStorage;
   },

   /*
    * QUnitChainer.fetchItem(key, bJSON)
    *
    * Get an item from browser storage.
    * key - the key name under which to look for the item
    * bJSON - flag if true will treat the value as JSON and decode it to an object
    */
   fetchItem: function (key, bJSON) {
      var value, rStorage = this.getStorage();
      if (rStorage) {
         try {
            value = rStorage.getItem(key);
            if (bJSON && typeof value === 'string') {
               value = JSON.parse(value);
            }
         } catch (exception) {
            value = undefined;
         }
      }
      return value;
   },

   /*
    * QUnitChainer.storeItem(key, value, bJSON)
    *
    * Save an item to browser storage
    * key - the key name under which to store the item
    * value - the value to store
    * bJSON - flag if true will convert the value into a JSON string before storage
    */
   storeItem: function (key, value, bJSON) {
      var rStorage = this.getStorage();
      if (rStorage) {
         try {
            value = bJSON ? JSON.stringify(value) : value;
            rStorage.setItem(key, value);
         } catch (exception) {
            rStorage = null;
         }
      }
      return rStorage;
   },

   /*
    * QUnitChainer.removeItem(key)
    *
    * Remove an item from browser storage
    * key - the key name of the item to remove
    */
   removeItem: function (key) {
      var rStorage = this.getStorage();
      if (rStorage) {
         try {
            rStorage.removeItem(key);
         } catch (exception) {
            rStorage = null;
         }
      }
      return rStorage;
   },

   /*
    * QUnitChainer.checkStorage()
    *
    * Check that the browser or the way the page is loaded in the browser enables the use of Storage.
    * Note, some browsers don't allow storage when you load a page in from a file on disk or from localhost.
    * You might have to run your test plans from within a web server with a domain.
    */
   checkStorage: function () {
      var get, bCheck = false,
         key = "QUnitChainerCheckStorageWorks",
         value = "ExistenceExistsButDoesStorage?";

      this.storeItem(key, value);
      get = this.fetchItem(key);
      this.removeItem(key);
      bCheck = (get === value) ? true : false;
      this.trace('QUC.checkStorage() - ' + bCheck);
      return bCheck;
   },

   /*
    * QUnitChainer.getProperty(key)
    * Retrieve the value of a Property
    */
   getProperty: function (key) {
      this.trace('QUC.getProperty(' + key + ') - this.Properties ' + JSON.stringify(this.Properties));
      return this.Properties[key];
   },

   /*
    * QUnitChainer.setProperty(key, value)
    * Set the value of a Property
    */
   setProperty: function (key, value) {
      this.Properties[key] = value;
      if (typeof this[key] !== 'undefined') {
         this[key] = value;
      }
      this.trace('QUC.setProperty(' + key + ', ' + value + ') - this.Properties ' + JSON.stringify(this.Properties));
   },

   /*
    * QUnitChainer.clearProperties()
    *
    * Clear the properties in storage under the QUnitChainerSettings key value
    */
   clearProperties: function () {
      this.trace('QUC.clearProperties(in ' + this.sskey + ') - this.Properties ' + JSON.stringify(this.Properties));
      this.removeItem(this.sskey);
      this.Properties = this.getDefaultProperties();
   },

   /*
    * QUnitChainer.clearStorage()
    *
    * Clear Properties and Test Results from storage
    */
   clearStorage: function () {
      this.clearProperties();
      this.clearTestResults();
   },

   /*
    * QUnitChainer.clearAllStorage()
    *
    * Delete all items from storage, not just those added by QUnitChainer
    */
   clearAllStorage: function () {
      var rStorage = this.getStorage();
      this.maybeAlertStorage('QUC.clearAllStorage()');
      this.clearStorage();
      if (rStorage) {
         rStorage.clear();
      }
   },

   /*
    * QUnitChainer.getAllStorage()
    *
    * Get all items from storage. In effect it makes a backup of storage.
    */
   getAllStorage: function () {
      var idx, key, rAllStorage = {}, rStorage = this.getStorage();
      if (rStorage) {
         for (idx = 0; idx < rStorage.length; idx++) {
            key = rStorage.key(idx);
            rAllStorage[key] = this.fetchItem(key);
         }
      }
      return rAllStorage;
   },

   /*
    * QUnitChainer.saveToStorage(rObj)
    *
    * Save object to  storage. Each key of the object is used as a key in storage..
    */
   saveToStorage: function (rObj) {
      var key, rStorage = this.getStorage();
      if (rStorage) {
         for (key in rObj) {
            if (rObj.hasOwnProperty(key)) {
               rStorage.setItem(key, rObj[key]);
            }
         }
      }
   },

   /*
    * QUnitChainer.storeProperties()
    *
    * Store the QUnitChainer.Properties data in storage under the QUnitChainerSettings key value.
    */
   storeProperties: function () {
      this.trace('QUC.storeProperties(to ' + this.sskey + ') - this.Properties ' + JSON.stringify(this.Properties));
      this.storeItem(this.sskey, this.Properties, 'JSON');
   },

   /*
    * QUnitChainer.getProperties()
    *
    * Retrieve storage data from the QUnitChainerSettings key value and return as an object.
    */
   getProperties: function () {
      var rProperties = null;
      this.trace('QUC.getProperties(from ' + this.sskey + ')');

      // Get settings from storage QUnitChainerSettings key
      rProperties = this.fetchItem(this.sskey, 'JSON');
      this.trace('fetched QUC.getProperties(from ' + this.sskey + ') - rProperties ' + JSON.stringify(rProperties));
      if (!rProperties) {
         rProperties = this.getDefaultProperties();
      }
      this.trace('leaving QUC.getProperties(from ' + this.sskey + ') - this.Properties ' + JSON.stringify(this.Properties) + ' rProperties ' + JSON.stringify(rProperties));
      return rProperties;
   },

   /*
    * QUnitChainer.clearTestResults()
    *
    * Clear the test results under the QUnitChainer key from storage
    */
   clearTestResults: function () {
      this.removeItem(this.skey);
   },

   /*
    * QUnitChainer.storeTestResults(rTestResults)
    *
    * Save an object (Test Run Results) to storage under the QUnitChainer key value
    */
   storeTestResults: function (rTestResults) {
      this.storeItem(this.skey, rTestResults, 'JSON');
   },

   /*
    * QUnitChainer.getTestResults()
    *
    * Retrieve storage data from the QUnitChainer key value and return as an object (Test Run Results).
    */
   getTestResults: function () {
      // Get test results from storage QUnitChainer/user agent/test plan name
      var rTestResults = this.fetchItem(this.skey, 'JSON');
      if (!rTestResults) {
         rTestResults = {};
      }
      return rTestResults;
   },

   /*
    * QUnitChainer.clearHistory()
    *
    * Clear the history of test plans typed into the edit box from storage
    */
   clearHistory: function () {
      this.removeItem(this.hskey);
   },

   /*
    * QUnitChainer.storeHistory(raHistory)
    *
    * Save the history of test plans typed into the edit box to storage
    *
    * raHistory - optional sorted unique list of test plans which have been
    *    typed into the edit box. Default is QUnitChainer.History
    */
   storeHistory: function (raHistory) {
      raHistory = raHistory || this.History;
      this.storeItem(this.hskey, { history: raHistory }, 'JSON');
   },

   /*
    * QUnitChainer.getHistory()
    *
    * Retrieve history of test plans from storage data from the QUnitChainer key value
    */
   getHistory: function () {
      var rHistory = this.fetchItem(this.hskey, 'JSON');
      if (!rHistory) {
         rHistory= [];
      } else {
         rHistory = rHistory.history || [];
      }
      return rHistory;
   },

   /*
    * QUnitChainer.addHistory(testplan)
    *
    * Add an item to the history of test plans (does not save to storage)
    * Items in history will be sorted and unique
    */
   addHistory: function (testplan) {
      var idx;
      for (idx = 0; idx < this.History.length; ++idx) {
         if (testplan === this.History[idx]) {
            return;
         }
      }
      this.History.push(testplan);
      this.History = this.History.sort();
   },

   /*
    * QUnit.begin() handler
    * is called once before running any tests.
    *
    * when QUnit tests begin, save the href of the test plan and update the page title
    *
    * (a better would've been QUnit.start, but thats already in use elsewhere and can't be changed.)
    */
   begin: function () {
      var self = QUnitChainer;
      self.logEvent({ 'in': "QUC - QUnit.begin()" });

      self.Tests.plan      = document.location.href;
      self.Tests.header    = jQuery('#qunit-header').text();

      self.Tests.userAgent = jQuery('#qunit-userAgent').text();

      document.title = self.Tests.header

      self.trace({ 'in': 'QUC.begin()', 'self.Tests': self.Tests});
   },

   /*
    * QUnit.done({ failed, passed, total, runtime }) handler
    * is called whenever all the tests have finished running.
    *
    *  failed is the number of failures that occurred.
    *  total is the total number of assertions that occurred,
    *  passed the passing assertions.
    *  runtime is the time in milliseconds to run the tests from start to finish.
    *
    * when QUnit testing is done, save test plan results to storage and possibly chain to the next test plan.
    *
    * caller can define these callback functions in the QUnitChainer namespace:
    *
    * QUnitChainer.cleanUserAgent(userAgent) - clean up the user agent string before using it as a key when saving to storage
    * QUnitChainer.cleanTestPlan(plan) - clean up the test plan URL before using it as a key when saving to storage
    */
   done: function (result) {
      var userAgent, testPlan, rTestStorage, rJQ, self = QUnitChainer;
      self.logEvent({ 'in': "QUC - QUnit.done()", 'result': result});

      delete self.Tests.module;
      delete self.Tests.test;
      self.trace({ 'in': 'QUC.done()', 'self.Tests': self.Tests});

      if (!self.Tests.plan.match(/(\?|%3F)(filter|spec)=/i)) {
         // Only save test results to storage if running entire test plan
         // Running a single test case puts ?filter= in the URL (?spec= for jasmine)
         rJQ = jQuery('#qunit-userAgent');
         self.Tests.userAgent = rJQ.length ? rJQ.text() : navigator.userAgent;
         userAgent = (self.cleanUserAgent && self.cleanUserAgent(self.Tests.userAgent)) || self.Tests.userAgent;
         testPlan = document.location.href.replace(/\?.*$/, '');
         testPlan = (self.cleanTestPlan && self.cleanTestPlan(testPlan)) || testPlan;
         self.maybeAlertStorage('QUC - QUnit.done() - get test results');
         rTestStorage = self.getTestResults();

         if (typeof rTestStorage[userAgent] === 'undefined') {
            rTestStorage[userAgent] = {};
         }
         rTestStorage[userAgent][testPlan] = self.Tests;
         self.storeTestResults(rTestStorage);
         self.maybeAlertStorage('QUC - QUnit.done() - store test results');

         // Chain to next test plan if flag is set and next test plan is defined
         if (self.getProperty('bFollowChain') && self.nextTestPlan) {
            self.logEvent({ 'in': 'QUC.done()', 'nextTestPlan': self.nextTestPlan });
            if (self.bPause) {
               self.myAlert("Tests finished, chaining to " + self.nextTestPlan + "\nfrom " + self.getLocation());
            }
            self.maybeAlertStorage('QUC - QUnit.done() - chain');
            self.setLocation(self.nextTestPlan);
         } else if (self.getProperty('bFollowChain')) {
            if (self.bPause) {
               self.myAlert("All test plans finished, showing results.");
            }
            self.setProperty('bFollowChain', false);
            self.storeProperties();
            self.maybeAlertStorage('QUC - QUnit.done() - store properties for results page');
            self.wipeQUnitOutput(self.jqInjectAt);
            self.showControlPage(self.jqInjectAt);
         }
      }
      parent.window.FT.socket.emit('results', {browser: self.browser, result: result});
   },

   /*
    * QUnit.moduleStart({ name }) handler
    * is called whenever a new module of tests starts running.
    *
    * name is the string name of the module.
    */
   moduleStart: function (my) {
      var self = QUnitChainer;
      self.logEvent({ 'in': "QUC - QUnit.moduleStart()", 'my': my});

      self.moduleIdx++;
      self.testIdx = -1;
      self.Tests.module = my.name;
   },

   /*
    * QUnit.moduleDone({ name, failed, passed, total }) handler
    * is called whenever a module finishes running.
    *
    * name is the string name of the module.
    * failed is the number of module failures that occurred.
    * total is the total number of module assertions that occurred.
    * Passed is the number of module assertions that passed.
    */
   moduleDone: function (result) {
      var self = QUnitChainer;
      self.logEvent({ 'in': "QUC - QUnit.moduleDone()", 'result': result});

      // Add the pass/fail/total counts to the record for storage
      self.Tests.failed += result.failed;
      self.Tests.passed += result.passed;
      self.Tests.total  += result.total;
   },

   /*
    * QUnit.testStart({ name }) handler
    * is called whenever a new test batch of assertions starts running.
    *
    * name is the string name of the test batch.
    */
   testStart: function (my) {
      var self = QUnitChainer;
      self.logEvent({ 'in': "QUC - QUnit.testStart()", 'my': my});

      if (!self.Tests.module) {
         // Test plan has no call to module() inject one with a default module name
         self.logEvent({ 'in': "QUC - QUnit.testStart()", 'message': "QUnit test plan has no call to module(Plan.title), adding a QUnit.testDone() handler" });
         self.moduleStart({ 'name': self.noModuleName });
         // And install a QUnit.testDone handler so we can track tests ourself
         QUnit.testDone = QUnitChainer.testDone;
      }

      self.Tests.test = my.name;
      self.testIdx++;
   },

   /*
    * QUnit.testDone({ name, failed, passed, total }) handler
    *
    * name is the string name of the test batch
    * failed is the number of tests which failed
    * passed is the number of tests which passed
    * total is the number of tests run in this batch
    */
   testDone: function (result) {
      var self = QUnitChainer;
      self.logEvent({ 'in': "QUC - QUnit.testDone()", 'result': result});

      // We only are concerned with testDone calls if module() has not been
      // called and we have assumed a module name.
      if (self.Tests.module === self.noModuleName) {
         // Add the pass/fail/total counts to the record for storage
         self.Tests.failed += result.failed;
         self.Tests.passed += result.passed;
         self.Tests.total  += result.total;
      }
   },

   /*
    * QUnitChainer.injectControlPage(jqInjectAt)
    *
    * Inject the DOM structure of the QUnitController control page into the DOM but only if it cannot already find them in the document
    *
    * jqInjectAt - optional jquery selector string identifying where to inject the content. Defaults to 'body' to wipe all the page content.
    */
   injectControlPage: function (jqInjectAt) {
      jqInjectAt = jqInjectAt || 'body';
      var html, title = 'QUnitChainer Control Page', refresh = Math.floor(this.autoRunInterval / 100) / 10.0;
      if (this.Plan.title) {
         title = this.Plan.title;
      }
      if (jQuery('#qunit-header').length === 0) {
         html = [
            '<form id="chainerControl" name="chainerControl" action="#" method="post" autocomplete="on">',
            '<h1 id="qunit-header">' + title + '</h1>',
            '<h2 id="qunit-banner"></h2>',
            '<div id="qunit-testrunner-toolbar">',
            '<input type="text" id="testPlan" name="testPlan" size="40">',
            // TODO want this button to be a submit so that autocomplete
            // works. but then the test plan is interrupted when we simulate the onclick
            // and had trouble preventing the submit with a .submit handler.
            // Figure it out some time.
            '<input type="button" id="runTests" name="runTests" value="run tests">',
            '<input type="checkbox" id="bAutoRun" name="bAutoRun">',
            '<label for="bAutoRun">auto run</label>',
            '<span id="autoRunInterval">' + refresh + ' sec</span>',
            '<input type="checkbox" id="bLog" name="bLog">',
            '<label for="bLog">logging</label>',
            '<input type="checkbox" id="bPause" name="bPause">',
            '<label for="bPause">pause</label>',
            '<input type="button" id="clearTests" name="clearTests" value="clear tests">',
            '<input type="checkbox" id="bDumpStorage" name="bDumpStorage">',
            '<label for="bDumpStorage">dump</label>',
            '<input type="checkbox" id="bAlertStorage" name="bAlertStorage">',
            '<label for="bAlertStorage">alert</label>',
            '<input type="button" id="clearStorage" name="clearStorage" value="clear storage">',
            'show',
            '<input type="checkbox" id="bShowPassed" name="bShowPassed">',
            '<label for="bShowPassed">passed</label>',
            '<input type="checkbox" id="bShowFixture" name="bShowFixture">',
            '<label for="bShowFixture">#qunit-fixture</label>',
            '<input type="checkbox" id="bShowFailTitle" name="bShowFailTitle">',
            '<label for="bShowFailTitle">FAIL in title</label>',
            '</div>',
            '</form>',
            '<h2 id="qunit-userAgent"></h2>',
            '<p id="qunit-testresult" class="result"></p>',
            '<div id="qunit-fixture">If you can see this then the #qunit-fixture DIV in your test plans will be visible.</div>',
            '<ol id="qunit-tests">',
            '</ol>',
            '<div id="qunitchainer-dump"></div>',
            ''
         ].join("\n");
         jQuery(jqInjectAt).html(html);
      }
   },

   /*
    * QUnitChainer.updateControlFields(testPlan)
    *
    * Update the form fields on the control page (checkboxes and text) from the object properties
    */
   updateControlFields: function (testPlan) {
      var idx;
      jQuery('#testPlan')[0].value = testPlan || this.nextTestPlan || '';
      for (idx = 0; idx < this.UICheckBoxes.length; ++idx) {
         jQuery('#' + this.UICheckBoxes[idx])[0].checked = this.Properties[this.UICheckBoxes[idx]];
      }
   },

   /*
    * QUnitChainer.wipeQUnitOutput()
    *
    * Wipe the page content prior to showing the control page.
    *
    * jqInjectAt - optional jquery selector string identifying where the control page is located in the DOM. Defaults to 'body' to wipe all the page content.
    */
   wipeQUnitOutput: function (jqInjectAt) {
      jqInjectAt = jqInjectAt || 'body';
      jQuery(jqInjectAt).html('');
   },

   /*
    * QUnitChainer.showControlPage(jqInjectAt)
    *
    * Show the QUnitController control page (injects into the DOM if needed
    *
    * jqInjectAt - optional jquery selector string identifying where the control page is located in the DOM. Defaults to 'body' to wipe all the page content.
    *
    * Side effect is to clear the bFollowChain Property and save it to storage so that if the user clicks on a test plan
    * URL then only that test plan will run instead of the entire chain of them.
    */
   showControlPage: function (jqInjectAt) {
      this.injectControlPage(jqInjectAt);
      document.title = jQuery('#qunit-header').html();

      // Prevent test plans from following following the chain when clicked from the control page.
      this.setProperty('bFollowChain', false);
      this.storeProperties();
      this.maybeAlertStorage('QUC.showControlPage() - store properties for control page');
      this.renderPage();
   },

   /*
    * QUnitChainer.renderPage()
    *
    * Render the control page by showing the test summary and storage
    *
    */
   renderPage: function () {
      this.showTestSummary();
      this.dumpStorage();
      this.updateControlFields();
   },

   /*
    * QUnitChainer.stringifyObj(obj)
    *
    * Format a Javascript object as a JSON string with line breaks to make it more readable.
    * We insert a newline around braces, square brackets, commas and add a space after the colon.
    * it's not perfect but it does the trick
    */
   stringifyObj: function (obj) {
      var str = JSON.stringify(obj);
      str = str.replace(/\{/g, '<br/>{<br/>   ');
      str = str.replace(/\[/g, '<br/>[<br/>   ');
      str = str.replace(/\}/g, '<br/>}<br/>');
      str = str.replace(/\]/g, '<br/>]<br/>');
      str = str.replace(/,/g, ',<br/>   ');
      str = str.replace(/":/g, '": ');
      str = str.replace(/^\s+/, '');
      str = str.replace(/\s+$/, '');
      return str;
   },

   /*
    * QUnitChainer.debugStorage(msg, maxlength)
    *
    * Format a string containing debugging information about storage.
    *
    * msg - a message to include with the formatted output
    * maxlength - maximum number of characters to show from the value of each keyed storage item
    */
   debugStorage: function (msg, maxlength) {
      maxlength = maxlength || 128;
      var idx, key, value, Keys = []; Msg = [ msg, window.location.protocol + '//' + window.location.host ],
         rStorage = this.getStorage(), rAllStorage = this.getAllStorage();
      if (rStorage) {
         Msg.push(this.storage);
         Msg.push('length: ' + rStorage.length);
         for (idx = 0; idx < rStorage.length; idx++) {
            Keys.push(rStorage.key(idx));
         }
         Keys = Keys.sort();
         for (idx = 0; idx < Keys.length; ++idx) {
            key = Keys[idx];
            value = rAllStorage[key];
            if (value.length > maxlength) {
               value = "\n      " + value.substr(0, maxlength) + '...';
            }
            Msg.push('   ' + idx + ': ' + key + ': ' + value);
         }
      } else {
         Msg.push(this.storage + " not supported");
      }
      return Msg.join("\n");
   },

   /*
    * QUnitChainer.maybeAlertStorage(msg)
    *
    * Put up an alert showing current storage contents.
    *  msg - a message to display with the debug alert
    */
   maybeAlertStorage: function (msg) {
      if (this.bAlertStorage) {
         // We call alert like this so JSLint won't report it as an error
         // That way unexpected debugging alert's will be caught by JSLint
         this.myAlert(this.debugStorage(msg));
      }
   },

   /*
    * QUnitChainer.myAlert(msg)
    *
    * My own alert function so that testing will work.
    *
    */
   myAlert: function (msg) {
      // We call alert like this so JSLint won't report it as an error
      // That way unexpected debugging alert's will be caught by JSLint
      var alert = 'alert';
      //console.log('ALERT(' + msg + ')'); // TODO
      window[alert](msg);
   },

   /*
    * QUnitChainer.dumpStorage()
    *
    * Show the Properties and Test Summary Results which are saved in storage in a JSON dump for debugging.
    * They will be displayed within the DIV with ID qunitchainer-dump
    */
   dumpStorage: function () {
      var rTestResults, raHistory, dump = '';
      if (this.getProperty('bDumpStorage')) {
         rTestResults = this.getTestResults();
         raHistory = this.getHistory();
         dump = [
            '<hr><b>' + this.storage + '[' + this.sskey + ']</b>',
            '<pre>' + this.stringifyObj(this.Properties) + '</pre>',
            '<b>' + this.storage + '[' + this.hskey + ']</b>',
            '<pre>' + this.stringifyObj(raHistory) + '</pre>',
            '<b>' + this.storage + '[' + this.skey + ']</b>',
            '<pre>' + this.stringifyObj(rTestResults) + '</pre>'
         ].join('');
      }
      jQuery('#qunitchainer-dump').html(dump);
   },

   /*
    * QUnitChainer.pushArray()
    *
    * Push all the elements of an array onto another array
    */
   pushArray: function (rArray, rElements) {
      var idx;
      for (idx = 0; idx < rElements.length; ++idx) {
         rArray.push(rElements[idx]);
      }
   },

   /*
    * QUnitChainer.showTestSummary()
    *
    * Render the summary of test results on the page within the OL with ID qunit-tests
    * Also update the pass/fail class status of the H2 with ID qunit-banner
    */
   showTestSummary: function () {
      var passed = 0, failed = 0, userAgent = '', planURL = '', rTestPlan, moduleStatus, planName, Content = [], ModuleContent,
         userAgentStatus, overallStatus = 'qunit-pass',
         rTestResults = this.getTestResults();
      this.maybeAlertStorage('QUC.showTestSummary()');

      for (userAgent in rTestResults) {
         if (rTestResults.hasOwnProperty(userAgent)) {
            userAgentStatus = 'pass';
            ModuleContent = [];
            for (planURL in rTestResults[userAgent]) {
               if (rTestResults[userAgent].hasOwnProperty(planURL)) {
                  rTestPlan = rTestResults[userAgent][planURL];
                  moduleStatus = (rTestPlan.failed || (rTestPlan.total === 0)) ? 'fail' : 'pass';
                  if (moduleStatus === 'fail') {
                     ++failed;
                     userAgentStatus = 'fail';
                     overallStatus = 'qunit-fail';
                     this.setControlPageTestStatus(overallStatus);
                  } else {
                     ++passed;
                  }

                  // jsLint says this is insecure, but it isn't
                  planName = this.getLocation(planURL).replace(/^.+\//, '');
                  planName = planName.replace(/\/\/+/g, '/');

                  ModuleContent.push('<li class ="' + moduleStatus + '">\n<span class="test-message">' + rTestPlan.header + '</span> <b class="counts">(<b class="failed">' + rTestPlan.failed + '</b>, <b class="passed">' + rTestPlan.passed + '</b>, ' + rTestPlan.total + ')</b><a href="' + this.addRandomParam(planURL) + '">' +  planName + '</a></li>\n');
               }
            }
            Content.push('<li class="' + userAgentStatus + '">\n<strong><span class="module-name">' + userAgent + '</span></strong>\n<ol>');
            this.pushArray(Content, ModuleContent);
            Content.push('</ol>\n</li>\n');
         }
      }

      // Output a qunit-testresult div with passes and fails
      this.testPasses = passed;
      this.testFailures = failed;
      jQuery('#qunit-testresult').html(failed + " failing test plan, " + passed + " passing test plan");

      if (Content.length === 0) {
         overallStatus = 'qunit-fail';
         Content.push('<li class="fail">\n<strong><span class="module-name">No test runs are stored in ' + this.storage + '[' +  this.skey + '] use the run tests button to run some test plans.</span></strong>\n</li>');
      }
      this.setControlPageTestStatus(overallStatus);
      jQuery('#qunit-tests').html(Content.join("\n"));
      this.showHidePassedTests();
   },

   /*
    * QUnitChainer.showHidePassedTests()
    *
    * Set the hidepass class on the #qunit-tests element based on the bShowPassed property
    */
   showHidePassedTests: function () {
      if (this.getProperty('bShowPassed')) {
         jQuery('#qunit-tests').removeClass('hidepass');
      } else {
         jQuery('#qunit-tests').addClass('hidepass');
      }
   },

   /*
    * QUnitChainer.setControlPageTestStatus()
    *
    * Set the status banner and title to indicate the test plan has passed/failed
    * Use a unicode character for checkmark or cross to indicate pass/fail
    */
   setControlPageTestStatus: function (status) {
      var prefix, number = 1, rBanner = jQuery('#qunit-banner'), title = jQuery('#qunit-header').html();
      if (this.Plan.title) {
         title = this.Plan.title;
      }
      // Use last status if undefined, and save status in object
      status = status || this.testStatus;
      this.testStatus = status;
      if (status === 'qunit-pass') {
         number = this.testPasses;
         rBanner.removeClass('qunit-fail');
         rBanner.addClass(status);
         // Older OS (Win2000) won't show unicode check mark so we use PASS / FAIL
         prefix = this.getProperty('bShowFailTitle') ? 'PASS' : '\u2714';
      } else {
         number = this.testFailures;
         rBanner.removeClass('qunit-pass');
         rBanner.addClass(status);
         prefix = this.getProperty('bShowFailTitle') ? 'FAIL' : '\u2716';
      }
      document.title = prefix + ' ' + number + ' - ' + title;
      jQuery('#qunit-header').html(title);
   },

   /*
    * QUnitChainer.bindUIEvents(rObj)
    *
    * Bind events to form elements so that the Control Page User Interface will function
    */
   bindUIEvents: function (rObj) {
      rObj = rObj || this;
      jQuery('#bPause').change(function () { rObj.clickPause(); });
      jQuery('#bLog').change(function () { rObj.clickLog(); });
      jQuery('#bAutoRun').change(function () { rObj.clickAutoRun(); });
      jQuery('#bDumpStorage').change(function () { rObj.clickDumpStorage(); });
      jQuery('#bAlertStorage').change(function () { rObj.clickAlertStorage(); });
      jQuery('#bShowPassed').change(function () { rObj.clickShowPassed(); });
      jQuery('#bShowFixture').change(function () { rObj.clickShowFixture(); });
      jQuery('#bShowFailTitle').change(function () { rObj.clickShowFailTitle(); });
      jQuery('#runTests').click(function () { rObj.clickRunTests(); });
      jQuery('#clearTests').click(function () { rObj.clickClearTests(); });
      jQuery('#clearStorage').click(function () { rObj.clickClearStorage(); });

      // TODO need to handle more cases: paste, blur, keyup, etc...
      jQuery('#testPlan').change(function () { rObj.changeTestPlan(); });
   },

   /*
    * QUnitChainer.clickLog(event)
    * jQuery Event handler for when the Logging checkbox is clicked.
    * Change the value in Storage
    */
   clickLog: function (event) {
      var checked = jQuery('#bLog')[0].checked;
      this.logEvent('QUC.clickLog(' + JSON.stringify(event) + ') ' + checked);
      this.setProperty('bLog', checked);
      this.storeProperties();
      this.maybeAlertStorage('QUC.clickLog()');
      this.dumpStorage();
   },

   /*
    * QUnitChainer.clickDumpStorage(event)
    * jQuery Event handler for when the Dump Storage checkbox is clicked.
    * Change the value in Storage
    */
   clickDumpStorage: function (event) {
      var checked = jQuery('#bDumpStorage')[0].checked;
      this.logEvent('QUC.clickDumpStorage(' + JSON.stringify(event) + ') ' + checked);
      this.setProperty('bDumpStorage', checked);
      this.storeProperties();
      this.maybeAlertStorage('QUC.clickDumpStorage()');
      this.dumpStorage();
   },

   /*
    * QUnitChainer.clickAlertStorage(event)
    * jQuery Event handler for when the Alert Storage checkbox is clicked.
    * Change the value in Storage
    */
   clickAlertStorage: function (event) {
      var checked = jQuery('#bAlertStorage')[0].checked;
      this.logEvent('QUC.clickAlertStorage(' + JSON.stringify(event) + ') ' + checked);
      this.setProperty('bAlertStorage', checked);
      this.storeProperties();
      this.dumpStorage();
   },

   /*
    * QUnitChainer.clickPause(event)
    *
    * jQuery Event handler for when the Pause checkbox is clicked.
    * We get the event before the state of the checkbox is changed.
    * Change the value in Storage and clear the Auto Run flag if Pause is being set.
    */
   clickPause: function (event) {
      var checked = jQuery('#bPause')[0].checked;
      this.logEvent('QUC.clickPause(' + JSON.stringify(event) + ') ' + checked);
      if (checked) {
         // Need to turn off the auto-run if pause will be turned on
         this.setProperty('bAutoRun', false);
         jQuery('#bAutoRun')[0].checked = false;
      }
      this.setProperty('bPause', checked);
      this.storeProperties();
      this.maybeAlertStorage('QUC.clickPause()');
      this.dumpStorage();
   },

   /*
    * QUnitChainer.clickAutoRun(event)
    *
    * jQuery Event handler for when the AutoRun checkbox is clicked.
    * We get the event before the state of the checkbox is changed.
    * Change the value in Storage and clear the Pause flag if AutoRun is being set.
    */
   clickAutoRun: function (event) {
      var checked = jQuery('#bAutoRun')[0].checked;
      this.logEvent('QUC.clickAutoRun(' + JSON.stringify(event) + ') ' + checked);
      if (checked) {
         // Need to turn off the pause if auto-run will be turned on
         this.setProperty('bPause', false);
         jQuery('#bPause')[0].checked = false;
      }
      this.setProperty('bAutoRun', checked);
      this.storeProperties();
      this.maybeAlertStorage('QUC.clickAutoRun()');
      this.dumpStorage();
   },

   /*
    * QUnitChainer.clickClearTests(event)
    *
    * jQuery Event handler for when the Clear Tests button is clicked.
    * Test Summary data is cleared and the page is rerendered
    */
   clickClearTests: function (event) {
      this.logEvent('QUC.clickClearTests(' + JSON.stringify(event) + ')');
      this.maybeAlertStorage('QUC.clickClearTests()');
      this.clearTestResults();
      this.renderPage();
   },

   /*
    * QUnitChainer.clickClearStorage(event)
    *
    * jQuery Event handler for when the Clear Storage button is clicked.
    * All storage is cleared and the page is rerendered
    */
   clickClearStorage: function (event) {
      this.logEvent('QUC.clickClearStorage(' + JSON.stringify(event) + ')');
      this.maybeAlertStorage('QUC.clickClearStorage()');
      this.clearStorage();
      this.renderPage();
   },

   /*
    * QUnitChainer.changeTestPlan(event)
    *
    * jQuery Event handler for when the Test Plan edit box contents are changed (and focus changes)
    * set the form action to match the test plan name so submit button will go to the correct place
    # and browser will record the edit field value for auto-completion
    */
   changeTestPlan: function (event) {
      this.logEvent('QUC.changeTestPlan(' + JSON.stringify(event) + ')');
      jQuery('#chainerControl')[0].action = this.getLocation(jQuery('#testPlan')[0].value);
   },

   /*
    * QUnitChainer.clickRunTests(event)
    *
    * jQuery Event handler for when the Run Tests button is clicked.
    * The bFollowChain property is set into storage and then the test plan named in the text box is invoked.
    */
   clickRunTests: function (event) {
      var URL = jQuery('#testPlan')[0].value;
      this.logEvent('QUC.clickRunTests(' + JSON.stringify(event) + ')');
      this.changeTestPlan(event);
      this.setProperty('bFollowChain', true);
      this.storeProperties();
      this.addHistory(this.getLocation(URL));
      this.storeHistory();
      this.maybeAlertStorage('QUC.clickRunTests()');
      this.setLocation(URL);
   },

   /*
    * QUnitChainer.clickShowFailTitle(event)
    * jQuery Event handler for when the Show Fail Title checkbox is clicked.
    * Change the value in Storage and update the browser title bar
    */
   clickShowFailTitle: function (event) {
      var checked = jQuery('#bShowFailTitle')[0].checked;
      this.logEvent('QUC.clickShowFailTitle(' + JSON.stringify(event) + ') ' + checked);
      this.setProperty('bShowFailTitle', checked);
      this.storeProperties();
      this.maybeAlertStorage('QUC.clickShowFailTitle()');
      this.setControlPageTestStatus();
   },

   /*
    * QUnitChainer.clickShowPassed(event)
    * jQuery Event handler for when the Show Passed checkbox is clicked.
    * Change the value in Storage and update the hidepass class on the #qunit-tests element
    */
   clickShowPassed: function (event) {
      var checked = jQuery('#bShowPassed')[0].checked;
      this.logEvent('QUC.clickShowPassed(' + JSON.stringify(event) + ') ' + checked);
      this.setProperty('bShowPassed', checked);
      this.storeProperties();
      this.maybeAlertStorage('QUC.clickShowPassed()');
      this.showHidePassedTests();
   },

   /*
    * QUnitChainer.clickShowFixture(event)
    * jQuery Event handler for when the Show Fixture checkbox is clicked.
    * Change the value in Storage and update the positioning of the #qunit-fixture element
    */
   clickShowFixture: function (event) {
      var checked = jQuery('#bShowFixture')[0].checked;
      this.logEvent('QUC.clickShowFixture(' + JSON.stringify(event) + ') ' + checked);
      this.setProperty('bShowFixture', checked);
      this.storeProperties();
      this.maybeAlertStorage('QUC.clickShowFixture()');
      this.showFixture(checked);
   },

   /*
    * QUnitChainer.getLocation(URL)
    *
    * Get the document.location.href, removing the random=\d+ from the URL if present
    * URL optional, if omitted, uses document.location.href
    */
   getLocation: function (URL) {
      URL = URL || document.location.href;
      URL = URL.replace(/(\?|\&)random=\d+/, function (unusedFullMatch, matchOne) {
         return matchOne;
      });
      URL = URL.replace(/\?\&/g, '?');
      URL = URL.replace(/\&\&/g, '&');
      URL = URL.replace(/(\?|\&)$/, '');
      return URL;
   },

   /*
    * QUnitChainer.addRandomParam(URL)
    *
    * Adds a random= parameter to the URL to defeat browser caching on the test plan
    * URL - optional, uses document.location.href if omitted.
    *
    */
   addRandomParam: function (URL) {
      var rand = Math.floor(Math.random() * 1E6);
      URL = this.getLocation(URL);
      if (URL.match(/\?/)) {
         URL = URL + '&random=' + rand;
      } else {
         URL = URL + '?random=' + rand;
      }
      return URL;
   },

   /*
    * QUnitChainer.setLocation(URL, bTest)
    *
    * Set the document.location to another URL to run all the chained test plans
    * A random= parameter will be added to defeat browser caching on the test plan
    */
   setLocation: function (URL) {
      document.location = this.addRandomParam(URL);
   },

   /*
    * QUnitChainer.installAutoRun()
    *
    * Install the auto run handler to force the running of the test plans continually
    */
   installAutoRun: function () {
      this.autoRunIntervalTimer = setInterval(function () {
         QUnitChainer.handleAutoRun();
      }, this.autoRunInterval);
   },

   /*
    * QUnitChainer.cancelAutoRun()
    *
    * Cancel the auto run handler interval timer.
    */
   cancelAutoRun: function () {
      if (this.autoRunIntervalTimer) {
         clearInterval(this.autoRunIntervalTimer);
         this.autoRunIntervalTimer = undefined;
      }
   },

   /*
    * QUnitChainer.handleAutoRun()
    *
    * Handle the timed call to auto run if the bAutoRun flag is set
    */
   handleAutoRun: function () {
      this.logEvent('QUC.handleAutoRun()');
      if (this.getProperty('bAutoRun')) {
         this.clickRunTests();
      }
   },

   /*
    * QUnitChainer.saveJSCoverage()
    *
    * Save Javascript coverage information if we are running under the cover server
    */
   saveJSCoverage: function (directory) {
      if (window.jscoverage_report) {
         directory = directory || 'QUC';
         jscoverage_report(directory);
      }
   },

   /*
    * QUnitChainer.logEvent(something)
    *
    * Log an internal event to the console log
    */
   logEvent: function (something) {
      this.logIt(this.bLogEvent, something);
   },

   /*
    * QUnitChainer.trace(something)
    *
    * Trace an internal method call to the console log
    */
   trace: function (something) {
      this.logIt(this.bTrace, something);
   },

   /*
    * QUnitChainer.logIt(bLog, something)
    *
    * Log something to the console log if flag bLog is true
    */
   logIt: function (bLog, something) {
      var key, somethingNice = '';
      if (bLog && window.console && window.console.log) {
         if (typeof something === 'object' && something['in'] && !this.browserIsFF() && !this.browserIsIE()) {
            // All browsers but Firefox log objects in console window in an obscure manner
            // so we log what function we are in before logging the object to make it a bit easier.
            // For IE we will stringify the object so we don't need this either.
            this.logIt(bLog, something['in']);
         }
         // convert to JSON string for browsers with less capable console log (I.E. <=8 checked so far)
         if (this.browserIsIE()) {
            try {
               somethingNice = JSON.stringify(something);
               // HTMLDivElement and probably other native objects in IE don't JSON stringify well...
               // http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
               if (somethingNice === undefined && typeof something === 'object') {
                  somethingNice = {};
                  for (key in something) {
                     if (typeof something[key] !== 'function') {
                        if (typeof something.hasOwnProperty !== 'undefined') {
                           if (something.hasOwnProperty(key)) {
                              somethingNice[key] = something[key];
                           }
                        } else {
                           somethingNice[key] = something[key];
                        }
                     }
                  }
                  somethingNice = JSON.stringify(somethingNice);
               }
            } catch (exception) {}
            something = somethingNice;
         }
         window.console.log(something);
      }
   },

   '-': '-'
};

/*
 * log(something)
 *
 * Log something (string or object) to the console log if the QUnitChainer or Plan flag is turned on.
 */
function log(something) {
   var bLog = QUnitChainer.getProperty('bLog') || this.Plan.bLog;
   QUnitChainer.logIt(bLog, something);
}

/* jshint node: true */
'use strict';

// developer options go here
// if you want to make changes run
// `git update-index --assume-unchanged karma.config.js`
// to prevent the file from being commited
// run `git update-index --no-assume-unchanged karma.config.js` to undo
var singleRun = false;
var autoWatch = true;
var browsers = ['Chrome'];
//var browsers = ['Chrome', 'Firefox'];
var browserify = { debug: true };

// add OS specific browsers
if(/^win/.test(process.platform)){
  browsers.push('IE');
} else if (process.platform === 'darwin') {
  browsers.push('Safari');
}

if (process.env.CI === 'true') {
// In the CI environment set an environment variable CI = 'true'
// CI options go here
  singleRun = true;
  autoWatch = false;
}

if (process.env.TRAVIS === 'true'){
  // we can't use travis from stash but if this goes public Travis options go here
  browsers = ['PhantomJS'];
}

if (process.env.JENKINS_URL){
  // Jenkins options go here
}

module.exports = function(config) {
  config.set({
    basePath: '',
    autoWatch: autoWatch,
    frameworks: ['qunit', 'browserify'],
    files: [
      'bower_components/jquery-1.7.2.min/index.js',
      'bower_components/jquery.cookie/index.js',
      'bower_components/sinon-1.10.3/index.js',
      'bower_components/sinon.ie.timers-1.10.3/index.js',
      'test/js/util/gpt.js',
      'test/js/util/test.helpers.js',
      'test/js/*.test.js'
    ],
    browsers: browsers,
    browserify: browserify,
    reporters: ['progress'],
    preprocessors: { 'test/js/util/test.helpers.js': ['browserify']},
    singleRun: singleRun
  });
};
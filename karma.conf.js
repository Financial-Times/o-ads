/* jshint node: true */
'use strict';
var browsers = ['Chrome', 'Firefox'];
if(/^win/.test(process.platform)){
  browsers.push('IE');
} else if (process.platform === 'darwin') {
  browsers.push('Safari');
}

var singleRun = true;
var autoWatch = false;

if (process.env.TRAVIS === 'true'){
  browsers = ['PhantomJS'];
}
// using CI environment variable to see if this is a ci build
if (process.env.CI === 'true') {
  singleRun = true;
  autoWatch = false;
}

module.exports = function(config) {
  config.set({
    basePath: '.',
    autoWatch: autoWatch,
    frameworks: ['qunit', 'sinon', 'browserify'],
    files: [
      'bower_components/jquery-1.7.2.min/index.js',
      'bower_components/jquery.cookie/index.js',
      'test/js/util/test.helpers.js',
      'test/js/util/gpt.js',
      'test/js/util/*.js',
      'test/js/*.test.js'
    ],
    browsers: browsers,

    reporters: ['progress'],
    preprocessors: { 'test/js/util/test.helpers.js': ['browserify']},
    singleRun: singleRun
  });
};
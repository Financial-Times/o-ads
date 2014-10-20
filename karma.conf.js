module.exports = function(config) {
  config.set({
    basePath: '',
    autoWatch: true,
    frameworks: ['qunit', 'sinon', 'browserify'],
    files: [
      'test/js/util/initialize.namespace.js',
      'bower_components/jquery-1.7.2.min/index.js',
      'bower_components/jquery.cookie/index.js',
      'test/js/util/test.helpers.js',
      'test/js/util/gpt.js',
      'test/js/util/*.js',
      'test/js/*.test.js'
    ],
    browsers: ['Chrome'],

    reporters: ['progress'],
    preprocessors: { 'test/js/util/initialize.namespace.js': ['browserify']},

    singleRun: false
  });
};

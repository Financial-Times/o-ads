module.exports = function(config) {
  config.set({
    basePath: '',
    autoWatch: true,
    frameworks: ['qunit', 'browserify'],
    files: [
      'test/js/util/initialize.namespace.js',
      'test/lib/jquery/*.js',
      'test/lib/sinon/*.js',
      'test/js/util/test.helpers.js',
      'test/js/util/gpt.js',
      'test/js/util/*.js',
      'test/js/advertising.utils.cookie.test.js',
      'test/js/third.party.config.test.js',
    ],
    browsers: ['Chrome'],

    reporters: ['progress'],
    preprocessors: { 'test/js/util/initialize.namespace.js': ['browserify']},

    singleRun: false
  });
};

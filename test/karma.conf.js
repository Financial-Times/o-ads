module.exports = function(config) {
  config.set({
    basePath: '',
    autoWatch: true,
    frameworks: ['qunit'],
    files: [
      'lib/jquery/*.js',
      '../src/js/namespace.js',
      '../src/js/utils/*.js',
      '../src/js/*.js',
      '../src/js/data-providers/audienceScienceFacade.js',
      '../src/js/data-providers/*.js',
     'lib/sinon/*.js',
     'js/util/test.helpers.js',
     'js/util/gpt.js',
     'js/util/*.js',
     'js/*.js'
    ],
    browsers: ['Chrome'],

    reporters: ['progress'],
    preprocessors: {  },

    singleRun: true
  });
};
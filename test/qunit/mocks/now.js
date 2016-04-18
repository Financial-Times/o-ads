/*
* this is a browserify swap file
* we need to override the default lodash now method in order to use sinon faketimers
*/

module.exports = () => new Date().getTime();

/* jshint node: true */
'use strict';

printAscii();
var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tagVersion = require('gulp-tag-version');
var argv = require('yargs').argv;
var conventionalGithubReleaser = require('conventional-github-releaser');
var gitSecret = (argv.gitSecret === undefined) ? false : argv.gitSecret;
var packageJson = require('./package.json');
var origin = packageJson.repository.url;

// var obt = require('origami-build-tools');
// var browserify = require('browserify');
// var swap = require('browserify-swap');
// var debowerify = require('debowerify');
// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');

//var sourcemaps = require('gulp-sourcemaps');

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp minor   # makes v0.1.1 → v0.2.0
 *     gulp major   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

 function inc(type, callback) {
 	if(!gitSecret){
 		throw 'gitSecret parameter is required in order to make a public release';
 	}

 	// make sure we're on the master branch, otherwise the release could end up on the wrong branch or worse an orphaned head
 	git.checkout('master', function(err) {
 		if (err) throw err;
		gulp.src(['./package.json', './bower.json'])
			.pipe(bump({type: type}))
			.pipe(gulp.dest('./'))
			.pipe(git.commit('bumps package version'))
			.pipe(filter('bower.json'))
			.pipe(tagVersion({prefix: ''}))
			.on('end', function() {
				git.push('origin', 'master', function(err) {
					if (err) throw err;
				git.push('origin', '--tag', function(err) {
					if (err) throw err;

					// make the Github release
					conventionalGithubReleaser(
					{
							type: 'oauth',
							token: gitSecret
					},
					{
						preset: 'jquery',
						transform: function(commit, cb) {
						var tagRegexp = /tag:\s*[v=]?(.+?)[,\)]/gi;
						var match = tagRegexp.exec(commit.gitTags);
						commit.version = 'v' + match[1];
						cb(null, commit);
						}
			  		},
			  		callback);

				});
			});
		});
 	});
 }

//
// gulp.task('qunit:build', function() {
// 	process.env.BROWSERIFYSWAP_ENV = 'karma';
// 	var dest = './build/qunit/';
//
// 	obt.build(gulp, {
// 		js: './test/qunit/setup.js',
// 		sourcemaps: true,
// 		transforms: [swap],
// 		buildFolder: dest
// 	});
// });
//
// gulp.task('qunit:coverage', function() {
// 	process.env.BROWSERIFYSWAP_ENV = 'karma';
// 	var dest = './build/qunit-coverage/';
//
// 	obt.build(gulp, {
// 		js: './test/qunit/setup.js',
// 		transforms: [swap, ['browserify-istanbul', { ignore: '**/node_modules/**,**/bower_components/**,**/test/**'}]],
// 		buildFolder: dest
// 	});
// });

gulp.task('release:patch', function(callback) { inc('patch', callback); });
gulp.task('release:minor', function(callback) { inc('minor', callback); });
gulp.task('release:major', function(callback) { inc('major', callback); });

function printAscii() {
	console.log('                                  __           ');
	console.log('                                 /  |          ');
	console.log('  ______           ______    ____$$ |  _______ ');
	console.log(' /      \\  ______ /      \\  /    $$ | /       |');
	console.log('/$$$$$$  |/      |$$$$$$  |/$$$$$$$ |/$$$$$$$/ ');
	console.log('$$ |  $$ |$$$$$$/ /    $$ |$$ |  $$ |$$      \\ ');
	console.log('$$ \\__$$ |       /$$$$$$$ |$$ \\__$$ | $$$$$$  |');
	console.log('$$    $$/        $$    $$ |$$    $$ |/     $$/ ');
	console.log('$$$$$$/          $$$$$$$/  $$$$$$$/ $$$$$$$/');
	console.log('');
}

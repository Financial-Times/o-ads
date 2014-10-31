/* jshint node: true */

'use strict';

printAscii();
var gulp = require('gulp'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag_version = require('gulp-tag-version');

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function inc(importance, callback) {
      // make sure we're on the master branch, otherwise the release could end up on the wrong branch or worse an orphaned head
    git.checkout('master', function (err) {
        if (err) throw err;
        // get all the files to bump version in
        gulp.src(['./package.json', './bower.json'])
            // bump the version number in those files
            .pipe(bump({type: importance}))
            // save it back to filesystem
            .pipe(gulp.dest('./'))
            // commit the changed version number
            .pipe(git.commit('bumps package version'))
            // read only one file to get the version number
            .pipe(filter('bower.json'))
            // **tag it in the repository**
            .pipe(tag_version({prefix:""}))
            .on('end', function () {
                git.push('origin', 'master', function (err) {
                    if (err) throw err;
                    git.push('origin', '--tag', function (err) {
                        if (err) throw err;
                        callback();
                    });
                });
            });
    });

}

gulp.task('patch', function(callback) { inc('patch', callback); });
gulp.task('feature', function(callback) { inc('minor', callback); });
gulp.task('release', function(callback) { inc('major', callback); });





function printAscii() {
    console.log("                                  __           ");          
    console.log("                                 /  |          ");    
    console.log("  ______           ______    ____$$ |  _______ ");
    console.log(" /      \\  ______ /      \\  /    $$ | /       |");
    console.log("/$$$$$$  |/      |$$$$$$  |/$$$$$$$ |/$$$$$$$/ ");
    console.log("$$ |  $$ |$$$$$$/ /    $$ |$$ |  $$ |$$      \\ ");
    console.log("$$ \\__$$ |       /$$$$$$$ |$$ \\__$$ | $$$$$$  |");
    console.log("$$    $$/        $$    $$ |$$    $$ |/     $$/ ");
    console.log("$$$$$$/          $$$$$$$/  $$$$$$$/ $$$$$$$/");
}
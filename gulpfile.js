/* jshint node: true */

'use strict';

printAscii();
var gulp = require('gulp');
var obt = require('origami-build-tools');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var plato = require('gulp-plato');
var tag_version = require('gulp-tag-version');
var ssg = require('gulp-ssg');
var rename = require('gulp-rename');
var data = require('gulp-data');
var matter = require('gray-matter');
var markdown = require('gulp-markdown');
var wrap = require('gulp-wrap');


var config = {
	origami: require('./origami.json'),
	bower: require('./bower.json'),
	jshint: require('./node_modules/origami-build-tools/config/jshint.json')
};

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

gulp.task('release:patch', function(callback) { inc('patch', callback); });
gulp.task('release:minor', function(callback) { inc('minor', callback); });
gulp.task('release:major', function(callback) { inc('major', callback); });


gulp.task('report:plato', function(){
	var dest = './reports/plato';
	gulp.src(['./main.js', './src/js/*.js']).pipe(plato(dest, {
		jshint: {
			options: config.jshint
		},
		complexity: {
			trycatch: true
		}
	}));
});

gulp.task('build', function () {
	obt.build(gulp, {
		sourcemaps: true
	});
});

gulp.task('reports', ['build', 'report:plato']);

gulp.task('docs:otech', function () {
	return gulp.src('./docs/*.md')
		.pipe(data(function(file) {
			console.log(file);
			var m = matter(String(file.contents));
			file.contents = new Buffer(m.content);
			return m.data;
		}))
		.pipe(markdown())
		.pipe(rename({ extname: '.html' }))
		.pipe(ssg())
		.pipe(wrap(
			{ src: './docs/templates/basic.html' },
			{ siteTitle: 'Example Website'},
			{ engine: 'hogan' }
		))
		.pipe(gulp.dest('./docs/o-tech/'));
});

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
	console.log("");
}

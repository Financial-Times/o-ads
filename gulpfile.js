/* jshint node: true */
'use strict';

printAscii();
var path = require('path');
var gulp = require('gulp');
var obt = require('origami-build-tools');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var plato = require('gulp-plato');
var tagVersion = require('gulp-tag-version');
var ssg = require('gulp-ssg');
var rename = require('gulp-rename');
var data = require('gulp-data');
var matter = require('gray-matter');
var markdown = require('gulp-markdown');
var wrap = require('gulp-wrap');
var sequence = require('run-sequence');
var clean = require('rimraf');

var config = {
	origami: require('./origami.json'),
	bower: require('./bower.json'),
	docs: {
		filters: {
			js: filter('**/*.js'),
			md: filter('**/*.md')
		},
		templates: {
			main: path.join(__dirname, './docs/templates/o-tech.html'),
			js: path.join(__dirname, './docs/templates/src.html')
		}
	},
	reports: {
		plato: {
			dest: './build/reports/plato',
			options: {
				jshint: {
					options: require('./node_modules/origami-build-tools/config/jshint.json')
				},
				complexity: {
					trycatch: true
				}
			}
		}
	}
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

function inc(type, callback) {

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
						callback();
					});
				});
			});
	});
}

gulp.task('release:patch', function(callback) { inc('patch', callback); });
gulp.task('release:minor', function(callback) { inc('minor', callback); });
gulp.task('release:major', function(callback) { inc('major', callback); });

gulp.task('report:plato', function() {
	var conf = config.reports.plato;
	gulp.src(['./main.js', './src/js/**/*.js'])
		.pipe(plato(conf.dest, conf.options));
});

gulp.task('build', function() {
	obt.build(gulp, {
		sourcemaps: true
	});
});

gulp.task('report:qunit', function() {
	obt.build(gulp, {
		files: ['test/qunit/setup.js', 'test/qunit/*.test.js'],
		sourcemaps: true
	});
});

gulp.task('reports', ['build', 'report:plato']);

gulp.task('docs:build', function() {
	var filters = config.docs.filters;
	var templates = config.docs.templates;
	return gulp.src(['./docs/**/*.md', './src/js/**/*.js'])
		.pipe(filters.md)
			.pipe(data(function(file) {
				var m = matter(String(file.contents));
				file.matter = matter.stringify('', m.data);
				file.contents = new Buffer(m.content);
				return m.data;
			}))
			.pipe(markdown())
		.pipe(filters.md.restore())
		.pipe(filters.js)
			.pipe(data(function(file) {
				var data = {
					title: path.parse(file.path).name
				};
				file.matter = matter.stringify('', data);
				return data;
			}))
			.pipe(wrap({ src: templates.js }, {}, { engine: 'hogan' }))
			.pipe(rename(function(file) {
				file.dirname = path.join('developer-guide/src/', file.dirname);
			}))
		.pipe(filters.js.restore())
		.pipe(wrap('{{file.matter}}{{{contents}}}', {}, { engine: 'hogan' }))
		.pipe(rename({ extname: '.html' }))
		.pipe(gulp.dest('./build/site/base'));
});

gulp.task('docs:gh', function() {
	var templates = config.docs.templates;

	return gulp.src('./build/site/base/**/*.html')
		.pipe(data(function(file) {
			var m = matter(String(file.contents));
			file.contents = new Buffer(m.content);
			return m.data;
		}))
		.pipe(ssg())
		.pipe(wrap(
			{ src: templates.main },
			{ siteTitle: config.origami.description},
			{ engine: 'hogan' }
		))
		.pipe(gulp.dest('./build/site/gh'));
});

gulp.task('clean:docs', function(cb) {
	clean('build/site', cb);
});

gulp.task('docs', function() {
	sequence('clean:docs', 'docs:build', 'docs:gh');
});

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

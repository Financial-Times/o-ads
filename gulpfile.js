/* jshint node: true */
/* globals __dirname: false*/

printAscii();

const path = require('path');
const gulp = require('gulp');
const git = require('gulp-git');
const bump = require('gulp-bump');
const filter = require('gulp-filter');
const tagVersion = require('gulp-tag-version');
const conventionalGithubReleaser = require('conventional-github-releaser');
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson = readPackageJSON(packageJsonPath) ;
const runSequence = require('run-sequence');


const yargs = require('yargs')
		.usage('Release automation for Stash and Github')
		.alias('e', 'email')
		.describe('email', 'Github login email')
		.demand('e', 'Please provide Github login email')
		.alias('t', 'token')
		.describe('token', 'Github personal access token')
		.demand('t', 'Please provide Github personal access token');


const args = yargs.argv;
const githubEmail = args.e;
const githubToken = args.t;
const origin = packageJson.repository.url;


function readPackageJSON(path) {
	if (require.cache[path]){
		delete require.cache[path];
	}
	return require(path);
}

// expects a HTTPS Github repo URL
function generateAuthenticatedGithubUrl(url, email, token){
	const parts = encodeURI(url).split('//');
	return parts[0] + '//' + encodeURIComponent(email) + ':' + token + '@' + parts[1];
}

const githubOrigin = generateAuthenticatedGithubUrl(origin, githubEmail, githubToken);

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

function release(type, callback) {
	// make sure we're on the master branch, otherwise the release could end up on the wrong branch or worse an orphaned head
	git.checkout('master', function (err) {
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

gulp.task('add-github-remote', function(){
	git.addRemote('github', githubOrigin, function (err) {
		if (err && err.message.indexOf('remote github already exists') === -1) {
			throw err;
		}
	});
});

gulp.task('push-to-github', function(callback){
	git.push('github', 'master', function(err) {
		if (err) throw err;
		git.push('github', '--tag', function(err) {
			if (err) throw err;
			callback();
		});
	});
});


gulp.task('github-release', function(callback){
	// get updated version number
	packageJson = readPackageJSON(packageJsonPath);
	// make the Github release
	conventionalGithubReleaser(
	{
			type: 'oauth',
			token: githubToken
	},
	{
		preset: 'jquery',
		transform: function(commit, cb) {
			commit.version = 'v' + packageJson.version;
			cb(null, commit);
		}
	},
	callback);
});

gulp.task('process-release-patch', function(callback) { release('type', callback); });
gulp.task('process-release-minor', function(callback) { release('minor', callback); });
gulp.task('process-release-major', function(callback) { release('major', callback); });

gulp.task('release:patch', function(done) {runSequence('add-github-remote', 'process-release-patch', 'push-to-github', 'github-release', done);});
gulp.task('release:minor', function(done) {runSequence('add-github-remote', 'process-release-minor', 'push-to-github', 'github-release', done);});
gulp.task('release:major', function(done) {runSequence('add-github-remote', 'process-release-major', 'push-to-github', 'github-release', done);});



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

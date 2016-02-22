var gulp 		= require('gulp'),
	ngAnnotate 	= require('gulp-ng-annotate'),
	uglify 		= require('gulp-uglify'),
	concat 		= require('gulp-concat'),
	jshint 		= require('gulp-jshint'),
	htmlhint 	= require("gulp-htmlhint"),
	unusedCSS 	= require( 'gulp-check-unused-css' ),
	validateCSS = require('gulp-w3c-css');

/* gulp build runs jshint and then makes app.min.js for us */
gulp.task('build', function () {
	return gulp.src('./src/**/*.js')
		.pipe(jshint({
			"curly":  true,
			"immed":  true,
			"noarg":  true,
			"sub":    true,
			"boss":   true,
			"eqnull": true,
			"node":   true,
			"undef":  true,
			"globals": {
				"_":       false,
				"jQuery":  false,
				"angular": false,
				"moment":  false,
				"console": false,
				"$":       false,
				"io":      false
			}
		}))
		.pipe(jshint.reporter('default'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest('./'));
});

/* gulp jshint only runs jshint */
gulp.task('jshint', function () {
	return gulp.src('./src/**/*.js')
		.pipe(jshint({
			"curly":  true,
			"immed":  true,
			"noarg":  true,
			"sub":    true,
			"boss":   true,
			"eqnull": true,
			"node":   true,
			"undef":  true,
			"globals": {
				"_":       false,
				"jQuery":  false,
				"angular": false,
				"moment":  false,
				"console": false,
				"$":       false,
				"io":      false
			}
		})).pipe(jshint.reporter('default'));
});

/* gulp htmlhint only runs htmlhint */
gulp.task('htmlhint', function () {
	return gulp.src('./src/**/*.html')
		.pipe(htmlhint())
		.pipe(htmlhint.reporter())
});

/* gulp unusedCSS finds unused css */
gulp.task('unusedCSS', function () {
	return gulp.src( './src/**/*.css')
		.pipe(unusedCSS());
});

/* gulp css runs validate css and puts the result in ./build/css, 
if the file generated is empty then there are no validation erros */
gulp.task('css', function () {
	return gulp.src('./src/**/*.css')
	.pipe(validateCSS())
	.pipe(gulp.dest("./build"));
});
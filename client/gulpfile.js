var gulp 		= require('gulp'),
	ngAnnotate 	= require('gulp-ng-annotate'),
	uglify 		= require('gulp-uglify'),
	concat 		= require('gulp-concat'),
	jshint 		= require('gulp-jshint');

gulp.task('all', function () {
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
		.pipe(gulp.dest('./build'));
});


gulp.task('hint', function () {
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

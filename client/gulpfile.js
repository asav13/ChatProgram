var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat');

gulp.task('minify', function () {
	gulp.src(['src/**/*.js'])
	.pipe(uglify())
	.pipe(rename({
		suffix: '.min'
		}))
	.pipe(gulp.dest('build'))
});

gulp.task('concat', function() {
	gulp.src('src/**/*.js')
	.pipe(concat('app.js'))
	.pipe(gulp.dest('build'))
});

//First minify then concat
gulp.task('minAndConcat', function () {
	return gulp.src(['src/**/*.js'])
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest('build'))
});

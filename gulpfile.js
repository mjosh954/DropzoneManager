var gulp       = require('gulp');
var gutil      = require('gulp-util');
var jshint     = require('gulp-jshint');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat     = require('gulp-concat');

gulp.task('jshint', function() {
	return gulp.src('app/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('javascript', function() {
	return gulp.src('app/*.js')
	.pipe(sourcemaps.init())
	.pipe(concat('DropzoneManager.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('app/*.js', ['jshint', 'javascript']);
});

gulp.task('default', ['watch']);
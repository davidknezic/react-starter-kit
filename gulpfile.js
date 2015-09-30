var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var webserver = require('gulp-webserver');

var b = browserify({
  entries: 'app/index.jsx',
	extensions: ['.jsx'],
  debug: true,
  transform: [babelify],
});

gulp.task('build', function (cb) {
	runSequence(['scripts', 'styles', 'static'], cb);
});

gulp.task('styles', function () {
	return gulp.src('app/index.less')
		.pipe(sourcemaps.init())
    .pipe(less({
      paths: ['node_modules']
    }))
		.pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function () {
	return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    	.on('error', gutil.log)
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dist'));
});

gulp.task('static', function () {
	var html = gulp.src(['app/index.html', 'app/test.json'])
		.pipe(gulp.dest('dist'));

	var fonts = gulp.src('node_modules/OneUI/src/assets/fonts/*')
		.pipe(gulp.dest('dist/fonts'));

	return merge(html, fonts);
});

gulp.task('serve', function () {
	gulp.src('dist')
	  .pipe(webserver({
	    livereload: true,
	    fallback: 'index.html'
	  }));
});

gulp.task('dev', ['build'], function (cb) {
	gulp.start('serve');

	watch([
    'app/**/*.less'
  ], function () {
    gulp.start('styles');
	});

	watch([
    'app/**/*.jsx',
		'app/**/*.js'
  ], function () {
    gulp.start('scripts');
	});

	watch([
    'app/index.html'
  ], function () {
    gulp.start('static');
	});
});

gulp.task('default', ['dev']);

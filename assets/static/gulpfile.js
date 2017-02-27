var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var sequence = require('run-sequence');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var minify = require('gulp-minify-css');

var target = 'dist';

/**
 * clean dist
 */
gulp.task('clean', function() {
  return gulp.src([target], {
    read: false
  }).pipe(clean());
});

gulp.task('sync:source', function() {
  return gulp.src(['src/**/*'], {
    base: 'src'
  }).pipe(gulp.dest(target)).pipe(connect.reload());
});

// minify css
gulp.task('minify:css', function() {
  return gulp.src(target + '/css/**/*')
    .pipe(minify({
      advanced: false
    }))
    .pipe(gulp.dest(target + '/css'))
    .pipe(connect.reload());
});

// uglify js
gulp.task('uglify:js', function() {
  return gulp.src([target + '/js/**/*'], {
    base: 'src'
  }).pipe(uglify()).pipe(gulp.dest(target)).pipe(connect.reload());
});

// watch file change
gulp.task('watch', function() {
  gulp.watch(['src/**/*'], ['sync:source']);
});

// connect server
gulp.task('connect', function() {
  connect.server({
    root: [target, '.'],
    port: 7070,
    livereload: true
  });
});

// Default task clean temporaries directories and launch the main optimization build task
gulp.task('default', function() {
  sequence('clean', ['sync:source'], ['connect', 'watch']);
});

// build project
gulp.task('dist', function() {
  sequence('clean', ['sync:source'], ['minify:css', 'uglify:js']);
});

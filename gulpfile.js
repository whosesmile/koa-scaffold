var gulp = require('gulp');

var jshint = require('gulp-jshint');

gulp.task('html', function () {
  return gulp.src(['app/**/*.html', 'app/favicon.ico', 'app/logo.png'], {
    base: 'app'
  }).pipe(gulp.dest('lib'));
});

gulp.task('default', function () {
  return gulp.src(['./server.js', './app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var neat = require('node-neat').includePaths;
var browserSync = require('browser-sync');

gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss').pipe(sass({
      includePaths: ['app/scss'].concat(neat)
    })).pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function () {
  browserSync.init(['app/**/*.html', 'app/css/**/*.css', 'app/js/**/*.js'], {
    server: {
      baseDir: 'app/'
    }
  });
});

gulp.task('default', ['sass', 'browser-sync'], function () {
  gulp.watch('app/scss/*.scss', ['sass']);
});
'use strict';

var gulp = require('gulp');
var neat = require('node-neat').includePaths;
var browserSync = require('browser-sync');

// Load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
  return gulp.src('app/styles/**/*.scss').pipe($.sass({
    includePaths: ['app/styles','app/bower_components'].concat(neat),
    sourceComments: 'map'
  })).pipe(gulp.dest('app/styles'));
});

gulp.task('browser-sync', function () {
  browserSync.init(['app/**/*.html', 'app/styles/*.css', 'app/scripts/**/*.js'], {
    server: {
      baseDir: 'app/'
    }
  });
});

gulp.task('serve', ['styles', 'browser-sync'], function () {
  gulp.watch('app/styles/**/*.scss', ['styles']);
});
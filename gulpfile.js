'use strict';

var gulp = require('gulp');
var neat = require('node-neat').includePaths;
var browserSync = require('browser-sync');
var stylish	= require('jshint-stylish');
var wiredep = require('wiredep').stream;

// Load plugins
var $ = require('gulp-load-plugins')();

// Styles
gulp.task('styles', function () {
  return gulp.src('app/styles/**/*.scss')
    .pipe($.sass({
      includePaths: ['app/styles','app/bower_components'].concat(neat),
      sourceComments: 'map'
    }))
    .pipe(gulp.dest('app/styles'))
    .pipe($.size());
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter(stylish))
    .pipe($.size());
});

//Browser-sync web server with live-reload multidevice support e.t.c.
gulp.task('browser-sync', function () {
  browserSync.init([
    'app/**/*.html',
    'app/styles/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ],
  {
    server: {
      baseDir: 'app/'
    }
  });
});

// Inject Bower components
gulp.task('wiredep', function () {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      directory: 'app/bower_components',
      ignorePath: 'app/bower_components/'
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'app/bower_components',
      ignorePath: 'app/'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('serve', [
  'styles',
  'scripts',
  'wiredep',
  'browser-sync'
], function () {

  // Watch .scss files
  gulp.watch('app/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('app/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);

  // Watch bower files
  gulp.watch('bower.json', ['wiredep']);

});
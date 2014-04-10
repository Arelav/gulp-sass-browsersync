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

// HTML
gulp.task('html', ['styles', 'scripts'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src('app/*.html')
    .pipe($.replaceTask({
      patterns: [
        {
          match: 'timestamp',
          replacement: new Date().getTime()
        }
      ]
    }))
    .pipe($.useref.assets())
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

// Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

// Clean
gulp.task('clean', function () {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], { read: false }).pipe($.clean());
});

// Build
gulp.task('build', ['html', 'images']);

// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

// Open
gulp.task('serve', [
  'wiredep',
  'styles',
  'scripts',
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

//Watch + Browser-sync web server with live-reload multidevice support e.t.c.
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

var gulp = require('gulp');
var sass = require('gulp-sass');
var neat = require('node-neat').includePaths;
var browserSync = require('browser-sync');

gulp.task('sass', function () {
    gulp.src('scss/**/*.scss')
        .pipe(sass({
            includePaths: ['scss'].concat(neat)
        }))
        .pipe(gulp.dest('css'));
});

gulp.task('browser-sync', function() {
    browserSync.init(["**/*.html", "css/**/*.css", "js/**/*.js"], {
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['sass', 'browser-sync'], function () {
    gulp.watch("scss/*.scss", ['sass']);
});
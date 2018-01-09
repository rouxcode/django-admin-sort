'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');


var sass_conf = {
    errLogToConsole: true,
    outputStyle: 'compressed'
};

gulp.task('sass', function () {
    return gulp.src('treebeard_admin/static/admin/treebeard_admin/scss/**/*.scss')
        .pipe(sass(sass_conf).on('error', sass.logError))
        .pipe(gulp.dest('treebeard_admin/static/admin/treebeard_admin/css/'));
});


gulp.task('watch', function () {
    gulp.watch('treebeard_admin/static/admin/treebeard_admin/scss/**/*.scss', ['sass']);
});

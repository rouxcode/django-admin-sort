'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');


var sass_conf = {
    errLogToConsole: true,
    outputStyle: 'compressed'
};

gulp.task('sass', function () {
    return gulp.src('admin_sort/static/admin_sort/scss/**/*.scss')
        .pipe(sass(sass_conf).on('error', sass.logError))
        .pipe(gulp.dest('admin_sort/static/admin_sort/css/'));
});


gulp.task('watch', function () {
    gulp.watch('admin_sort/static/admin_sort/scss/**/*.scss', ['sass']);
});

const gulp = require('gulp');
const minify = require('gulp-babel-minify');
const sass = require('gulp-sass');


const js_src = 'frontend/js/**/*.js';
const js_dest = 'admin_sort/static/admin_sort/js';
const js_conf = {
    "parserOptions": {
        "sourceType": "module",
    }
};


const scss_src = 'frontend/scss/**/*.scss';
const scss_dest = 'admin_sort/static/admin_sort/css';
const scss_conf = {
    errLogToConsole: true,
    outputStyle: 'compressed'
};

exports.js = function () {
    return gulp.src(js_src)
        .pipe(minify(js_conf))
        .pipe(gulp.dest(js_dest));
};


exports.scss = function () {
    return gulp.src(scss_src)
        .pipe(sass(scss_conf).on('error', sass.logError))
        .pipe(gulp.dest(scss_dest));
};

exports.watch = function () {

    // build js
    gulp.watch(js_src, exports.js);

    // build css
    gulp.watch(scss_src, exports.scss);
};

exports.default = function (cb) {
    cb();
};
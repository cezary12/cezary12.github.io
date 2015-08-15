/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    merge = require("merge-stream");


gulp.task('_default', ["min", "fonts"], function () {
    // place code for your default task here
});


gulp.task("min:js", ["min:vendor:js", "min:app:js"], function () {

    return gulp.src(["./js/vendor.min.js", "./js/app.min.js"], { base: "." })
        .pipe(concat("./js/site.min.js"))
        .pipe(gulp.dest("."));
});

gulp.task("min:app:js", function () {

    var app = [
        "./js/app.js"
    ];

    return gulp.src(app, { base: "." })
        .pipe(concat("./js/app.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});


gulp.task("min:vendor:js", function () {

    var bower = "./bower_components/";
    var src = [
        bower + "jquery/dist/jquery.min.js",
        bower + "bootstrap/dist/js/bootstrap.min.js",
        bower + "knockout/dist/knockout.js"
    ];

    return gulp.src(src, { base: "." })
        .pipe(concat("./js/vendor.min.js"))
        .pipe(gulp.dest("."));
});

gulp.task("min:css", ["min:vendor:css", "min:app:css"], function () {

    return gulp.src(["./css/vendor.min.css", "./js/custom.min.css"], { base: "." })
        .pipe(concat("./css/site.min.css"))
        .pipe(gulp.dest("."));
});

gulp.task("min:app:css", function () {

    var app = [
        "./css/custom.css"
    ];

    return gulp.src(app, { base: "." })
        .pipe(concat("./css/custom.min.css"))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min:vendor:css", function () {

    var bower = "./bower_components/";
    var src = [
        bower + "bootstrap/dist/css/bootstrap.min.css"
    ];

    return gulp.src(src, { base: "." })
        .pipe(concat("./css/vendor.min.css"))
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task("fonts", function() {

    var bower = "./bower_components/";
    var src = [
        bower + "bootstrap/dist/fonts/*.*"
    ];

    return gulp.src(src)
        .pipe(gulp.dest("./fonts/"));
});
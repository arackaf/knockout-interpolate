var pkg = require("./package.json");
var gulp = require("gulp");
var header = require("gulp-header");
var jshint = require("gulp-jshint");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var karma = require("gulp-karma");

var banner = "// <%= pkg.name %> <%= pkg.version %> | (c) <%= new Date().getFullYear() %> Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license\n";

gulp.task("build", [ "lint" ], function() {
    return gulp.src("src/knockout-interpolate.js")
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest("dist"))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename("knockout-interpolate.min.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("lint", function() {
    return gulp.src(["src/*.js", "spec/*.js"]).pipe(jshint());
});

var testFiles = [
    "node_modules/chai/chai.js",
    "node_modules/knockout/build/output/knockout-latest.js",
    "node_modules/jquery/dist/jquery.min.js",
    "dist/knockout-interpolate.min.js",
    "spec/*.spec.js"
];

gulp.task("test", ["build"], function() {
    gulp.src(testFiles)
        .pipe(karma({
            configFile: __dirname + "/karma.conf.js",
            action: "run"
        }));
});

gulp.task("test-ci", function() {
    gulp.src(testFiles)
        .pipe(karma({
            configFile: __dirname + "/karma.conf.js",
            action: "watch"
        }));
});

gulp.task("default", ["build"]);
gulp.task("watch", ["test-ci"], function() {
    gulp.watch("src/*.js", ["build"]);
});
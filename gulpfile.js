/// <binding Clean='clean' />

var gulp = require("gulp"),
    gulpcopy = require('gulp-copy'),
    config = require('./gulpConfig')(),
    del = require('del'),
    fs = require("fs"),
    ignore = require('gulp-ignore'),
    inject = require('gulp-inject'),
    rimraf = require("gulp-rimraf"),
    runSequence = require('run-sequence'),
    series = require('stream-series'),
    sourcemaps = require('gulp-sourcemaps'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    path = require('path');
;

/*
gulp.task("default", function () {
    runSequence('clean', 'ts-lint', 'gen-ts-refs-file', 'compile-ts', '1-copy', ['2-inject']);
});
*/
gulp.task("clean", function (cb) {

    return gulp.src(config.cleanFolders, { read: false }) // much faster
        .pipe(rimraf({ force: true }, cb));
});

gulp.task("1-copy", ["clean", "compile-ts"], function () {
    //gulp.task("1-copy", function () {
    var bower = {
        "angular": "angular/angular.min.*{js,map}",
        "angular-google-maps": "angular-google-maps/dist/**/*.{min.js,dot,png}",
        "angular-sanitize": "angular-sanitize/angular-sanitize.min.*{js,map}",
        "angular-ui-alias": "angular-ui-alias/src/alias.js",
        "angular-ui-router": "angular-ui-router/release/angular-ui-router.min.js",
        "bootstrap": "bootstrap/dist/{css,fonts,js}/{glyphicons-*,bootstrap.min,bootstrap-theme.min,bootstrap-theme.css}.{css,map,eot,svg,ttf,woff,woff2,js}",
        "font-awesome": "font-awesome/{css,fonts}/{font-awesome.min,font-awesome.css,FontAwesome}.{css,map,eot,svg,ttf,woff,woff2,otf}",
        "jquery": "jquery/dist/*min.{js,map}",
        "lodash": "lodash/lodash.min.js",
        "modernizr": "modernizr/modernizr.js",
        "momentjs": "moment/min/moment.min.js",
        "normalize.css": "normalize.css/normalize.css"

    }

    for (var destinationDir in bower) {
        if (bower.hasOwnProperty(destinationDir)) {
            gulp.src(config.paths.bowerDirectory + bower[destinationDir])
                .pipe(gulp.dest(config.paths.webRootlib + destinationDir));
        }
    }
    //gulp.src(config.copyFiles)
    //    .pipe(gulpcopy(config.paths.webRootApp));

});

gulp.task("2-inject", [], function () {
    var lib = config.paths.webRootlib;
    var vendorStream = gulp.src([
        lib + "{normalize.css,modernizr,jquery,angular}/*",
        lib + "bootstrap/{css,js}/{bootstrap.,bootstrap-*}*",
        lib + "angular-bootstrap/{ui-bootstrap.,ui-bootstrap-*}*",
        lib + "**/*",
        "!./app/lib/normalize.css",
        "!./app/lib/modernizr/modernizr.js"
    ], { read: false });

    var srcModernizr = gulp.src(config.paths.modernizrFile, { read: false });
    var opts = { ignorePath: 'src', addRootSlash: false, starttag: '<!-- inject:head:{{ext}} -->' };
    var appStream = gulp.src(config.injectFiles, { read: false });

    gulp.src('./index.html')   //
        .pipe(inject(series(vendorStream, appStream), { read: false, ignorePath: 'wwwroot', addRootSlash: true }))
        .pipe(inject(srcModernizr, opts))
        .pipe(gulp.dest(config.paths.webRoot));

});


gulp.task('gen-ts-refs-file', function () {
    fs.writeFile(config.ts.tsReferencesFile, '//{\n//}', function (err) {
        if (err) throw err;
        console.log('Created "app.d.ts" Reference File in folder "typescript".');
    });
    var injectOptions = {
        read: false,
        addRootSlash: true,
        starttag: '//{',
        endtag: '//}',
        transform: config.ts.transformFn
    };
    var test = config.ts.allTypeScript;
    var target = gulp.src(config.ts.tsReferencesFile);
    var sources = gulp.src(config.ts.allTypeScript, { read: false });


    return target
        .pipe(inject(sources, injectOptions))
        .pipe(gulp.dest(config.ts.paths.typings));
});

gulp.task('ts-lint', function () {
    return gulp.src(config.ts.appTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
});

gulp.task('compile-ts', ['ts-lint', 'gen-ts-refs-file'], function () {
    //gulp.task('compile-ts', function () {
    del(config.ts.allJavaScriptOutput);
    var sourceTsFiles = [config.ts.appTypeScript,
        config.ts.tslibrarytDefinitions,
        config.ts.tsReferencesFile];

    var tsResult = gulp.src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(config.ts.tscOptions));

    tsResult.dts.pipe(gulp.dest(config.ts.paths.tsOutputPath));
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.ts.paths.tsOutputPath));
});
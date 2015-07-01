module.exports = function () {
    var root = './';
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var typings = './typings/';
    var appRoot = root + 'app/';
    var appSource = './AppSource/';
    var tsReferencesFile = typings + 'tsd.d.ts';
    var paths = {
        webRoot: root,
        webRootApp: appRoot,
        webRootlib: appRoot + "lib/",
        webRootJs: appRoot + "js/",
        webContentCss: "./Content/",
        webTemplates: "./Templates/",
        bowerDirectory: bower.directory,
        modernizrFile: appRoot + "lib/modernizr/modernizr.js"
    };
    var config = {
        paths: paths,
        // All typescript settings
        ts: {
            paths: {
                typings: typings,
                tsOutputPath: paths.webRootJs
            },
            appTypeScript: appSource + '**/*.ts',
            allTypeScript: [typings + '**/*.ts', appSource + '**/*.ts', '!' + tsReferencesFile],
            allJavaScriptOutput: paths.webRootJs + '**/*',
            tslibrarytDefinitions: typings + '**/*.ts',
            tsReferencesFile: tsReferencesFile,

            tscOptions: {
                target: 'ES5',
                declarationFiles: false,
                noExternalResolve: true,
                removeComments: true
            },

            transformFn: function (filepath) {
                if (filepath.substring(0, 8) === '/typings') {
                    return '/// <reference path=".' + filepath.substring(8) + '" />';
                } else {
                    return '/// <reference path="..' + filepath + '" />';
                }
            }


        },
        injectFiles: [
                        paths.webContentCss + '**/*.css',
                        appRoot + 'js/**/*.common.js',
                        appRoot + 'js/app.module.js',
                        appRoot + 'js/app.config.js',
                        appRoot + 'js/**/*.filter.js',
                        appRoot + 'js/**/*.module.js',
                        appRoot + 'js/**/*.controller.js',
                        appRoot + 'js/**/*.js'
        ],
        //copyFiles: ['./Content/**/*', './Templates/**/*'],
        cleanFolders: [appRoot],
    };

    return config;


};

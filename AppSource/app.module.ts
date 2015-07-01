/// <reference path="../typings/tsd.d.ts" />

((): void => {
    'use strict';
    angular.module('app', ['ui.router', 'ngSanitize'])
        .constant('appConstant', Constants.Default)
        .run(function ($rootScope: any, appConstant: any) {
        $rootScope.defaults = appConstant;
    });
})();

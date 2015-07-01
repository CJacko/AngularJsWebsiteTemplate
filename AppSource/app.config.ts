/// <reference path="../typings/tsd.d.ts" />
module app.services {

    export class Routing {
        constructor($locationProvider: ng.ILocationProvider,
            private $stateProvider: ng.ui.IStateProvider,
            private $urlRouterProvider: ng.ui.IUrlRouterProvider) {
    //        $locationProvider.html5Mode(true);
            this.init();
        }
        private init(): void {
            this.$stateProvider.state('home', {
                url: '/',
                templateUrl: '/templates/home.html'
            })
                .state('contactus', {
                url: '/ContactUs',
                controller: 'app.Ctls.MapController',
                templateUrl: '/templates/contactus.html'
            });

            this.$urlRouterProvider.otherwise('/');
        }
    }


}

angular.module('app')
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
    ($locationProvider: ng.ILocationProvider, $stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => {
        return new app.services.Routing($locationProvider, $stateProvider, $urlRouterProvider);
    }
]);
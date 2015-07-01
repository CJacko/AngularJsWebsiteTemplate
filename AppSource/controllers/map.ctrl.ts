/// <reference path="../../typings/tsd.d.ts" />
module app.Ctls {
    'use strict';

    class MapController {
        private Latitude: number = 52.758555;
        private Longitude: number = -1.177699;
        mapOptions: Object = {
            zoom: 16,
            center: new google.maps.LatLng(this.Latitude, this.Longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map: google.maps.Map;
        marker: google.maps.Marker;
        constructor() {
            this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
            this.marker = new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(this.Latitude, this.Longitude),
                title: Constants.Default.companyName
            });
        }
    }

    angular.module('app').controller('app.Ctls.MapController', MapController);
}


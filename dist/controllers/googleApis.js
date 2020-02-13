'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var google_maps_1 = require("google-maps");
var GoogleAPIs = /** @class */ (function () {
    function GoogleAPIs() {
    }
    GoogleAPIs.prototype.placesAPI = function () {
        var input = document.getElementById('autocomplete');
        return new google_maps_1.google.maps.places.Autocomplete(input);
    };
    GoogleAPIs.prototype.initMap = function (query) {
        var location = {
            lat: query.lat,
            lng: query.lng
        };
        var map = new google_maps_1.google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 17
        });
        var imageURL = 'https://i.imgur.com/kUG7GZa.png';
        // let image = new google.maps.MarkerImage(imageURL,
        //     new google.maps.Size(20, 20));
        var image = {
            "url": imageURL,
            "scaledSize": new google_maps_1.google.maps.Size(30, 30),
            "origin": new google_maps_1.google.maps.Point(0, 0),
            "anchor": new google_maps_1.google.maps.Point(0, 0)
        };
        var frogPin = new google_maps_1.google.maps.Marker({
            position: location,
            map: map,
            icon: image,
            title: 'hello'
        });
    };
    return GoogleAPIs;
}());
exports.default = GoogleAPIs;

'use strict';
import { google } from "google-maps";
class GoogleAPIs {
    placesAPI() {
        let input = document.getElementById('autocomplete');
        return new google.maps.places.Autocomplete(input);
    }
    initMap(query) {
        let location = {
            lat: query.lat,
            lng: query.lng
        };
        let map = new google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 17
        });
        let imageURL = 'https://i.imgur.com/kUG7GZa.png';
        // let image = new google.maps.MarkerImage(imageURL,
        //     new google.maps.Size(20, 20));
        let image = {
            "url": imageURL,
            "scaledSize": new google.maps.Size(30, 30),
            "origin": new google.maps.Point(0, 0),
            "anchor": new google.maps.Point(0, 0)
        };
        let frogPin = new google.maps.Marker({
            position: location,
            map,
            icon: image,
            title: 'hello'
        });
    }
}

/*jshint forin:false*/
(function(app, $) {

    var MILES_IN_METER = 0.000621371192,
        KILOMETERS_IN_METER = 0.001,
        EARTH_RADIUS_IN_KM = 6372.8;

    $.extend(app.util, {
        metersToMiles: function(meters) {
            return meters * MILES_IN_METER;
        },

        metersToKilometers: function(meters) {
            return meters * KILOMETERS_IN_METER;
        },

        deg2Rad: function(deg) {
            return deg * Math.PI / 180;
        },

        getDistance: function(lat1, lon1, lat2, lon2) {
            var dLat = app.util.deg2Rad(lat2 - lat1);
            var dLon = app.util.deg2Rad(lon2 - lon1);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(app.util.deg2Rad(lat1)) * Math.cos(app.util.deg2Rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distance = EARTH_RADIUS_IN_KM * c;

            return distance;
        }
    });

}(window.app = window.app || {}, jQuery));
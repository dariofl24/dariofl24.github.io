/*global $, app, google */
$(document).ready(function() {
    var gbStoreLocatorConfig = {
            mapOptions: {
                zoom: 6,
                center: new google.maps.LatLng(54.559322, -4.174804)
            },
            distanceUnit: app.storeLocator.StoreLocatorConstants.DistanceUnit.Kilometers
        };

    app.storeLocator.StoreLocator(gbStoreLocatorConfig);
});

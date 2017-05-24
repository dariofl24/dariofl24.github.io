/*global window, google */

(function(app, $) {

    function PickUpPointRoute(pickUpPointMap) {
        this.pickUpPointMap = pickUpPointMap;
        this.gmaps = pickUpPointMap.getMap(); // gMaps.js Object
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.init();
    }

    PickUpPointRoute.prototype = {
        initCache: function() {
            var cache = {
                findRouteForm: $('.find-route-form'),
                routeA: $('#route-a'),
                routeB: $('#route-b'),
                travelModeToggle: $('.travel-mode-toggle')
            };

            cache.travelIconContainer = cache.travelModeToggle.find('.icon-container');

            this.cache = cache;
        },
        toggleTravelMode: function() {
            $('.travel-mode-toggle').find('.icon-container').removeClass('selected');
            $(this).addClass('selected');
            
            var map = app.pickUpPoint.getPickUpPointMap();
            map.updateRouteToPickUpPoint();
        },
        getTravelMode: function() {
            return this.cache.travelModeToggle.find('.selected').data('travel-mode');
        },
        getRouteData: function() {
            return {
                origin: this.cache.routeA.val(),
                destination: this.cache.routeB.val(),
                travelMode: this.getTravelMode()
            };
        },
        drawRoute: function() {
            if (this.cache.findRouteForm.parsley('validate')) {
                event.preventDefault();
            } else {
                return;
            }

            var that = this;
            var data = this.getRouteData();

            this.directionsService.route(data, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    that.directionsDisplay.setDirections(response);
                    that.removeRouteError();
                } else {
                    that.showRouteError();
                }
            });
        },
        showRouteError: function() {
            $('#pup-route').find('.error-message').html('Directions request failed.');
        },
        removeRouteError: function() {
            $('#pup-route').find('.error-message').html('');
        },
        clearFormFields: function() {
            this.cache.routeA.val('');
            this.cache.routeB.val('');
            this.cache.travelIconContainer.removeClass('selected');
            this.cache.travelIconContainer.eq(0).addClass('selected');
            this.removeRouteError();
        },
        clearRoute: function() {
            this.directionsDisplay.setDirections({
                routes: []
            });
        },
        reset: function() {
            this.clearFormFields();
            this.clearRoute();
        },
        bindEvents: function() {
            this.cache.travelIconContainer.on('click', this.toggleTravelMode);
            this.cache.findRouteForm.on('submit', this.drawRoute.bind(this));
        },
        init: function() {
            this.initCache();
            this.bindEvents();
            this.directionsDisplay.setMap(this.gmaps.map);
        }
    };

    app.pup = app.pup || {};
    app.pup.PickUpPointRoute = PickUpPointRoute;

}(window.app = window.app || {}, jQuery));
/*global window */
(function(app, $) {
    var PUBSUB = {
        VIEWS: {
            LIST: 'view:list',
            ROUTE: 'view:route',
            MAP: 'view:map'
        }
    };

    var $cache = {};

    function initializeCache() {
        $cache = {
            pupList: $('#pup-list'),
            pupRoute: $('#pup-route'),
            pupMap: $('#pup-map'),
            menuItems: $('.menu-items'),
            toggleViewListItems: $('.toggle-view li'),
            menuListLink: $('.menu-list-link'),
            menuMapLink: $('.menu-map-link'),
            menuRouteLink: $('.menu-route-link'),
            menuSearchLink: $('.menu-search-link'),
            menuNearestLink: $('.menu-nearest-link'),
            menuLocateLink: $('.menu-locate-link'),
            pupPopupPostal: $('#pup-popup-postal'),
            pupRouteOrigin: $('#find-route-form #route-origin'),
            pupRouteDestination: $('#find-route-form #route-destination'),
            travelModeToggle: $('.route-container .travel-mode-toggle'),
            stepByStepDirections: $('.step-by-step-directions'),
            stepByStepPanel: $('#step-by-step-panel'),
            stepByStepCloseButton: $('#step-by-step-header .close'),
            isMobileMapView:false
        };
    }

    function setListActive() {
        $cache.toggleViewListItems.removeClass('selected');
        $cache.menuListLink.addClass('selected');
        $cache.menuRouteLink.removeClass('hide-mobile');
        app.pickUpPoint.showListView();
        hideMenuItemsMobile();
        hideMapViewMobile();
        $.publish(PUBSUB.VIEWS.LIST);
        $cache.isMobileMapView= false;
    }

    function setRouteActive() {
        $cache.toggleViewListItems.removeClass('selected');
        $cache.menuRouteLink.addClass('hide-mobile');
        $cache.menuRouteLink.addClass('selected');
        app.pickUpPoint.showRouteView();
        hideMenuItemsMobile();
        hideMapViewMobile();
        resetRouteOrigin();
        $.publish(PUBSUB.VIEWS.ROUTE);
    }
    
    function setDestination(destination) {
        $cache.pupRouteDestination.val(destination);
    }
    
    function resetRouteOrigin() {
        var map = app.pickUpPoint.getPickUpPointMap();
        if (!map.hasLocateMeMarker()) {
            $cache.pupRouteOrigin.val('');
        }
    }
    
    function setRouteOrigin(location) {
        if (location === undefined) {
            $cache.pupRouteOrigin.val('My Location');
        } else {
            $cache.pupRouteOrigin.val(location);
        }
    }

    function setMapActive() {
        $cache.toggleViewListItems.removeClass('selected');
        $cache.menuMapLink.addClass('selected');
        $cache.menuRouteLink.addClass('hide-mobile');
        showMenuItemsMobile();
        showMapViewMobile();
        hideListRouteViews();
        $.publish(PUBSUB.VIEWS.MAP);
        $cache.isMobileMapView= true;
    }
    
    function setPostalCode(postalCode) {
        $cache.pupPopupPostal.val(postalCode);
    }

    function showMenuItemsMobile() {
        $cache.menuItems.removeClass('hide-mobile');
    }

    function hideMenuItemsMobile() {
        $cache.menuItems.addClass('hide-mobile');
    }

    function showMapViewMobile() {
        $cache.pupMap.removeClass('vis-hidden-mobile');
        $('#pup-map').height($('#pup-popup').height() - 210);
    }

    function hideMapViewMobile() {
        $cache.pupMap.addClass('vis-hidden-mobile');
    }

    function hideListRouteViews() {
        $cache.pupList.hide();
        $cache.pupRoute.hide();
    }

    function clickSearchLink() {
        setListActive();
        $cache.pupPopupPostal.focus();
    }
    
    function findRouteToNearestPickUpPoint() {
        var map = app.pickUpPoint.getPickUpPointMap();
        map.findRouteToNearestPickUpPoint();
    }
    
    function locateMeHandler(event) {
        event.preventDefault();
        var map = app.pickUpPoint.getPickUpPointMap();
        map.locateMe();
    }
    
    function findRouteToNearestPickUpPointHandler(event) {
        var map = app.pickUpPoint.getPickUpPointMap();
        
        event.preventDefault();
        
        if (map.hasLocateMeMarker()) {
            map.findRouteToNearestPickUpPoint();
        }
    }
    
    function clearStepByStepDirections() {
        $cache.stepByStepPanel.hide();
        $cache.stepByStepDirections.html('');
    }
    
    function showStepByStepDirections() {
        $cache.stepByStepPanel.show();
    }
    
    function addStepByStepDirection(destinationStep) {
        var html = '<div>' + destinationStep.instructions + '</div>';
        $cache.stepByStepDirections.append(html);
    }
    
    function closeStepByStepRouteHandler(event) {
        var map = app.pickUpPoint.getPickUpPointMap();
        
        event.preventDefault();
        clearStepByStepDirections();
        map.removeCurrentRouteToPickUpPoint();
    }
    
    function onMobileOrientationChanged (event){
        event.preventDefault();
    
        if(isPopupVisible()){
            
            if($cache.isMobileMapView){
                
                $cache.toggleViewListItems.removeClass('selected');
                $cache.menuListLink.addClass('selected');
                $cache.menuRouteLink.removeClass('hide-mobile');
                app.pickUpPoint.showListView();
                hideMenuItemsMobile();
                hideMapViewMobile();
                $.publish(PUBSUB.VIEWS.LIST);
            }
            
        }
        
    }
    
    function isPopupVisible() {
        return $('#pup-popup').is(':visible');
    }
    
    function initializeEvents() {
        $cache.menuListLink.on('click', setListActive);
        $cache.menuRouteLink.on('click', setRouteActive);
        $cache.menuMapLink.on('click', setMapActive);
        $cache.menuSearchLink.on('click', clickSearchLink);
        $cache.menuNearestLink.on('click', findRouteToNearestPickUpPoint);
        $cache.menuLocateLink.on('click', locateMeHandler);
        
        $cache.pupRouteOrigin.on('click', locateMeHandler);
        $cache.pupRouteDestination.on('click', findRouteToNearestPickUpPointHandler);
        
        $cache.stepByStepCloseButton.on('click', closeStepByStepRouteHandler);
        
        $(window).on("orientationchange",onMobileOrientationChanged);
        
    }

    function init() {
        initializeCache();
        initializeEvents();
    }

    app.pickUpPoint = app.pickUpPoint || {};
    app.pickUpPoint.menu = {
        init: init,
        setListActive: setListActive,
        setRouteActive: setRouteActive,
        setMapActive: setMapActive,
        setDestination: setDestination,
        setPostalCode: setPostalCode,
        clearStepByStepDirections: clearStepByStepDirections,
        addStepByStepDirection: addStepByStepDirection,
        setRouteOrigin: setRouteOrigin,
        showStepByStepDirections: showStepByStepDirections
    };

}(window.app = window.app || {}, jQuery));

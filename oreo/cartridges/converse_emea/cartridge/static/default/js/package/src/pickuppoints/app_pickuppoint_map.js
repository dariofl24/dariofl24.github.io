/*global window, google, GMaps, Mustache */
/*jshint forin: false, multistr: true */

(function(app, $) {

    var Defaults = {
        mapSelector: '#pup-map',
        mapOptions: {
            zoom: 10,
            latitude: 52.5167,
            longitude: 13.3833,
            markerIcon: '/images/pickuppoints/pin.png',
            myLocationIcon: '/images/pickuppoints/my.location.pin.png'
        }
    };

    function PickUpPointMap(pickUpPointList, settings) {
        this.config = $.extend(true, {}, Defaults, settings);
        this.pickUpPointList = pickUpPointList;
        this.pickUpPointListByDist=[];
        this.init();
    }

    PickUpPointMap.prototype = {
        initCache: function() {
            var cache = {
                map: $(this.config.mapSelector),
                pupInfo: $('.pup-info'),
                zipCodeRegex: (new RegExp("^([1-9][0-9]{3})([a-zA-Z]{2})$")),
                myCoordinates:{},
                countryCodeFR:'FR',
                limitFR:10
            };

            this.cache = cache;
        },
        initMap: function() {
            this.gmaps = new GMaps({
                div: this.config.mapSelector,
                zoom: this.config.zoom,
                lat: this.config.mapOptions.latitude,
                lng: this.config.mapOptions.longitude,
                width: '50',
                height: '50',
                gestureHandling: 'greedy'
            });
        },
        getConfig: function() {
            return this.config;
        },
        getMap: function() {
            return this.gmaps;
        },
        hasLocateMeMarker : function() {
            var that = this;
            return that.locateMeMarker ? true : false;
        },
        onRouteStart: function(destinationRoute) {
            var menu = app.pickUpPoint.getPickUpPointMenu();
            menu.clearStepByStepDirections();
            menu.showStepByStepDirections();
        },
        onRouteEnd: function(destinationRoute) {
        },
        onRouteStep: function(destinationStep) {
            var menu = app.pickUpPoint.getPickUpPointMenu();
            menu.addStepByStepDirection(destinationStep);
        },
        removeCurrentRouteToPickUpPoint: function() {
            var that = this;
            var menu = app.pickUpPoint.getPickUpPointMenu();
            
            that.gmaps.cleanRoute(that.currentRoute);
            menu.setDestination('');
            that.currentRoute = undefined;
            that.currentPickUpPointID = undefined;
        },
        locateMe: function() {
            var that = this;
            var menu = app.pickUpPoint.getPickUpPointMenu();

            GMaps.geolocate({
                success: function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    menu.setRouteActive();
                    menu.setRouteOrigin();
                    that.createLocateMeMarker(pos);
                },
                error: function(error) {
                    console.log(error.message);
                },
                not_supported: function() {
                    console.log('Your browser does not support geolocation');
                }
            });
        },
        updateRouteToPickUpPoint: function () {
            var that = this;
            var menu = app.pickUpPoint.getPickUpPointMenu();
            
            if (that.currentPickUpPointID) {
                menu.clearStepByStepDirections();
                that.findRouteToPickUpPoint(that.currentPickUpPointID);
            }
        },
        selectRouteInPickUpPointList: function (pickUpPointID, scroll) {
            var pupList = $('.pup-info');
            if (pupList.exists()) {
                pupList.removeClass('selected');
            }
            
            var selected = $('.pup-info[data-pup-id="' + pickUpPointID + '"]');
            if (selected.exists()) {
                selected.addClass('selected');
                if (scroll) {
                    selected[0].scrollIntoView(true);
                }
            }
        },
        showRouteToPickUpPoint: function(lat1, lng1, pickUpPoint, pickUpPointID) {
            var that = this;
            
            var route = app.pickUpPoint.getPickUpPointRoute();
            var menu = app.pickUpPoint.getPickUpPointMenu();
            var list = app.pickUpPoint.getPickUpPointList();
            
            var origin = [lat1, lng1];
            var destinationPos = [pickUpPoint.latitude, pickUpPoint.longitude];
            var travelMode = route.getTravelMode();
            
            that.gmaps.cleanRoute();
            that.currentRoute = that.gmaps.drawSteppedRoute({
                origin: origin,
                destination: destinationPos,
                travelMode: travelMode,
                start: that.onRouteStart,
                end: that.onRouteEnd,
                step: that.onRouteStep
            });
            that.currentPickUpPointID = pickUpPointID;
            
            var destination = list. getFormattedAddress(pickUpPoint);
            menu.setDestination(destination);
            
            that.selectRouteInPickUpPointList(pickUpPointID, false);
        },
        findRouteToPickUpPoint: function(pickUpPointID) {
            var that = this;
            var list = app.pickUpPoint.getPickUpPointList();
            var menu = app.pickUpPoint.getPickUpPointMenu();
            
            if (!that.locateMeMarker) {
                list.displayError(app.pickUpPoint.LocateMeRequiredMessage);
                return;
            }
            
            menu.setDestination('');
            
            var pickUpPoints = list.getData();
            var pickUpPoint = pickUpPoints[pickUpPointID];
            if (pickUpPoint) {
                var lat1 = that.locateMeMarker.getPosition().lat();
                var lng1 = that.locateMeMarker.getPosition().lng();
                
                that.showRouteToPickUpPoint(lat1, lng1, pickUpPoint, pickUpPointID);
            }
        },
        findRouteToNearestPickUpPoint: function() {
            var list = app.pickUpPoint.getPickUpPointList();
            var menu = app.pickUpPoint.getPickUpPointMenu();
            
            if (!this.locateMeMarker) {
                list.displayError(app.pickUpPoint.LocateMeRequiredMessage);
                return;
            }
            
            menu.setDestination('');
            
            var pickUpPoints = list.getData();
            
            var lat1 = this.locateMeMarker.getPosition().lat();
            var lng1 = this.locateMeMarker.getPosition().lng();
            
            var minDistance = 9999;
            var nearestPickUpPoint = null;
            var nearestPickUpPointID = null;
            
            $.each(pickUpPoints, function(id, pickUpPoint) {
                var lat2 = pickUpPoint.latitude;
                var lng2 = pickUpPoint.longitude;
                
                var distance = app.util.getDistance(lat1, lng1, lat2, lng2);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestPickUpPoint = pickUpPoint;
                    nearestPickUpPointID = id;
                }
            });
            
            if (nearestPickUpPoint) {
                this.showRouteToPickUpPoint(lat1, lng1, nearestPickUpPoint, nearestPickUpPointID);
            }
        },
        createLocateMeMarker: function(position) {
            var that = this;

            that.gmaps.setCenter(position);
            
            if (that.locateMeMarker) {
                that.removeLocateMeMarker();
            }
            
            that.locateMeMarker = that.gmaps.addMarker({
                lat: position.lat,
                lng: position.lng, 
                title: "My location",
                icon: app.urls.staticPath + that.config.mapOptions.myLocationIcon,
                infoWindow: {
                    content: "My location",
                    position: position
                }
            });
        },
        createMarker: function(pickUpPoint) {
            var that = this;
            
            this.gmaps.addMarker({
                lat: pickUpPoint.latitude,
                lng: pickUpPoint.longitude,
                title: pickUpPoint.title,
                icon: app.urls.staticPath + that.config.mapOptions.markerIcon,
                click: function(event) {
                    that.clickMarker(pickUpPoint);
                },
                infoWindow: {
                    content: that.renderInfoBoxItem(pickUpPoint)
                }
            });
        },
        clickMarker: function(pickUpPoint) {
            var that = this;
            that.selectRouteInPickUpPointList(pickUpPoint.id, true);
        },
        hasMarkers: function() {
            return this.gmaps.markers.length ? true : false;
        },
        removeLocateMeMarker: function() {
            var that = this;
            
            that.gmaps.removeMarker(that.locateMeMarker);
            that.locateMeMarker = undefined;
        },
        removeAnyMarkers: function() {
            var that = this;
            that.gmaps.removeMarkers(that.gmaps.markers);
        },
        renderInfoBoxItem: function(pickUpPoint) {
            var template = $('#pup-info-box-tpl').html();
            var rendered = Mustache.render(template, pickUpPoint);
            return rendered;
        },
        selectPickUpPointHandler: function(event) {
            event.preventDefault();
            var pickUpPointID = $(this).attr('data-pup-id');
            app.pickUpPoint.displayPickUpPointInfo(pickUpPointID);
        },
        findRouteToPickUpPointHandler: function (event) {
            event.preventDefault();
            var pickUpPointID = $(this).attr('data-pup-id');
            var map = app.pickUpPoint.getPickUpPointMap();
            map.findRouteToPickUpPoint(pickUpPointID);
        },
        showGeocodeError: function() {
            var list = app.pickUpPoint.getPickUpPointList();
            list.displayError('Not all pickup points were geocoded. Please try again later.');
        },
        removeGeocodeError: function() {
            $('#pup-list').find('.error-message').html('');
        },
        populate: function() {
            var that = this;
            var geoCodedCount = 0;

            if(this.pickUpPointListByDist.length<=0){
            
                if (this.pickUpPointList.getCount() < 1) {
                    return;
                }
                
                $.each(this.pickUpPointList.getData(), function(id, pickUpPoint) {
                    if (('latitude' in pickUpPoint) && ('longitude' in pickUpPoint)){
                        that.createMarker(pickUpPoint);
                        geoCodedCount++;
                    }
                });
                
            }else{
                
                
                $.each(this.pickUpPointListByDist, function(id, pickUpPoint) {
                    
                        if (('latitude' in pickUpPoint.pup) && ('longitude' in pickUpPoint.pup)){
                            that.createMarker(pickUpPoint.pup);
                            geoCodedCount++;
                        }
                    
                });   
            }

            this.reCenter();
        },
        
        refineGmapsResults: function(results,postal,cCode) {
        
            var countryCode="";
            var postCode="";
            var llat;
            var llng;
            var llatc;
            var llngc;
            
            $.each(results, function(ii, addressData) {
                
                if('address_components' in addressData){
                    
                    $.each(addressData.address_components, function(jj, adressComp) {
                
                        $.each(adressComp.types,function(kk,dataType){
                
                            if(dataType === 'country'){
                                countryCode=adressComp.short_name;
                            }
                
                            if(dataType === 'postal_code'){
                                postCode=adressComp.short_name.replace(" ","");
                            }
                        });
                
                    });
                    
                    if(postCode === postal.replace(" ","") && countryCode === cCode ){
                        llat = addressData.geometry.location.lat();
                        llng = addressData.geometry.location.lng();
                    }else if(countryCode === cCode){
                        llatc = addressData.geometry.location.lat();
                        llngc = addressData.geometry.location.lng();
                    }
                    
                }
                
            });
            
            if(llat && llng){
                return {lat:llat,lng:llng};
            }else if(llatc && llngc){
                return {lat:llatc,lng:llngc};
            }
            
            return {};
        },
        locateByPostalCode: function(postal) {
        
            if(this.cache.zipCodeRegex.test(postal)){
                var res = this.cache.zipCodeRegex.exec(postal);
                postal = res[1]+" "+res[2];
            }
        
            var that = this;
            var deferred = $.Deferred();
            var coordinates;
            
            GMaps.geocode({
                componentRestrictions : {
                    country : app.util.siteInfo().countryCode,
                    postalCode: postal
                },
                callback : function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        
                        coordinates= that.refineGmapsResults(results,postal,app.util.siteInfo().countryCode);
                        
                        app.pickUpPoint.menu.setRouteOrigin(postal);
                        that.createLocateMeMarker(coordinates);
                        that.cache.myCoordinates= coordinates;
                        deferred.resolve();
                    } else {
                        that.handleLocationError(status);
                    }
                }
            });
            
            return deferred.promise();
        },
        handleLocationError: function(status) {
            console.log('Geocode was not successful for the following reason: ' + status);
        },
        reCenter: function() {
            return this.hasMarkers() ? this.gmaps.fitZoom() : this.resetMap();
        },
        reCenterMobile: function() {
            if (this.hasMarkers()) {
                this.gmaps.refresh();
                this.gmaps.fitZoom();
            }
        },
        clearMap: function() {
            this.gmaps.hideInfoWindows();
            this.gmaps.removeMarkers();
            this.gmaps.refresh();
        },
        resetMap: function() {
            this.gmaps.setCenter(this.config.mapOptions.latitude, this.config.mapOptions.longitude);
            this.gmaps.setZoom(this.config.mapOptions.zoom);
        },
        bindEvents: function() {
            var that = this;

            this.cache.map.on('click', '.select-button', that.selectPickUpPointHandler);
            this.cache.map.on('click', '.find-route-button', that.findRouteToPickUpPointHandler);
            google.maps.event.addDomListener(window, 'resize', that.reCenter.bind(that));
            $.subscribe('view:map', that.reCenterMobile.bind(that));
        },
        getPUPDistance: function(pickUpPoint){
            var deferred = $.Deferred();
            
            var that = this;
            var distance=0;
            
            if(pickUpPoint.latitude !== undefined && pickUpPoint.longitude !== undefined){
                distance = Math.pow((pickUpPoint.latitude-that.cache.myCoordinates.lat),2)+Math.pow((pickUpPoint.longitude-that.cache.myCoordinates.lng),2);
            }
            
            pickUpPoint.distance=distance;
            deferred.resolve();
            
            return deferred.promise();
        },
        sortAllPUPByDistance: function(){
            
            var promises = [];
            var i=0;
            for (var pickUpPointID in this.pickUpPointList.data) {
                var pickUpPoint = this.pickUpPointList.data[pickUpPointID];
                    
                var promise = this.getPUPDistance(pickUpPoint);
                promises.push(promise);
                i+=1;
            }//for
            
            this.sortPUPsBydistance();
            
            return $.when.apply(undefined, promises).promise();
        
        },
        initSortPUPByDistance: function(){
            var promise;
            promise = this.sortAllPUPByDistance();
            promise.done(this.populate.bind(this));
        },
        sortPUPsBydistance: function(){
        
            var pairs=[];
            var that=this;
            var limit;
            
            for (var pickUpPointID in this.pickUpPointList.data) {
                
                if( !(that.pickUpPointList.isGeocoded() ) ){
                    
                    if(that.pickUpPointList.data[pickUpPointID].geocoded){
                        
                        pairs.push({
                            pup:that.pickUpPointList.data[pickUpPointID],
                            distance:that.pickUpPointList.data[pickUpPointID].distance
                        });
                    }
                    
                }else{
                    pairs.push({
                        pup:that.pickUpPointList.data[pickUpPointID],
                        distance:that.pickUpPointList.data[pickUpPointID].distance
                    });
                }
                
            }//for
            
            pairs.sort(this.pupsort);
            
            this.pickUpPointListByDist= pairs;
            
            limit=this.getPUPListLimit();
            limit= (limit===undefined)?pairs.length:limit;
            this.pickUpPointList.renderOrderedList(pairs,limit);
            
        },
        getPUPListLimit: function(){
            var lim; // if lim is undefined it means there is no limit 
            
            lim= (app.util.siteInfo().countryCode===this.cache.countryCodeFR)?this.cache.limitFR:undefined;
            
            return lim;
        },
        pupsort: function(aPUP, bPUP){
            return aPUP.distance-bPUP.distance;
        },
        sortPUPsPreliminar: function (){
            
            for (var ii in this.pickUpPointList.data) {
                
                var pickUpPoint = this.pickUpPointList.data[ii];
                this.getPUPDistance(pickUpPoint);
                
            }
            
            var pairs=[];
            var that=this;
            
            for (var jj in this.pickUpPointList.data) {
                pairs.push({
                    pup:that.pickUpPointList.data[jj],
                    distance:that.pickUpPointList.data[jj].distance
                });
                
            }
            
            pairs.sort(this.pupsort);
            return pairs;
        },  
        geocodePickUpPoint: function(pickUpPoint) {
            var deferred = $.Deferred();
            var address = this.pickUpPointList.getFormattedAddress(pickUpPoint);
            var postalCode = this.pickUpPointList.getAddressPostalCode(pickUpPoint);
            
            GMaps.geocode({
                componentRestrictions : {
                    country : app.util.siteInfo().countryCode,
                    postalCode: postalCode 
                },
                address: address,
                callback: function(results, status) {
                    if (status === 'OK') {
                        var latlng = results[0].geometry.location;
                        pickUpPoint['latitude'] = latlng.lat();
                        pickUpPoint['longitude'] = latlng.lng();
                    }else{
                        console.log("GEOCODE_ERROR:'"+status+"'");
                    }

                    deferred.resolve();
                }
            });

            return deferred.promise();
        },
        geocodeAllPickUpPoints: function() {
            var promises = [];
            var limit =this.cache.limitFR;
            var curr=0;
            
            var pairs = this.sortPUPsPreliminar();
            
            for (var pickUpPointID in pairs) {
            
                if(curr<limit){
            
                    var pickUpPoint = pairs[pickUpPointID];

                    if (!('address' in pickUpPoint.pup)) {
                        return;
                    }

                    var promise = this.geocodePickUpPoint(pickUpPoint.pup);
                    pickUpPoint.pup.geocoded=true;
                    promises.push(promise);
           
                }
                
                curr+=1;
            }//for

            return $.when.apply(undefined, promises).promise();
        },
        initGeoCode: function() {
            var promise = this.geocodeAllPickUpPoints();
            //promise.done(this.populate.bind(this));
            promise.done(this.initSortPUPByDistance.bind(this));
        },
        init: function() {
            this.locateMeMarker = null;
            this.currentRoute = null;
            this.initCache();
            this.bindEvents();
            this.initMap();
            
            if (this.pickUpPointList.isGeocoded()) {
                this.locateByPostalCode(app.pickUpPoint.getPostalCode()).done(this.initSortPUPByDistance.bind(this));
            } else {
                this.locateByPostalCode(app.pickUpPoint.getPostalCode()).done(this.initGeoCode.bind(this));
            }
            
        }
    };

    app.pup = app.pup || {};
    app.pup.PickUpPointMap = PickUpPointMap;

}(window.app = window.app || {}, jQuery));
/*global _, window, google, InfoBox */
(function(app, $) {

    var Google = google.maps,
        AppUrls = app.urls,
        Constants = app.storeLocator.StoreLocatorConstants,
        Helper = app.storeLocator.StoreLocatorHelper;

    var ARROW_WIDTH_OFFSET = 15,
        ARROW_HEIGHT_OFFSET = 22;

    function StoreLocatorMap(locator) {
        if (!(this instanceof StoreLocatorMap)) {
            return new StoreLocatorMap(locator);
        }

        this.locator = locator;
        this.config = locator.getConfig();
        this.cache = locator.getCache();

        this.icons = null;
        this.map = null;
        this.markers = [];
        this.selectedMarker = null;
        this.infoBox = null;

        this.init();
    }

    StoreLocatorMap.createInfoBox = function() {
        var boxOptions = {
            disableAutoPan: false,
            maxWidth: 0,
            zIndex: null,
            boxStyle: {
                opacity: 1
            },
            closeBoxMargin: "10px",
            closeBoxURL: AppUrls.staticPath + "/images/storelocator/store-locator-close-icon.png",
            infoBoxClearance: new Google.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: false,
            alignBottom: false
        };

        return new InfoBox(boxOptions);
    };

    StoreLocatorMap.getInfoBoxOffset = function(marker) {
        var icon = marker.getIcon(),
            width = (icon.size.width / 2) + ARROW_WIDTH_OFFSET,
            height = -(icon.size.height + ARROW_HEIGHT_OFFSET);

        return new Google.Size(width, height);
    };

    StoreLocatorMap.prototype = {

        initIcons: function() {
            this.icons = this.config.markerIcons;
        },

        initMap: function() {
            this.map = new Google.Map(document.getElementById("map-canvas"), this.config.mapOptions);
        },

        bindEvents: function() {
            var that = this;

            var panorama = this.map.getStreetView();
            Google.event.addListener(panorama, "visible_changed", function() {
                that.locator.setContentVisible(!panorama.getVisible());
                that.locator.resize();
            });

            Google.event.addListener(this.map, "center_changed", function() {
                if (that.locator.shouldAutoSearch()) {
                    that.locator.autoSearch();
                }
            });
        },

        setInitialLocation: function() {
            this.map.setCenter(this.config.mapOptions.center);
            this.map.setZoom(this.config.mapOptions.zoom);
        },

        getMap: function() {
            return this.map;
        },

        getZoom: function() {
            return this.getMap().getZoom();
        },

        getCenter: function() {
            return this.getMap().getCenter();
        },

        getDistanceInMeters: function(currentLocation) {
            return Google.geometry.spherical.computeDistanceBetween(currentLocation, this.getCenter());
        },

        getStoreIcon: function(store, state) {
            return this.icons[Helper.getStoreIconType(store)][state];
        },

        clearMarkers: function() {
            var i, len = this.markers.length;
            for(i = 0; i < len; i++) {
                this.markers[i].setMap(null);
            }
            this.markers.length = 0;
            this.selectedMarker = null;
        },

        getMarker: function(store) {
            var i, len = this.markers.length;
            for (i = 0; i < len; i++) {
                if (this.markers[i].get("storeId") === store.id) {
                    return this.markers[i];
                }
            }
            return null;
        },

        getMarkerStore: function(marker) {
            var storeId = marker.get("storeId");
            return this.locator.getStore(storeId);
        },

        createMarker: function(store) {
            var position = new Google.LatLng(store.latitude, store.longitude);

            return new Google.Marker({
                position: position,
                map: this.map,
                //animation: Google.Animation.DROP,
                title: this.config.showMarkerTitle ? Helper.getStoreTitle(store) : null,
                icon: this.getStoreIcon(store, Constants.IconState.Normal),
                shadow: this.getStoreIcon(store, Constants.IconState.Shadow),
                storeId: store.id
            });
        },

        createInfoBoxContent: function(marker) {
            var store = this.getMarkerStore(marker);

            var elId =  _.sprintf("store-info-box-%s", store.id);
            var storeDiv = Helper.createStoreDiv("<div/>", store, this.config, {
                    id: elId,
                    includeThumbnail: true,
                    includeStoreHours: true,
                    includeURL: true,
                    includeDirections: false
                }
            );

            return $("<div/>", {
                "class" : "store-box-info"
            }).append(storeDiv);
        },

        closeInfoBox: function() {
            if (this.infoBox) {
                this.infoBox.close();
            }
        },

        openInfoBox: function(marker) {
            if (this.infoBox) {
                this.closeInfoBox();
            }
            else {
                this.infoBox = StoreLocatorMap.createInfoBox();
            }

            var content = this.createInfoBoxContent(marker);
            this.infoBox.setContent(content.get(0));

            var offset = StoreLocatorMap.getInfoBoxOffset(marker);
            this.infoBox.setOptions({ pixelOffset: offset });

            this.infoBox.open(this.map, marker);
        },

        addMarkerOverEvent: function(marker) {
            var that = this;
            Google.event.addListener(marker, "mouseover", function() {
                if (that.selectedMarker !== marker) {
                    var store = that.getMarkerStore(marker),
                        icon = that.getStoreIcon(store, Constants.IconState.Over);
                    marker.setIcon(icon);
                }
            });
        },

        addMarkerOutEvent: function(marker) {
            var that = this;
            Google.event.addListener(marker, "mouseout", function() {
                if (that.selectedMarker !== marker) {
                    var store = that.getMarkerStore(marker),
                        icon = that.getStoreIcon(store, Constants.IconState.Normal);
                    marker.setIcon(icon);
                }
            });
        },

        addMarkerClickEvent: function(marker, clickFunc) {
            Google.event.addListener(marker, "click", function() {
                clickFunc(marker);
            });
        },

        setMarkerSelected: function(marker, selected) {
            if (this.config.markerSelectedEnabled) {
                var store = this.getMarkerStore(marker),
                    icon = this.getStoreIcon(store, selected ? Constants.IconState.Selected : Constants.IconState.Normal);

                if (icon) {
                    marker.setIcon(icon);
                }
            }

            this.selectedMarker = selected ? marker : null;
        },

        handleMarkerClick: function(marker, syncList) {
            this.locator.setAutoSearchEnabled(false);

            if (this.selectedMarker) {
                this.setMarkerSelected(this.selectedMarker, false);
            }

            this.map.setCenter(marker.getPosition());
            this.setMarkerSelected(marker, true);
            this.openInfoBox(marker);

            if (this.locator.hasList() && syncList) {
                this.locator.getList().syncListStore(this.getMarkerStore(marker));
            }

            this.locator.setAutoSearchEnabled(true);
        },

        addMarkerEvents: function(marker) {
            if (this.config.markerOverEnabled && !this.locator.isTouch()) {
                this.addMarkerOverEvent(marker);
                this.addMarkerOutEvent(marker);
            }

            var that = this;
            this.addMarkerClickEvent(marker, function(marker) {
                that.handleMarkerClick(marker, true);
            });
        },

        addMarker: function(store) {
            var marker = this.createMarker(store);
            this.addMarkerEvents(marker);
            this.markers.push(marker);
            return marker;
        },

        syncMarkerStore: function(store) {
            var marker = this.getMarker(store);
            if (marker) {
                this.handleMarkerClick(marker, false);
            }
        },

        reset: function() {
            this.clearMarkers();
            this.closeInfoBox();
        },

        syncMapUI: function(count, bounds) {
            if (count > 0) {
                this.map.fitBounds(bounds);
                this.map.setCenter(bounds.getCenter());
            }
        },

        filterMarker: function(marker, filters, store) {
            var visible = this.locator.passesFilters(filters, store);
            marker.setVisible(visible);
            return visible;
        },

        applyFilters: function() {
            var bounds = new Google.LatLngBounds(),
                filters = this.locator.getSelectedFilters(),
                count = 0;

            var i, len = this.markers.length;
            for (i = 0; i < len; i++) {
                var marker = this.markers[i],
                    store = this.getMarkerStore(marker),
                    visible = this.filterMarker(marker, filters, store);

                if (visible) {
                    bounds.extend(marker.getPosition());
                    count++;
                }
                else if (marker === this.selectedMarker) {
                    this.closeInfoBox();
                }
            }

            this.syncMapUI(count, bounds);

            return count;
        },

        populate: function(userSearch) {
            this.reset();

            var bounds = new Google.LatLngBounds(),
                count = 0;

            if (this.locator.getStoreCount() > 0) {
                var that = this,
                    filters = this.locator.getSelectedFilters();

                $.each(this.locator.getStores(), function(id, store) {
                    if (Helper.hasCoordinates(store)) {
                        var marker = that.addMarker(store),
                            visible = that.filterMarker(marker, filters, store);

                        if (visible) {
                            bounds.extend(marker.getPosition());
                            count++;
                        }
                    }
                });
            }

            if (userSearch) {
                if (count === 0) {
                    this.setInitialLocation();
                }
                else {
                    this.syncMapUI(count, bounds);
                }
            }

            return count;
        },

        init: function() {
            this.initIcons();
            this.initMap();
            this.bindEvents();
        }
    };

    app.storeLocator = app.storeLocator || {};
    app.storeLocator.StoreLocatorMap = StoreLocatorMap;

}(window.app = window.app || {}, jQuery));

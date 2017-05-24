/*global _, window, google, navigator */
(function(app, $) {

    var Google =  google.maps,
        AppConstants = app.constant,
        AppResources = app.resources,
        AppUtils = app.util,
        Constants = app.storeLocator.StoreLocatorConstants,
        Helper = app.storeLocator.StoreLocatorHelper;

    var Defaults = {
        mapOptions: {
            zoom: 5,
            center: new Google.LatLng(37.09024, -95.712891), // USA
            mapTypeId: Google.MapTypeId.ROADMAP,
            mapTypeControl: true,
            overviewMapControl: false,
            rotateControl: false,
            panControl: true,
            panControlOptions: {
                position: Google.ControlPosition.RIGHT_TOP
            },
            zoomControl: true,
            zoomControlOptions: {
                position: Google.ControlPosition.RIGHT_TOP
            },
            scaleControl: true,
            streetViewControl: true,
            scrollwheel: false,
            showMarkerTitle: false
        },
        radius: 15,
        expandRadius: 25,
        distanceUnit: Constants.DistanceUnit.Miles,
        limit: 100,
        autoSearchMinZoom: 9,
        autoSearchDelay: 750,
        listItemSelectedEnabled: false,
        listItemOverEnabled: false,
        listItemIcons: Helper.getListItemIcons(),
        markerSelectedEnabled: false,
        markerOverEnabled: false,
        markerIcons: Helper.getMarkerIcons()
    };

    function StoreLocator(settings) {
        if (!(this instanceof StoreLocator)) {
            return new StoreLocator(settings);
        }

        this.config = $.extend(true, {}, Defaults, settings);

        this.list = null;
        this.map = null;
        this.data = null;
        this.currentLocation = null;
        this.currentRadius = null;
        this.currentDistanceUnit = null;
        this.currentLimit = null;
        this.autoSearchEnabled = true;
        this.timer = null;

        this.init();
    }

    StoreLocator.prototype = {

        getConfig: function() {
            return this.config;
        },

        getCache: function() {
            return this.cache;
        },

        getList: function() {
            return this.list;
        },

        hasList: function() {
            return (this.getList());
        },

        getMap: function() {
            return this.map;
        },

        hasMap: function() {
            return (this.getMap());
        },

        getData: function() {
            return this.data;
        },

        setData: function(data) {
            this.data = data;
        },

        hasData: function() {
            return (this.getData());
        },

        getStores: function() {
            return this.hasData() ? this.getData().stores : {};
        },

        getStoreCount: function() {
            var total = this.hasData() ? this.getData().total : 0;
            return parseInt(total, 10);
        },

        getStore: function(storeId) {
            return this.getStores()[storeId];
        },

        getCurrentLocation: function() {
            return this.currentLocation;
        },

        setCurrentLocation: function(location) {
            this.currentLocation = location;
        },

        isCurrentLocationSet: function() {
            return (this.getCurrentLocation());
        },

        getCurrentRadius: function() {
            return this.currentRadius;
        },

        setCurrentRadius: function(radius) {
            this.currentRadius = radius;
        },

        isCurrentRadiusSet: function() {
            return $.isNumeric(this.getCurrentRadius());
        },

        getCurrentDistanceUnit: function() {
            return this.currentDistanceUnit;
        },

        setCurrentDistanceUnit: function(distanceUnit) {
            this.currentDistanceUnit = distanceUnit;
        },

        isCurrentDistanceUnitSet: function() {
            return Constants.DistanceUnit.Kilometers === this.getCurrentDistanceUnit() ||
                        Constants.DistanceUnit.Miles === this.getCurrentDistanceUnit();
        },

        getCurrentLimit: function() {
            return this.currentLimit;
        },

        setCurrentLimit: function(limit) {
            this.currentLimit = limit;
        },

        isCurrentLimitSet: function() {
            return $.isNumeric(this.getCurrentLimit());
        },

        setAutoSearchEnabled: function(enabled) {
            this.autoSearchEnabled = enabled;
        },

        isAutoSearchEnabled: function() {
            return this.autoSearchEnabled;
        },

        areSearchParametersSet: function() {
            return this.isCurrentLocationSet() && this.isCurrentRadiusSet() && this.isCurrentDistanceUnitSet();
        },

        areKilometersUsed: function() {
            return Constants.DistanceUnit.Kilometers === this.getCurrentDistanceUnit();
        },

        getUnits: function() {
            return this.areKilometersUsed() ? AppResources.storelocator.KILOMETERS : AppResources.storelocator.MILES;
        },

        initCache: function() {
            var cache = {
                wrapperDiv: $("#wrapper"),
                pageDiv: $(".pt_store-locator"),
                footerDiv: $("footer"),
                contentDiv: $("#store-locator-content"),
                searchDiv: $("#store-locator-search"),
                resultsDiv: $("#store-locator-results")
            };

            cache.searchForm = cache.searchDiv.find("#store-locator-search-form");
            cache.refineSearchBtn = cache.searchForm.find("#refine-search-btn");
            cache.filtersHeader = cache.searchForm.find("#filters-header");
            cache.filtersList = cache.searchForm.find("#filters-list");
            cache.filters = cache.searchForm.find(".filter");
            cache.scrollerDiv = cache.resultsDiv.find("#stores-scroller");
            cache.storeProgress = cache.resultsDiv.find("#stores-progress");
            cache.storeMessage = cache.resultsDiv.find("#stores-message");
            cache.storesFooter = cache.resultsDiv.find("#stores-footer");
            cache.storesList = cache.scrollerDiv.find("#stores");
            cache.searchRadius = cache.storesFooter.find("#search-radius");
            cache.expandSearchBtn = cache.storesFooter.find("#expand-search-btn");

            this.cache = cache;
        },

        isListEnabled: function() {
            return true;
        },

        isMapEnabled: function() {
            return !AppUtils.isSmallDevice();
        },

        isResizingEnabled: function() {
            return !AppUtils.isSmallDevice();
        },

        initList: function() {
            this.list = app.storeLocator.StoreLocatorList(this);
        },

        initMap: function() {
            this.map = app.storeLocator.StoreLocatorMap(this);
        },

        setContentVisible: function(visible) {
            AppUtils.setElementVisible(this.cache.contentDiv, visible);
        },

        setFiltersHeaderVisible: function(visible) {
            AppUtils.setElementVisible(this.cache.filtersHeader, visible);
        },

        setMessage: function(message) {
            var hasMessage = !AppUtils.isBlank(message);
            this.cache.storeMessage.text(hasMessage ? message : "");
            AppUtils.setElementVisible(this.cache.storeMessage, hasMessage);
        },

        getStoreCountMessage: function(count) {
            var message = null;

            if (count > 0) {
                if (!this.isCurrentLimitSet()) {
                    message = _.sprintf(AppResources.storelocator.SEARCH_SUCCESS, count);
                }
            }
            else {
                message = AppResources.storelocator.SEARCH_EMPTY;
            }

            return message;
        },

        setStoreCountMessage: function(count) {
            var message = this.getStoreCountMessage(count);
            this.setMessage(message);
        },

        setProgressVisible: function(visible) {
            AppUtils.setElementVisible(this.cache.storeProgress, visible);
        },

        reset: function() {
            this.setFiltersExpanded(false);
            this.setFiltersHeaderVisible(false);

            if (this.hasList()) {
                this.getList().reset();
            }

            if (this.hasMap()) {
                this.getMap().reset();
            }
        },

        populate: function(options) {
            this.setAutoSearchEnabled(false);

            var listCount = 0, mapCount = 0;

            if (this.hasList()) {
                listCount = this.getList().populate(options.userSearch);
            }

            if (this.hasMap()) {
                mapCount = this.getMap().populate(options.userSearch);
            }

            this.setStoreCountMessage(Math.max(listCount, mapCount));

            this.setAutoSearchEnabled(true);
        },

        createSearchHandler: function() {
            var that = this;
            return {
                onGeoCodeFailure: function(status) {
                    that.setMessage(AppResources.storelocator.UNKNOWN_ADDRESS);
                },

                onSearchStart: function() {
                    //that.setProgressVisible(true);
                    that.setMessage(AppResources.storelocator.SEARCHING);
                },

                onSearchDone: function(data, lat, lng, options) {
                    that.setData(data);
                    that.setCurrentLocation(new Google.LatLng(lat, lng));

                    that.setProgressVisible(false);

                    that.setFiltersHeaderVisible(that.getStoreCount() > 0);

                    that.populate(options);

                    if (that.isResizingEnabled()) {
                        that.resize();
                    }
                },

                onSearchFail: function() {
                    that.setMessage(AppResources.storelocator.SEARCH_ERROR);
                }
            };
        },

        setInitialSearchParameters: function() {
            this.setCurrentRadius(this.config.radius);
            this.setCurrentDistanceUnit(this.config.distanceUnit);
            this.setCurrentLimit(this.config.limit);
        },

        getSearchOptions: function(userSearch) {
            return {
                userSearch: userSearch,
                radius: this.getCurrentRadius(),
                distanceUnit: this.getCurrentDistanceUnit(),
                limit: this.getCurrentLimit()
            };
        },

        searchByCoords: function(lat, lng, userSearch) {
            this.reset();

            var handler = this.createSearchHandler();
            Helper.searchStoresByCoords(lat, lng, handler, this.getSearchOptions(userSearch));
        },

        searchByAddress: function(address, userSearch) {
            this.reset();

            var handler = this.createSearchHandler();
            Helper.searchStoresByAddress(address, handler, this.getSearchOptions(userSearch));
        },

        handleGeoLocation: function(position) {
            var coords = new Google.LatLng(position.coords.latitude, position.coords.longitude);
            this.setCurrentLocation(coords);
            this.searchByCoords(coords.lat(), coords.lng(), true);
        },

        handleNoGeoLocation: function(browserSupported) {
            this.setCurrentLocation(null);
            if (this.hasMap()) {
                this.getMap().setInitialLocation();
            }
        },

        setInitialLocation: function() {
            this.setInitialSearchParameters();

            var that = this;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    that.handleGeoLocation(position);
                }, function() {
                    that.handleNoGeoLocation(true);
                });
            }
            else {
                that.handleNoGeoLocation(false);
            }

            that.setContentVisible(true);
        },

        getFiltersCount: function() {
            return this.cache.filters.length;
        },

        getSelectedFilters: function() {
            var filters = [];

            var checks = this.cache.filters.filter(":checked");
            checks.each(function() {
                filters.push($(this).val());
            });

            return filters;
        },

        passesFilter: function(filter, store) {
            switch (filter) {
                case Constants.StoreFilters.OFFICIAL:
                    return Helper.isFlagshipStore(store);
                case Constants.StoreFilters.OUTLET:
                    return Helper.isOutletStore(store);
                case Constants.StoreFilters.SKATEBOARDING:
                    return Helper.isSkateboardingStore(store);
                case Constants.StoreFilters.OTHER:
                    return Helper.isOtherStore(store);
                default:
                    return false;
            }
        },

        passesFilters: function(filters, store) {
            if (filters.length === 0 || filters.length === this.getFiltersCount()) {
                return true;
            }

            var that = this,
                passes = false;

            $.each(filters, function(index, filter) {
                passes = that.passesFilter(filter, store);
                return !passes;
            });

            return passes;
        },

        applyFilters: function() {
            this.setAutoSearchEnabled(false);

            var listCount = 0, mapCount = 0;

            if (this.hasList()) {
                listCount = this.getList().applyFilters();
            }

            if (this.hasMap()) {
                mapCount = this.getMap().applyFilters();
            }

            this.setStoreCountMessage(Math.max(listCount, mapCount));

            this.setAutoSearchEnabled(true);
        },

        isTouch: function() {
            return AppUtils.isTouchDevice();
        },

        getPageHeight: function() {
            var pageTopOffset = this.cache.pageDiv.offset().top,
                footerHeight = this.cache.footerDiv.outerHeight();

            return $(window).height() - (pageTopOffset + footerHeight);
        },

        resizePage: function() {
            this.cache.pageDiv.css({ 'height': this.getPageHeight() });
        },

        resize: function() {
            this.resizePage();

            if (this.hasList()) {
                this.getList().resizeScroller();
            }
        },

        initializeResizeHacks: function() {
            var that = this;

            this.cache.wrapperDiv.css("overflow", "hidden");
            this.cache.footerDiv.css("zIndex", parseInt(this.cache.contentDiv.css("zIndex"), 10) + 1);

            $(window).resize(function() {
                that.resize();
            });

            // handle overlay
            app.overlay.clicked(function() {
                setTimeout(function() {
                    that.resize();
                },
                AppConstants.STANDRD_FADE_DURATION + 200);
            });

            // handle slider
            var handleSlider = function(eventName, sliderArea) {
                if (sliderArea === AppConstants.SLIDER.LOGIN_PANEL) {
                    that.resize();
                }
            };
            $.subscribe(AppConstants.SLIDER.EXPANDED, handleSlider);
            $.subscribe(AppConstants.SLIDER.COLLAPSED, handleSlider);
        },

        calculateCurrentDistance: function() {
            var meters = this.getMap().getDistanceInMeters(this.getCurrentLocation());
            return this.areKilometersUsed() ? AppUtils.metersToKilometers(meters) : AppUtils.metersToMiles(meters);
        },

        isInAutoSearchZoom: function() {
            return this.getMap().getZoom() >= this.config.autoSearchMinZoom;
        },

        isInAutoSearchRadius: function() {
            if (this.areSearchParametersSet()) {
                var distance = this.calculateCurrentDistance();
                return distance > (this.getCurrentRadius() / 2);
            }

            return false;
        },

        shouldAutoSearch: function() {
            return this.isAutoSearchEnabled() && this.isInAutoSearchZoom() && this.isInAutoSearchRadius() && !Helper.isLoginSliderActive();
        },

        autoSearch: function() {
            if (this.timer) {
                window.clearTimeout(this.timer);
            }

            var coords = this.getMap().getCenter();
            this.setCurrentLocation(coords);

            var that = this;
            this.timer = window.setTimeout(function() {
                that.searchByCoords(coords.lat(), coords.lng(), false);
            },
            this.config.autoSearchDelay);
        },

        expandSearch: function() {
            this.setCurrentRadius(this.config.expandRadius);

            if (this.areSearchParametersSet()) {
                this.getList().syncSearchRadius();
                this.searchByCoords(this.getCurrentLocation().lat(), this.getCurrentLocation().lng(), true);
            }
        },

        getRadiusWithUnits: function() {
            return _.sprintf("%s %s", this.getCurrentRadius(), this.getUnits());
        },

        areFiltersExpanded: function() {
           return this.cache.filtersHeader.hasClass("expanded");
        },

        setFiltersExpanded: function(visible) {
            var that = this;

            var callback = function() {
                if (that.isResizingEnabled()) {
                    that.resize();
                }
            };

            if (!visible && this.areFiltersExpanded()) {
                this.cache.filtersHeader.removeClass("expanded");
                this.cache.filtersList.slideUp("fast", callback);
            }
            else if (visible && !this.areFiltersExpanded()) {
                this.cache.filtersHeader.addClass("expanded");
                this.cache.filtersList.slideDown("fast", callback);
            }
        },

        toggleFilters: function() {
            this.setFiltersExpanded(!this.areFiltersExpanded());
        },

        handleSearchFormSubmit: function() {
            var address = this.cache.searchForm.find("#address").val();
            if (address) {
                this.searchByAddress(address, true);
            }
        },

        bindEvents: function() {
            var that = this;

            this.cache.refineSearchBtn.on("click", function(){
                that.toggleFilters();
            });

            this.cache.filters.on("click", function() {
                that.applyFilters();
            });

            this.cache.searchForm.submit(function(e) {
                e.preventDefault();
                that.handleSearchFormSubmit();
            });

            this.cache.expandSearchBtn.on("click", function() {
                that.expandSearch();
                that.cache.expandSearchBtn.remove();
            });
        },

        init: function() {
            this.initCache();

            if (this.isListEnabled()) {
                this.initList();
            }

            if (this.isMapEnabled()) {
                this.initMap();
            }

            this.setInitialLocation();

            if (this.isResizingEnabled()) {
                this.initializeResizeHacks();
                this.resize();
            }

            this.bindEvents();
        }
    };

    app.storeLocator = app.storeLocator || {};
    app.storeLocator.StoreLocator = StoreLocator;

}(window.app = window.app || {}, jQuery));

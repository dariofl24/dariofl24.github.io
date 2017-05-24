/*global window, google */
(function(app, $) {

    var Google =  google.maps,
        AppConstants = app.constant,
        AppUtils = app.util,
        AppUrls = app.urls,
        Constants = app.storeLocator.StoreLocatorConstants;

    var getIconDefinition = function(path, width, height, offsetX, offsetY) {
        var icon = {
            url: AppUrls.staticPath + path,
            size: new Google.Size(width, height)
        };

        if ($.isNumeric(offsetX) && $.isNumeric(offsetY)) {
            icon.origin = new Google.Point(0, 0);
            icon.anchor = new Google.Point(offsetX, offsetY);
        }

        return icon;
    };

    var getStateIcons = function(normalIcon, shadowIcon, overIcon, selectedIcon) {
        var stateIcons = {};
        stateIcons[Constants.IconState.Normal] = normalIcon;
        stateIcons[Constants.IconState.Shadow] = shadowIcon;
        stateIcons[Constants.IconState.Over] = overIcon;
        stateIcons[Constants.IconState.Selected] = selectedIcon;
        return stateIcons;
    };

    var getTypeIcons = function(converseStateIcons, otherStateIcons) {
        var typeIcons = {};
        typeIcons[Constants.IconType.Converse] = converseStateIcons;
        typeIcons[Constants.IconType.Other] = otherStateIcons;
        return typeIcons;
    };

    var MarkerStarIcon = getIconDefinition("/images/storelocator/store_locator_star.png", 28, 37),
        MarkerStarShadowIcon = getIconDefinition("/images/storelocator/store_locator_star_shadow.png", 33, 19, 7, 19),
        MarkerPinIcon = getIconDefinition("/images/storelocator/store_locator_pin.png", 16, 24),
        MarkerPinShadowIcon = getIconDefinition("/images/storelocator/store_locator_pin_shadow.png", 21, 13, 2, 13),
        ListItemStarIcon = getIconDefinition("/images/storelocator/list-star.png", 18, 18),
        ListItemPinIcon = MarkerPinIcon;

    var MarkerConverseStateIcons = getStateIcons(MarkerStarIcon, MarkerStarShadowIcon, null, null),
        MarkerOtherStateIcons = getStateIcons(MarkerPinIcon, MarkerPinShadowIcon, null, null),
        ListItemConverseStateIcons = getStateIcons(ListItemStarIcon, null, null, null),
        ListItemOtherStateIcons = getStateIcons(ListItemPinIcon, null, null, null);

    var ListItemIcons = getTypeIcons(ListItemConverseStateIcons, ListItemOtherStateIcons),
        MarkerIcons = getTypeIcons(MarkerConverseStateIcons, MarkerOtherStateIcons);

    var StoreLocatorHelper = {

        getListItemIcons: function() {
            return ListItemIcons;
        },

        getMarkerIcons: function() {
            return MarkerIcons;
        },

        isLoginSliderActive: function() {
            return app.slider.isActive(AppConstants.SLIDER.LOGIN_PANEL);
        },

        isFlagshipStore: function(store) {
            return store.flagship;
        },

        isOutletStore: function(store) {
            return store.outlet;
        },

        isSkateboardingStore: function(store) {
            return store.type === Constants.StoreType.SKATEBOARDING;
        },

        isConverseStore: function(store) {
            return StoreLocatorHelper.isFlagshipStore(store) || StoreLocatorHelper.isOutletStore(store);
        },

        isOtherStore: function(store) {
            return !StoreLocatorHelper.isConverseStore(store) && !StoreLocatorHelper.isSkateboardingStore(store);
        },

        hasCoordinates: function(store) {
            return store.latitude && store.longitude;
        },

        getStoreTitle: function(store) {
            return AppUtils.arrayToString([ store.name, store.address1, store.address2, store.city, store.stateCode, store.postalCode ], ', ');
        },

        getStoreIconType: function(store) {
            return StoreLocatorHelper.isConverseStore(store) ? Constants.IconType.Converse : Constants.IconType.Other;
        },

        constructSearchUrl: function(lat, lng, options) {
            var searchUrl = AppUrls.storeLocatorSearch;
            searchUrl = AppUtils.appendParamToURL(searchUrl, 'lat', lat);
            searchUrl = AppUtils.appendParamToURL(searchUrl, 'lng', lng);
            searchUrl = AppUtils.appendParamToURL(searchUrl, 'rd', options.radius);
            searchUrl = AppUtils.appendParamToURL(searchUrl, 'du', options.distanceUnit);
            searchUrl = AppUtils.appendParamToURL(searchUrl, 'lm', options.limit);

            return searchUrl;
        },

        geoCode: function(address, callback) {
            var geocoder = new Google.Geocoder();
            geocoder.geocode({ 'address': address }, function(results, status) {
                callback(results, status);
            });
        },

        searchStoresByAddress: function(address, handler, options) {
            StoreLocatorHelper.geoCode(address, function(results, status) {
                if (status === Google.GeocoderStatus.OK) {
                    var coords = results[0].geometry.location;
                    StoreLocatorHelper.searchStoresByCoords(coords.lat(), coords.lng(), handler, options);
                }
                else {
                    if ($.isFunction(handler.onGeoCodeFailure)) {
                        handler.onGeoCodeFailure(status);
                    }
                }
            });
        },

        searchStoresByCoords: function(lat, lng, handler, options) {
            if ($.isFunction(handler.onSearchStart)) {
                handler.onSearchStart();
            }

            $.getJSON(StoreLocatorHelper.constructSearchUrl(lat, lng, options))
                 .done(function(data) {
                    if ($.isFunction(handler.onSearchDone)) {
                        handler.onSearchDone(data, lat, lng, options);
                    }
                 })
                 .fail(function(jqxhr, textStatus, error) {
                    if ($.isFunction(handler.onSearchFail)) {
                        handler.onSearchFail(jqxhr, textStatus, error);
                    }
                });
        },

        getStoreDivIcon: function(store, config) {
            var iconType = StoreLocatorHelper.getStoreIconType(store);
            var icon = config.listItemIcons[iconType][Constants.IconState.Normal];
            return icon.url;
        },

        createStoreDiv: function(elStr, store, config, options) {
            var divOptions = $.extend({ includeThumbnail: false, includeStoreHours: false, includeURL: false, includeDirections: false }, options);

            var storeImageDiv =  $("<div/>", {
                "class" : "image"
            });

            storeImageDiv.append($("<img/>", {
                src : StoreLocatorHelper.getStoreDivIcon(store, config)
            }));

            var storeHeaderDiv = $("<div/>", {
                "class" : "header"
            });

            storeHeaderDiv.append($("<div/>", {
                "class" : "name",
                text: store.name
            }));

            storeHeaderDiv.append($("<div/>", {
                "class" : "distance",
                text: store.distance
            }));

            var storeInfoDiv = $("<div/>", {
                "class" : "info"
            });

            storeInfoDiv.append(storeHeaderDiv);

            if (store.image && divOptions.includeThumbnail) {
                storeInfoDiv.append($("<img/>", {
                    "class" : "thumbnail",
                    src: store.image
                }));
            }

            storeInfoDiv.append($("<div/>", {
                "class" : "address-line1",
                text: AppUtils.arrayToString([ store.address1, store.address2 ], ', ')
            }));

            storeInfoDiv.append($("<div/>", {
                "class" : "address-line2",
                text: AppUtils.arrayToString([ store.city, store.stateCode ], ', ') + ' ' + store.postalCode
            }));

            if (store.phone) {
                storeInfoDiv.append($("<a/>", {
                    "class" : "phone",
                    href: "tel:" + store.phone,
                    text: store.phone
                }));
            }

            if (store.storeHours && divOptions.includeStoreHours) {
                storeInfoDiv.append($("<p/>", {
                    "class" : "store-hours-title",
                    text: app.resources.storelocator.STOREHOURS_TITLE
                }));
                storeInfoDiv.append($("<div/>", {
                    "class" : "hours",
                    html: store.storeHours
                }));
            }

            if (store.url && divOptions.includeURL) {
                storeInfoDiv.append($("<a/>", {
                    "class" : "url",
                    href: store.url,
                    target: "_blank",
                    text: app.resources.storelocator.URL_TITLE
                }));
            }

            if (divOptions.includeDirections) {
                storeInfoDiv.append($("<button/>", {
                    "class" : "directions-btn",
                    text: app.resources.storelocator.DIRECTIONS_TITLE
                }));
            }

            var locationUrl = "";
            if(store.latitude && store.longitude) {
                locationUrl = AppUtils.arrayToString([ store.latitude, store.longitude], ', ');
            } else {
                locationUrl = "(" + store.name + ") " + AppUtils.arrayToString([ store.address1, store.address2, store.city, store.stateCode, store.postalCode], ', ');
            }
            storeInfoDiv.append($("<a/>", {
                "class" : "map",
                text: "Map",
                href: "http://maps.apple.com/maps?q=" + locationUrl
            }));

            var storeDiv =  $(elStr, {
                id: divOptions.id,
                "class" : "store"
            });

            storeDiv.append(storeImageDiv);
            storeDiv.append(storeInfoDiv);

            return storeDiv;
        }
    };

    app.storeLocator = app.storeLocator || {};
    app.storeLocator.StoreLocatorHelper = StoreLocatorHelper;

}(window.app = window.app || {}, jQuery));

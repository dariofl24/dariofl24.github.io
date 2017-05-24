/*global window */
(function(app, $) {

    var StoreType = {
        USA: "US",
        CANADA: "CA",
        SKATEBOARDING: "SKATE"
    };

    var StoreFilters = {
        OFFICIAL: "official",
        OUTLET: "outlet",
        SKATEBOARDING: "skate",
        OTHER: "other"
    };

    var DistanceUnit = {
        Miles: "mi",
        Kilometers: "km"
    };

    var IconType = {
        Converse: "converse",
        Other: "other"
    };

    var IconState = {
        Normal:  "normal",
        Shadow: "shadow",
        Over: "over",
        Selected:  "selected"
    };

    app.storeLocator = app.storeLocator || {};
    app.storeLocator.StoreLocatorConstants = {
        StoreType: StoreType,
        StoreFilters: StoreFilters,
        DistanceUnit: DistanceUnit,
        IconType: IconType,
        IconState: IconState
    };

}(window.app = window.app || {}, jQuery));

/*global _*/
(function(app, $) {

    var CONST = app.constant;
    var EXPANDED = "expanded";

    var $cache = {};

    function initializeCache() {
        $cache = {
            wrapper: $("#wrapper")
        };
    }

    function findSliderArea(sliderAreaName) {
        var sliderAreaSelector = _.sprintf("[data-slider-area='%s']", sliderAreaName);
        return $cache.wrapper.find(sliderAreaSelector);
    }

    function getActiveSliderArea() {
        return $cache.wrapper.find("[data-slider-area].expanded");
    }

    function slideDown(sliderArea) {
        return sliderArea
            .addClass(EXPANDED)
            .slideDown(CONST.SLIDER.FADE_DURATION)
            .promise();
    }

    function slideUp(sliderArea) {
        return sliderArea
            .removeClass(EXPANDED)
            .slideUp(CONST.SLIDER.FADE_DURATION)
            .promise();
    }

    function show(sliderAreaName, noOverlay) {
        noOverlay = (typeof noOverlay === "undefined") ? false : noOverlay;
        var deferred = $.Deferred();
        var activeSliderArea = getActiveSliderArea();
        var sliderAreaToShow = findSliderArea(sliderAreaName);
        var slideDownFunc = function() {
            $.publish(CONST.SLIDER.BEFORE_EXPANDED, sliderAreaName);
            slideDown(sliderAreaToShow).then(function() {
                deferred.resolve();
                $.publish(CONST.SLIDER.EXPANDED, sliderAreaName);
            });
        };

        if (activeSliderArea.exists()) {
            slideUp(activeSliderArea).then(slideDownFunc);
        } else {
            if (noOverlay === false) {
                app.overlay.show();
            }
            $.timer(CONST.OVERLAY_DELAY_DURATION).then(slideDownFunc);
        }

        return deferred;
    }

    function hide(sliderAreaName, maintainOverlay) {
        maintainOverlay = (typeof maintainOverlay === "undefined") ? false : maintainOverlay;
        var deferred = $.Deferred();
        var sliderArea = null;

        if(sliderAreaName) {
            sliderArea = findSliderArea(sliderAreaName);
        } else {
            sliderArea = getActiveSliderArea();
            sliderAreaName = sliderArea.data("slider-area");
        }

        var slideUpFunc = function() {
            $.publish(CONST.SLIDER.BEFORE_COLLAPSED, sliderAreaName);
            slideUp(sliderArea).then(function() {
                deferred.resolve();
                $.publish(CONST.SLIDER.COLLAPSED, sliderAreaName);
            });        
        };

        if(sliderArea.exists() && sliderArea.hasClass(EXPANDED)) {
            if (maintainOverlay === false) {
                app.overlay.hide();
            }
            $.timer(CONST.OVERLAY_DELAY_DURATION).then(slideUpFunc);
        }

        return deferred;
    }

    function isActive(sliderAreaName) {
        var activeSliderArea = getActiveSliderArea();
        return activeSliderArea.exists() && activeSliderArea.data("slider-area") === sliderAreaName;
    }

    function toggle(sliderAreaName) {
        return isActive(sliderAreaName) ? hide(sliderAreaName) : show(sliderAreaName);
    }

    function collapse() {
        var activeSliderArea = getActiveSliderArea();
        var sliderAreaName = activeSliderArea.data("slider-area");
        hide(sliderAreaName);
    }

    function onOverlayClicked() {
        hide();
    }

    function initializeEvents() {
        app.overlay.clicked(onOverlayClicked);
    }

    app.slider = {
        init: function() {
            initializeCache();
            initializeEvents();
        },
        isActive: isActive,
        show: show,
        hide: hide,
        toggle: toggle,
        collapse: collapse
    };

}(window.app = window.app || {}, jQuery));

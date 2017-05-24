/*global _, window*/

(function(app, $) {
     _.mixin(_.str.exports());

    var DATA_CSS_POSITION = "old_css_position";

    var defaultOptions = {
        fade_opacity: 0.6,
        fade_duration: 500,
        overlay_zindex: 1000
    };

    function appendOverlayElement(container, options) {
        var overlayElement = $("<div class='conv-ajax-loader'></div>").css({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            "z-index": options.overlay_zindex
        });
        overlayElement.data("options", options);
        container.append(overlayElement);
    }

    function setUpPositionRelative(container) {
        var position = container.css("position");
        if(position !== "relative") {
            container.data(DATA_CSS_POSITION, position);
            container.css("position", "relative");
        }
    }

    function restorePositionRelative(container) {
        var oldCssPosition = container.data(DATA_CSS_POSITION);
        if(oldCssPosition) {
            container.css("position", oldCssPosition);
        }
    }

    function show(container, options) {
        options = options || {};
        var mergedOptions = $.extend({}, defaultOptions, options);
        var $container = $(container);

        setUpPositionRelative($container);
        appendOverlayElement($container, mergedOptions);
        $container.fadeTo(mergedOptions.fade_duration, mergedOptions.fade_opacity);
    }

    function hide(container) {
        var $container = $(container);
        var overlayElement = $container.find(".conv-ajax-loader");
        var options = overlayElement.data("options");

        overlayElement.remove();
        $container.fadeTo(options.fade_duration, 1.0);
        restorePositionRelative($container);
    }

    app.ajaxLoader = {
        show: show,
        hide: hide
    };

}(window.app = window.app || {}, jQuery));

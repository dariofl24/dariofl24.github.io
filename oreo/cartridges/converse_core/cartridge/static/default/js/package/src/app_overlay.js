// app.overlay
(function(app, $) {
    var OLD_ZINDEX_DATA = "old-z-index";
    var ORDER_DATA = "overlay-order";
    var ZINDEX_CSS_PROP = "z-index";

    var selector = {
        overlayElement: "#overlay-area",
        overlayVisibleElements: '[data-overlay-visible]'
    };

    var clickedCallbacks = $.Callbacks();

    function getOverlayVisibleIndex(el, overlayZIndex) {
        var order = el.data(ORDER_DATA) || 0;
        return (+overlayZIndex) + (+order) + 1;
    }

    function showOverlayVisibleElements() {
        var overlayZIndex = $(selector.overlayElement).css(ZINDEX_CSS_PROP);

        $(selector.overlayVisibleElements).each(function() {
            var el = $(this);
            var overlayVisibleIndex = getOverlayVisibleIndex(el, overlayZIndex);

            el.data(OLD_ZINDEX_DATA, el.css(ZINDEX_CSS_PROP));
            el.css(ZINDEX_CSS_PROP, overlayVisibleIndex);
        });
    }

    function restoreOverlayVisibleElements() {
        $(selector.overlayVisibleElements).each(function() {
            var el = $(this);
            el.css(ZINDEX_CSS_PROP, el.data(OLD_ZINDEX_DATA));
        });
    }

    function showOverlay() {
        $(selector.overlayElement).show();
    }

    function hideOverlay() {
        $(selector.overlayElement).hide();
    }

    function show() {
        showOverlayVisibleElements();
        showOverlay();
    }

    function hide() {
        restoreOverlayVisibleElements();
        hideOverlay();
    }

    function toggle() {
        return $(selector.overlayElement).is(":visible") ? hide() : show();
    }

    function clicked(callback) {
        if ( ! clickedCallbacks.has(callback) ) {
            clickedCallbacks.add(callback);
        }
        return clickedCallbacks;
    }

    function initSubscriptionAccessors() {
        $.subscribe(app.constant.OBSERVERS.SITE_OVERLAY_OPEN, function(v, arg) {
            if ( $.isFunction(arg) ) {
                clicked(arg);
            }
            show();           
        });

        $.subscribe(app.constant.OBSERVERS.SITE_OVERLAY_CLOSE, function(v, arg) {          
            clickedCallbacks.remove(arg);
            hide();
        });
    }

    function initializeEvents() {
        initSubscriptionAccessors();
        
        $(selector.overlayElement).on("click", function() {
            clickedCallbacks.fire();
        });
    }

    app.overlay = {
        init: function() {
            initializeEvents();
        },
        toggle: toggle,
        show: show,
        hide: hide,
        showOverlay: showOverlay,
        hideOverlay: hideOverlay,
        clicked: clicked
    };

}(window.app = window.app || {}, jQuery));

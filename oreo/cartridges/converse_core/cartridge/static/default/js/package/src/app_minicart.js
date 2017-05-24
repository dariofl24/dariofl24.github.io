// app.minicart
(function(app, $) {
    var CONST = app.constant;
    var $cache = {};
    var closeTimer = null;

    function initializeCache() {
        $cache = {
            minicart: $(".mini-cart"),
            minicart_content: $("#mini-cart > span"),
            minicart_panel_container: $("#minicart-panel-container")
        };
    }

    function setCartCount(topic, args) {
        if (args.cartCount === 0) {
            $cache.minicart.attr("icon-text-attr", "");
            $cache.minicart.removeClass("mini-cart-full");
            $cache.minicart.addClass("mini-cart-empty");
        } else {
            $cache.minicart.attr("icon-text-attr", args.cartCount);
            $cache.minicart.removeClass("mini-cart-empty");
            $cache.minicart.addClass("mini-cart-full");
        }
    }

    function getCartQuantity() {
        return app.util.parseIntOrDefault($cache.minicart.attr("icon-text-attr"), 0);
    }

    function setCartQuantity(newQuantity) {
        $cache.minicart.attr("icon-text-attr", newQuantity);
        app.cart.publishCartQuantityChanged(newQuantity);
    }

    function addQtyToCart(qty) {
        qty = app.util.parseIntOrDefault(qty, 0);

        if ($cache.minicart.hasClass("mini-cart-empty") === true) {
            $cache.minicart.removeClass("mini-cart-empty");
            $cache.minicart.addClass("mini-cart-full");
        }

        setCartQuantity(getCartQuantity() + qty);
    }

    function hidePanel() {
        app.slider.hide(CONST.SLIDER.MINICART_PANEL);
    }

    function showPanel() {
        app.slider.show(CONST.SLIDER.MINICART_PANEL);
    }

    function hidePanelAfterDelay() {
        if(closeTimer && !closeTimer.isResolved()) {
            closeTimer.reject();
        }
        closeTimer = $.timer(CONST.MINICART_PANEL_HOLD_ON_DURATION);
        closeTimer.then(hidePanel);
    }

    function updatePanelContent(minicartPanelContent) {
        $cache.minicart_panel_container.html(minicartPanelContent);
        showPanel();
        hidePanelAfterDelay();
    }

    function reset() {
        app.util.scrollBrowser(0);
        app.minicart.init();
    }

    function refresh() {
        app.ajax.load({
            url : app.urls.minicartRefresh,
            callback : function(response) {
                $cache.minicart.replaceWith(response);
                app.minicart.reset();
            }
        });
    }

    function toggleMinicartActive(topic, panelName) {
        if(panelName === CONST.SLIDER.MINICART_PANEL) {
            $cache.minicart_content.toggleClass("active");
        }
    }

    function initializeEvents() {
        $cache.minicart_panel_container.on("click", ".close-btn", hidePanel);
        $.subscribe(CONST.SLIDER.COLLAPSED, toggleMinicartActive);
        $.subscribe(CONST.SLIDER.BEFORE_EXPANDED, toggleMinicartActive);
        $.subscribe(CONST.PUBSUB.CART.QTY_CHANGED, setCartCount);
    }

    app.minicart = {
        init: function() {
            initializeCache();
            initializeEvents();
        },

        getCartQuantity: getCartQuantity,
        setCartQuantity: setCartQuantity,
        addQtyToCart: addQtyToCart,
        updatePanelContent: updatePanelContent,
        reset: reset,
        refresh: refresh
    };
}(window.app = window.app || {}, jQuery));

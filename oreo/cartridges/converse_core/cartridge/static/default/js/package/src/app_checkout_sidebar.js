// app.checkout_sidebar
(function(app, $) {
    var $cache;

    function initializeCache() {
        $cache = {
            checkoutSidebar: $(".checkout-sidebar")
        };

        $cache.viewMoreButtonContainer = $cache.checkoutSidebar.find(".btn-container");
        $cache.viewMoreButton = $cache.viewMoreButtonContainer.find(".btn-view-more");
        $cache.cartItem = $cache.checkoutSidebar.find('li.cart-item');
        $cache.cartItemPrice = $cache.cartItem.find('.product-price');
    }

    function hideViewMoreButtonContainer() {
        $cache.viewMoreButtonContainer.hide();
    }

    function showAllCartItems() {
        $cache.cartItem.show();
    }

    function showTaxInfo() {
        if ($cache.cartItemPrice.find('.tax-info').is(':visible')) {
            $cache.cartItemPrice.removeClass('tax').addClass('tax');
        }
    }

    function initializeEvents() {
        $cache.viewMoreButton.click(function() {
            showAllCartItems();
            hideViewMoreButtonContainer();
        });
        showTaxInfo();
    }

    app.checkoutSidebar = {
        init: function() {
            initializeCache();
            initializeEvents();
            app.sidebar.setSideBarHeight();
        }
    };

}(window.app = window.app || {}, jQuery));

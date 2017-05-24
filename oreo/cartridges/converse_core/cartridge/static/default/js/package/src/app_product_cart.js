/*global pixlee_analytics*/
(function(app, $) {

    function getQuantity(form) {
        return form.find('.quantity option:selected').val();
    }

    function getProductId(form) {
        return form.find('#pid').val();
    }

    function getProductPrice() {
        return $('body').find('.product-price .price-sales').last().text().trim();
    }

    function isSizeSelected(form) {
        return form.find('.size option:selected').val() !== '';
    }
    
    function addProductAndUpdateMiniCart(data, productId, qty, price, callback) {
        app.cart.addProduct(data, function(response) {
            app.minicart.addQtyToCart(qty);
            app.minicart.updatePanelContent(response);
            
            //Uses this function because lint doesn't let you add one more nested call
            pixleeTriggerAddToCart(productId, qty, price);
            
            if ($.isFunction(callback)) {
                callback();
            }
        });
    }
    
    function pixleeTriggerAddToCart(productId, qty, price) {
        if (typeof pixlee_analytics !== 'undefined') {
            pixlee_analytics.events.trigger('add:to:cart', {
                'product_id': productId,
                'product_qty': qty,
                'product_price': price
            });
        }
    }

    function addDYOProductAndUpdateMiniCart() {
        $.get(app.urls.getLastAddedItemMinipanel)
            .then(app.minicart.refresh)
            .then(app.minicart.updatePanelContent);
    }

    function showErrorMessage(message) {
        var elem = $('.error-message');

        if (elem.hasClass("visually-hidden")) {
            elem.text(message);
            elem.removeClass("visually-hidden");
            $('.select2:visible').first().addClass('error');
            $('span[aria-labelledby="select2-sizes-container"]').addClass('error');
            $('span[aria-labelledby="select2-quantity-container"]:visible').addClass('qty-error');
            $('.product-top-bar .top-bar-content').addClass('error');
            $(".product-top-bar .error-message").removeClass("visually-hidden");
            $(".product-top-bar #quantity .select2-selection").addClass('qty-error');
        }
    }

    function hideErrorMessage() {
        var elem = $('.error-message');

        if (elem.is(':visible')) {
            elem.addClass('visually-hidden');
            elem.text('');
            $('.select2:visible').first().removeClass('error');
            $('span[aria-labelledby="select2-sizes-container"]').removeClass('error');
            $('span[aria-labelledby="select2-quantity-container"]:visible').removeClass('qty-error');
            $('.product-top-bar .top-bar-content').removeClass('error');
            $('.product-top-bar .error-message').addClass('visually-hidden');
            $('.product-top-bar #quantity .select2-selection').removeClass('qty-error');
        }
    }

    function setAddToCartHandler(event) {
        event.preventDefault();

        var form = $(this).closest('form');
        var quantity = getQuantity(form);
        var productId = getProductId(form);
        var price = getProductPrice();

        if (!isSizeSelected(form)) {
            showErrorMessage(app.resources.ADD_TO_CART_SIZE_SELECT_ERROR);
            return;
        }

        hideErrorMessage();
        addProductAndUpdateMiniCart(form.serialize(), productId, quantity, price);
        app.util.scrollTop();
    }

    function initAddToCart() {
        $('.add-to-cart').on('click', setAddToCartHandler);
    }

    $.extend(app.product = app.product || {}, {
        initAddToCart: initAddToCart,
        addProductAndUpdateMiniCart: addProductAndUpdateMiniCart,
        addDYOProductAndUpdateMiniCart: addDYOProductAndUpdateMiniCart
    });

}(window.app = window.app || {}, jQuery));
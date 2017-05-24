/*global pixlee_analytics*/
// app.cart
(function(app, $) {
    var $cache = { cartContainer: $('section.pt_cart div#main') };
    
    function initializeCache() {
        $cache.cartWrapper = $cache.cartContainer.find('#cart-wrapper');
        $cache.removeButton = $cache.cartContainer.find('button.remove-button');
        $cache.cartItemsForm = $cache.cartContainer.find('article.fullcart form#cart-items-form');
        $cache.itemQuantity = $cache.cartItemsForm.find('.item-quantity .quantity');
        $cache.itemQuantityUpdate = $cache.cartItemsForm.find('.confirm-update-quantity');
        $cache.cartCountInput = $cache.cartContainer.find('#cartCount');
        $cache.includeSheerIDCheckBox = $cache.cartContainer.find('#has-sheerid');
        $cache.sheerIDFrame = $cache.cartContainer.find('#sheerid iframe');
        $cache.sidebar = $cache.cartContainer.find('.checkout-sidebar');
        $cache.sidebarInitialHeight = $cache.sidebar.height();
        $cache.fullcart = $cache.cartContainer.find('.fullcart');
        $cache.cartMaxMsg = cartMaxMsgs();
        $cache.cartMaxMsg();
    }

    function cartMaxMsgs() {
        var cartOverFullBox = $('.cart-full-error');
        var cartIsFullBox = $('.cart-is-full');
        
        var maxPLIsPerCO = (function() { 
            var maxPLIsPerCOElt = $cache.cartContainer.find('#maxPLIsPerCO');
            if (maxPLIsPerCOElt) {
                return maxPLIsPerCOElt.data('maxplisperco');
            }
        })();
        
        var updateMaxPlis = function checkQuantities() {
            var cartCountInput = Number($cache.cartCountInput.val());
            if (maxPLIsPerCO && cartOverFullBox && cartIsFullBox) {
                cartIsFullBox.addClass('hide');
                cartOverFullBox.addClass('hide');
                if (cartCountInput === maxPLIsPerCO) {
                    cartIsFullBox.removeClass('hide');
                } else if (cartCountInput > maxPLIsPerCO) {
                    cartOverFullBox.removeClass('hide');
                }
            }
        };
        
        return updateMaxPlis;
    }

    function getCartCount() {
        var result = 0;

        if ($cache.cartCountInput.exists()) {
            result = Number($cache.cartCountInput.val());
        }

        return result;
    }

    function publishCartQuantityChanged(count) {
        $.publish(app.constant.PUBSUB.CART.QTY_CHANGED, {cartCount: count});
    }

    function disableActionableElements() {
        $cache.removeButton.attr('disabled', 'disabled');
    }

    function reloadChatSubTotal(response) {
        var chatSubTotal    = response.find('div#chatSubTotal').text();
        window.chatSubTotal = chatSubTotal;
    }

    function reloadCartContent(responseText) {
        var response = $(responseText);
        var cartContainerContent = response.find('section.pt_cart div#main').html();
        
        reloadChatSubTotal(response);
        $cache.cartContainer.empty().html(cartContainerContent);

        initializeCache();
        initializeEvents();
    }

    function errorCallback(xhr, statusText, errorThrown) {
        console.log(errorThrown);        
    }

    function executeAjax(data, callback) {
        var options = {
            url: $cache.cartItemsForm.attr('action'),
            type: 'post',
            data: data,
            success: callback,
            error: errorCallback
        };

        $.ajax(options);
    }

    function removeItemCallBack(responseText, statusText, xhr) {
        reloadCartContent(responseText);
        publishCartQuantityChanged(getCartCount());

        if (!$cache.cartContainer.find('.cart-items').exists()) {
            app.product.tile.siteFeaturedCategoryInit();
        }
    }

    function setupItemRemoveEvents() {
        $cache.removeButton.click(function(e) {
            var button = $(e.currentTarget);
            var row = button.closest('div.item');
            
            if(!confirm(app.resources.CART_REMOVE_ITEM_CONFIRMATION)) {
                return;
            }

            var productId = row.find(".pid").val();
            var qty = row.find(".quantity").val();
            var price = row.find(".price-sales").last().text().trim();

            disableActionableElements();
            row.fadeTo(app.constant.INPUT_MESSAGING_FADEIN_DURATION, 0.6);
            button.hide();

            var pair = button.attr('name') + '=' + button.val();
            var data = $cache.cartItemsForm.formSerialize() + '&' + pair;

            if (typeof pixlee_analytics !== 'undefined') {
                pixlee_analytics.events.trigger('remove:from:cart', {"product_id":productId, "product_qty":qty, "price":price});
            }

            executeAjax(data, removeItemCallBack);
        });
    }

    function setupItemQuantitySelect2() {
        $(".quantity").select2({
            minimumResultsForSearch: Infinity,
            containerCssClass: 'cart',
            dropdownCssClass: 'cart'
        });
    }

    function onItemQuantityChanged(e) {
         var elem = $(e.currentTarget);
         var row = elem.closest('div.item');

         var updateItemCallback = function(responseText, statusText, xhr) {
             row.fadeTo(app.constant.INPUT_MESSAGING_FADEIN_DURATION, 1.0);

             setTimeout(function() {
                 reloadCartContent(responseText);
                 publishCartQuantityChanged(getCartCount());
             }, app.constant.INPUT_MESSAGING_FADEIN_DURATION);
         };
         executeAjax($cache.cartItemsForm.formSerialize(), updateItemCallback);
         row.fadeTo(app.constant.INPUT_MESSAGING_FADEIN_DURATION, 0.6);
    }

    function setupItemQuantityEvents() {
        setupItemQuantitySelect2();
        $cache.itemQuantity.on("change", onItemQuantityChanged);
    }

    function setupFormEvents() {
        $cache.cartItemsForm.submit(function(e) { 
            e.preventDefault();

            var visibleLink = $cache.cartItemsForm.find('.confirm-update-quantity:visible');
            
            visibleLink.click();
        });
    }

    function addProduct(postdata, callback) {
        var url = app.util.ajaxUrl(app.urls.addProduct);
        
        $.post(url, postdata).done(callback);
    }

    function initSheerIDBox() {
        if ($cache.includeSheerIDCheckBox.exists()) {
            $cache.sheerIDFrame.toggle($cache.includeSheerIDCheckBox.is(':checked'));
            var headerHeight = $('#header').css('position') === 'fixed' ? $('#header').height() : 0;
            $(window).scrollTop($cache.sheerIDFrame.offset().top - headerHeight);
            setSideBarHeight();
        }
    }

    function setSideBarHeight() {
       if ($cache.sidebar.css('float') !== 'none') {
            if ($cache.sidebarInitialHeight < $cache.fullcart.height()) {
                $cache.sidebar.height($cache.fullcart.height());
            } else {
                $cache.sidebar.height($cache.sidebarInitialHeight);
            }
        }else if ($cache.sidebar.css('height')) {
            $cache.sidebar.css("height", "");
        }
    }
    
    function updateSideBarHeight() {
        $(window).resize(function () {
            setSideBarHeight();
       });
    }
    
    function initializeEvents() {
        setupFormEvents();
        setupItemRemoveEvents();
        setupItemQuantityEvents();
        setSideBarHeight();
        app.checkbox.init(".pt_cart");
        updateSideBarHeight();

        $cache.includeSheerIDCheckBox.on("click", initSheerIDBox);
    }

    app.cart = {
        addProduct: function(postdata, callback) {
            addProduct(postdata, callback);
        },
        init: function() {
            initializeCache();
            initializeEvents();
        },
        publishCartQuantityChanged: publishCartQuantityChanged
    };
    
}(window.app = window.app || {}, jQuery));

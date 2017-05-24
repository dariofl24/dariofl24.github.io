/*global _, window, pixlee_analytics*/

// app.checkoutShipping
(function(app, $) {
    var LOGIN_PANEL = app.constant.PUBSUB.LOGIN_PANEL;

    var $cache = {};
    var shippingMethods = null;

    function initializeCache() {
        var shippingForm = $("form.address.checkout-shipping");
        var checkoutSidebar = $(".checkout-sidebar");

        $cache = {
            checkoutSidebar: checkoutSidebar,
            shippingForm: shippingForm,
            addressList: shippingForm.find(".select-address select[id$='_addressList']"),
            firstName: shippingForm.find("input[name$='_firstName']"),
            lastName: shippingForm.find("input[name$='_lastName']"),
            address1: shippingForm.find("input[name*='_address1']"),
            address2: shippingForm.find("input[name$='_address2']"),
            city: shippingForm.find("input[name$='_city']"),
            shippingType: shippingForm.find('.shipping-type').find(':checked'),
            postalCode: shippingForm.find("input[name$='_zip']"),
            phone: shippingForm.find("input[name$='_phone']"),
            phoneOpt: shippingForm.find("input[name$='_phoneOpt']"),
            countryCode: shippingForm.find("select[id$='_country']"),
            stateCode: shippingForm.find("select[id$='_states_stateCode']"),
            addToAddressBook: shippingForm.find("input[name$='_addToAddressBook']"),
            addToAddressBookNickName: shippingForm.find("#form-add-to-addressbook-nickname"),
            giftMessage: shippingForm.find(".gift-message-text"),
            includeGiftMessageCheckBox: shippingForm.find("#is-gift-yes"),
            shippingMethodList: $("#shipping-method-list"),
            continueBtn: shippingForm.find(".btn-continue"),
            checkoutAlerts: $("#checkout-alerts"),
            countryname: shippingForm.find(".countryname").val()
        };
    }

    function shippingFormExists() {
        return $("form.address.checkout-shipping").exists();
    }

    function getShippingMethodURL(url) {
        var params = {
            countryCode: $cache.countryCode.val(),
            stateCode: $cache.stateCode.val(),
            postalCode: $cache.postalCode.val(),
            city: $cache.city.val(),
            shippingType: $cache.shippingType.val(),
            address1: $cache.address1.val(),
            address2: $cache.address2.val()
        };
        return app.util.appendParamsToUrl(url, params, true);
    }

    function updateSummary() {
        var url = app.urls.summaryRefreshURL;

        $cache.checkoutSidebar.load(url, function() {
            $cache.checkoutSidebar.fadeIn("fast");
            $cache.checkoutSidebar.find('.checkout-mini-cart .minishipment .header a').hide();
            $cache.checkoutSidebar.find('.order-totals-table .order-shipping .label a').hide();
            app.checkoutSidebar.init();
        });
    }

    function selectShippingMethod(shippingMethodID, productType) {
        if (!shippingMethodID || !productType) {
            return;
        }

        var params = {
            countryCode: $cache.countryCode.val(),
            stateCode: $cache.stateCode.val(),
            postalCode: $cache.postalCode.val(),
            city: $cache.city.val(),
            shippingType: $cache.shippingType.val(),
            address1: $cache.address1.val(),
            address2: $cache.address2.val(),
            shippingMethodID: shippingMethodID,
            productType: productType
        };

        var url = app.util.appendParamsToUrl(app.urls.selectShippingMethod, params, true);

        app.ajax.getJson({
            url: url,
            callback: function(data) {
                updateSummary();
            }
        });

    }

    function onShippingMethodChanged() {
        var element = $(this);
        selectShippingMethod(element.find("option:selected").val(), element.data('product-type'));
    }

    function initShippingMethodListEvents() {
        $cache.shippingMethodList.find("select.select-shipping-method").on("change", onShippingMethodChanged);
        app.checkoutForm.resetDropdown();
    }

    function loadShippingMethodList() {
        var smlUrl = getShippingMethodURL(app.urls.shippingMethodsList);

        $cache.continueBtn.attr("disabled", "disabled");
        $cache.shippingMethodList.load(smlUrl, function() {
            $cache.shippingMethodList.fadeIn("fast");
            initShippingMethodListEvents();
            updateAddressAlerts();
            updateSummary();
        });
        $cache.continueBtn.removeAttr("disabled");
    }

    function updateAddressAlerts() {
        var poBoxRestricted = $("#po-box-restricted");
        if(poBoxRestricted.exists()) {
            if(poBoxRestricted.attr("data-address1-error") === "true") {
                $cache.address1.parent(".form-group").addClass("error");
            } else {
                clearAddressError($cache.address1);
            }
            if(poBoxRestricted.attr("data-address2-error") === "true") {
                $cache.address2.parent(".form-group").addClass("error");
            } else {
                clearAddressError($cache.address2);
            }
        } else {
            clearAddressError($cache.address1);
            clearAddressError($cache.address2);

        }
    }

    function clearAddressError(addressForm) {
        if( !$.trim( addressForm.parent(".form-group").find(".message-placeholder").html() ).length) {
            addressForm.parent(".form-group").removeClass("error");
        }
    }

    function updateCheckoutAlerts(messages) {
        if (messages) {
            $cache.checkoutAlerts.html('<ul><li>' + messages.join('</li><li>') + '</li></ul>');
            $cache.checkoutAlerts.show();
        } else {
            $cache.checkoutAlerts.html('');
            $cache.checkoutAlerts.hide();
        }
    }

    function updateShippingMethodList() {
        if (!$cache.shippingMethodList || $cache.shippingMethodList.length === 0) {
            return;
        }

        var url = getShippingMethodURL(app.urls.shippingMethodsJSON);

        app.ajax.getJson({
            url: url,
            callback: function (data) {
                if (!data) {
                    return false;
                }

                if (shippingMethods && shippingMethods === data.methods) {
                    return true;
                }

                shippingMethods = data.methods;
                updateCheckoutAlerts(data.messages);
                loadShippingMethodList();
            }
        });
    }

    function initGiftMessageBox() {
        if ($cache.includeGiftMessageCheckBox.exists()) {
            $cache.giftMessage.toggle($cache.includeGiftMessageCheckBox.is(':checked'));
        }
    }

    function initAddToAddressBookBox() {
        if ($cache.addToAddressBook.exists()) {
            $cache.addToAddressBookNickName.toggle($cache.addToAddressBook.is(':checked'));
        }
    }

    function onAddressListChanged() {
        var selected = $cache.addressList.children(":selected").first();
        var data = $(selected).data("address");
        
        if (selected.text() === app.resources.CHECKOUT_ADDRESS_LIST_SELECT) {
            app.util.clearFormFields($cache.shippingForm);
            app.checkoutForm.resetDropdown();
            $cache.giftMessage.find("textarea").val("");
        } else {
            if(data){
                data.phoneOpt =data.phone;
            }
        
            _.each(data, function(value, key) {
                if ($cache[key]) {
                    value = _.isString(value) ? value.replace("^", "'") : value;
                    $cache[key].val(value);
                }
            });

            updateShippingMethodList();

            $cache.shippingForm.validate().form();
        }
        
        setCountryCodeName();
        
    }
    
    function setCountryCodeName(){
        $(".countryname").val($cache.countryname);
    }

    function fillOutAddressFormIfAddressSelectedFromList() {
        onAddressListChanged();
    }

    function onAddressFormLoaded(addressFormContent) {
        $(".shipping-address-fields").html(addressFormContent);

        app.checkoutShipping.init();
    }

    function handleLoggedIn(topic, data) {
        $(".login-faster-checkout").hide();
        $.get(app.urls.addressForm).done(onAddressFormLoaded);
    }

    function onShowLoginPanel() {
        $.publish(LOGIN_PANEL.TOGGLE);
    }

    function getPixleeData() {
        var items = $cache.checkoutSidebar.find(".products-in-cart");
        var cartTotal = $cache.checkoutSidebar.find(".order-sub-total").text().trim();
        var totalQuantity = 0;
        var cartContents = {};
        var productsInCart = [];

        for (var i = 0; i < items.length; i++) {
            var productId = $(items[i]).find(".sku").text().trim();
            var qty = parseInt($(items[i]).find(".qty").text().trim(), 10);

            cartContents[i] = {
                "product_id": productId,
                "product_qty": qty
            };
            totalQuantity += qty;
            productsInCart[i] = productId;
        }

        var data = {
            cartContents: cartContents,
            productsInCart: productsInCart,
            totalQuantity: totalQuantity,
            cartTotal: cartTotal
        };

        return data;
    }

    function updatePixlee() {
        var isPixleeEnabled = app.featuretoggle.isFeatureEnabled('pixlee-integration');

        if (!isPixleeEnabled) {
            return;
        }

        var data = getPixleeData();

        pixlee_analytics.events.trigger('checkout:start', {
            "cart_contents": JSON.stringify(data.cartContents),
            "products_in_cart": JSON.stringify(data.productsInCart),
            "total_quantity": data.totalQuantity,
            "cart_total": data.cartTotal
        });
    }

    function updateShippingAddressLabel() {
        var newLabel = $('#shipping-address-label').attr("value");
        if (newLabel !== undefined) {
            $cache.address1.siblings('label').find('span').text(newLabel);
        }
    }

    function initializeShipping() {
        initGiftMessageBox();
        initAddToAddressBookBox();
    }

    function initializeEvents() {
        $cache.addressList.on("change", onAddressListChanged);
        initShippingMethodListEvents();

        $cache.shippingForm.on("click", "#is-gift-yes, #is-gift-no", initGiftMessageBox);
        $cache.addToAddressBook.on("click", initAddToAddressBookBox);

        var changeAwareInputs = [
            $cache.stateCode,
            $cache.city,
            $cache.shippingType,
            $cache.postalCode,
            $cache.address1,
            $cache.address2
        ];

        $.each(changeAwareInputs, function(index, $element) {
            $element.on("change", updateShippingMethodList);
        });

        $(".login-faster-checkout").on("click", onShowLoginPanel);
        $.subscribe(LOGIN_PANEL.USER.LOGGED_IN, handleLoggedIn);
    }

    function init() {
        if (!shippingFormExists()) {
            return;
        }

        initializeCache();
        initializeShipping();
        initializeEvents();
        loadShippingMethodList();
        updatePixlee();
        app.sidebar.setSideBarHeight();
        app.checkoutForm.resetDropdown();
        updateShippingAddressLabel();

        fillOutAddressFormIfAddressSelectedFromList();
    }

    app.checkoutShipping = {
        init: init
    };
    
}(window.app = window.app || {}, jQuery));

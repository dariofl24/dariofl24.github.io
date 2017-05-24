/*global window, pixlee_analytics*/

// app.orderConfirmation
(function(app, $) {
    var LOGIN_PANEL = app.constant.PUBSUB.LOGIN_PANEL;
    var SLIDER = app.constant.SLIDER;
    var $cache = {};

    function initializeCache() {
        var checkoutContainer = $(".checkout-confirmation");
        var checkoutSidebar = $("#secondary.checkout-sidebar");

        $cache = {
            checkoutContainer: checkoutContainer,
            checkoutSidebar: checkoutSidebar,
            saveAddressButton: checkoutContainer.find("button.save-address"),
            confirmationAddressInfo: checkoutContainer.find(".checkout-confirmation-address-info"),
            createAccountButton: $("#checkout-create-account-btn"),
            printConfirmationPageButton: checkoutContainer.find(".btn-print"),
            addressNickNameForm: checkoutContainer.find(".address-nickname")
        };
    }

    function onCreateAccountClicked(event) {
        event.preventDefault();
        app.accountCommon.showContainers(["register"]);
        app.slider.toggle(SLIDER.LOGIN_PANEL);
    }

    function onPrintOrderConfirmationClicked(event) {
        window.print();
    }

    function addNickNameToAddress() {
        var addressNickname = $cache.addressNickNameForm.find(".address-nickname-input").val();
        $cache.confirmationAddressInfo.find(".shipping ul").prepend("<li>" + addressNickname + "</li>");
        $cache.addressNickNameForm.remove();
    }

    function onSubmitAddressNickName() {
        var form = $cache.addressNickNameForm,
            setupCallback = null,
            successCallback = function(form, data, textStatus, jqXHR) {
                addNickNameToAddress();
            },
            errorCallback = function(form, jqXHR, textStatus, errorThrown){
                app.forms.displayServerError();
            },
            dataType = "JSON";

        app.forms.bindAjaxForm(form, setupCallback, successCallback, errorCallback, dataType);
    }

    function onAccountCreated() {
        $cache.createAccountButton.unbind("click", onCreateAccountClicked);
        $cache.createAccountButton.click();
    }

    function populateEmail() {
        var customerEmail = $cache.createAccountButton.data("customer-email");
        var email = customerEmail || "";

        $("#new-account-table .email-input").val(email);
    }

    function initializeEvents() {
        $cache.createAccountButton.on("click", onCreateAccountClicked);
        $cache.saveAddressButton.on("click", onSubmitAddressNickName);
        $cache.printConfirmationPageButton.on("click", onPrintOrderConfirmationClicked);
        
        $.subscribe(LOGIN_PANEL.USER.REGISTERED, onAccountCreated);
        $.subscribe(SLIDER.EXPANDED, populateEmail);
    }

    app.orderConfirmation = {
        init: function() {
            initializeCache();
            initializeEvents();
            app.checkoutSidebar.init();

            var items = $cache.checkoutSidebar.find(".products-in-cart");
            var total_quantity = 0;
            var cartContents = {};
            var products_in_cart = [];
            for(var i =0; i < items.length; i++) {
                var productId = $(items[i]).find(".sku").text().trim();
                var qty = parseInt($(items[i]).find(".qty").text().trim(), 10);
                cartContents[i] = {"product_id":productId, "product_qty":qty};
                total_quantity += qty;
                products_in_cart[i] = productId;
            }
            var total = $cache.checkoutSidebar.find(".order-sub-total").text().trim();
            if (typeof pixlee_analytics !== 'undefined') {
                pixlee_analytics.events.trigger('converted:photo',
                    {
                        "cart_contents":JSON.stringify(cartContents),
                        "products_in_cart":JSON.stringify(products_in_cart),
                        "total_quantity":total_quantity,
                        "cart_total":total
                    });
            }
        }
    };
}(window.app = window.app || {}, jQuery));

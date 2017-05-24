/*global _, window*/

// app.checkoutBilling
(function(app, $) {

    var LOGIN_PANEL = app.constant.PUBSUB.LOGIN_PANEL;
    var SLIDER = app.constant.SLIDER;
    var PM_PAYPAL = "PAY_PAL";

    var $cache = {};

    var selector = {
        continue_with_paypal_btn: ".continue-with-paypal",
        continue_with_giftcard_btn: ".continue-with-giftcard"
    };

    function initializeCache() {
        var billingForm = $("form.address.checkout-billing");
        var ccContainer = $("#PaymentMethod_CREDIT_CARD");

        $cache = {
            slider: $("#slider"),
            billingPaypalContinueContainer: $("#billing-paypal-continue-container"),

            billingForm: billingForm,
            email: billingForm.find("input[name$='_emailAddress']"),
            save: billingForm.find("button[name$='_billing_save']"),
            paymentMethods: billingForm.find("div.payment-method"),
            paymentMethodId: billingForm.find("input[name$='_selectedPaymentMethodID']"),
            billingSameAsShipping: billingForm.find("input[name$='_billingSameAsShipping']"),

            ccContainer: ccContainer,
            giftCardInput: ccContainer.find(".is-gift-card-apply"),
            giftCardForm: ccContainer.find(".gift-card-form"),

            billingAddress: billingForm.find("div.billingaddress-info"),
            addressList: billingForm.find(".select-address select[id$='_addressList']"),
            firstName: billingForm.find("input[name$='_firstName']"),
            lastName: billingForm.find("input[name$='_lastName']"),
            address1: billingForm.find("input[name$='_address1']"),
            address2: billingForm.find("input[name$='_address2']"),
            city: billingForm.find("input[name$='_city']"),
            postalCode: billingForm.find("input[name$='_zip']"),
            phone: billingForm.find("input[name$='_phone']"),
            phoneOpt: billingForm.find("input[name$='_phoneOpt']"),
            countryCode: billingForm.find("select[id$='_country']"),
            stateCode: billingForm.find("select[id$='_states_stateCode']"),

            ccList: $("#creditCardList"),
            ccOwner: ccContainer.find("input[name$='creditCard_owner']"),
            ccType: ccContainer.find("select[name$='_type']"),
            ccNum: ccContainer.find("input[name$='_number']"),
            ccMonth: ccContainer.find("[name$='_month']"),
            ccYear: ccContainer.find("[name$='_year']"),
            ccDay: billingForm.find("select[name$='_day']"),
            ccSsn: billingForm.find("input[name$='_ssn']"),
            ccCcv: ccContainer.find("input[name$='_cvn']"),
            BMLContainer: billingForm.find("#PaymentMethod_BML"),
            countryname: billingForm.find(".countryname").val()
        };
    }

    function billingFormExists() {
        return $("form.address.checkout-billing").exists();
    }

    function hideBillingFields() {
        if ($cache.billingForm.find(".select-address").exists()) {
            $cache.billingForm.find(".select-address").hide();
        }
        $cache.billingForm.find(".name-row").hide();
        $cache.billingForm.find(".address-row").hide();
        $cache.billingForm.find(".city-state-zip-row").hide();
        $cache.billingForm.find(".form-column-country").hide();
        $cache.billingForm.find(".form-column-phone").removeClass("form-column-right").addClass("form-column-left");
        $cache.billingForm.find(".email-row .form-column-right").css({
            "float": "left",
            "clear": "left",
            "margin-top": "16px"
        });
    }
    
    function hideAddressAndContactFields() {
        $cache.billingForm.find(".billingaddress-wrapper").hide();
    }
    
    function showAddressAndContactFields() {
        $cache.billingForm.find(".billingaddress-wrapper").show();
    }

    function showBillingFields() {
        if ($cache.billingForm.find(".select-address").exists()) {
            $cache.billingForm.find(".select-address").show();
        }
        $cache.billingForm.find(".name-row").show();
        $cache.billingForm.find(".address-row").show();
        $cache.billingForm.find(".city-state-zip-row").show();
        $cache.billingForm.find(".form-column-country").show();
        $cache.billingForm.find(".form-column-phone").removeClass("form-column-left").addClass("form-column-right");
    }

    function getShippingAddressVals() {
        return {
            firstName: $("#shipping-first-name").val(),
            lastName: $("#shipping-last-name").val(),
            address1: $("#shipping-address1").val(),
            address2: $("#shipping-address2").val(),
            city: $("#shipping-city").val(),
            stateCode: $("#shipping-state-code").val(),
            postalCode: $("#shipping-postal-code").val(),
            phone: $("#shipping-phone").val(),
            phoneOpt: $("#shipping-phoneOpt").val()
        };
    }

    function setBillingAddressVals() {
        var addressDetails = getShippingAddressVals();
        $.each(addressDetails, function(index, value){
            $cache[index].val(value);
        });
    }

    function toggleBillingFields(isHidden) {
    
        setCountryCodeName();
    
        if (isHidden) {
            hideBillingFields();
            setBillingAddressVals();
            $cache.billingAddress.find(".form-row.billing-address").show();
        } else {
            showBillingFields();
            $cache.billingAddress.find(".form-row.billing-address").hide();
        }
    }

    function onBillingSameAsShippingChecked() {
        $cache.billingSameAsShipping.on("click", function() {
            toggleBillingFields(this.checked);
            app.checkoutForm.resetDropdown();
        });
    }

    function initBMLPaymentMethodValidation(paymentMethodID) {
        var bmlForm = $cache.BMLContainer;
        bmlForm.find("select[name$='_year']").removeClass("required");
        bmlForm.find("select[name$='_month']").removeClass("required");
        bmlForm.find("select[name$='_day']").removeClass("required");
        bmlForm.find("input[name$='_ssn']").removeClass("required");

        if (paymentMethodID === "BML") {
            bmlForm.find("select[name$='_year']").addClass("required");
            bmlForm.find("select[name$='_month']").addClass("required");
            bmlForm.find("select[name$='_day']").addClass("required");
            bmlForm.find("input[name$='_ssn']").addClass("required");
        }
    }

    function onApplyGiftCardChecked() {
        $cache.giftCardForm.toggle($cache.giftCardInput.prop("checked"));
    }

    function setCheckedPaymentMethod(id) {
        var elem = $("#is-" + id);

        if (elem.exists()) {
            elem[0].checked = true;
        }
    }

    function showCreditCardDisclaimer() {
        $(".credit-card-disclaimer").show();
    }

    function hideCreditCardDisclaimer() {
        $(".credit-card-disclaimer").hide();
    }

    function changePaymentMethod(paymentMethodID, siteID) {
        var pmc = $cache.paymentMethods.filter("#PaymentMethod_" + paymentMethodID);
        $cache.paymentMethods.removeClass("payment-method-expanded");
        if (pmc.length === 0 || paymentMethodID === "INVOICE" || paymentMethodID === "PAY_PAL") {
            hideCreditCardDisclaimer();
            if (paymentMethodID === "INVOICE" || ( paymentMethodID === "PAY_PAL" && siteID !== 'US' )) {
                showAddressAndContactFields();
            } else {
                hideAddressAndContactFields();
            }
            
        } else {
            $cache.paymentMethods.filter(".giftcard-info").addClass("payment-method-expanded");
            showAddressAndContactFields();
            showCreditCardDisclaimer();
        }

        pmc.addClass("payment-method-expanded");
        setCheckedPaymentMethod(paymentMethodID);
        initBMLPaymentMethodValidation(paymentMethodID);
    }

    function setCCFields(data) {
        $cache.ccOwner.val(data.holder);
        $cache.ccType.val(data.type);
        $cache.ccNum.val(data.maskedNumber);
        $cache.ccMonth.val(data.expirationMonth);
        $cache.ccYear.val(data.expirationYear);
        $cache.ccCcv.val("");

        $cache.ccContainer.find(".errormessage")
            .toggleClass("errormessage")
            .filter("span").remove();

        $cache.ccContainer.find(".errorlabel").toggleClass("errorlabel");
    }

    function populateCreditCardForm(cardID) {
        var url = app.util.appendParamToURL(app.urls.billingSelectCC, "creditCardUUID", cardID);
        app.ajax.getJson({
                url: url,
                callback: function(data) {
                    if (!data) {
                        window.alert(app.resources.CC_LOAD_ERROR);
                        return false;
                    }
                    $cache.ccList.data(cardID, data);
                    setCCFields(data);
                }
            });
    }

    function onPaymentMethodChanged(e) {
        var paymentMethodId = $(this).val();
        var siteID = app.site.id;

        var panelClosed = function(continueWithPaypal) {
            if (continueWithPaypal) {
                changePaymentMethod(paymentMethodId, siteID);
            }
        };

        if (paymentMethodId === PM_PAYPAL && giftCardHasBeenApplied()) {
            openContinueWithPaypalPanelAndWaitForAction().done(panelClosed);
            e.preventDefault();
        } else {
            changePaymentMethod(paymentMethodId, siteID);
        }
    }

    function openContinueWithPaypalPanelAndWaitForAction() {
        var deferred = $.Deferred();

        function continueWithPaypal(actionFlag) {
            return function() {
                app.slider.hide(SLIDER.BILLING_PAYPAL_CONTINUE_PANEL);
                deferred.resolve(actionFlag);
            };
        }

        function initializePanel() {
            $cache.billingPaypalContinueContainer
                .switchEvent("click", selector.continue_with_paypal_btn, continueWithPaypal(true))
                .switchEvent("click", selector.continue_with_giftcard_btn, continueWithPaypal(false));
        }

        app.slider.show(SLIDER.BILLING_PAYPAL_CONTINUE_PANEL).then(initializePanel);

        return deferred;
    }

    function giftCardHasBeenApplied() {
        return $cache.paymentMethods.find(".giftcard-info .gift-card-balance").exists();
    }

    function onCreditCardChanged() {
        var cardUUID = $(this).val();
        if (!cardUUID) {
            return;
        }
        var ccdata = $cache.ccList.data(cardUUID);
        if (ccdata && ccdata.holder) {
            setCCFields(ccdata);
            return;
        }
        populateCreditCardForm(cardUUID);
    }

    function removeCreditCardNumericValidation() {
        if ($cache.ccNum.exists() && $cache.ccNum.val().length > 0) {
            $cache.ccNum.parsley('removeConstraint', 'type');
        }
    }

    function onBillingSubmit() {
        if ($("#noPaymentNeeded").length > 0 && $(".giftcertpi").length > 0) {
            $cache.paymentMethodId.filter(":checked").removeAttr("checked");
            $("<input/>").attr({
                    name: $cache.paymentMethodId.first().attr("name"),
                    type: "radio",
                    checked: "checked",
                    value: app.constants.PI_METHOD_GIFT_CERTIFICATE
                })
                .appendTo($cache.billingForm);
        }

        if ($cache.paymentMethodId.filter(":checked").val() === "BML" && !$cache.billingForm.find("input[name$='bml_termsandconditions']")[0].checked) {
            alert(app.resources.BML_AGREE_TO_TERMS);
            return false;
        }
    }

    function onAddressListChanged() {
        var selected = $(this).children(":selected").first();
        var data = $(selected).data("address");

        if (selected.text() === app.resources.CHECKOUT_ADDRESS_LIST_SELECT) {
            app.util.clearFormFields($cache.billingAddress);
        }
        else {
        
            if(data){
                data.phoneOpt =data.phone;
            }
            
            _.each(data, function(value, key) {
      
                if ($cache[key]) {
                    value = _.isString(value) ? value.replace("^", "'") : value;
                    $cache[key].val(value);
                }
            });

            $cache.billingAddress.validate().form();
        }

        app.checkoutForm.resetDropdown();
        setCountryCodeName();
    }

    function moveContinueWithPaypalPanelToSlider() {
        $cache.billingPaypalContinueContainer
            .remove()
            .appendTo($cache.slider);
    }

    function initializeBilling() {
        if ($cache.paymentMethodId.exists()) {
            var paymentMethodId = $cache.paymentMethodId.filter(":checked");
            var siteID = app.site.id;
            changePaymentMethod(paymentMethodId.length === 0 ? "CREDIT_CARD" : paymentMethodId.val(), siteID);
        }

        onApplyGiftCardChecked();
        toggleBillingFields($cache.billingSameAsShipping.is(':checked'));
        moveContinueWithPaypalPanelToSlider();
    }

    function initializeEvents() {
        $cache.giftCardInput.on("click", onApplyGiftCardChecked);
        $cache.addressList.on("change", onAddressListChanged);
        $cache.paymentMethodId.on("click", onPaymentMethodChanged);
        $cache.ccList.on("change", onCreditCardChanged);
        $cache.save.on('click', onBillingSubmit);
        onBillingSameAsShippingChecked();   
    }

    function initializeFasterLogin() {
        $(".login-faster-checkout").on("click", onShowLoginPanel);
        $.subscribe(LOGIN_PANEL.USER.LOGGED_IN, handleLoggedIn);
    }

    function handleLoggedIn(topic, data) {
        $(".login-faster-checkout").hide();
        $.get(app.urls.addressForm).done(onAddressFormLoaded);
    }

    function onAddressFormLoaded(addressFormContent) {
        $(".shipping-address-fields").html(addressFormContent);

        app.checkoutShipping.init();
    }

    function onShowLoginPanel() {
        $.publish(LOGIN_PANEL.TOGGLE);
    }

    function setCountryCodeName(){
        $(".countryname").val($cache.countryname);
    }
    
    app.checkoutBilling = {
        init: function() {
            if (billingFormExists()) {
                initializeCache();
                initializeBilling();
                initializeEvents();
                removeCreditCardNumericValidation();
                app.sidebar.setSideBarHeight();
                app.checkoutForm.resetDropdown();
                app.radio_button.init(".pt_checkout");
                app.checkbox.init(".pt_checkout");
                initializeFasterLogin();
                
            }
        }
    };
}(window.app = window.app || {}, jQuery));

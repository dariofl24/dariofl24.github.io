/*global utag, emailDialogShow */
(function(app, $) {
    var $cache;
    
    function initializeCache() {
        $cache = {
            newEmailAddressesContainer: $("#new-email-addresses-container"),
            footerSubscriptionForm: $("#email-form"),
            footerContentAssetContainer: $("#footer-email-content-asset-container")
        };

        $cache.newEmailAddressesForm = $cache.newEmailAddressesContainer.find('#new-email-addresses-form');
        $cache.dateContainer = $cache.newEmailAddressesForm.find('.date-container');
        $cache.monthSelect = $cache.dateContainer.find('#month');
        $cache.daySelect = $cache.dateContainer.find('#day');
        $cache.yearSelect = $cache.dateContainer.find('#year');
        $cache.dateValue = $cache.dateContainer.find('.date-value');
        $cache.successNewMessageContainer = $cache.newEmailAddressesContainer.find('#success-message-container');
        $cache.signupTextContainer = $cache.newEmailAddressesContainer.find('#new-email-addresses-copy-container');
        $cache.shoppingButton = $cache.newEmailAddressesContainer.find('#shopping-button');
        $cache.closeButton = $cache.newEmailAddressesContainer.find('.close-button');
        $cache.promotionContainer = $cache.newEmailAddressesContainer.find('.promotion-offered');
        $cache.promotionValue = $cache.newEmailAddressesForm.find('.offered-promotion');
        $cache.footerPromotionContainer = $cache.footerContentAssetContainer.find('.promotion-offered');
        $cache.footerPromotionValue = $cache.footerSubscriptionForm.find('.offered-promotion');
        $cache.emailInput = $cache.newEmailAddressesForm.find('input[type="email"]');
        $cache.footerEmailInput = $cache.footerSubscriptionForm.find('input#email-input');
        $cache.saveEmail = $cache.footerSubscriptionForm.find('#save-email');
        $cache.footerSuccessMessageContainer = $cache.footerSubscriptionForm.find('.success');
        $cache.footerErrorMessageContainer = $cache.footerSubscriptionForm.find('.error');
        $cache.dateErrorMessage = $cache.newEmailAddressesForm.find('.form-column-right').find('.message-placeholder');
        $cache.emailErrorMessage = $cache.newEmailAddressesForm.find('.form-column-left').find('.message-placeholder');
    }

    function onDialogOpen() {
        $('.ui-dialog-titlebar').hide();
        $(".ui-widget-overlay").css('background-color', 'black');
        $(".ui-widget-overlay").css('opacity', '0.8');
        $(".ui-widget-overlay").click(closeDialog);
    }

    function closeDialog() {
        $cache.newEmailAddressesContainer.dialog("close");
        app.validation.reset($cache.newEmailAddressesForm);
        $cache.successNewMessageContainer.hide();
        $cache.signupTextContainer.show();
        $cache.newEmailAddressesForm.show();
        $cache.newEmailAddressesContainer.removeClass('email-sent');
    }

    function showForm(init) {
        if(!$cache.newEmailAddressesContainer.exists() || (init === true && !emailDialogShow)) {
            return;
        }

        app.dialog.create({
            target: $cache.newEmailAddressesContainer,
            options: {
                width: 500,
                height: 430,
                title: this.title,
                show: { effect: "fade", speed: 1000 },
                hide: "fade",
                closeOnEscape: true,
                open: onDialogOpen,
                zIndex: 10000
            }
        });

        $cache.newEmailAddressesContainer.dialog("open");
        if(init !== true) {
            $cache.emailInput.val($cache.footerEmailInput.val());
            app.validation.validateField($cache.emailInput);
        }
    }

    function onSuccess() {
        if($cache.newEmailAddressesForm.exists()) {
            $cache.successNewMessageContainer.show();
            $cache.signupTextContainer.hide();
            $cache.newEmailAddressesForm.hide();
            $cache.newEmailAddressesContainer.toggleClass('email-sent');

            utag.link({ page_type:'popup', page_name:'email_popup', event:'email_submit_success' });    // for Tealium / Omniture

        } else {
            $cache.footerSuccessMessageContainer.show();
        }
    }

    function populatePromotion() {
        $cache.promotionValue.val($cache.promotionContainer.data('promo'));
        $cache.footerPromotionValue.val($cache.footerPromotionContainer.data('promo'));
    }

    function bindForm() {
        var callbacks = null;

        if($cache.newEmailAddressesForm.exists()){
            callbacks = app.form.bindAjax($cache.newEmailAddressesForm, true, { dataType: "json" });

            callbacks.beforeSubmit.add(function(){
                app.validation.resetFormError($cache.newEmailAddressesForm);
            });
        } else {
            callbacks = app.form.bindAjax($cache.footerSubscriptionForm, true, { dataType: "json" });
        }

        callbacks.success.add(function(form, response, textStatus, jqXHR) {
            if(response.success) {
                onSuccess();
            }
        });

        populatePromotion();
    }

    function manageErrorMessages() {
        // If date has non errors, use all available space.
        if ($cache.dateErrorMessage.find('.parsley-error-list')[0]){
            $cache.emailErrorMessage.removeClass('only-email-error');
        } else {
            $cache.emailErrorMessage.addClass('only-email-error');
        }
    }

    function populateDate() {
        var month = $cache.monthSelect.val();
        var day = $cache.daySelect.val();
        var year = $cache.yearSelect.val();
        $cache.dateValue.val("");

        if (month && day && year) {
            $cache.dateValue.val(month + '/'+ day + '/' + year);
            $cache.dateValue.parsley('validate');
        }
    }

    function clearFooterMessage() {
        $cache.footerSuccessMessageContainer.hide();
    }

    function bindEvents() {
        $cache.monthSelect.change(populateDate);
        $cache.daySelect.change(populateDate);
        $cache.yearSelect.change(populateDate);
        $cache.closeButton.click(closeDialog);
        $cache.shoppingButton.click(closeDialog);
        $cache.saveEmail.click(showForm);
        $cache.footerEmailInput.keyup(clearFooterMessage);
        $cache.dateErrorMessage.bind('DOMSubtreeModified', manageErrorMessages);
    }
    
    app.newEmailAddresses = {
        init: function() {
            initializeCache();
            showForm(true);
            bindForm();
            bindEvents();
        }
    };

}(window.app = window.app || {}, jQuery));

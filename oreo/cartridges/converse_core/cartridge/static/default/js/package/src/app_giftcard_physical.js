(function(app, $) {
    var TABIFY = app.constant.PUBSUB.TABIFY;
    var $cache;
    var $giftCards;  
    
    function getAmount() {
        var result = 0;

        if ($cache.amountOptions.is(':visible')) {
            result = Number($cache.amountOptions.find(':checked').val());
        } else if ($cache.amountSelectOptions.is(':visible')) {
            result = Number($cache.amountSelectOptions.val());
        }

        return result;
    }

    function getSleeve() {
        return $cache.sleeveOptions.find(':checked').val();
    }

    function populateSku() {
        var amount = getAmount();
        var sleeve = getSleeve();

        if (amount > 0 && sleeve) {
            $cache.sku.val($giftCards[sleeve][amount]);
        }
    }

    function resetForm() {
        $cache.physicalGiftcardForm.resetForm();
        $cache.sku.val('');
    }

    function initializeCache() {
        $cache = {
            physicalGiftcardForm: $("div.converse-tabs form[name='physicalGiftcardForm']")
        };

        $cache.amountOptions = $cache.physicalGiftcardForm.find(".giftcard-options-container li");
        $cache.sleeveOptions = $cache.physicalGiftcardForm.find(".sleeve-options li");
        $cache.amountSelectOptions = $cache.physicalGiftcardForm.find(".select-giftcard-options-container");
        $cache.sku = $cache.physicalGiftcardForm.find("#sku");
    }
    
    function bindForm() {
        var callbacks = app.form.bindAjax($cache.physicalGiftcardForm, false);

        callbacks.beforeSubmit.add(function(){
            app.validation.resetFormError($cache.physicalGiftcardForm);
        });

        callbacks.success.add(function(form, response, textStatus, jqXHR) {
                if (response.success === false) {
                    app.validation.showFormError($cache.physicalGiftcardForm, app.giftcard.getErrorMessage(response.formErrors));
                    return;
                }

                app.minicart.updatePanelContent(response);
                app.minicart.refresh();
                resetForm();
            });
    }

    function bindEvents() {
        $cache.amountOptions.find('input[type="radio"]').click(populateSku);
        $cache.sleeveOptions.find('input[type="radio"]').click(populateSku);
        $cache.amountSelectOptions.change(populateSku);
    }

    function initPhysicalGiftCard() {
        initializeCache();
        bindForm();
        bindEvents();
        $giftCards = app.giftcard.getAvailablePhysicalVariants();
    }

    app.giftcardPhysical = {
        init: function() {            
            $.subscribe(TABIFY.TAB_COMPLETE, initPhysicalGiftCard);
        }
    };

}(window.app = window.app || {}, jQuery));

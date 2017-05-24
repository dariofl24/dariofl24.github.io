(function(app, $) {
    var TABIFY = app.constant.PUBSUB.TABIFY;
    var $cache;

    function resetForm() {
        $cache.electronicGiftcardForm.resetForm();
        $cache.sku.val('');
    }

    function initializeCache() {
        $cache = {
            electronicGiftcardForm: $("div.converse-tabs form[name='electronicGiftcardForm']")
        };

        $cache.amountOptions = $cache.electronicGiftcardForm.find("input[name='card-amount']");
        $cache.amountSelectOptions = $cache.electronicGiftcardForm.find(".select-giftcard-options-container");
        $cache.sku = $cache.electronicGiftcardForm.find("#sku");
    }

    function bindForm() {
        var callbacks = app.form.bindAjax($cache.electronicGiftcardForm, false);

        callbacks.beforeSubmit.add(function(){
            app.validation.resetFormError($cache.electronicGiftcardForm);
        });

        callbacks.success.add(function(form, response, textStatus, jqXHR) {
                if (response.success === false) {
                    app.validation.showFormError($cache.electronicGiftcardForm, app.giftcard.getErrorMessage(response.formErrors));
                    return;
                }

                app.minicart.updatePanelContent(response);
                app.minicart.refresh();
                resetForm();
            });
    }

    function bindEvents() {
        $cache.amountOptions.click(function(e){
            $cache.sku.val($(e.currentTarget).val());
        });

        $cache.amountSelectOptions.change(function(e){
            $cache.sku.val($(e.currentTarget).val());
        });
    }

    function initElectronicGiftCard() {
        initializeCache();
        bindForm();
        bindEvents();
    }

    app.giftcardElectronic = {
        init: function() {
            $.subscribe(TABIFY.TAB_COMPLETE, initElectronicGiftCard);
        }
    };

}(window.app = window.app || {}, jQuery));

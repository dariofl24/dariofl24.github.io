/*global window*/

(function(app, $) {
    var TABIFY = app.constant.PUBSUB.TABIFY;
    var OLD_GIFTCARD_LENGTH = 16;
    var $cache;
    
    function initializeCache() {
        $cache = {
            giftcardCheckBalanceForm : $("div.converse-tabs form[name='giftcardBalanceForm']")
        };

        $cache.cardNumberInput = $cache.giftcardCheckBalanceForm.find('input[name$="_cardnumber"]');
        $cache.pinInput = $cache.giftcardCheckBalanceForm.find('input[name$="_pin"]');
        
        $cache.balanceValueContainer = $cache.giftcardCheckBalanceForm.find("#balancevalue");
        $cache.amount = $cache.giftcardCheckBalanceForm.find("#amount");
        $cache.checkBalanceButton = $cache.giftcardCheckBalanceForm.find("#checkbalancebtn");
    }

    function isNewGiftcard(cardNumber) {
        return cardNumber.length !== OLD_GIFTCARD_LENGTH;
    }

    function resetForm() {
        $cache.giftcardCheckBalanceForm.resetForm();
        $cache.checkBalanceButton.val(app.resources.CHECK_ANOTHER_CARD);
    }

    function bindCustomValidation() {
        $cache.cardNumberInput.blur(function(){
            var cardNumberValue = $(this).val();

            if (isNewGiftcard(cardNumberValue)) {
                $cache.pinInput.parsley( 'addConstraint', { required: true } );
            } else {
                $cache.pinInput.parsley( 'removeConstraint', 'required');
            }
        });
    }

    function bindForm() {
        app.form.bindAjax($cache.giftcardCheckBalanceForm, true, { dataType: "json" })
                .success.add(function(form, response, textStatus, jqXHR) {
                    app.validation.reset($cache.giftcardCheckBalanceForm);
                    $cache.amount.text('');

                    if(response.success) {
                        $cache.amount.text(response.result);
                        $cache.balanceValueContainer.show();
                    } else {
                        $cache.balanceValueContainer.hide();
                        app.validation.showFormError($cache.giftcardCheckBalanceForm, response.formErrors.errorMessage);
                    }

                    resetForm();
                });
    }

    function bindEvents() {
        bindCustomValidation();
        bindForm();
    }

    function initGiftcardCheckBalance() {
        initializeCache();
        bindEvents();
    }

    app.giftcardCheckBalance = {
        init: function() {
            $.subscribe(TABIFY.TAB_COMPLETE, initGiftcardCheckBalance);
        }
    };

}(window.app = window.app || {}, jQuery));

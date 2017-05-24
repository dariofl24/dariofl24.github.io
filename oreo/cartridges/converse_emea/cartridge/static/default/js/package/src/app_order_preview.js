/*global window */
(function(app, $) {
    var $cache = {};

    function initializeCache() {
        $cache = {
            orderSummaryFooter: $(".order-summary-footer"),
            idealPaymentForm: $(".ideal-form")
        };

        $cache.orderSubmit   = $cache.orderSummaryFooter.find('button[type="submit"]');
        $cache.termsCheckbox = $cache.orderSummaryFooter.find('input[name="termsCheckbox"]');
        $cache.termsError    = $cache.orderSummaryFooter.find('.terms-error');
    }

    function bindEvents() {
        $cache.orderSubmit.on("click", verifyTermsAndConditions);
        $cache.idealPaymentForm.on('submit', idealPaymentPopup);
    }

    function verifyTermsAndConditions() {
        if (!$cache.termsCheckbox.is(':checked')) {
            $cache.termsError.show();
           return false;
        }
    }
    
    function idealPaymentPopup(event) {
        event.preventDefault();
        app.popUpIdealPayment.init();
    }
    
    app.orderPreview = {
        init: function() {
            initializeCache();
            bindEvents();
        }
    };

} (window.app = window.app || {}, jQuery));

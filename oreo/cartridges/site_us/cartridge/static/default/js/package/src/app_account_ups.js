/*global window*/
(function(app, $) {

    function initializeReturnExchangeFormLink() {
        var returnExchangeSelect = $("#return_exchange_select"),
            returnExchangeFormLink = $("#return_exchange_form_link");

        var setReturnExchangeFormLinkVisibility = function() {
            returnExchangeFormLink.toggle(returnExchangeSelect.val() === 'yes');
        };

        setReturnExchangeFormLinkVisibility();
        returnExchangeSelect.change(setReturnExchangeFormLinkVisibility);
    }

    function initializeReturnsPrintLabel() {
        $("#print-return-label").on("click", function() {
            window.print();
        });
    }
    
    app.accountUPS = {
        init: function() {
            initializeReturnExchangeFormLink();
            initializeReturnsPrintLabel();
        }
    };

}(window.app = window.app || {}, jQuery));

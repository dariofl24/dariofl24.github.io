// app.account
(function(app, $) {


    function initializeExchangeSelectLabel() {

        (function() {
            var ev = new $.Event('classadded'),
                orig = $.fn.addClass;
            $.fn.addClass = function() {
                $(this).trigger(ev, arguments);
                return orig.apply(this, arguments);
            };
        })();

        (function() {
            var ev = new $.Event('classremoved'),
                orig = $.fn.removeClass;
            $.fn.removeClass = function() {
                $(this).trigger(ev, arguments);
                return orig.apply(this, arguments);
            };
        })();

        var dwControl = $('#check_label_on_error').find('div.form-group'); 

        $(dwControl).on('classadded', function(ev, newClasses) {
            $('#return_exchange_select_label').addClass(newClasses);
        });

        $(dwControl).on('classremoved', function(ev, newClasses) {
            $('#return_exchange_select_label').removeClass(newClasses);
        });
    
    }



    app.account = {
        init: function() {
            app.accountAddresses.init();
            app.accountProfile.init();
            app.accountSubscriptions.init();
            initializeExchangeSelectLabel();
        }
    };

}(window.app = window.app || {}, jQuery));

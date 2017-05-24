// app.checkout
(function(app, $) {
     app.sidebar = {
        setSideBarHeight: function() {
            var $cache = $('.pt_checkout');
            $cache.sidebar = $cache.find('.checkout-sidebar');
            $cache.sidebarInitialHeight = $cache.sidebar.outerHeight();
            $cache.checkoutContent = $cache.find('#primary');

            if ($cache.sidebar.css('float') !== 'none') {
               if ($cache.sidebarInitialHeight < $cache.checkoutContent.outerHeight()) {
                   $cache.sidebar.height($cache.checkoutContent.outerHeight());
               } else {
                   $cache.sidebar.height($cache.sidebarInitialHeight);
               }
            }else if ($cache.sidebar.css('height')) {
                $cache.sidebar.css("height", "");
            }
        }
     };

    app.checkoutForm = {
        resetDropdown: function() {
            var options = {
                minimumResultsForSearch: Infinity,
                containerCssClass: 'default',
                dropdownCssClass:  'default'
            };
            $('.pt_checkout div').removeClass('styled-select');
            $('.pt_checkout').find('select').select2(options);
        }
    };
    
    function updateSideBarHeight() {
        $(window).resize(function () {
            app.sidebar.setSideBarHeight();
       });
    }

    function initializeTermsAndConditionsPopup() {
        if ($('.terms-and-conditions-popup-link').is(':visible')) {
            $('.terms-and-conditions-popup-link').magnificPopup({
                type: 'inline',
                midClick: true
            });
        }
    }

    app.checkout = {
        init: function() {
            app.checkoutShipping.init();
            app.checkoutBilling.init();
            app.checkoutSidebar.init();
            app.radio_button.init(".pt_checkout");
            app.checkbox.init(".pt_checkout");
            updateSideBarHeight();
            initializeTermsAndConditionsPopup();
        }
    };
}(window.app = window.app || {}, jQuery));

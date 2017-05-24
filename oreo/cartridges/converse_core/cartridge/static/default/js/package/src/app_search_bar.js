// app.searchbar
(function(app, $) {
    var CONST = app.constant;
    var $cache = {};

    function initializeCache() {
        $cache = {
            overlayArea: $('#overlay-area'),
            searchButton: $('#search-button'),
            searchClose: $('.header-search .action-close'),
            searchBar: $('#search-bar')
        };

        $cache.queryInputField = $cache.searchBar.find('input#q');
    }

    function bindEvents() {
        $cache.searchButton.on("click", function() {
            app.slider.toggle(CONST.SLIDER.SEARCH_PANEL);
        });

        $cache.searchClose.on("click", function() {
            app.slider.toggle(CONST.SLIDER.SEARCH_PANEL);
        });

        $.subscribe(CONST.SLIDER.EXPANDED, function(topic, sliderName) {
            if (sliderName === CONST.SLIDER.SEARCH_PANEL) {
                $cache.searchButton.addClass('search-active');
                $cache.queryInputField.focus();
            }
        });

        $.subscribe(CONST.SLIDER.COLLAPSED, function(topic, sliderName) {
            if (sliderName === CONST.SLIDER.SEARCH_PANEL) {
                $cache.searchButton.removeClass('search-active');
            }
        });
    }

    app.searchbar = {
        init: function() {
            initializeCache();
            bindEvents();
        }
    };

}(window.app = window.app || {}, jQuery));

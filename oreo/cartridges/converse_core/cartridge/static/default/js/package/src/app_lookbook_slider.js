//app.lookbookslider
(function(app, $) {

    var $cache;
    var slider;

    function initializeCache() {
        $cache = {
            lookbook: $('#lookbook-desktop').find('.slides')
        };
    } 

    function getLargeSliderOptions() {
        return {
            auto: false,
            autoHover: true,
            pager: false,
            mode: 'horizontal',
            useCSS: false,
            touchEnabled: true,
            controls: true,
            responsive: true,
            preloadImages: 'all'
        };
    }

    function initSlider() {
        slider = $cache.lookbook.bxSlider(getLargeSliderOptions());
    }

    function initModal() {
        $('.js-load-jp-popup').magnificPopup({
          type:'inline',
          midClick: true
        });
    }

    function reloadSlider(event) {
        setTimeout(function() {
            slider.reloadSlider();
        }, 200);  
    }
 
    function initEvents() {
        $('.js-load-jp-popup').on('click', reloadSlider);
    }

    function init() {
        initializeCache();
        initEvents();
        initSlider();
        initModal();
    }

    app.lookbookslider = {
        init: init
    };

}(window.app = window.app || {}, jQuery));
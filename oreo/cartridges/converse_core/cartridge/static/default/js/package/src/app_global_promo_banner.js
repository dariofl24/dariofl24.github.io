/*global _*/
(function(app, $) {

    var GLOBAL_PROMO_BANNER = ".global-promo-banner",
        GLOBAL_PROMOS = "#global-promos";
    var SLIDER;

    function getSliderObject() {

        if ( _.isUndefined(SLIDER) ) {
            var promoList = $(GLOBAL_PROMOS),
                promoItems = promoList.find(".global-promo");

            SLIDER = promoList.bxSlider({
                onSliderLoad: function() {
                    promoItems.addClass("loaded");

                    // Hack: setting item's proper height after the parent <ul> is rendered.
                    var viewport = promoList.parent(".bx-viewport");
                    promoItems.find("div").css("height", $(viewport).height());
                }
            });
        }
        return SLIDER;
    }

    function getSliderOptions() {
        return {
                auto: $(GLOBAL_PROMO_BANNER).is(":visible"),
                autoHover: true,
                pager: false,
                useCSS: false,
                mode: "fade", 
                onSlideAfter: function(e, oi, ni) {
                    if( executedFullCycleOfSlides( ni ) ) {
                        var slider = getSliderObject();
                        slider.stopAuto();
                    }
                }
            };
    }

    function setupSlider() {
        var promoList = $(GLOBAL_PROMOS),
            promoItems = promoList.find(".global-promo");

        if (promoItems.length > 1) {
            var slider = getSliderObject();
            slider.reloadSlider(getSliderOptions());
        }
    }

    function executedFullCycleOfSlides( ni ) {
        return (ni === 0);
    }

    function updateGlobalPromoBanner() {
        $.get(app.urls.globalPromoBanner)
            .done(function(response) {
                $(GLOBAL_PROMO_BANNER).replaceWith(response);
                SLIDER = undefined;
                setupSlider();
            });
    }

    function initializeEvents() {
        $.subscribe(app.constant.PUBSUB.CART.QTY_CHANGED, updateGlobalPromoBanner);
    }

    app.globalPromoBanner = {
        init: function() {
            initializeEvents();
            setupSlider();
        }
    };

}(window.app = window.app || {}, jQuery));

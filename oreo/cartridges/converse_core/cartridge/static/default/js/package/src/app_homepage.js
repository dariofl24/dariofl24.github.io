// app.homepage
(function(app, $) {
    app.homepage = {
        initFeaturedCategories: function() {
            $(".featured-categories").tabs({
                fx: {
                    opacity: 'toggle'
                },
                select: function(event, ui) {
                    jQuery(this).css('height', jQuery(this).height());
                    jQuery(this).css('overflow', 'hidden');

                    if(history && history.pushState) {
                        history.pushState(null, null, ui.tab.hash);
                    }
                    else {
                        location.hash = ui.tab.hash;
                    }
                },
                show: function(event, ui) {
                    jQuery(this).css('height', 'auto');
                    jQuery(this).css('overflow', 'visible');
                },
                load: function(event, ui) {
                    app.product.tile.init();
                    if (ui.panel) {
                        $('#'+ui.panel.id).siblings('.ui-tabs-panel').html('');
                    }
                },
                beforeLoad: function(event, ui) {
                    ui.jqXHR.error(function() {
                        ui.panel.html("Couldn't load this category.");
                    });
                }
            });

            app.search.initViewMore();
        }
    };

    // To prevent default browser scrolling to DIV
    // create an temp element with the same ID/class
    // then remove from DOM once window is loaded
    if (window.location.hash) {
        var param = window.location.hash.replace('#','');
        var tempElement = '<div id="' + param + '" class="removable" style="display:none"></div>';
        $('#header').prepend(tempElement);
            
        //DOM loaded: Remove temp element
        window.onload = function() {
            $('div.removable').remove();
        };
    }

}(window.app = window.app || {}, jQuery));

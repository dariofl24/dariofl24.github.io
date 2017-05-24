// app.search
(function(app, $) {

    var selector = {
        moreResults: '#moreresults',
        topmenucatid: '#topmenucatid'
    };

    var $cache = {};

    function initializeCache() {
        $cache = {
            page: $('.pt_product-search-result'),
            main: $('#main')
        };

        $cache.content = $cache.main.find('.search-result-content');
    }

    function onClickMoreResults(event) {
        event.preventDefault();
        if (app.gridwall.moreResultsUrlExists()) {
            var url = app.gridwall.getMoreResultsUrl();
            app.gridwall.update(url);
        }
    }

    function initViewMoreButton() {
        app.gridwall.resetMoreResultsSizeParam();
        $cache.page.on('click', selector.moreResults, onClickMoreResults);
    }
    
    function addTopMenuCategoryParam(){
        var moreResultsElement = $(selector.moreResults);
        if( $(selector.topmenucatid).exists() ){
            moreResultsElement.attr("href",moreResultsElement.attr("href"));
        }
    }

    function initializeEvents() {
        $(window).on('resize', app.refinementSlider.resizeSliders);
    }

    app.search = {
        init: function() {
            initializeCache();
            initializeEvents();
            app.product.tile.init();
            initViewMoreButton();
            addTopMenuCategoryParam();
            app.infiniteScroll.init();
            app.filters.init();
        },
        initViewMore: function() {
            initializeCache();
            initViewMoreButton();
        }
    };

}(window.app = window.app || {}, jQuery));
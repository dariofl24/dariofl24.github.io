// app.search

(function(app, $) {
    var CONST = app.constant,
        queryParamStart = 0,
        queryParamSize = 16,
        History = window.History,

        selector = {
            main: '#main',
            page: '.pt_product-search-result',
            header: '.pt_product-search-result .category-header',
            moreResultsContainer: '.more-results',
            moreResults: '#moreresults',
            searchResultContent: '.search-result-content',
            searchResultItems: '#search-result-items',
            gridTileItem: '#search-result-items .grid-tile',
            breadcrumb: '.content-header-category',
            refinements: '#refinements',
            refinementDetails: '#refinement-details',
            mobileSearchPanel: '.mobile-search-panel',
            refinementDetailsMobile: '#refinement-details-mobile',
            overlay: '#gridwall-overlay',
            topmenucatid: '#topmenucatid'
        },
        currentAjaxUrl;

    function moreResultsUrlExists() {
        return $(selector.moreResults).exists();
    }

    function getMoreResultsUrl() {
        return $(selector.moreResults).attr('href');
    }

    function getMoreResultsParams() {
        var url = moreResultsUrlExists() ? getMoreResultsUrl() : currentAjaxUrl;
        var element = $('<a href="' + url + '">');
        var queryString = element.get(0).search.substr(1);
        return app.util.getQueryStringParams(queryString);
    }

    function getGridwallItemCount() {
        return $(selector.gridTileItem).length;
    }

    function getPushStateObject() {
        var params = getMoreResultsParams();
        params['sz'] = getGridwallItemCount();
        params['start'] = queryParamStart;
        return params;
    }

    function serializePushStateObject(params) {
        return $.param(params);
    }

    function pushStateUrl(pushStateObject, pushStateObjectSerialized) {
        History.pushState(pushStateObject, '', '?' + pushStateObjectSerialized);
    }

    function updateUrlState() {
        var pushStateObject = getPushStateObject();
        var pushStateObjectSerialized = serializePushStateObject(pushStateObject);
        pushStateUrl(pushStateObject, pushStateObjectSerialized);
    }

    function updateMoreResultsLink(data) {
    var moreResultsElement = $(data).find(selector.moreResults);
    if (moreResultsElement.exists()) {
        if ($(selector.moreResultsContainer).exists()) {
            $(selector.moreResultsContainer).find(selector.moreResults).replaceWith(moreResultsElement);
            
            if( $(selector.topmenucatid).exists() ){
                moreResultsElement.attr("href",moreResultsElement.attr("href")+getTopMenuCategoryName());
            }
            
        } else {
            $(selector.searchResultContent).after($(data).find(selector.moreResultsContainer));
        }
    } else {
        $(selector.moreResultsContainer).remove();
    }
}

    function setMoreResultsLinkSizeParam(url) {
        var moreResultsLinkUpdatedSizeParam = app.util.updateParamFromURL(url, 'sz', queryParamSize);
        $(selector.moreResults).attr('href', moreResultsLinkUpdatedSizeParam);
    }

    function resetMoreResultsSizeParam() {
        if (moreResultsUrlExists()) {
            var url = getMoreResultsUrl();
            setMoreResultsLinkSizeParam(url);
        }
    }

    function updateData(data) {
        var $data = $(data);
        //var headerHtml = $data.find(selector.header);
        var refinementsHtml = $data.find(selector.refinements);
        var refinementDetailsHtml = $data.find(selector.refinementDetails);
        var mobileSearchPanelHtml = $data.find(selector.mobileSearchPanel);
        var refinementDetailsMobileHtml = $data.find(selector.refinementDetailsMobile);
        //$(selector.header).replaceWith(headerHtml);
        $(selector.refinements).replaceWith(refinementsHtml);
        $(selector.refinementDetails).replaceWith(refinementDetailsHtml);
        $(selector.mobileSearchPanel).replaceWith(mobileSearchPanelHtml);
        $(selector.refinementDetailsMobile).replaceWith(refinementDetailsMobileHtml);
        
    }

    function getTopMenuCategoryName(){
        return '';
    }
    
    function updateGridSuccess(data) {
        updateData(data);
        updateMoreResultsLink(data);
        updateUrlState();
        app.product.tile.init();
        
        var breadcrumb = $(data).find(selector.breadcrumb);
        $(selector.breadcrumb).html( breadcrumb.html() );
        
        toggleProgress();
        $.publish(CONST.PUBSUB.SCROLL.DONE_LOADING_PAGES, []);
    }

    function appendItemsToGridwall(data) {
        var searchResultItems = $(data).find(selector.gridTileItem);
        $(searchResultItems).appendTo(selector.searchResultItems);
        
        updateGridSuccess(data);
    }

    function replaceItemsOnGridwall(data) {
        var searchResultItems = $(data).find(selector.searchResultItems);
        $(selector.searchResultItems).replaceWith(searchResultItems);
        updateGridSuccess(data);
    }

    function showProgress() {
        $(selector.searchResultContent).prepend('<div id="gridwall-overlay"></div>');
    }

    function hideProgress() {
        $(selector.overlay).remove();
    }

    function toggleProgress() {
        if ($(selector.overlay).exists()) {
            hideProgress();
        } else {
            showProgress();
        }
    }

    function scrollToTop() {
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 270) {
                $('.scrollupwrapper').fadeIn();
            } else {
                $('.scrollupwrapper').fadeOut();
            }
        });

        $('.scrollupwrapper').on('click', function() {
            $('html, body').animate({
                scrollTop: 0
            }, 600);
            return false;
        });
    }

    function updateGrid(url, callback) {
        var currentUrl = url;

        $.publish(CONST.PUBSUB.SCROLL.DO_NOT_ACCEPT_ACTIONS_ON_REACHED_BOTTOM, []);

        toggleProgress();
        var ajaxOptions = {
            url: currentUrl,
            type: 'GET',
            dataType: 'html'
        };
        var request = $.ajax(ajaxOptions);
        request.done(callback);
        request.always(function(){
                $.publish(CONST.PUBSUB.SCROLL.ACCEPT_ACTIONS_ON_REACHED_BOTTOM, []);
               currentAjaxUrl = currentUrl;
        });
    }

    app.gridwall = {
        update: function(url) {
            updateGrid(url, appendItemsToGridwall);
        },
        replace: function(url) {
            updateGrid(url, replaceItemsOnGridwall);
        },
        scrollToTop: scrollToTop,
        moreResultsUrlExists: moreResultsUrlExists,
        getMoreResultsUrl: getMoreResultsUrl,
        getMoreResultsParams: getMoreResultsParams,
        setMoreResultsLinkSizeParam: setMoreResultsLinkSizeParam,
        resetMoreResultsSizeParam: resetMoreResultsSizeParam,
        getGridwallItemCount: getGridwallItemCount,
        getPushStateObject: getPushStateObject,
        serializePushStateObject: serializePushStateObject,
        pushStateUrl: pushStateUrl,
        updateData: updateData,
        updateUrlState: updateUrlState,
        updateMoreResultsLink: updateMoreResultsLink,
        appendItemsToGridwall: appendItemsToGridwall,
        replaceItemsOnGridwall: replaceItemsOnGridwall,
        updateGrid: updateGrid
    };

}(window.app = window.app || {}, jQuery));
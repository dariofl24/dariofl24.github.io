/* global utag */

(function(app, $) {

    var CONST = app.constant;
    var appUtil = app.util;

    var selector = {
        header: '#header',
        footer: 'footer',
        page: '.pt_product-search-result',
        billboard: '.slim-category-billboard',
        searchResults: '.search-result-content',
        isExpanded: 'is-expanded',
        isCollapsed: 'is-collapsed',
        refinement: '.refinement',
        refinementDetail: '.refinement-detail',
        refinementLink: '.refinement-detail a',
        refinements: '#refinements',
        filterType: '.filter-type',
        filterTypeByDesktop: '#refinements .filter-type',
        closePanel: '.close-panel',
        clearFilter: '.clear-filter a',
        sortBySelect: '#sort-by-select-box',
        mobileSearchPanel: '.mobile-search-panel',
        sortOptionMobile: '.mobile-search-panel .sort-option p',
        filterByMobile: '.product-sort-filter-options-mobile .filter-by',
        filterOptionByMobile: '.mobile-search-panel .filter-option',
        sortByMobile: '.product-sort-filter-options-mobile .sort-by',
        moreRefinementsLink: '.more-refinements-link'
    };
    
    var $page = $(selector.page);
    var $refinementBar;
    var $categoryHeader;

    function getAvailableFilters() {
        var filterList = [];
        var elements = $('h3[data-refinement-id]');

        if (!elements.exists()) {
            return filterList;
        }

        elements.each(function() {
            filterList.push($(this).data('refinement-id'));
        });

        return filterList;
    }

    function getSelectedFilterRefinements(filter) {
        var $parentElement = appUtil.isSmallDevice() ? $(selector.mobileSearchPanel) : $(selector.refinements),
            selectorTxt = String.format('ul[data-refinement-id="{0}"]', filter),
            $refinementsListElement = $parentElement.find(selectorTxt),
            arr = [];

        $refinementsListElement.find('.selected').each(function() {
            var refinementText = $(this).find('span').text();
            arr.push(refinementText);
        });

        return arr;
    }

    function getAllSelectedRefinements() {
        var filters = getAvailableFilters();
        var obj = {};

        for (var i = 0; i < filters.length;  i++) {
            obj[filters[i]] = getSelectedFilterRefinements(filters[i]);
        }

        return obj;
    }

    function getSelectedRefinementCount() {
        var filters = getAvailableFilters();
        var count = 0;

        for (var i = 0; i < filters.length;  i++) {
            count += getSelectedFilterRefinements(filters[i]).length;
        }

        return count;
    }

    function toggleMoreButton() {
        $(selector.refinements).find(selector.refinementDetail).each(function() {
            var cutoffThreshold = parseInt($(this).data('cutoff-threshold'), 10);
            var refinementCount = $(this).find('li').length;

            if (refinementCount > cutoffThreshold) {
                $(this).find('ul[data-refinement-id]').append('<li class="more-refinements-link desktop-only">More +</li>');
            }
        });
    }

    function updateRefinementCount() {
        var count = getSelectedRefinementCount();
        var textValue = count > 0 ? '(' + count + ')' : '';

        var $element1 = $(selector.filterByMobile).find('.count');
        var $element2 = $(selector.mobileSearchPanel).find('.count');

        $element1.text(textValue);
        $element2.text(textValue);
    }

    function getFilterRefinmentsElement(filter) {
        var $parentElement = appUtil.isSmallDevice() ? $(selector.mobileSearchPanel) : $(selector.refinements);
        var cssClass = String.format('{0}.{1}', selector.refinementDetail, filter);

        return $parentElement.find(cssClass);
    }

    function filterExists(filter) {
        var $element = getFilterRefinmentsElement(filter);
        return $element.exists();
    }

    function toggleExpandability(filter) {
        var $filter = getFilterRefinmentsElement(filter).siblings(selector.filterType);

        if ($filter.hasClass(selector.isExpanded)) {
            $filter.addClass(selector.isCollapsed).removeClass(selector.isExpanded);
        } else {
            $filter.addClass(selector.isExpanded).removeClass(selector.isCollapsed);
        }
    }

    function toggleFilterRefinementsVisibility(filter) {
        if (!(filterExists(filter))) {
            return;
        }

        var $element = getFilterRefinmentsElement(filter);

        $element.toggle();
        toggleExpandability(filter);
    }

    function openPanel(panel) {
        $('body').css('overflow', 'hidden');
        $(panel).fadeIn();
    }

    function closePanel() {
        $('body').css('overflow', 'auto');
        $(selector.mobileSearchPanel).fadeOut();
    }

    var defaultPadding = 100;
    var oldScrollTop=$(window).scrollTop();
    
    function fixedFilters(){
        var minProductsToEnableFixedNav = 12;
    
        if (app.gridwall.getGridwallItemCount() <= minProductsToEnableFixedNav) {
            $("#refinements").removeClass('sticky sticky-bottom');
            return;
        }
        
        if(!appUtil.isTouchDevice()){
            dofixedFilters();
        }
        
        
    }
    
    function dofixedFilters() {
    
        $refinementBar= $(selector.refinements);
        $categoryHeader= $('.category-header');
    
        var minTrigger= $categoryHeader.outerHeight(true)+40;
        var minTrigger2= minTrigger + $(selector.header).height();
        var maxTrigger = $(document).height() - $(selector.footer).height()-getWindowHeight();
        
        minTrigger= (appUtil.isMediumDevice())?minTrigger2:minTrigger;
        
        var scrollTop = $(window).scrollTop();
        var windowHeight = getWindowHeight();
        var headerHeight = $(selector.header).height();
        var screenHeightNoHeaders = appUtil.isMediumDevice() ? (windowHeight - headerHeight) : (windowHeight - (headerHeight + defaultPadding));
        var refinementHeight= $refinementBar.height();
        
        setDefaultPosition(minTrigger,refinementHeight,screenHeightNoHeaders);
        
        
        var elemRelTop = $refinementBar.position().top;
        var up = ((scrollTop-oldScrollTop)>0)?false:true;
        var down = ((oldScrollTop-scrollTop)>0)?false:true;
        
        var positions =(appUtil.isMediumDevice())?
                getMenuPositionsForMediumDevice(scrollTop,headerHeight,refinementHeight,screenHeightNoHeaders,elemRelTop):
                getMenuPositionsForNonmobile(scrollTop,headerHeight,refinementHeight,screenHeightNoHeaders,elemRelTop);
        
        var functions= getLeftNavMovementFunctions();
        
        var vals={
                vtop:positions.top,
                vbot:positions.bot,
                vup:up,
                vdown:down,
                vscrollTop: scrollTop,
                vmaxTrigger: maxTrigger,
                vrefinementHeight: refinementHeight,
                vwindowHeight: windowHeight, 
                vheaderHeight: headerHeight,
                vminTrigger:minTrigger,
                vscreenHeightNoHeaders:screenHeightNoHeaders,
                velemRelTop:elemRelTop
        };
        
        moveLeftNav(functions,vals);
  
        oldScrollTop=scrollTop;
    }
    
    function setDefaultPosition(minTrigger,refinementHeight,screenHeightNoHeaders){
        if((oldScrollTop===0) || 
                (oldScrollTop < minTrigger && $refinementBar.css('position')==='static')){

            $refinementBar.css('bottom','auto');
            $refinementBar.css('position','absolute');
            
            
        }else if((oldScrollTop >= minTrigger) && ($refinementBar.css('position')==='static')){
        
            $refinementBar.css('position','fixed');
            if(refinementHeight > screenHeightNoHeaders){
                $refinementBar.css('bottom','0px');
                $refinementBar.css('top','auto');
            }else{
                $refinementBar.css('top',((appUtil.isMediumDevice())?0:$(selector.header).height())-40);
                $refinementBar.css('bottom','auto');
            }   
        }
    }
    
    function getMenuPositionsForNonmobile(scrollTop,headerHeight,refinementHeight,screenHeightNoHeaders,elemRelTop){
        var top_nm;
        var bot_nm;
        
        if($refinementBar.css('position')==='absolute'){
            top_nm = $categoryHeader.outerHeight(true)-scrollTop+40+elemRelTop;
        }else if($refinementBar.css('position')==='fixed'){
            top_nm = elemRelTop - headerHeight-scrollTop-40;
        }
        
        bot_nm = 40 - (refinementHeight-(screenHeightNoHeaders - top_nm));
        
        return {top:top_nm,bot:bot_nm};
    }
    
    function getMenuPositionsForMediumDevice(scrollTop,headerHeight,refinementHeight,screenHeightNoHeaders,elemRelTop){
        
        var top_meddiv;
        var bot_meddiv;
        
        if($refinementBar.css('position')==='absolute'){
            
            top_meddiv = $categoryHeader.outerHeight(true)+ $(selector.header).height() -scrollTop+40+elemRelTop;
            
        }else if($refinementBar.css('position')==='fixed'){
        
            top_meddiv= elemRelTop -scrollTop - 40;
            
        }
        
        bot_meddiv= 40 - (refinementHeight-(screenHeightNoHeaders - top_meddiv)) - 32;
        
        return {top:top_meddiv,bot:bot_meddiv};
    }
    
    function moveLeftNav(functions,vals){
    
        if( functions.isFixMenuBottomOnScreen(vals) ){ //1
            functions.fixMenuBottomOnScreen(vals.vrefinementHeight,vals.vscreenHeightNoHeaders,vals.vheaderHeight);
        }else if( functions.isFixMenuBottomOnPage(vals) ){ //2
                functions.fixMenuBottomOnPage(vals.velemRelTop,vals.vheaderHeight);
        }else if( functions.isFixMenuTopOnScreen(vals) || functions.isFixMenuTopOnScreen_small(vals) ){//3 & 4 
            functions.fixMenuTopOnScreen(vals.vheaderHeight);
        }else if( functions.isFixOnPageStart(vals) ){//5
            functions.fixOnPageStart();
        }else if( functions.isFixMenuTopOnPage(vals) ){ //6 when fixed and down to absolute
            functions.fixMenuTopOnPage(vals.velemRelTop,vals.vheaderHeight);
        }else if( functions.isFixOnPageEnd(vals) ){ //7
            functions.fixOnPageEnd(vals.vrefinementHeight,vals.vscreenHeightNoHeaders);   
        }
        
    }
    
    function isBottomCornerVisible(vals){
        return (vals.vtop <= 0) && (vals.vbot >= 0);
    }
    
    function isBottomCornerVisibleAndMovingUp(vals){
        return (vals.vtop>0) && (vals.vbot<0) && !vals.vdown; 
    }
    
    function isBottomCornerVisibleAndMovingUp_smallMenu(vals){
        return (vals.vtop>0) && (vals.vbot>0) && !vals.vdown && (vals.vrefinementHeight <= vals.vscreenHeightNoHeaders);
    }
    
    function isBottomCornerVisibleAndMovingDown(vals){
        return (vals.vtop <= 0) && (vals.vbot<0) && !vals.vup && vals.vdown;
    }
    
    function getLeftNavMovementFunctions(){
    
        var functions ={
                isFixMenuBottomOnScreen: function (vals){ 
                    return (isBottomCornerVisible(vals) && !vals.vup && (vals.vscrollTop < vals.vmaxTrigger) && ($refinementBar.css('position')!=='fixed'));
                },
                isFixMenuBottomOnPage: function (vals){
                    return (isBottomCornerVisible(vals) && vals.vup && !vals.vdown && ($refinementBar.css('position')==='fixed') && (vals.vrefinementHeight > ( vals.vwindowHeight - vals.vheaderHeight )));
                },
                    
                isFixMenuTopOnScreen: function (vals){
                    return (isBottomCornerVisibleAndMovingUp(vals) && ($refinementBar.css('position')==='absolute') && (vals.vscrollTop > vals.vminTrigger));
                },
                isFixMenuTopOnScreen_small: function (vals){
                    return (isBottomCornerVisibleAndMovingUp_smallMenu(vals) && ($refinementBar.css('position')==='absolute') && (vals.vscrollTop > vals.vminTrigger));
                },
                isFixMenuTopOnPage: function (vals){
                    return (isBottomCornerVisibleAndMovingDown(vals) && (vals.vscrollTop < vals.vmaxTrigger) && (vals.vscrollTop > vals.vminTrigger) && ($refinementBar.css('position')==='fixed'));
                },
                
                isFixOnPageStart: function (vals){
                    return (vals.vup && !vals.vdown && ($(selector.refinements).css('position')==='fixed') && (vals.vscrollTop < vals.vminTrigger) );
                },
                isFixOnPageEnd: function (vals){
                    return (vals.vscrollTop >= vals.vmaxTrigger);
                },
                bigRefinement: function (vals){
                    return (vals.vrefinementHeight > vals.vscreenHeightNoHeaders);
                },
                fixMenuBottomOnScreen: function(refinementHeight,screenHeightNoHeaders,headerHeight){
                    $refinementBar.css('position','fixed');
                    
                    if( refinementHeight > screenHeightNoHeaders ){
                        $refinementBar.css('bottom','0px');
                        $refinementBar.css('top','auto');
                    }else{
                        $refinementBar.css('bottom','auto');
                        $refinementBar.css('top',((appUtil.isMediumDevice())?0:headerHeight)-40);
                    }
                },
                fixMenuTopOnScreen: function(headerHeight){
                    $refinementBar.css('position','fixed');
                    $refinementBar.css('bottom','auto');
                    $refinementBar.css('top',((appUtil.isMediumDevice())?0:headerHeight)-40);
                },
                fixMenuBottomOnPage: function(elemRelTop,headerHeight){
                    $refinementBar.css('position','absolute');
                    $refinementBar.css('bottom','auto');
                    $refinementBar.css('top',elemRelTop - $categoryHeader.outerHeight(true) - headerHeight);
                },
                fixMenuTopOnPage: function(elemRelTop,headerHeight){
                    $refinementBar.css('position','absolute');
                    $refinementBar.css('bottom','auto');
                    $refinementBar.css('top',elemRelTop - $categoryHeader.outerHeight(true) - headerHeight);
                },
                fixOnPageStart: function(){
                    $refinementBar.css('position','absolute');
                    $refinementBar.css('bottom','auto');
                    $refinementBar.css('top','0');  
                },
                fixOnPageEnd: function(refinementHeight,screenHeightNoHeaders){
                    $refinementBar.css('position','absolute');
                    
                    if( refinementHeight > screenHeightNoHeaders ){
                        $refinementBar.css('bottom','0px');
                        $refinementBar.css('top','auto');
                    }else{
                        $refinementBar.css('bottom',(screenHeightNoHeaders-refinementHeight)+60);
                        $refinementBar.css('top','auto');
                    }
                }
        };
        
        return functions;
    }

    function getWindowHeight(){
         return appUtil.isTouchDevice() ? window.innerHeight : $(window).height();
    }
    
    
    function trackData(filterClicked, refinementClicked) {
        var allSelectedRefinements = getAllSelectedRefinements();

        /*
            Update allSelectedRefinements variable with currently clicked
            refinement data since we only know it after the ajax call we 
            need to do this on the fly to get current data.
            Remove item if unchecked Add item if checking the refinement.
        */
        var clickedFilterArray = allSelectedRefinements[filterClicked];
        var index = $.inArray(refinementClicked, clickedFilterArray);

        if (index > -1) {
            clickedFilterArray.splice(index, 1);
        } else {
            clickedFilterArray.push(refinementClicked);
        }

        utag.link({
            filterClicked: filterClicked,
            refinementClicked: refinementClicked,
            allSelectedRefinements: JSON.stringify(allSelectedRefinements)
        });
    }

    function clickOptionMobile(event) {
        var panel = event.data.panelSelector;
        openPanel(panel);
    }

    function clickFilter() {
        var useThis = this;

        if( $(useThis).hasClass("filter-option") )
        {
            useThis = $(useThis).find(selector.filterType)[0];
        }

        var filter = $(useThis).data('refinement-id');

        toggleFilterRefinementsVisibility(filter);
    }

    function clickRefinement(event) { console.log("clickRefinement");
        event.preventDefault();
        var url = $(this).attr('href');
        var filterClicked = $(this).parents('[data-refinement-id]').data('refinement-id');
        var refinementClicked = $(this).find('span').text();
        if(filterClicked && refinementClicked){
            trackData(filterClicked, refinementClicked);
        }
        app.gridwall.replace(url);
        closePanel();
        return false;
    }

    function clickSortBy() {
        var url = $(this).data('url');
        app.gridwall.replace(url);
        closePanel();
    }

    function changeSortBy(event) {
        event.preventDefault();
        var url = $(this).find('option:selected').val();
        if (url !== '') {
            app.gridwall.replace(url);
        }
    }
    
    
    function clickMoreRefinementsButton() {
        $(this).siblings('.hide-large').removeClass('hide-large').end().remove();
    }

    function subscribeEvents() {
        $.subscribe(CONST.RESPONSIVE_DEVICE_OBSERVER, function(pub, arg) {
            if (arg[0] === CONST.DEVICE_TYPE.MEDIUM) {
                closePanel();
            }
        });

        $.subscribe(CONST.PUBSUB.SCROLL.DONE_LOADING_PAGES, function(pub, arg) {
            fixedFilters();
            updateRefinementCount();
            toggleMoreButton();
        });
    }

    function bindEvents() {
        $(window).on('scroll', fixedFilters);
        $(window).on('resize', fixedFilters);
        $page.on('click', selector.closePanel, closePanel);
        $page.on('click', selector.filterOptionByMobile, clickFilter );
        $page.on('click', selector.filterTypeByDesktop, clickFilter);
        $page.on('click', selector.refinementLink, clickRefinement);
        $page.on('click', selector.clearFilter, clickRefinement);
        $page.on('change', selector.sortBySelect, changeSortBy);
        $page.on('click', selector.sortOptionMobile, clickSortBy);
        $page.on('click', selector.filterByMobile, {panelSelector: '.filter-panel'}, clickOptionMobile);
        $page.on('click', selector.sortByMobile, {panelSelector: '.sort-panel'}, clickOptionMobile);
        $page.on('click', selector.moreRefinementsLink, clickMoreRefinementsButton);
        
        subscribeEvents();
    }

    function init() {
        bindEvents();
        updateRefinementCount();
        toggleMoreButton();
        $(window).load(function(){
            app.filters.fixedFilters();
        });
    }

    app.filters = {
        init: init,
        openPanel: openPanel,
        closePanel: closePanel,
        getAvailableFilters: getAvailableFilters,
        getSelectedFilterRefinements: getSelectedFilterRefinements,
        getAllSelectedRefinements: getAllSelectedRefinements,
        getSelectedRefinementCount: getSelectedRefinementCount,
        fixedFilters:fixedFilters
    };

}(window.app = window.app || {}, jQuery));

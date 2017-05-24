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
            $(selector.refinements).removeClass('sticky sticky-bottom');
            return;
        }
        dofixedFilters();
    }
    
    function dofixedFilters() {
    
        var minTrigger= $('.category-header').outerHeight(true)+40;
        var minTrigger2= minTrigger + $(selector.header).height();
        var maxTrigger = $(document).height() - $(selector.footer).height()-getWindowHeight();
        
        minTrigger= (appUtil.isMediumDevice())?minTrigger2:minTrigger;
        //***
//        if((oldScrollTop===0) || 
//                (oldScrollTop < minTrigger && $(selector.refinements).css('position')==='static')){
//
//            $(selector.refinements).css('bottom','auto');
//            $(selector.refinements).css('position','absolute');
//            
//            
//        }else if((oldScrollTop >= minTrigger) && ($(selector.refinements).css('position')==='static')){
//        
//            console.log("PUT DEF ...");
//            $(selector.refinements).css('position','fixed');
//            if(refinementHeight > orRefinementHeight){
//                $(selector.refinements).css('bottom','0px');
//                $(selector.refinements).css('top','auto');
//            }else{
//                $(selector.refinements).css('top',((appUtil.isMediumDevice())?0:$(selector.header).height())-40);
//                $(selector.refinements).css('bottom','auto');
//            }   
//        }
        
       //***
        var scrollTop = $(window).scrollTop();
        var windowHeight = getWindowHeight();
        var headerHeight = $(selector.header).height();
        var orRefinementHeight = appUtil.isMediumDevice() ? (windowHeight - headerHeight) : (windowHeight - (headerHeight + defaultPadding));
        var refinementHeight= $(selector.refinements).height();
        
        setDefaultPosition(minTrigger,refinementHeight,orRefinementHeight);
        
        var top;
        var top2;
        var bot;
        
        var elemRelTop = $(selector.refinements).position().top;
        
        if($(selector.refinements).css('position')==='absolute'){ //console.log("ABSOLUTE");
            top = $('.category-header').outerHeight(true)-scrollTop+40+elemRelTop;
            top2 = $('.category-header').outerHeight(true)+ $(selector.header).height() -scrollTop+40+elemRelTop;
        }else if($(selector.refinements).css('position')==='fixed'){//console.log("FIXED: "+elemRelTop+"-"+headerHeight+"-"+scrollTop);
            top=elemRelTop - headerHeight-scrollTop-40;
            top2= elemRelTop -scrollTop - 40;
        }
//        else{
//            console.log("PPP: "+$(selector.refinements).css('position'));
//        }
        
        bot = 40 - (refinementHeight-(orRefinementHeight - top));
        
        var up = ((scrollTop-oldScrollTop)>0)?false:true;
        var down = ((oldScrollTop-scrollTop)>0)?false:true;
        
//        console.log("S: "+scrollTop+" : "+ ( (up)?'+UP':'' ) + ( (down)?'-down':'' ) );
//        console.log("TOP: "+top + " :: "+top2);
//        console.log("BOT: "+bot+" :: "+(40 - (refinementHeight-(orRefinementHeight - top2)) - 32));
        
        top= (appUtil.isMediumDevice())?top2:top;
        bot= (appUtil.isMediumDevice())?(40 - (refinementHeight-(orRefinementHeight - top2)) - 32):bot;
        
        var functions= getLeftNavMovementFunctions();
        
        var vals={
                vtop:top,
                vbot:bot,
                vup:up,
                vdown:down,
                vscrollTop: scrollTop,
                vmaxTrigger: maxTrigger,
                vrefinementHeight: refinementHeight,
                vwindowHeight: windowHeight, 
                vheaderHeight: headerHeight,
                vminTrigger:minTrigger,
                vorRefinementHeight:orRefinementHeight,
                velemRelTop:elemRelTop
        };
        
        moveLeftNav(functions,vals);
  
        oldScrollTop=scrollTop;
    }
    
    function setDefaultPosition(minTrigger,refinementHeight,orRefinementHeight){
        if((oldScrollTop===0) || 
                (oldScrollTop < minTrigger && $(selector.refinements).css('position')==='static')){

            $(selector.refinements).css('bottom','auto');
            $(selector.refinements).css('position','absolute');
            
            
        }else if((oldScrollTop >= minTrigger) && ($(selector.refinements).css('position')==='static')){
        
            console.log("PUT DEF ...");
            $(selector.refinements).css('position','fixed');
            if(refinementHeight > orRefinementHeight){
                $(selector.refinements).css('bottom','0px');
                $(selector.refinements).css('top','auto');
            }else{
                $(selector.refinements).css('top',((appUtil.isMediumDevice())?0:$(selector.header).height())-40);
                $(selector.refinements).css('bottom','auto');
            }   
        }
    }
    
    function moveLeftNav(functions,vals){
    
        if( functions.ismove1(vals) ){ //1 vals.v
            
            functions.move1(vals.vrefinementHeight,vals.vorRefinementHeight,vals.vheaderHeight);
            console.log("PCC++++++++++++++++++++++++++++++++++++++");
            
        }else if( functions.ismove2(vals) ){ //2
        
                functions.move2(vals.velemRelTop,vals.vheaderHeight);
                console.log("PCC-------------------------------------- ");
        
        }else if( functions.ismove3(vals) || functions.ismove4(vals) ){//3 & 4 
        
            functions.move3and4(vals.vheaderHeight);
            console.log("PCC&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        }else if( functions.ismove5(vals) ){//5
        
            functions.move5();
            console.log("PCCuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
            
        }else if( functions.ismove6(vals) ){ //6 when fixed and down to absolute

            functions.move6(vals.velemRelTop,vals.vheaderHeight);
            console.log("PCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
            
        }else if( functions.ismove7(vals) ){ //7
        
            functions.move7(vals.vrefinementHeight,vals.vorRefinementHeight);
            console.log("PCCssssssssssssssssssssssssssssssssssssss");
            
        }//if - else
        
    }
    
    function getLeftNavMovementFunctions(){
    
        var functions ={
                ismove1: function (vals){ 
                    return ((vals.vtop <= 0) && (vals.vbot >= 0) && !vals.vup && (vals.vscrollTop < vals.vmaxTrigger) && ($(selector.refinements).css('position')!=='fixed'));
                    },
                ismove2: function (vals){
                    return ((vals.vtop <= 0) && (vals.vbot >= 0) && vals.vup && !vals.vdown && ($(selector.refinements).css('position')==='fixed') &&(vals.vrefinementHeight > ( vals.vwindowHeight - vals.vheaderHeight )));
                    },
                ismove3: function (vals){ 
                    return (!vals.vdown && (vals.vtop>0) && (vals.vbot<0) && ($(selector.refinements).css('position')==='absolute') && (vals.vscrollTop > vals.vminTrigger));
                    },
                ismove4: function (vals){ 
                    return (!vals.vdown && (vals.vtop>0) && (vals.vbot>0) && (vals.vscrollTop > vals.vminTrigger) && ($(selector.refinements).css('position')==='absolute') && (vals.vrefinementHeight <= vals.vorRefinementHeight));
                },
                ismove5: function (vals){
                    return (vals.vup && !vals.vdown && ($(selector.refinements).css('position')==='fixed') && (vals.vscrollTop < vals.vminTrigger) );
                },
                ismove6: function (vals){
                    return (!vals.vup && vals.vdown && (vals.vscrollTop < vals.vmaxTrigger) && (vals.vscrollTop > vals.vminTrigger) && (vals.vtop <= 0) && (vals.vbot<0) && ($(selector.refinements).css('position')==='fixed'));
                },
                ismove7: function (vals){
                    return (vals.vscrollTop >= vals.vmaxTrigger);
                },
                bigRefinement: function (vals){
                    return (vals.vrefinementHeight > vals.vorRefinementHeight);
                },
                move1: function(refinementHeight,orRefinementHeight,headerHeight){
                    $(selector.refinements).css('position','fixed');
                    
                    if( refinementHeight > orRefinementHeight ){
                        $(selector.refinements).css('bottom','0px');
                        $(selector.refinements).css('top','auto');
                    }else{
                        $(selector.refinements).css('bottom','auto');
                        $(selector.refinements).css('top',((appUtil.isMediumDevice())?0:headerHeight)-40);
                    }
                },
                move2: function(elemRelTop,headerHeight){
                    $(selector.refinements).css('position','absolute');
                    $(selector.refinements).css('bottom','auto');
                    $(selector.refinements).css('top',elemRelTop - $('.category-header').outerHeight(true) - headerHeight);
                },
                move3and4: function(headerHeight){
                    $(selector.refinements).css('position','fixed');
                    $(selector.refinements).css('bottom','auto');
                    $(selector.refinements).css('top',((appUtil.isMediumDevice())?0:headerHeight)-40);
                },
                move4: function(){
                    
                },
                move5: function(){
                    $(selector.refinements).css('bottom','auto');
                    $(selector.refinements).css('position','absolute');
                    $(selector.refinements).css('top','0');  
                },
                move6: function(elemRelTop,headerHeight){
                    $(selector.refinements).css('position','absolute');
                    $(selector.refinements).css('bottom','auto');
                    $(selector.refinements).css('top',elemRelTop - $('.category-header').outerHeight(true) - headerHeight);
                },
                move7: function(refinementHeight,orRefinementHeight){
                    $(selector.refinements).css('position','absolute');
                    
                    if( refinementHeight > orRefinementHeight ){
                        $(selector.refinements).css('bottom','0px');
                        $(selector.refinements).css('top','auto');
                    }else{
                        $(selector.refinements).css('bottom',(orRefinementHeight-refinementHeight)+60);
                        $(selector.refinements).css('top','auto');
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

    function clickRefinement(event) {
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

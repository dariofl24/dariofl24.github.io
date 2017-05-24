// app.primarycatalognavigation
(function(app, $) {
    var CONST = app.constant;
    var EXPANDED = 'expanded';
    var ACTIVE = 'active';
    var CLICKED = 'clicked';
    var NULL_CLICK_HANDLER = ':void(0);';
    var PROVISIONAL_HOVER_DURATION = 450;
    var _hoverState = false;
    var $cache;
    var isProvisionallyExitHover = false;

    function initializeCache() {
        $cache = {
            menusParent: $('.menu-category-container'),
            subMenusParent: $('.external-category-container'),
            hoverTopLimitArea: $('.promo-message, #black-bar'),
            hoverBottomLimitArea: $('.menu-catcher'),
            hoverArea: $('header')
        };

        $cache.categoryLink = $cache.menusParent.find('a.level-1');
        $cache.menusContainer = $cache.menusParent.find('div.level-2');
        $cache.subMenusContainer = $cache.subMenusParent.find('div.level-2');
    }
    
    function isHoverState() {
        return _hoverState;
    }
    
    function setHoverState() {
        _hoverState = true;
    }
    
    function removeHoverState() {
        _hoverState = false;
    }
    
    function setProvisionallyExitHover(){
        isProvisionallyExitHover = true;
    }
    
    function removeProvisionallyExitHover(){
        isProvisionallyExitHover = false;
    }
    
    function hasPageUrl(elem) {
        return $(elem).attr('href').indexOf(NULL_CLICK_HANDLER) === -1;
    }

    function getMenuContainer(elem) {
        return $(elem).closest('li').find('div.level-2');
    }

    function markAsExpanded(elem) {
        $cache.menusContainer.removeClass(EXPANDED);
        elem.addClass(EXPANDED);
    }

    function markAsActive(elem) {
        $cache.categoryLink.removeClass(ACTIVE);
        elem.addClass(ACTIVE);
    }
    
   /**
    * Adds 'clicked' class to the passed elem (which is expected to be the top-level
    * menu item), removes it from all other menu items, and also adds it to submenus panel.
    *
    * @param {jQuery} elem Element to add 'clicked' class to.
    */    
    function markAsClicked(elem) {
        $cache.categoryLink.removeClass(CLICKED);
        $cache.subMenusParent.addClass(CLICKED);
        elem.addClass(CLICKED);
    }
        
    function markAllAsInactive() {
        $cache.categoryLink.removeClass(ACTIVE);
    }

    function markAllAsUnclicked() {
        $cache.categoryLink.removeClass(CLICKED);
        $cache.subMenusParent.removeClass(CLICKED);
    }

    function setSubMenusContent(menuContainer) {
        var content = menuContainer.children().clone(true);
        $cache.subMenusContainer.hide();
        $cache.subMenusContainer.children().remove();
        $cache.subMenusContainer.append(content);
        $cache.subMenusContainer.show();
    }

    function toggleSubCategoryPanel() {
        if (!$cache.subMenusParent.hasClass(EXPANDED)) {
            app.slider.toggle(CONST.SLIDER.SUBCATEGORY_PANEL);
        }
    }

    function showSubCategoryPanel() {
        app.slider.show(CONST.SLIDER.SUBCATEGORY_PANEL, true);
        $.publish(CONST.PUBSUB.CATALOG_NAVIGATION.SHOW, []);
    }

    function hideSubCategoryPanel() {
        app.slider.hide(CONST.SLIDER.SUBCATEGORY_PANEL, false);
        $.publish(CONST.PUBSUB.CATALOG_NAVIGATION.HIDE, []);
    }
    
    function showMenuOverlay() {
        app.overlay.show();
    }

    function collapseHoveredMenu() {
        if (isHoverState()) {
            $cache.menusContainer.removeClass(EXPANDED);
            removeHoverState();
            hideSubCategoryPanel();
            markAllAsInactive();
        }
        
    }

    function tryExitingHoverButDoItCarefully() {
        //if we are here then quite recently mouse exited hover area
        if (isProvisionallyExitHover===true) { 
            collapseHoveredMenu();
        } else {
            //isProvisionallyExitHover has been reset already, false alarm
        }
    }
    
    function bindCategoryClick() {
        $cache.categoryLink.click(function(event) {
            var menuContainer = getMenuContainer(this);
            
            if (hasPageUrl(this) && !app.util.isTouchDevice() ) {
                return;
            }

            if (!menuContainer.exists()) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (menuContainer.hasClass(EXPANDED)) {
                markAsClicked($(this));
                if (isHoverState()) {
                    removeHoverState();
                    showMenuOverlay();
                    return;
                }
                app.slider.toggle(CONST.SLIDER.SUBCATEGORY_PANEL);
                return;
            }

            markAsExpanded(menuContainer);
            setSubMenusContent(menuContainer);
            toggleSubCategoryPanel();
            markAsClicked($(this));
            markAsActive($(this));
        });
    }

    function bindCategoryHover() {
        $cache.categoryLink.hover(function(event) {
            //entering category area
            var menuContainer = getMenuContainer(this);
            
            if (!menuContainer.exists()) {
                return;
            }
            if (app.slider.isActive(CONST.SLIDER.SUBCATEGORY_PANEL)) {
                if ($cache.subMenusParent.hasClass(CLICKED) && !isHoverState()) {
                    //we are here b/c menu is in a pinned(clicked) mode, just exit
                    return;
                }
            }
            if (menuContainer.hasClass(EXPANDED)) {
                //menuContainer is already expanded, do nothing and just exit
                return;
            }
            //mark menuContainer as expanded, and set hover state
            markAsExpanded(menuContainer);
            setHoverState();
            setSubMenusContent(menuContainer);
            if (!app.slider.isActive(CONST.SLIDER.SUBCATEGORY_PANEL)) {
                showSubCategoryPanel();
            }
            markAsActive($(this));
            markAsClicked($(this));
        }, function(event) {
            // do nothing here for hover out
            event.stopPropagation();
            return;
        });
    }
    
    function bindMenuHover() {
        $cache.hoverArea.hover(function(event) {
            //hover in, entering hoverArea
            if (isHoverState()) {
                //re-activate hover mode by removing provisioning
                removeProvisionallyExitHover();
            }
        }, function(event) {
            //hover out, exiting hoverArea
            if (isHoverState()) {
                provisionallyExitHover();
            }
        });
    }
    
    function bindTopLimitAreaHover() {
        //because of the complicated layout of hover area itself we use this one as an opposite of the hover area
        //if you are here then you are NOT there, and vice versa
        $cache.hoverTopLimitArea.hover(function(event) {
            //hover in. we treat entering to this area as a definite exit from hover area 
            if (isHoverState()) {
                //instead of calling collapseHoveredMenu() do it provisionally
                provisionallyExitHover();
            }
        }, function(event) {
            //hover out, exiting TopLimitAreaHover
            if (isHoverState()) {
                //re-activate hover mode by removing provisioning
                removeProvisionallyExitHover();
            }
            return;
        });
    }
    
   /**
    * Sets isProvisionallyExitHover flag to true, then calls tryExitingHoverButDoItCarefully()
    * after a delay. If during this grace period something resets isProvisionallyExitHover
    * flag then call to tryExitingHoverButDoItCarefully() will do nothing, otherwise it
    * will result in exit from hover mode
    */
    function provisionallyExitHover(){
        setProvisionallyExitHover();
        setTimeout(function() {
            tryExitingHoverButDoItCarefully();
        }, PROVISIONAL_HOVER_DURATION);
    }
    
    function bindCategoriesCollapsed() {
        $.subscribe(CONST.SLIDER.BEFORE_EXPANDED, function(topic, sliderAreaName) {
            if (sliderAreaName !== CONST.SLIDER.SUBCATEGORY_PANEL) {
                $cache.menusContainer.removeClass(EXPANDED);
                $cache.subMenusContainer.children().remove();
                markAllAsInactive();
            }
        });

        $.subscribe(CONST.SLIDER.COLLAPSED, function(topic, sliderAreaName) {
            if (sliderAreaName === CONST.SLIDER.SUBCATEGORY_PANEL) {
                $cache.menusContainer.removeClass(EXPANDED);
                $cache.subMenusContainer.children().remove();
                markAllAsInactive();
                markAllAsUnclicked();
            }
        });
    }

    function bindEvents() {
        bindCategoryClick();
        bindCategoryHover();
        bindTopLimitAreaHover();
        bindMenuHover();
        bindCategoriesCollapsed();
    }

    app.primarycatalognavigation = {
        init: function() {
            initializeCache();
            bindEvents();
        },

        hasSubcategories: function(anchor) {
            var menuContainer = getMenuContainer(anchor);

            return menuContainer.exists();
        }
    };
}(window.app = window.app || {}, jQuery));

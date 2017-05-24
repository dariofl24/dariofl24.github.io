// app.mobilemenu
(function(app, $) {
    var CONST = app.constant;
    var EXPANDED = 'menu-expanded';
    var POSITION_FIXED = 'position-fixed';
    var POSITION_ABSOLUTE = 'position-absolute';
    var CATCHER_CLASS = 'catcher-in-the-rye';
    var $cache;

    function initializeCache() {
        $cache = {
            hamburgerButton: $('.hamburg'),
            wrapper: $('#wrapper'),
            menu_list: $('#mobile-menu-list'),
            footer: $('#footer'),
            glass_panel: $('#glass-panel')
        };
    }
    

    function isMenuExpanded() {
        var result = $cache.wrapper.hasClass(EXPANDED);
        return result;
    }

    function expandMenu() {
        $cache.wrapper.addClass(EXPANDED);
        $cache.wrapper.addClass(POSITION_FIXED);
        $cache.wrapper.removeClass(POSITION_ABSOLUTE);
        $cache.glass_panel.addClass(CATCHER_CLASS);
        //need to hide and then show the footer when expanding menu on infinite scroll pages
        //because some browsers don't render it correctly during the transition 
        if (app.infiniteScroll.isFixedFooter()) {
            $cache.footer.hide();
        }
        return;
    }

    function hideMenu() {
        $cache.wrapper.removeClass(EXPANDED);
        $cache.wrapper.removeClass(POSITION_FIXED);
        $cache.wrapper.addClass(POSITION_ABSOLUTE);
        $cache.glass_panel.removeClass(CATCHER_CLASS);
        return;
    }

    function toggleMenu() {
        return isMenuExpanded() ? hideMenu() : expandMenu();
    }

    function bindHamburgerClick() {
        $cache.hamburgerButton.click(function(event) {

            event.stopPropagation();

            toggleMenu();
        });
    }

    function bindWrapperClick() {
        $cache.wrapper.click(function(event) {
            if (isMenuExpanded() === true) {

                event.preventDefault();
                event.stopPropagation();

                hideMenu();
            }
        });
    }
    
    //re-draw the infinite scroll footer on menu opening
    function bindMenuOpened() {
        $cache.wrapper.on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', function(event) {
            if (app.infiniteScroll.isFixedFooter() && event.originalEvent.propertyName==='left') {
                $cache.footer.show();
            }
        });
    }

    function subscribeDeviceTypes() {
        $.subscribe(CONST.RESPONSIVE_DEVICE_OBSERVER, function(pub, arg) {
            if (arg[0] === CONST.DEVICE_TYPE.LARGE) {
                hideMenu();
            }
        });
    }
    
    function subscribeSliderEvents(){
        $.subscribe(CONST.SLIDER.COLLAPSED, hackityHack);
        $.subscribe(CONST.SLIDER.EXPANDED, hackityHack);
    }
    
    function hackityHack(){
        $cache.menu_list.show();
    }
    
    function initializeTouchWipe() {
        $cache.wrapper.touchwipe({
            preventDefaultEvents: function() {
                if (isMenuExpanded() === true) {
                    return true;
                }
                return false;
            },
            wipeLeft: function() {
                if (isMenuExpanded() === true){
                    hideMenu();
                }
            },
            wipeRight: function() {
                if (isMenuExpanded() === true){
                    hideMenu();
                }
            },
            wipeUp: function() {
                if (isMenuExpanded() === true){
                    hideMenu();
                }
            },
            wipeDown: function() {
                if (isMenuExpanded() === true){
                    hideMenu();
                }
            }
        });
    }

    function bindEvents() {
        bindHamburgerClick();
        bindWrapperClick();
        initializeTouchWipe();
        subscribeDeviceTypes();
        subscribeSliderEvents();
        bindMenuOpened();
    }

    app.mobilemenu = {
        init: function() {
            initializeCache();
            bindEvents();
            
            $(".country-selector-column-tablet").clone().appendTo(".mobile-menu-country-selector-column-tablet");
        },
        isMenuExpanded: isMenuExpanded,
        expandMenu: expandMenu,
        hideMenu: hideMenu
    };
}(window.app = window.app || {}, jQuery));

// app.mobileMenuNavigation
(function(app, $) {
    var LOGIN_PANEL = app.constant.PUBSUB.LOGIN_PANEL;
    var CONST = app.constant;
    var MENU_ID = 'menu-id';
    var MOBILE_SIDE_NAV_ID = 'hamburgernav';
    var MOBILE_LITE_NAV_ID = 'lightweightnav';
    var MENUS = {};

    function initializeCache() {
        MENUS[MOBILE_SIDE_NAV_ID] = $('#'+MOBILE_SIDE_NAV_ID);
        MENUS[MOBILE_LITE_NAV_ID] = $('#'+MOBILE_LITE_NAV_ID);
    }
    
    function getMenuById(element) {
        if (typeof element === "undefined" || element === null) {
            return;
        }
        var menuID = element.data(MENU_ID);
        return MENUS[menuID];
    }
    
    function bindEvents() {
        MENUS[MOBILE_LITE_NAV_ID].find('a').on('click', onClickAnchor);
        MENUS[MOBILE_SIDE_NAV_ID].find('a').on('click', onClickAnchor);
    }
    
    function unbindEvents() {
        MENUS[MOBILE_LITE_NAV_ID].find('a').off('click', onClickAnchor);
        MENUS[MOBILE_SIDE_NAV_ID].find('a').off('click', onClickAnchor);
    }
    
    function collapseMenuItem(element) {
        var checkElement = element.closest('ul');
        if (checkElement.is(':visible')) {
            var closestLi = checkElement.closest('li');
            closestLi.removeClass('active');
            checkElement.slideUp('normal');
        }
    }

    function onClickAnchor() {
        if (!$(this).closest('li').hasClass('has-sub')) {
            return true;
        }
        var checkElement = $(this).next();
        var menu = getMenuById($(this));
        menu.find('li').removeClass('active');
        $(this).closest('li').addClass('active');


        if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            $(this).closest('li').removeClass('active');
            checkElement.slideUp({queue:true, duration: CONST.MOBILE_NAV_UP_DOWN_DURATION, easing : "easeOutExpo"});
        }   

        if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            menu.find('ul ul:visible').slideUp('normal');
            checkElement.slideDown({queue:true, duration: CONST.MOBILE_NAV_UP_DOWN_DURATION, easing : "easeOutExpo"});
        }
        
        return false;
    }
    
    function initMobileMenuNavigation() {
        initializeCache();
        bindEvents();
    }

    function handleLoggedIn(topic, data) {
        initializeCache();
        unbindEvents();
        bindEvents();
    }
    
    app.mobileMenuNavigation = {
        init: function() {
            initMobileMenuNavigation();
            $.subscribe(LOGIN_PANEL.USER.LOGGED_IN, handleLoggedIn);
        },
        collapseMenuItem: collapseMenuItem
    };
}(window.app = window.app || {}, jQuery));
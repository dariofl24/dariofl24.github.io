(function(app, Social, $) {
    var LOGIN_PANEL = app.constant.PUBSUB.LOGIN_PANEL;

    var $cache;
    var $socialEnabled;
    var slideInterval = 250;

    function _fadeOutMenu() {
        $('html').off("click.accountBox");
        $cache.accountBox.toggleClass("active", slideInterval, "easeOutSine");
        setTimeout(function() {
            $cache.accountBox.toggleClass("visible");
        }, slideInterval);
    }

    function keepPopupOpened() {
        $('html').on("click.accountBox", function() {
            _fadeOutMenu();
        });
    }

    function _fadeInMenu() {
        $cache.accountBox.toggleClass("visible");
        $cache.accountBox.toggleClass("active", slideInterval, "easeOutSine");
        keepPopupOpened();
    }

    function _setAnimationDelay(d) {
        slideInterval = d;
    }

    function initializeVars() {
        $socialEnabled = app.featuretoggle.isFeatureEnabled('gigya-integration');
    }

    function initializeCache() {
        $cache = {
            logoutLI: $("#account-info-box.logout"),
            accountBox: $("ul.account-box"),
            mobileLogoutLink: $('#mobile-logout-link')
        };
        $cache.logoutLink = $cache.accountBox.find("#logout-link");
    }

    function toggleAccountBox(event) {
        event.stopPropagation();

        if ($cache.accountBox.hasClass("active")) {
            _fadeOutMenu();
        } else {
            _fadeInMenu();
        }
    }

    function bindEvents() {
        $cache.logoutLI.on("click", toggleAccountBox);

        $cache.accountBox.on("click", function(event) {
            event.stopPropagation();
        });
        
        $cache.mobileLogoutLink.on('click', mobileLogout);

        $cache.logoutLink.on("click", function(event) {
            event.preventDefault();

            if ($socialEnabled) {
                Social.Gigya.performLogout();
            }

            var _this = this;
            setTimeout(function() {
                window.location.href = _this.href;
            },
            500);

            return false;
        });
    }

    function mobileLogout(event) {
            event.preventDefault();
            var element = $(this);
            var logoutURL = this.href;
            if ($socialEnabled) {
                Social.Gigya.performLogout();
            }
            app.mobileMenuNavigation.collapseMenuItem(element);
            app.mobilemenu.hideMenu();
            setTimeout(function() {
                window.location.href = logoutURL;
            },
            1000);
            return false;
    }

    function initLogout() {
        initializeVars();
        initializeCache();
        bindEvents();
    }

    function handleLoggedIn(topic, data) {
        initLogout();
    }

    app.logout = {
        init: function() {
            initLogout();
            $.subscribe(LOGIN_PANEL.USER.LOGGED_IN, handleLoggedIn);
        },
        setAnimationDelay: _setAnimationDelay
    };

}(window.app = window.app || {}, window.Social = window.Social || {}, jQuery));

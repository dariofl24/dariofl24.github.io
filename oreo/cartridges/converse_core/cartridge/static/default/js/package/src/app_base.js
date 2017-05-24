/*exported app*/
//    app.js 2.0.0
//    (c) 2009-2012 Demandware Inc.
//    Subject to standard usage terms and conditions
//    Relies on jQuery, jQuery UI, jQuery validate, ...
//    For all details and documentation:
//    https://github.com/Demandware/Site-Genesis

// All java script logic for the application.
// The code relies on the jQuery JS library to be also loaded.

// if jQuery has not been loaded, load from google cdn
if (!window.jQuery) {
    var s = document.createElement('script');
    s.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');
    s.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(s);
}

// Application singleton and namespace object
// ------------------------------------------
var app = (function(app, $) {
    document.cookie = "dw=1";
    /******** private functions & vars **********/

    // cache dom elements accessed multiple times
    // app.ui holds globally available elements

    function initUiCache() {
        app.ui = {
            main: $("#main"),
            primary: $("#primary"),
            secondary: $("#secondary")
        };
    }

    function initializeEvents() {
        var controlKeys = ["8", "13", "46", "45", "36", "35", "38", "37", "40", "39"];
        $("body").on("keydown", "textarea[data-character-limit]", function(e) {
                var text = $.trim($(this).val()),
                    charsLimit = $(this).data("character-limit"),
                    charsUsed = text.length;

                if ((charsUsed >= charsLimit) && (controlKeys.indexOf(e.which.toString()) < 0)) {
                    e.preventDefault();
                }
            })
            .on("change keyup mouseup", "textarea[data-character-limit]", function(e) {
                var text = $.trim($(this).val()),
                    charsLimit = $(this).data("character-limit"),
                    charsUsed = text.length,
                    charsRemain = charsLimit - charsUsed;

                if (charsRemain < 0) {
                    $(this).val(text.slice(0, charsRemain));
                    charsRemain = 0;
                }

                $(this).next('div.char-count').find('.char-remain-count').html(charsRemain);
            });


        // add show/hide navigation elements
        $('.secondary-navigation .toggle').click(function() {
            $(this).toggleClass('expanded').next('ul').toggle();
        });

        // add generic toggle functionality
        $('.toggle').next('.toggle-content').hide();
        $('.toggle').click(function() {
            $(this).toggleClass('expanded').next('.toggle-content').toggle();
        });
    }

    function initializeDom() {
        // add class to html for css targeting
        $('html').addClass('js');

        // load js specific styles
        app.util.limitCharacters();
    }


    // _app object
    // "inherits" app object via $.extend() at the end of this seaf (Self-Executing Anonymous Function
    var _app = {
        containerId: "content",
        ProductCache: null, // app.Product object ref to the current/main product
        ProductDetail: null,
        clearDivHtml: '<div class="clear"></div>',
        currencyCodes: app.currencyCodes || {}, // holds currency code/symbol for the site

        /**
         * @name init
         * @function
         * @description Master page initialization routine
         */
        init: function() {

            if (document.cookie.length === 0) {
                $("<div/>").addClass("browser-compatibility-alert").append($("<p/>").addClass("browser-error").html(app.resources.COOKIES_DISABLED)).appendTo("#browser-check");
            }


            // init global cache
            initUiCache();

            // init global dom elements
            initializeDom();

            // init global events
            initializeEvents();

            // init specific global components
            app.primarycatalognavigation.init();
            app.overlay.init();
            app.slider.init();
            app.mobilemenu.init();
            app.mobileMenuNavigation.init();
            app.accountCommon.init();
            app.logout.init();
            app.login.init();
            app.passwordReset.init();
            app.minicart.init();
            app.validation.init();
            app.validator.init();
            app.placeholder.init();
            app.searchbar.init();
            app.giftcard.init();
            app.globalPromoBanner.init();
            app.util.publishResponsiveDeviceStatus();
            app.ajax.init();
            app.gridwall.scrollToTop();
            
            // execute page specific initializations
            var ns = app.page.ns;
            if (ns && app[ns] && app[ns].init) {
                app[ns].init();
            }
        }
    };

    return $.extend(app, _app);
}(window.app = window.app || {}, jQuery));

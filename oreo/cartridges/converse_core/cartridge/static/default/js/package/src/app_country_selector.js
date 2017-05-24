(function(app, $) {
    function setLocaleCookies(locale) {
        //Set cookie for one year
        $.cookie('preferredSiteLocale', locale, {expires: 365, path: "/"});
    }

    app.countrySelector = {
        setLocaleCookies: setLocaleCookies
    };
} (window.app = window.app || {}, jQuery));


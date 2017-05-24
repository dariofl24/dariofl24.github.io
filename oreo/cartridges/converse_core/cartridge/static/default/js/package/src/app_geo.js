/*global window, geoip2*/

// app.geo
(function(app, $) {
    var COUNTRY_CODE_COOKIE = 'geoip_country_code';
    var MAXMIND_JS_URL = '//j.maxmind.com/js/apis/geoip2/v2.0/geoip2.js';

    function getCountryCode() {
        return $.cookie(COUNTRY_CODE_COOKIE);
    }

    function setCountryCode(countryCode) {
        $.cookie(COUNTRY_CODE_COOKIE, countryCode, { expires: 365, path: '/' });
    }

    function fetchAndSaveCountryCode(callback) {
        var onSuccess = function(location){
            var countryCode = location.country.iso_code;
            setCountryCode(countryCode);

            if ($.isFunction(callback)) {
                callback(countryCode);
            }
        };

        var onError = function(error) {
            console.error(error);
        };

        var onLoadScriptSuccess = function() {
            if (typeof geoip2 !== 'undefined' && typeof geoip2 === 'object') {
                geoip2.country(onSuccess, onError, { w3cGeolocationDisabled: true, timeout: 2000 });
            }
        };

        $.getScript(MAXMIND_JS_URL, onLoadScriptSuccess);
    }

    app.geo = {
        getCountryCode: getCountryCode,
        fetchAndSaveCountryCode: fetchAndSaveCountryCode
    };

}(window.app = window.app || {}, jQuery));

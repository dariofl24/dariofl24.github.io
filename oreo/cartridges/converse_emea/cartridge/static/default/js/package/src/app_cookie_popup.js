/*global window */
(function(app, $) {
    var $cache = {};

    function initializeCache() {
        $cache = {
            popUpCookies: $(".popUp-Cookies"),
            popUpLauncher: $("#popUpLauncher"),
            popUpCookieSettingLink: $(".cookie-setting-link")
        };

        $cache.acceptCookiesButton = $cache.popUpCookies.find(".accept-button");
        $cache.moreInfoButton = $cache.popUpCookies.find(".more-info-button");
    }

    function showCookieSettings() {
        //change view to settings
        $('.cookie-popUp-view').hide();
        $('.cookie-settings-view').show();
    }

    // Store cookies after user close the pop-up.
    function closeAndSave(){
        //Set cookie for one year
        var date = new Date();
        var days = 365;
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        
        /* Using a integer value as cookie value for acceptConverseCookiePolicy cookie
         * This will allow to use only one cookie instead of 3 cookies
         * 
         * 0 value indicates only Functional cookies are accepted by the user
         * 1 value indicates Functional+Performance cookies are accepted by the user, this is default
         * 2 value indicates Functional+Advertising cookies are accepted by the user
         * 3 value indicates all cookies are accepted by the user
         * 
         */
        var cookiePolicy;

     // set cookie policy
     if (!$("input[name='performance']").is(':checked') && !$("input[name='socialMediaAndAdvertising']").is(':checked')) {
         //both are unchecked, only functional cookies are allowed
         cookiePolicy = 0;
     } else if ($("input[name='performance']").is(':checked') && $("input[name='socialMediaAndAdvertising']").is(':checked')) {
         //both are checked, all cookies are allowed
         cookiePolicy = 3;
     } else if ($("input[name='performance']").is(':checked')) {
         cookiePolicy = 1;
     } else if ($("input[name='socialMediaAndAdvertising']").is(':checked')) {
         cookiePolicy = 2;
     } else {
         //set the default
         cookiePolicy = 1;
     }

     $.cookie("acceptConverseCookiePolicy", cookiePolicy, {
         expires: date,
         path: "/"
     });
    }

    function closePopup() {
        $.magnificPopup.close();
        closeAndSave();
        location.reload();
    }

    function setMaxHeight() {
        $cache.popUpLauncher.css("max-height", window.height);
    }

    function bindEvents() {
        $cache.acceptCookiesButton.on("click", closePopup);
        $cache.moreInfoButton.on("click", showCookieSettings);
        $cache.popUpLauncher.on("click", setMaxHeight);
        $cache.popUpCookieSettingLink.on("click", setupPopUp);
        app.checkbox.init(".popUp-Cookies");
    }

    function setupPopUp() {
        setMaxHeight();
        $('.cookie-setting-link').magnificPopup({
            type: 'inline',
            src: '#popUpLauncher',
            modal: true,
            focus: '#yesCookiesBtn',
            close: closeAndSave
        });
    }

    function initPopUp() {
        // cookies are check by backend before send the response
        // look for file default/components/footer/footer.isml
        // we check if cookie "dwsid" exists in the client.
        setupPopUp();
        $( document ).ready(function() {
            if ($cache.popUpLauncher.data("show")){
                $('.cookie-setting-link').click();
            }
        });
    }

    function init() {
        initializeCache();
        initPopUp();
        bindEvents();
    }

    app.popUpCookies = {
        init: init
    };

} (window.app = window.app || {}, jQuery));

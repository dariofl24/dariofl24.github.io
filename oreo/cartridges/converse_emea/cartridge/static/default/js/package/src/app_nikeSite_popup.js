/*global window */
(function(app, $) {
    var $cache = {};

    function initializeCache() {
        $cache = {
            popUpNikeSites: $(".popUp-nikeSites"),
            popUpLauncher: $("#popUpLauncherNike"),
            popUpNikeSitesLink: $(".nikeSites-link")
        };
        $cache.closeButton = $cache.popUpNikeSites.find(".close-nikeSites-popup");
    }



    function setMaxHeight() {
        $cache.popUpLauncher.css("max-height", window.height);
    }

    function bindEvents() {
        $cache.closeButton.on("click", closePopup);
        $cache.popUpLauncher.on("click", setMaxHeight);
        $cache.popUpNikeSitesLink.on("click", setupPopUp);
    }
    
    function closePopup() {
        $.magnificPopup.close();
    }
    
    function setupPopUp() {
        setMaxHeight();
        $('.nikeSites-link').magnificPopup({
            type: 'inline',
            src: '#popUpLauncherNike',
            modal: true
        });
    }
    function initPopUp() {
        setupPopUp();
        $('.nikeSites-link').click();
    }
    function init() {
        initializeCache();
        initPopUp();
        bindEvents();
    }

    app.popUpNikeSites = {
        init: init
    };

} (window.app = window.app || {}, jQuery));

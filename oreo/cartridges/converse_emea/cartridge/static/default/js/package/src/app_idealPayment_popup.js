/*global window */
(function(app, $) {
    var $cache = {};

    function initializeCache() {
        $cache = {
            popUpIdealPayment: $(".popUp-idealPayment"),
            popUpLauncher: $("#popUpLauncher"),
            popUpIdealSettingLink: $(".ideal-setting-link")
        };

        $cache.continueIdealPaymentButton = $cache.popUpIdealPayment.find(".continue-idealPayment");
    }

    function continueOrder(){
        var url = app.urls.cosummary;
        app.ajax.post(url);
    }

    function closePopup() {
        $.magnificPopup.close();
        continueOrder();
    }

    function setMaxHeight() {
        $cache.popUpLauncher.css("max-height", window.height);
    }

    function bindEvents() {
        $cache.continueIdealPaymentButton.on("click", closePopup);
        $cache.popUpLauncher.on("click", setMaxHeight);
        $cache.popUpIdealSettingLink.on("click", setupPopUp);
    }
    
    function setupPopUp() {
        setMaxHeight();
        $('.ideal-setting-link').magnificPopup({
            type: 'inline',
            src: '#popUpLauncher',
            modal: true,
            focus: '#yesIdealBtn',
            close: continueOrder
        });
    }
    function initPopUp() {
        setupPopUp();
        $('.ideal-setting-link').click();
    }
    function init() {
        initializeCache();
        initPopUp();
        bindEvents();
    }

    app.popUpIdealPayment = {
        init: init
    };

} (window.app = window.app || {}, jQuery));

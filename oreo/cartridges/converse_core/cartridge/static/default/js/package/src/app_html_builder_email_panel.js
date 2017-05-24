(function(app, $) {
    var $cache;

    function initializeCache() {
        $cache = {
            emailDesignContainer: $('#pdp-email-design-container'),
            genericPopup: $('#pdp-generic-popup')
        };
    }

    function renderContent(metricId) {
        app.htmlBuilder.openPopup($cache.emailDesignContainer);
        updateContent(metricId);
    }

    function updateContent(metricId) {
        var imageUrl = app.htmlBuilder.getImageShotUrl(metricId, 300, 'vw-1');
        $cache.emailDesignContainer.find('.dyo-shoe-image').attr('src', imageUrl);
        $cache.emailDesignContainer.attr('data-metric-id', metricId);
    }

    function sendEmail(event) {
        event.preventDefault();

        if (!$cache.emailDesignContainer.find('form').parsley('validate')) {
            return;
        }

        var data = {
            sender: $cache.emailDesignContainer.find('input.sender-input').val(),
            recipients: $cache.emailDesignContainer.find('input.recipients-input').val().split(','),
            message: $cache.emailDesignContainer.find('textarea.message-input').val(),
            productId: app.htmlBuilder.configuration.converse.productId(),
            metricId: $cache.emailDesignContainer.data('metric-id')
        };

        var request = app.product.share.sendDYOEmail(data);

        request()
            .done(sendEmailCallback(app.resources.htmlbuilder.EMAIL_DESIGN_SUCCESS_MESSAGE))
            .fail(sendEmailCallback(app.resources.htmlbuilder.ERROR_MESSAGE));
    }

    function sendEmailCallback(message) {
        return function() {
            app.htmlBuilder.closePopup();
            var str = String.format('<h2>{0}</h2>', message);
            app.htmlBuilder.openPopup($cache.genericPopup, str);
        };
    }

    function bindEvents() {
        $cache.emailDesignContainer.find('form').on('submit', sendEmail);
    }

    function init() {
        initializeCache();
        bindEvents();
    }

    var emailPopup = {
        init: init,
        show: renderContent
    };

    $.extend(app.htmlBuilder = app.htmlBuilder || {}, {
        emailPopup: emailPopup
    });

}(window.app = window.app || {}, jQuery));
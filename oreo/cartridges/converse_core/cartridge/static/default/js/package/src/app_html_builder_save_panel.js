(function(app, $) {
    var $cache;
    var saveDesignRequested;

    function initializeCache() {
        saveDesignRequested = false;

        $cache = {
            saveDesignContainer: $('#pdp-save-design-container'),
            genericPopup: $('#pdp-generic-popup')
        };
    }

    function renderContent(metricId) {
        app.htmlBuilder.openPopup($cache.saveDesignContainer);
        updateContent(metricId);
    }

    function updateContent(metricId) {
        var imageUrl = app.htmlBuilder.getImageShotUrl(metricId, 300, 'vw-1');
        $cache.saveDesignContainer.find('.dyo-shoe-image').attr('src', imageUrl);
        $cache.saveDesignContainer.attr('data-metric-id', metricId);
    }

    function prepareSaveDesign(event) {
        var productId = app.htmlBuilder.configuration.converse.productId();
        var metricId = $cache.saveDesignContainer.data('metric-id');
        var userDefinedName = $cache.saveDesignContainer.find('input').val();

        var postData = {
            user_id: '',
            user_defined_name: userDefinedName,
            channel: 'CONVERSE_ONE',
            return_url: String.format('?pid={0}&metricId={1}', productId, metricId),
            extra_data: 'scene7',
            metrics_id: metricId
        };

        if ($cache.saveDesignContainer.find('form').parsley('validate')) {
            event.preventDefault();

            var isLoggedIn = app.util.isUserLoggedInRequest();
            isLoggedIn.done(function(data) {
                var status = $(data).find('profileService status');
                if (status.text() !== 'false') {
                    saveDesign(postData);
                } else {
                    saveDesignRequested = true;
                    app.htmlBuilder.closePopup();
                    app.login.togglePanel();
                }
            });
        }
    }

    function saveDesign(postData) {
        var request = $.ajax({
            url: app.urls.addToMyDesigns,
            type: 'POST',
            data: postData
        });

        request.done(function(data) {
            if (data.indexOf('success') > -1) {
                var message = String.format('<h2>{0}</h2>', app.resources.htmlbuilder.SAVE_DESIGN_SUCCESS_MESSAGE);
                var formattedMessage = String.format(message, postData.user_defined_name);
                app.htmlBuilder.closePopup();
                app.htmlBuilder.openPopup($cache.genericPopup, formattedMessage);
            }
        });

        request.fail(function() {
            app.htmlBuilder.closePopup();
            var message = String.format('<h2>{0}</h2>', app.resources.htmlbuilder.ERROR_MESSAGE);
            app.htmlBuilder.openPopup($cache.genericPopup, message);
        });
    }

    function userLoggedIn() {
        if (saveDesignRequested) {
            var metricId = $cache.saveDesignContainer.data('metric-id');

            renderContent(metricId);
        }
    }

    function bindEvents() {
        $cache.saveDesignContainer.find('form').on('submit', prepareSaveDesign);
        $.subscribe(app.constant.PUBSUB.LOGIN_PANEL.USER.LOGGED_IN, userLoggedIn);
    }

    function init() {
        initializeCache();
        bindEvents();
    }

    var savePanel = {
        init: init,
        show: renderContent
    };

    $.extend(app.htmlBuilder = app.htmlBuilder || {}, {
        savePanel: savePanel
    });

}(window.app = window.app || {}, jQuery));
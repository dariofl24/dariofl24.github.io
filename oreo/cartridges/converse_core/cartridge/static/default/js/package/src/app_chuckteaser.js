// app.chuckteaser
(function(app, $) {

    var $cache;

    function initializeCache() {
        $cache = {
            chuckTeaser: $('#chuck-teaser'),
            chuckTeaserForm: $('#chuck-two-teaser-popup-form'),
            signUpButton: $('#chuck-two-sign-up-button'),
            popup: $('#chuck-two-teaser-popup'),
            teaserPopup: $('.teaser-popup')
        };

        $cache.dateContainer = $cache.popup.find('.date-container');
        $cache.monthSelect = $cache.dateContainer.find('#month');
        $cache.daySelect = $cache.dateContainer.find('#day');
        $cache.yearSelect = $cache.dateContainer.find('#year');
        $cache.dateValue = $cache.dateContainer.find('.date-value');
    }

    function initializePopup() {
        $cache.signUpButton.magnificPopup({
            type: 'inline',
            midClick: true,
            callbacks: {
                open: function() {
                    $cache.popup.find('.mfp-close').css('display', 'none');
                }
            }
        });
    }

    function closePopup() {
        $.magnificPopup.close();
    }

    function populateDate() {
        var month = $cache.monthSelect.val();
        var day = $cache.daySelect.val();
        var year = $cache.yearSelect.val();

        if (month && day && year) {
            $cache.dateValue.val(month + '/' + day + '/' + year);
            $cache.dateValue.parsley('validate');
        }
    }

    function openSuccessPopup() {
        $.magnificPopup.open({
            items: {
                src: '#chuck-two-teaser-success-popup'
            },
            callbacks: {
                open: function() {
                    $cache.popup.find('.mfp-close').css('display', 'none');
                }
            }
        });
    }

    function bindForm() {
        var callbacks = app.form.bindAjax($cache.chuckTeaserForm, true, {
            dataType: "json"
        });

        callbacks.beforeSubmit.add(function() {
            app.validation.resetFormError($cache.chuckTeaserForm);
        });

        callbacks.success.add(function(form, response, textStatus, jqXHR) {
            if (response.success) {
                openSuccessPopup();
            }
        });

    }

    function bindEvents() {
        $cache.monthSelect.on('change', populateDate);
        $cache.daySelect.on('change', populateDate);
        $cache.yearSelect.on('change', populateDate);
        $cache.teaserPopup.find('.close-button').on('click', closePopup);
    }

    function init() {
        initializeCache();
        initializePopup();
        bindEvents();
        bindForm();
    }

    app.chuckteaser = {
        init: init
    };

}(window.app = window.app || {}, jQuery));
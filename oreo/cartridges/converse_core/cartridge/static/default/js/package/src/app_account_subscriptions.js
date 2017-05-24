// app.accountSubscriptions
(function(app, $) {
    var TABIFY = app.constant.PUBSUB.TABIFY;

    var $interestsCheckboxes;
    var $subscriptionForm;

    function initializeElements() {
        $subscriptionForm = $('#subscription-form');
        $interestsCheckboxes = $subscriptionForm.find(':checkbox');
    }
    
    function displaySubscriptionSaveMessage() {
        $('#subscription-success-message').show();
        setTimeout(function() {
            $('#subscription-success-message').hide();
        }, 2000);
    }

    function bindForm() {
        var successHandler = function(form, response, textStatus, jqXHR) {
            if (!response.success) {
                app.forms.displayAjaxFormErrors(form, response);
            } else {
                displaySubscriptionSaveMessage();
            }
        };

        app.form.bindAjax($subscriptionForm, true).success.add(successHandler);
    }

    function checkInterest(e) {
        var element = $(e.currentTarget);
        var isChecked = element.is(':checked');
        
        element.val(isChecked);
    }

    function initializeEvents() {
        $interestsCheckboxes.click(checkInterest);
        bindForm();
    }

    function initSubscriptionsTab() {
        initializeElements();
        initializeEvents();
    }

    app.accountSubscriptions = {
        init: function() {
            initSubscriptionsTab();
            $.subscribe(TABIFY.TAB_COMPLETE, initSubscriptionsTab);
        }
    };
}(window.app = window.app || {}, jQuery));

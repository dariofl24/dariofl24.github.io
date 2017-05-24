(function(app, $) {

    var CUSTOMER_SERVICE = app.constant.CUSTOMER_SERVICE;
    var $cache;

    function initializeCache() {
        $cache = {
            loginForm: $(".converse-tabs #login-form"),
            orderStatusForm: $(".converse-tabs #check-order-status-form")
        };
    }

    function onUserLoggedIn() {
        app.page.redirect(app.urls.orderHistory);
    }

    function onCheckStatusSuccess(data) {
        var url = app.util.appendParamToURL(app.urls.orderTrack, "orderID", data.orderID);
        app.page.redirect(url);
    }

    function bindLoginForm() {
        app.form.bindAjax($cache.loginForm, true, { dataType: "json" })
            .success.add(function(form, response, textStatus, jqXHR) {
                if(response.success) {
                    onUserLoggedIn(response.result);
                }
            });
    }

    function bindOrderStatusForm() {
        var callbacks = app.form.bindAjax($cache.orderStatusForm, true, { dataType: "json" });
        callbacks.success.add(function(form, response, textStatus, jqXHR) {
            if(response.success) {
                onCheckStatusSuccess(response.result);
            } else {
                app.progress.hide($cache.orderStatusForm);
            }
        });
        callbacks.beforeSubmit.add(function(form, response, textStatus, jqXHR) {
            app.progress.show($cache.orderStatusForm);
        });
        callbacks.error.add(function(form, response, textStatus, jqXHR) {
            app.progress.hide($cache.orderStatusForm);
        });
    }

    function onContentLoaded(topic, contentName) {
        if(contentName === CUSTOMER_SERVICE.CHECK_ORDER_STATUS) {
            initializeCache();
            bindLoginForm();
            bindOrderStatusForm();
        }
    }

    function initializeEvents() {
        $.subscribe(CUSTOMER_SERVICE.CONTENT_LOADED, onContentLoaded);
    }

    app.checkOrderStatusForm = {
        init: function() {
            initializeEvents();
        }
    };
}(window.app = window.app || {}, jQuery));

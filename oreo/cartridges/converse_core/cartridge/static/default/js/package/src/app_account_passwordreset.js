// app.passwordReset
(function(app, $) {
    var $cache;

    function initializeCache() {
        $cache = {
            forgotPasswordBtn: $("#forgot-password-btn"),

            requestPasswordForm: $("form[name='requestPasswordForm']"),
            requestPasswordBtn: $("#request-password-btn"),
            cancelRequestPasswordBtn: $("#cancel-request-password-btn"),

            resetPasswordForm: $("form[name='resetPasswordForm']"),
            resetPasswordBtn: $("#reset-password-btn"),
            cancelResetPasswordBtn: $("#cancel-reset-password-btn")
        };
    }

    function extractTokenFromUrl() {
        var url = app.util.getCurrentUrl();
        var params = app.util.getQueryStringParams(url);

        return params.Token;
    }
    
    function displayRequestPasswordNotification() {
        var container = app.accountCommon.getContainer("requestPassword");
        container.find("#forgot-pass-email-cell").hide();
        container.find("#submit-cell").hide();
        container.find("#cancel-cell").hide();
        container.find(".notification").show();
    }

    function displayResetPasswordNotification() {
        var container = app.accountCommon.getContainer("resetPassword");
        container.find("#password-cell").hide();
        container.find("#password-confirm-cell").hide();
        container.find("#submit-cell").hide();
        container.find("#cancel-cell").hide();
        container.find(".notification").show();
        container.find('.title-text').text(app.resources.PASSWORD_RESET_PASSWORD_CHANGED);
    }

    function bindRequestPasswordForm() {
        var isFormReady = function() {
            return app.forms.checkFormFieldsNotBlank($cache.requestPasswordForm, [".emailaddress-input"]);
        };

        var successHandler = function(form, response, textStatus, jqXHR) {
            if (!response.success) {
                if (response.formErrors) {
                    app.forms.displayAjaxFormErrors(form, response);
                } else if (response.error === 'notfounderror') {
                    app.forms.displayAjaxFormError(form, app.resources.PASSWORD_RESET_CUSTOMER_NOT_FOUND);
                }
            } else {
                displayRequestPasswordNotification();
            }
        };

        var errorHandler = function(form, jqXHR, textStatus, errorThrown) {
            app.forms.displayServerError(form, textStatus, errorThrown);
        };

        app.forms.bindAjaxForm($cache.requestPasswordForm, isFormReady, successHandler, errorHandler);
    }

    function bindResetPasswordForm() {
        var isFormReady = function() {
            return app.forms.checkFormFieldsNotBlank($cache.resetPasswordForm, [".password-input"]);
        };

        var successHandler = function(form, response, textStatus, jqXHR) {
            if (!response.success) {
                if (response.formErrors) {
                    app.forms.displayAjaxFormErrors(form, response);
                } else if (response.error === 'passwordsdonotmatch') {
                    app.forms.displayAjaxFormError(form, app.resources.PASSWORD_RESET_PASSWORDS_NO_MATCH);
                } else if (response.error === 'invalidtokenerror' || response.error === 'invalidpassworderror') {
                    app.accountCommon.showContainers(["requestPassword"]);
                    app.forms.displayAjaxFormError($cache.requestPasswordForm, app.resources.PASSWORD_RESET_INVALID_TOKEN);
                }
            } else {
                displayResetPasswordNotification();
            }
        };

        var errorHandler = function(form, jqXHR, textStatus, errorThrown) {
            app.forms.displayServerError(form, textStatus, errorThrown);
        };

        app.forms.bindAjaxForm($cache.resetPasswordForm, isFormReady, successHandler, errorHandler);
    }

    function bindForgotPasswordButton() {
        $cache.forgotPasswordBtn.on("click", function() {
            app.accountCommon.showContainers(["requestPassword"]);
        });
    }

    function bindRequestPasswordContainer() {
        $cache.requestPasswordBtn.on("click", function() {
            app.forms.resetAjaxFormErrors($cache.requestPasswordForm);
            $cache.requestPasswordForm.submit();
        });

        $cache.cancelRequestPasswordBtn.on("click", function() {
            app.accountCommon.showContainers(["login", "createAccount"]);
        });

        bindRequestPasswordForm();
    }
    
    function bindResetPasswordToken() {
        var token = extractTokenFromUrl();
        $cache.resetPasswordForm.find("input[name='Token']").attr('value', token);
    }

    function bindResetPasswordContainer() {
        $cache.resetPasswordBtn.on("click", function() {
            app.forms.resetAjaxFormErrors($cache.resetPasswordForm);
            $cache.resetPasswordForm.submit();
        });

        $cache.cancelResetPasswordBtn.on("click", function() {
            app.accountCommon.showContainers(["login", "createAccount"]);
        });

        bindResetPasswordForm();
    }

    app.passwordReset = {
        init: function() {
            initializeCache();
            bindForgotPasswordButton();
            bindResetPasswordToken();
            bindRequestPasswordContainer();
            bindResetPasswordContainer();
        }
    };
}(window.app = window.app || {}, jQuery));

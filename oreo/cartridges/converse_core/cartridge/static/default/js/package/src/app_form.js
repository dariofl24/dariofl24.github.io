/*global _*/
(function(app, $) {

    function bindInputKeypress(form) {
        form.find("input").keypress(function(e) {
            if (e.which === 13) {
                e.preventDefault();
                form.submit();
            }
        });    
    }

    function addDefaultErrorHandling(callbacks) {
        callbacks.success.add(function(form, response, textStatus, jqXHR) {
            if (response.success === false) {
                displayAjaxFormErrors(form, response);
            }
        });

        callbacks.error.add(function(form, jqXHR, textStatus, errorThrown) {
            displayServerError(form, textStatus, errorThrown);
        });
    }

    function mergeOptions() {
        var options = _.toArray(arguments);
        var extendParams = [ true , {} ].concat(options);
        return $.extend.apply(null, extendParams);
    }

    function formDataOptions(form) {
        return {
            data: form.serialize()
        };
    }

    function bindAjax(form, defaultErrorHandling, customOptions) {
        var callbacks = {
            "success": $.Callbacks(),
            "error" : $.Callbacks(),
            "beforeSubmit": $.Callbacks(),
            "submitComplete": $.Callbacks()
        };

        customOptions = customOptions || {};

        bindInputKeypress(form);

        app.validation.initForm(form);

        var basicOptions = {
            type: form.attr("method"),
            url: form.attr("action"),
            data: form.serialize(),
            crossDomain: app.ajax.isCrossDomainSupported(),
            xhrFields: {
                withCredentials: true
            },
            success: function(data, textStatus, jqXHR) {
                callbacks.success.fire(form, data, textStatus, jqXHR);
                callbacks.submitComplete.fire(form);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                callbacks.error.fire(form, jqXHR, textStatus, errorThrown);
                callbacks.submitComplete.fire(form);
            }
        };

        if(defaultErrorHandling) {
            addDefaultErrorHandling(callbacks);
        }

        function onFormSubmit() {
            app.validation.removeServerSideErrors(form);

            if(app.validation.valid(form)) {
                var options = mergeOptions(basicOptions, customOptions, formDataOptions(form) );

                callbacks.beforeSubmit.fire(form);
                $.ajax(options);
            }

            return false;
        }

        form.off("submit.bindAjaxForm");
        form.on("submit.bindAjaxForm", onFormSubmit);

        return callbacks;
    }

    function displayAjaxFieldErrors(form, formFields) {
        _.each(formFields, function(value, name) {
            var formField = form.find("input[name=" + name + "]").eq(0);
            if (formField.exists()) {
                app.validation
                    .addServerSideError(formField, value.errorMessage, "ajax")
                    .validateField(formField);
            }
        });
    }

    function getFormGroupErrorMessage(form, formGroups) {
        var formGroup = formGroups[form.attr("id")];
        if (!formGroup) {
            formGroup = app.util.firstObjectProperty(formGroups);
        }
        return formGroup.errorMessage;
    }

    function displayAjaxFormErrors(form, response) {
        app.validation.reset(form);

        var formErrors = response.formErrors,
            formGroups = formErrors.formGroups,
            formFields = formErrors.formFields;

        if(_.isEmpty(formFields)) {
            var errorMessage = _.isEmpty(formGroups) ? formErrors.errorMessage : getFormGroupErrorMessage(form, formGroups);
            app.validation.showFormError(form, errorMessage || app.resources.FORM_ERROR);
        } else {
            displayAjaxFieldErrors(form, formFields);
        }
    }

    function displayServerError(form, textStatus, errorThrown) {
        app.validation.showFormError(form, app.resources.SERVER_ERROR);
    }

    app.form = {
        bindAjax: bindAjax,
        displayAjaxFieldErrors: displayAjaxFieldErrors,
        displayAjaxFormErrors: displayAjaxFormErrors,
        displayServerError: displayServerError
    };

}(window.app = window.app || {}, jQuery));

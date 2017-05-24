(function(app, $) {

    var DATA_TYPE = {
        DEFAULT : "json",
        INTELLIGENT_GUESS : "guess"
    };

    function checkFormFieldsNotBlank(form, fields) {
        var blank = false;
        $(fields).each(function(index, value) {
            var field = form.find(value);
            if ($.trim(field.val()).length === 0) {
                blank = true;
            }
            return !blank;
        });
        return !blank;
    }
    //isFormReadyForSubmit :- Checks if the form fields are not empty and do not have any errors, before submitting the form
    function isFormReadyForSubmit(form, fields) {
        var isFormReady = true;
        $(fields).each(function(index, value) {
            var field = form.find(value);
            if (field.hasClass('error') || $.trim(field.val()).length === 0) {
                isFormReady = false;
            }
            return isFormReady;
        });
        return isFormReady;
    }

    function bindAjaxForm(form, setupCallback, successCallback, errorCallback, dataType) {
        form.find("input").keypress(function(e) {
            if (e.which === 13) {
                formSubmit(e);
            }
        });

        function formSubmit(e) {
            e.preventDefault();
            var ready = $.isFunction(setupCallback) ? setupCallback() : true;
            if (ready) {
                var options = {
                    type: form.attr("method"),
                    url: form.attr("action"),
                    data: form.serialize(),
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: app.ajax.isCrossDomainSupported(),
                    success: function(data, textStatus, jqXHR) {
                        successCallback(form, data, textStatus, jqXHR);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        errorCallback(form, jqXHR, textStatus, errorThrown);
                    }
                };
                if (dataType !== DATA_TYPE.INTELLIGENT_GUESS) {
                    options.dataType = dataType || DATA_TYPE.DEFAULT;
                }
                $.ajax(options);
            }
            return false;
        }
        form.off("submit.bindAjaxForm");
        form.on("submit.bindAjaxForm", formSubmit);
    }

    function resetAjaxFormError(form) {
        var errorDiv = form.find(".error-form");
        errorDiv.hide();
        errorDiv.text("");
    }

    function resetAjaxFieldErrors(form) {
        form.find(".input-container").removeClass("error");
        form.find("input.error").removeClass("error").addClass("valid");
        form.find("span[generated=true].error").remove();
    }

    function resetAjaxFormErrors(form) {
        resetAjaxFormError(form);
        resetAjaxFieldErrors(form);
    }

    function displayAjaxFormError(form, error) {
        if (error) {
            var errorDiv = form.find(".error-form");
            errorDiv.empty();

            var errorLines = error.split("\n");
            $.each(errorLines, function( index, line ) {
                errorDiv.append($("<div>").addClass("error-line").text(line));
            });
            errorDiv.show();
        }
    }

    function displayAjaxFieldErrors(form, formFields) {
        var errorDisplayed = false;

        if (formFields) {
            $.each(formFields, function(name, value) {
                var formField = form.find("input[name=" + name + "]").eq(0);

                if (formField.exists()) {
                    formField.removeClass("valid").addClass("error");

                    var errorSpan = $("<span/>").attr("for", name).attr("generated", "true").addClass("error").text(value.errorMessage);
                    $(errorSpan).insertAfter(formField);
                    app.util.showCustomErrors(formField, value.errorMessage);
                    errorDisplayed = true;
                }
            });
        }

        return errorDisplayed;
    }

    function displayAjaxGroupError(form, formGroups) {
        var formGroup = formGroups[form.attr("id")];
        if (!formGroup) {
            formGroup = app.util.firstObjectProperty(formGroups);
        }
        displayAjaxFormError(form, formGroup.errorMessage);
    }

    function displayAjaxFormErrors(form, response) {
        resetAjaxFormErrors(form);

        var formErrors = response.formErrors,
            formGroups = formErrors.formGroups,
            formFields = formErrors.formFields;

        var errorDisplayed = false;
        if (!$.isEmptyObject(formFields)) {
            errorDisplayed = displayAjaxFieldErrors(form, formFields);
        }

        if (!errorDisplayed) {
            if (!$.isEmptyObject(formGroups)) {
                displayAjaxGroupError(form, formGroups);
            } else {
                displayAjaxFormError(form, formErrors.errorMessage);
            }
        }
    }

    var displayErrorMessage = function(form, messageElId, defaultMessage) {
        var errorMsg = $.trim($("#" + messageElId).text());

        resetAjaxFormErrors(form);
        displayAjaxFormError(form, errorMsg.length > 0 ? errorMsg : defaultMessage);
    };

    function displayGenericFormError(form) {
        displayErrorMessage(form, "genericFormError", app.resources.FORM_ERROR);
    }

    function displayServerError(form, textStatus, errorThrown) {
        displayErrorMessage(form, "serverError", app.resources.SERVER_ERROR);
    }

    app.forms = {
        DATA_TYPE: DATA_TYPE,
        checkFormFieldsNotBlank: checkFormFieldsNotBlank,
        bindAjaxForm: bindAjaxForm,
        displayAjaxFieldErrors: displayAjaxFieldErrors,
        displayAjaxGroupError: displayAjaxGroupError,
        displayAjaxFormError: displayAjaxFormError,
        displayAjaxFormErrors: displayAjaxFormErrors,
        displayGenericFormError: displayGenericFormError,
        displayServerError: displayServerError,
        resetAjaxFieldErrors: resetAjaxFieldErrors,
        resetAjaxFormError: resetAjaxFormError,
        resetAjaxFormErrors: resetAjaxFormErrors,
        isFormReadyForSubmit:isFormReadyForSubmit
    };

}(window.app = window.app || {}, jQuery));

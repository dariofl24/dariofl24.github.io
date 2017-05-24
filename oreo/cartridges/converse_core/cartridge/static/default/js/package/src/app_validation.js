/*global _*/
(function (app, $) {

    var selector = {
        form_group: ".form-group",
        server_side_error: ".parsley-error-list[generated]",
        message_placeholder: ".message-placeholder",
        error_form: ".error-form"
    };

    var parsleyDefaults = {
        animate: false,
        errorClass: "error",
        errors: {
            classHandler: function(elem) {
                return $(elem).closest(selector.form_group);
            },
            container: function(elem, isRadioOrCheckbox) {
                return defineErrorContainer(elem, isRadioOrCheckbox);
            }
        },
        listeners: {
            onFieldValidate: function (elem, ParsleyForm) {
                if (!$(elem).hasClass('force-validation') && !$(elem).is(':visible')) {
                    return true;
                }
            },
            onFieldSuccess: function(elem, constraints, ParsleyField) {
                removeServerSideError(elem);
            },
            onFieldError: function(elem, constraints, ParsleyField) {
                removeServerSideError(elem);
            }
        },
        validators: {
            "servererror": function(val, type, self) {
                return false;
            }
        }
    };

    function defineErrorContainer(element, isRadioOrCheckbox) {
        var formGroup = element.closest(selector.form_group);
        var messagePlaceholder = formGroup.find(selector.message_placeholder);
        if(messagePlaceholder.exists()) {
            return messagePlaceholder;
        }
    }

    function removeServerSideError(element) {
        var formGroup = element.closest(selector.form_group);
        formGroup.find(selector.server_side_error).remove();
    }

    function initParsley(formElements, defaults) {
        $(formElements).each(function () {
            $(this).parsley(defaults);
        });
    }

    app.validation = {
        init: function() {
            app.parsleyField.init();
            app.parsleyForm.init();
            initParsley('[data-validate="parsley"]', parsleyDefaults);
        },
        initForm: function(form) {
            initParsley(form, parsleyDefaults);
        },
        reset: function(form) {
            this.resetFieldErrors(form);
            this.resetFormError(form);
        },
        resetFieldErrors: function(form) {
            $(form).parsley("reset");
        },
        resetFormError: function(form) {
            form.find(selector.error_form)
                .hide()
                .text("");
        },
        showFormError: function(form, errorMessage) {
            if (errorMessage) {
                var errorDiv = form.find(selector.error_form);
                errorDiv.empty();

                var errorLines = errorMessage.split("\n");
                _.each(errorLines, function(line) {
                    errorDiv.append($("<div>").addClass("error-line").text(line));
                });

                errorDiv.show();
            }
        },
        valid: function(form) {
            return $(form).parsley("isValid");
        },
        validateField: function(field) {
            return $(field).parsley("validate");
        },
        addServerSideError: function(field, errorMessage, type) {
            var parsleyField = $(field).parsley();
            var constraint = { "servererror" : type || "server" };
            parsleyField.addConstraint(constraint);
            parsleyField.updateConstraint(constraint, errorMessage);
            return this;
        },
        removeServerSideErrors: function(form) {
            var parsleyForm = $(form).parsley();
            _.each(parsleyForm.items, function(validationItem) {
                validationItem.removeError("servererror");
                validationItem.removeConstraint("servererror");
                validationItem.manageValidationResult();
            });
        }
    };
}(window.app = window.app || {}, jQuery));

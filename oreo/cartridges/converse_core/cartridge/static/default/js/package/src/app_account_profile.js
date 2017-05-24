/*global _, window*/

(function(app, $) {
    _.mixin(_.str.exports());

    var TABIFY = app.constant.PUBSUB.TABIFY;
    var $cache;

    function initializeCache() {
        var profileForm = $("form[id='profile-form']");
        var deleteAccountSection = $(".delete-account-section");

        $cache = {
            profileForm: profileForm,
            deleteAccountSection: deleteAccountSection,
            accountInfoBox: $("#account-info-box"),
            firstNameInput: profileForm.find("input[name$='_firstname']"),
            lastNameInput: profileForm.find("input[name$='_lastname']"),
            customerEmail: profileForm.find("span#profileCustomerEmail"),
            profileActionButtons: profileForm.find("#profileButtonPanel"),
            deleteAccountLink: profileForm.find(".delete-account-link"),
            messageContainer: profileForm.find('div.message'),
            allPasswordFields: profileForm.find('input[type="password"]'),
            resetFormButton: profileForm.find(".cancel-button[type='reset']"),
            profileFormDeleteAccountBtn: profileForm.find(".delete-account-link"),
            deleteAccountButton: deleteAccountSection.find(".deleteaccount-button"),
            deleteAccountCanelBtn: deleteAccountSection.find(".cancel-deleteacount-button"),
            deleteAccountDeleteBtn: deleteAccountSection.find(".deleteaccount-button")
        };
    }

    function getUsername() {
        var firstName = _.trim($cache.firstNameInput.val());
        var lastName = _.trim($cache.lastNameInput.val());

        var username;
        if (firstName) {
            username = firstName;
            if (lastName) {
                username += " " + lastName;
            }
        }
        else {
            var email = $cache.customerEmail.text();
            username = email.split("@")[0];
        }

        return username;
    }

    function displayCustomerGreeting() {
        var pattern = app.resources.CUSTOMER_WELCOME_PATTERN;
        var greeting = pattern.replace("{0}", getUsername());
        $cache.accountInfoBox.text(greeting);
    }

    function displaySuccessMessage() {
        var fadeOutDuration = app.constant.INPUT_MESSAGING_FADEOUT_DURATION;

        $cache.messageContainer.addClass('visible');
        $.timer(fadeOutDuration).then(function() {
            $cache.messageContainer.removeClass('visible');
        });
    }

    function resetPasswordFields() {
        $cache.allPasswordFields.val('');
    }

    function onBeforeSubmit() {
        app.ajaxLoader.show($cache.profileForm);
    }

    function onSubmitComplete() {
        resetPasswordFields();
        app.ajaxLoader.hide($cache.profileForm);
    }

    function successHandler(form, response, textStatus, jqXHR) {
        if (response.success) {
            displayCustomerGreeting();
            displaySuccessMessage();
        }
    }

    function bindProfileForm() {
        var callbacks = app.form.bindAjax($cache.profileForm, true);

        callbacks.success.add(successHandler);
        callbacks.beforeSubmit.add(onBeforeSubmit);
        callbacks.submitComplete.add(onSubmitComplete);
    }

    function deleteAccount() {
        var promise = $.ajax({
            type: "POST",
            url: app.util.appendParamToURL(app.urls.deleteAccount, "format", "ajax")
        });

        promise.done(function(data) {
            if (data.success) {
                app.page.redirect(app.urls.logout);
            } else {
                app.validation.showFormError($cache.profileForm, app.resources.FORM_ERROR);
            }
        });

        promise.fail(function() {
            app.validation.showFormError($cache.profileForm, app.resources.SERVER_ERROR);
        });
    }

    function deleteAccountCanelBtnClicked(event) {
        event.preventDefault();
        $cache.profileActionButtons.show();
        $cache.deleteAccountSection.hide();
    }

    function deleteAccountBtnClicked(event) {
        event.preventDefault();
        $cache.profileActionButtons.hide();
        $cache.deleteAccountSection.show();
    }

    function deleteAccountDeleteBtnClicked(event) {
        event.preventDefault();      
        deleteAccount();
    }

    function resetFormValues() {
        app.validation.reset($cache.profileForm);
    }

    function bindEvents() {
        $cache.deleteAccountCanelBtn.switchEvent("click.deleteAccountCanelBtn", deleteAccountCanelBtnClicked);
        $cache.profileFormDeleteAccountBtn.switchEvent("click.profileFormDeleteAccountBtn", deleteAccountBtnClicked);
        $cache.deleteAccountDeleteBtn.switchEvent("click.deleteAccountDeleteBtn", deleteAccountDeleteBtnClicked);
        $cache.resetFormButton.switchEvent("click.resetFormButton", resetFormValues);
    }

    function initAccountProfile() {
        initializeCache();
        bindProfileForm();
        bindEvents();
    }

    app.accountProfile = {
        init: function() {
            initAccountProfile();
            $.subscribe(TABIFY.TAB_COMPLETE, initAccountProfile);
        }
    };
}(window.app = window.app || {}, jQuery));

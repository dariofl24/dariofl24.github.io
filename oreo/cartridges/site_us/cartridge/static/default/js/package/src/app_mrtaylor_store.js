(function(app, $) {
    var $cache;
    var LOGIN_PANEL = app.constant.PUBSUB.LOGIN_PANEL;

    function initializeCache() {
        $cache = {
            verifyForm: $("#verify-employee-form"),
            registerForm: $("#register-employee-form"),
            forgotPasswordBtn: $("#forgot-password")
        };
        $cache.registerBirthDayCell = $cache.registerForm.find("#birthday-cell");
        $cache.registerZipCell = $cache.registerForm.find("#zip-cell");
        $cache.liveInUSCheck = $cache.registerForm.find("#liveinus-cell input[type=checkbox]");
    }

    function updateLiveInUsWarning() {
        app.zipComponent.updateLiveInUsWarning($cache.liveInUSCheck, app.resources.forms.mrtaylorstore.INTERNATIONAL_WARNING);
    }

    function bindEvents() {
        app.dateSelectComponent.registerDateSelectComponent($cache.registerBirthDayCell);
        app.zipComponent.registerZipComponent($cache.registerZipCell, $cache.liveInUSCheck, updateLiveInUsWarning);

        $cache.forgotPasswordBtn.on("click", function() {
            app.accountCommon.showContainers(["requestPassword"]);
            $.publish(LOGIN_PANEL.TOGGLE);
        });
    }

    function displaySuccess(response, dialog, accepted) {
        if (response && response.success) {
            if (accepted) {
                var successDiv = $("#family-member-terms-and-conditions-success");

                dialog.find(".content").replaceWith(successDiv);
                dialog.dialog("option", "buttons", {});

                successDiv.find("#shop-now").on("click", function() {
                    dialog.dialog("close");
                });

                successDiv.show();
            }
        } else {
            dialog.dialog("close");
        }
    }

    function saveTermsAndConditions(accepted, callback) {
        app.ajax.getJson({
            url: app.urls.setRelativeTermsAndConditionsAccepted,
            data: { accepted: accepted },
            callback: callback
        });
    }

    function showDeclineConfirmation(dialog) {
        var errorDiv = $("#family-member-terms-and-conditions-error");

        dialog.find(".content").replaceWith(errorDiv);

        dialog.dialog("option", "buttons", {
            Accept: function() {
                saveTermsAndConditions(true, function(response) { displaySuccess(response, dialog, true); });
            },
            Decline: function() {
                saveTermsAndConditions(false, function(response) { dialog.dialog("close"); });    
            }
        });

        errorDiv.show();
    }

    function displayFamilyMemberTermsAndConditions(fullModal) {
        var dialogDiv = $("#family-member-terms-and-conditions-dialog");
        var slotContentDiv = dialogDiv.find(".slot-content");

        var setAccepted = function(dialog, accepted) {
            if (accepted) {
                saveTermsAndConditions(accepted, function(response) { displaySuccess(response, dialog, accepted); });
            } else {
                showDeclineConfirmation(dialog);   
            }
        };

        var showDialog = function(fullModal) {
            app.dialog.create({
                target: dialogDiv,
                options: {
                    width: 600,
                    height: 'auto',
                    title: this.title,
                    show: { effect: "fade", speed: 1000 },
                    hide: "fade",
                    closeOnEscape: !fullModal,
                    buttons: {
                        Accept: function() {
                            setAccepted($(this), true);
                        },
                        Decline: function() {
                            setAccepted($(this), false);
                        }
                    },
                    open: function(event, ui) {
                        if (fullModal) {
                            $(".ui-dialog-titlebar-close").hide();
                        } else {
                            $(".ui-widget-overlay").on("click", function() {
                                dialogDiv.dialog("close");
                            });
                        }
                    }
                }
            });
            
            dialogDiv.dialog("open");
        };

        app.ajax.load({
            url: app.urls.includeRelativeTermsAndConditions,
            target: slotContentDiv,
            callback: function() {
                var hasContent = slotContentDiv.find("#family-member-terms-and-conditions-slot").exists();
                
                if (hasContent) {
                    showDialog(fullModal);
                }
            }
        });
    }

    app.mrtaylorstore = {
        init: function() {
            initializeCache();
            bindEvents();
        },
        displayFamilyMemberTermsAndConditions: displayFamilyMemberTermsAndConditions
    };

}(window.app = window.app || {}, jQuery));

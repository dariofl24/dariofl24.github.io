// app.family
(function(app, $) {
    var $cache = {};
    var FADE_TIME = 300;

    function initializeCache() {
        $cache = {
            familyMembersContainer: $("#family-members-container"),
            addFamilyMemberFormContainer: $("#add-family-member-container"),
            addNewMemberForm: $("#add-family-member-form")
        };

        $cache.addNewMemberButton = $cache.addFamilyMemberFormContainer.find(".add-new-member-button");
        $cache.cancelButton = $cache.addNewMemberForm.find(".cancel-button");
    }

    function executeAjax(element, url, callback) {
        var parent = element.parent();

        $.ajax({
            type: "POST",
            url: url,
            data: { email: element.data("email") },
            success: function(result) {
                app.ajaxLoader.hide(parent);

                if (result.success) {
                    callback(element, result);
                }
            },
            beforeSend: function() { 
                app.ajaxLoader.show(parent); 
            },
            error: function() { 
                app.ajaxLoader.hide(parent); 
            }
        });
    }

    function displaySuccessMessage(container) {
        var messageContainer = container.find('.message');

        messageContainer.addClass('visible');
        
        $.timer(app.constant.INPUT_MESSAGING_FADEOUT_DURATION).then(function() {
            messageContainer.removeClass('visible');
        });
    }

    function reinviteMember(element, result) {
        element.closest("li").find(".member-state").html(result.result);
        displaySuccessMessage(element.parent());
    }

    function onReInviteButtonClicked(e) {
        e.preventDefault();
        executeAjax($(e.currentTarget), app.urls.reInviteFamilyMember, reinviteMember);
    }

    function removeMember(element, result) {
        element.closest("li").remove();
    }

    function onDeleteButtonClicked(e) {
        e.preventDefault();
        executeAjax($(e.currentTarget), app.urls.deleteFamilyMember, removeMember);
    }

    function toggleAddNewMember() {
        if ($cache.addNewMemberButton.is(':visible')) {
            $cache.addNewMemberButton.fadeOut(FADE_TIME, function() {
                $cache.addNewMemberForm.fadeIn();
            });
        }

        if ($cache.addNewMemberForm.is(':visible')) {
            $cache.addNewMemberForm.fadeOut(FADE_TIME, function() {
                $cache.addNewMemberButton.fadeIn();
            });
        }
    }

    function bindAddNewMemberForm() {
        var callbacks = app.form.bindAjax($cache.addNewMemberForm, true);

        callbacks.submitComplete.add(function() {
            $cache.addNewMemberForm.trigger('reset');
        });

        callbacks.success.add(function(form, response, textStatus, jqXHR) {
            var hasContent = $(response).is("ul");
            
            if (hasContent) {
                $cache.familyMembersContainer.html(response);
                toggleAddNewMember();
            }
        });
    }

    function initializeEvents() {
        $cache.addNewMemberButton.click(toggleAddNewMember);
        $cache.cancelButton.click(toggleAddNewMember);
        $cache.familyMembersContainer.on("click", ".re-invite-member-button", onReInviteButtonClicked);
        $cache.familyMembersContainer.on("click", ".delete-member-button", onDeleteButtonClicked);

        bindAddNewMemberForm();
    }

    app.family = {
        init: function() {
            initializeCache();
            initializeEvents();
        }
    };
}(window.app = window.app || {}, jQuery));

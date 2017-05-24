/*global window*/
(function(app, $) {

    function getZipHidden(parentContainer) {
        return parentContainer.find(".zip-input-hidden");
    }

    function getZipInput(parentContainer) {
        return parentContainer.find(".zip-input");
    }

    function createZipInput(parentContainer, zipHidden) {
        var zipInput = getZipInput(parentContainer);
        if (!zipInput.exists()) {
            zipInput = $('<input>').attr({
                    'type': 'text',
                    'class': 'zip-input'
                });
            zipHidden.before(zipInput);
        }
        return zipInput;
    }

    function handleLiveInUS(liveInUSCheck, zipInput, callback) {
        if (liveInUSCheck.is(":checked")) {
            zipInput.addClass("required");
        } else {
            zipInput.removeClass("required error");
            zipInput.parent().removeClass("required error");
            zipInput.closest(".input-container").removeClass("required error");
        }

        zipInput.blur();

        if ($.isFunction(callback)) {
            callback();
        }
    }

    function createLiveInUsWarningErrorSpan(liveInUSCheck) {
        var $errorSpan = $('<span>').addClass('error');
        liveInUSCheck.after($errorSpan);
    }

    function updateLiveInUsWarning(liveInUSCheck, warningMsg) {
        if (liveInUSCheck.is(":checked")) {
            liveInUSCheck.siblings("span.error").html('');
        } else {
            liveInUSCheck.siblings("span.error").html(warningMsg);
        }
    }

    function setZipValue(zipHidden, zipInput, liveInUSCheck) {
        if (!liveInUSCheck.is(":checked") && $.trim(zipInput.val()).length === 0) {
            zipHidden.val(app.constants.FAKE_POSTAL_CODE);
        } else {
            zipHidden.val(zipInput.val());
        }
    }

    function syncZipComponent(zipHidden, zipInput, liveInUSCheck) {
        if (liveInUSCheck.is(":checked")) {
            zipInput.addClass("required");
        }

        if (zipHidden.parent().hasClass("error")) {
            zipInput.addClass("error");
        }

        if (!liveInUSCheck.is(":checked") && zipHidden.val() === app.constants.FAKE_POSTAL_CODE) {
            zipInput.val("");
        } else {
            zipInput.val(zipHidden.val());
        }
    }

    function registerZipComponent(zipParentContainer, liveInUSCheck, liveInUSCallback) {
        var form = zipParentContainer.closest("form");
        var zipHidden = getZipHidden(zipParentContainer);
        var zipInput = createZipInput(zipParentContainer, zipHidden);

        createLiveInUsWarningErrorSpan(liveInUSCheck);
        syncZipComponent(zipHidden, zipInput, liveInUSCheck);

        liveInUSCheck.on("click", function() {
            handleLiveInUS(liveInUSCheck, zipInput, liveInUSCallback);
        });

        form.submit(function(evt) {
            setZipValue(zipHidden, zipInput, liveInUSCheck);
        });
    }

    app.zipComponent = {
        registerZipComponent: registerZipComponent,
        updateLiveInUsWarning: updateLiveInUsWarning
    };

}(window.app = window.app || {}, jQuery));

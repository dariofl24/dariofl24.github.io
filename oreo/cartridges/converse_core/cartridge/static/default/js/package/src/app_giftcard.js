(function(app, $) {
    var availablePhysicalVariants;

    function getErrorMessage(formErrors) {
        if (formErrors.formFields === null) {
            return formErrors.errorMessage;
        }

        var buffer = [];

        for (var key in formErrors.formFields) {
            if (formErrors.formFields.hasOwnProperty(key)) {
                var item = formErrors.formFields[key];

                if (item) {
                    buffer.push(item.errorMessage);
                }
            }
        }

        return buffer.join('\n');
    }

    function setAvailablePhysicalVariants(json) {
        availablePhysicalVariants = json;
    }

    function getAvailablePhysicalVariants() {
        return availablePhysicalVariants;
    }

    app.giftcard = {
        init: function() {
            app.minicart.init();
            app.giftcardPhysical.init();
            app.giftcardElectronic.init();
            app.giftcardCheckBalance.init();
        }, 
        getErrorMessage: getErrorMessage,
        setAvailablePhysicalVariants: setAvailablePhysicalVariants,
        getAvailablePhysicalVariants: getAvailablePhysicalVariants
    };

}(window.app = window.app || {}, jQuery));

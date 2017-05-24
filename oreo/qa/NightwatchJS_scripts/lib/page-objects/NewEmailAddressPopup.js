
module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var newEmailAddressFieldId = 'dwfrm_newemailaddress_email';

    var css = { };
    css.popupClose = '.close-button';

    return {
        closePopupIfExists : function() {
            return browser
                .infoLog('[NewEmailAddressPopup] - Close Pop Up If Exists')
                .elementActive(function (result) {
                    browser.elementIdAttribute(result.value.ELEMENT, 'id', function(idAttribute){
                        if(idAttribute.value == newEmailAddressFieldId) {
                            browser
                                .infoLog('[NewEmailAddressPopup] - Closing new email Pop Up')
                                .useCss()
                                .waitForElementVisible(css.popupClose, timeout)
                                .click(css.popupClose)
                        }
                    });
                });
        }

    }
};
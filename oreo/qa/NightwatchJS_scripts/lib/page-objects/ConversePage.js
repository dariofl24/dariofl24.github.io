/**
 * Created by vesteban on 4/22/15.
 */

var TKUtil = require('../util/TKUtil');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};
    css.primaryLogo = '.primary-logo>a';

    var dwUrl = TKUtil.getConverseStorefrontURL(browser.globals);

    return {
        goToConverse : function() {
            return browser
                .infoLog('[ConversePage] - Going to converse storefront')
                .infoLog('[ConversePage] - URL : ' + dwUrl)
                .url(dwUrl)
                .useCss()
                .waitForElementVisible('body', timeout)
                .maximizeWindow()
                .page.NewEmailAddressPopup().closePopupIfExists();
        },
        switchBackToConverseWindow : function() {
            return browser
                .infoLog('[ConversePage] - Switching Back to Converse Window')
                .windowHandles(function(windowHandles) {
                    // Assuming that the handles are in the same order as the windows were open
                    browser.switchWindow(windowHandles.value[0]);
                });
        },
        goToHomePage : function() {
            browser
                .infoLog('[ConversePage] - Going to Home Page')
                .click(css.primaryLogo)
                .pause(2500);
            return browser;
        }
    };
};

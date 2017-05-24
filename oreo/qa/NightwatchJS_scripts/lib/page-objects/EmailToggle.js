/**
 * Created by gledesma on 09/13/16.
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};
    css.emailDiv = '#new-email-addresses-container'
    css.closeButton = '.mfp-close'

    return {
        closeEmailToggle : function (){
            return browser
                .infoLog('[Email Toggle] - If email toggle present: close toggle')
                .useCss()
                .element('css selector', css.emailDiv, function(result) {
                    if (result.value && result.value.ELEMENT){
                        browser
                            .waitForElementVisible(css.closeButton, timeout)
                            .click(css.closeButton);
                    }
                });
        }
    };
};
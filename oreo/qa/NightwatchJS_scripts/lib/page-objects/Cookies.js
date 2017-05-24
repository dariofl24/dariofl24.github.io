/**
 * Created by esanchez on 09/08/15.
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};
    css.acceptButton = '.button.accept-button'

    return {
        acceptCookies : function (){
            return browser
                .infoLog('[Cookies] - Accept cookies')
                .useCss()
                .element('css selector', css.acceptButton, function (result) {
                    if (result.value && result.value.ELEMENT){
                        browser
                            .waitForElementVisible(css.acceptButton, timeout)
                            .click(css.acceptButton);
                    }
                });
        }
    };
};
/**
 * Created by gledesma on 9/02/16
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    css.transaction = {};
    css.transaction.confirmation = {};
    css.transaction.confirmation.Button = '.pps-button';

    return {
        transactionConfirmation : function() {
            return browser
                .infoLog('[IdealSite] - Transaction Confirmation')
                .useCss()
                .click(css.transaction.confirmation.Button);
        }
    };
};

/**
 * Created by gledesma on 8/17/16
 */

var AccountTestData  = require('../testdata/AccountTestData');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    css.payment = {};
    css.payment.login = {};
    css.payment.login.UserID = '#BackendFormLOGINNAMEUSERID';
    css.payment.login.PIN = '#BackendFormUSERPIN';
    css.payment.login.nextButton = '.large.button';
    css.payment.login.bank = '#MultipaysSessionSenderBankCode_999';

    css.account = {};
    css.account.selection = '#MultipaysSessionSenderAccountNumberTechnical23456789';
    css.account.BIC = '#MultipaysSessionSenderBankCode';
    css.account.TAN = '#BackendFormTan'

    css.transaction = {};
    css.transaction.confirmation = {};
    css.transaction.confirmation.TAN = '#BackendFormTAN';

    return {
        loginToSofortPayment : function() {
            var sofortPaymentCredentials = {};
            sofortPaymentCredentials.userID = browser.globals.sofort.payment.userID;
            sofortPaymentCredentials.PIN = browser.globals.sofort.payment.PIN;

            return browser
                .infoLog('[SofortSite] - Login to Sofort Payment EMEA')
                .useCss()
                .waitForElementVisible(css.payment.login.UserID, timeout)
                .clearValue(css.payment.login.UserID)
                .setValue(css.payment.login.UserID, sofortPaymentCredentials.userID)
                .clearValue(css.payment.login.PIN)
                .setValue(css.payment.login.PIN, sofortPaymentCredentials.PIN)
                .click(css.payment.login.nextButton);
        },
        bankSelection : function() {
            return browser
                .infoLog('[SofortSite] - Bank Selection')
                .useCss()
                .waitForElementVisible(css.payment.login.bank, timeout)
                .click(css.payment.login.bank)
                .click(css.payment.login.nextButton);
        },
        bankBic : function() {
            var sofortPaymentCredentials = {};
            sofortPaymentCredentials.BIC = browser.globals.sofort.payment.BIC;

            return browser
                .infoLog('[SofortSite] - Enter BIC')
                .useCss()
                .waitForElementVisible(css.account.BIC, timeout)
                .setValue(css.account.BIC, sofortPaymentCredentials.BIC)
                .click(css.payment.login.nextButton);
        },
        accountSelection : function() {
            return browser
                .infoLog('[SofortSite] - Account Selection')
                .useCss()
                .waitForElementVisible(css.account.selection, timeout)
                .click(css.account.selection)
                .click(css.payment.login.nextButton);
        },
        transactionConfirmation : function() {
            var sofortPaymentCredentials = {};
            sofortPaymentCredentials.TAN = browser.globals.sofort.payment.TAN;

            return browser
                .infoLog('[SofortSite] - Transaction Confirmation')
                .useCss()
                .element('css selector', css.transaction.confirmation.TAN, function(result){
                    if (result.value.ELEMENT) {
                        browser.setValue(css.transaction.confirmation.TAN, sofortPaymentCredentials.TAN)
                    }else {
                        browser.setValue(css.account.TAN, sofortPaymentCredentials.TAN)
                    }
                 })
                .click(css.payment.login.nextButton);
        },
        reviewInformationUS : function() {
            return browser
                .infoLog('[PayPalSite] - Review Information Us')
                .useCss()
                .waitForElementVisible(css.payment.inforeview.continueBtnUs, timeout)
                .click(css.payment.inforeview.continueBtnUs);
        }
    };
};

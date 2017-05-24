/**
 * Created by vesteban on 5/27/15.
 */

var AccountTestData  = require('../testdata/AccountTestData');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var payPalSiteUrl = browser.globals.paypal.developerSite.url;
    var payPalWindowName = 'PayPal';

    var css = {};

    css.site = {};
    css.site.login = {};
    css.site.login.iframe = '#injectedUnifiedLogin>iframe';
    css.site.login.link = 'a.dx-auth-login';
    css.site.login.email = '#email';
    css.site.login.password = '#password';
    css.site.login.submitButton  = '#btnLogin';

    css.site.developerName = '.dx-auth-username';

    css.payment = {};
    css.payment.login = {};
    css.payment.login.email = '#login_email';
    css.payment.login.password = '#login_password';
    css.payment.login.submitButton = '#submitLogin';
    css.payment.login.emailUS = '#email';
    css.payment.login.passwordUS = '#password';
    css.payment.login.submitButtonUS = '#btnLogin';
    css.payment.login.section = '#loadLogin';
    //css.payment.login.title = '#loginTitle';
    css.payment.login.title = '#main xo-title';
    css.payment.login.signInLink = 'a.textLink'

    css.payment.ecdpolicy = {};
    css.payment.ecdpolicy.agreeCheckbox = '#esignOpt';
    css.payment.ecdpolicy.agreeContinueBtn = 'input[type="submit"][name="agree_submit.x"]';

    css.payment.inforeview = {};
    css.payment.inforeview.shippingAddress = '#reviewModule > div.body.clearfix > div:nth-child(3) > div:nth-child(1) > div';
    //css.payment.inforeview.continueBtn = '#continue_abovefold';
    css.payment.inforeview.continueBtn = '#confirmButtonTop';
    css.payment.inforeview.continueBtnUs = '#confirmButtonTop';
    css.payment.inforeview.emailError = 'div.ng-binding';

    return {
        openPayPalDeveloperSiteInNewWindow : function() {
            return browser
                .infoLog('[PayPalSite] - Go To PayPal Site on a new Window')
                .openBrowser(payPalSiteUrl, payPalWindowName)
                .maximizeWindow();
        },
        loginToPayPalDeveloperSite : function() {
            var payPalDeveloperCredentials = {};
            payPalDeveloperCredentials.email = browser.globals.paypal.developerSite.email;
            payPalDeveloperCredentials.password = browser.globals.paypal.developerSite.password;

            return browser
                .infoLog('[PayPalSite] - Login To PayPal Developer Site')
                .useCss()
                .waitForElementPresent(css.site.login.link, timeout)
                .clickOnLink(css.site.login.link)
                .waitForElementVisible(css.site.login.email, timeout)
                .clearValue(css.site.login.email)
                .setValue(css.site.login.email, payPalDeveloperCredentials.email)
                .clearValue(css.site.login.password)
                .setValue(css.site.login.password, payPalDeveloperCredentials.password)
                .click(css.site.login.submitButton)
                .waitForElementVisible(css.site.developerName, timeout)
                .assert.containsText(css.site.developerName, 'Converse');
        },
        fillEmailPayPal : function() {
             var payPalPaymentCredentials = {};
             payPalPaymentCredentials.email = browser.globals.paypal.payment.email;
             payPalPaymentCredentials.password = browser.globals.paypal.payment.password;

             return browser
                 .infoLog('[PayPalSite] - Fill PayPal Email')
                 .useCss()
                 .frame("injectedUl")
                 .clearValue(css.payment.login.emailUS)
                 .setValue(css.payment.login.emailUS, payPalPaymentCredentials.email)
                 .clearValue(css.payment.login.passwordUS)
                 .setValue(css.payment.login.passwordUS, payPalPaymentCredentials.password)
                 .click(css.payment.login.submitButtonUS)
                 .frameParent();
        },
        loginToPayPalPayment : function() {
            var payPalPaymentCredentials = {};
            payPalPaymentCredentials.email = browser.globals.paypal.payment.email;
            payPalPaymentCredentials.password = browser.globals.paypal.payment.password;

            return browser
                .infoLog('[PayPalSite] - Login to PayPal Payment EMEA')
                .useCss()
                .waitForElementVisible(css.payment.login.title, timeout, function(){
                    browser.element('css selector', css.payment.login.signInLink, function(result){
                        if (result.value && result.value.ELEMENT){
                            browser.click(css.payment.login.signInLink);
                        }
                    browser.waitForElementVisible(css.site.login.iframe, timeout)
                    })

                })
                .frame("injectedUl")
                .waitForElementVisible(css.payment.login.emailUS, timeout, function(){
                    browser.clearValue(css.payment.login.emailUS)
                    browser.setValue(css.payment.login.emailUS, payPalPaymentCredentials.email)
                    browser.clearValue(css.payment.login.passwordUS)
                    browser.setValue(css.payment.login.passwordUS, payPalPaymentCredentials.password)
                })
                .waitForElementVisible(css.payment.login.submitButtonUS, timeout, function(){
                    browser.click(css.payment.login.submitButtonUS)
                })
                .frameParent();
        },
        loginToPayPalPaymentUS : function() {
            var payPalPaymentCredentials = {};
            payPalPaymentCredentials.email = browser.globals.paypal.payment.email;
            payPalPaymentCredentials.password = browser.globals.paypal.payment.password;

            return browser
                .infoLog('[PayPalSite] - Login to PayPal Payment US')
                .useCss()
                .waitForElementVisible(css.site.login.iframe, timeout)
                .frame(0)
                .waitForElementVisible(css.payment.login.emailUS, timeout)
                .clearValue(css.payment.login.emailUS)
                .setValue(css.payment.login.emailUS, payPalPaymentCredentials.email)
                .clearValue(css.payment.login.passwordUS)
                .setValue(css.payment.login.passwordUS, payPalPaymentCredentials.password)
                .click(css.payment.login.submitButtonUS)
                .frameParent();
        },
        acceptECDPolicy : function() {
            return browser
                .infoLog('[PayPalSite] - Accept ECD Policy')
                .useCss()
                .waitForElementVisible(css.payment.ecdpolicy.agreeCheckbox, timeout)
                .setCheckboxValue(css.payment.ecdpolicy.agreeCheckbox, true)
                .click(css.payment.ecdpolicy.agreeContinueBtn);
        },
        reviewInformation : function() {
            return browser
                .infoLog('[PayPalSite] - Review Information')
                .useCss()
                .waitForElementVisible(css.payment.inforeview.continueBtn, timeout, function(){
                    browser.click(css.payment.inforeview.continueBtn)
                })
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

/**
 * Created by vesteban on 4/23/15.
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    css.loginMenu = ".login";
    css.inputUserField = ".username-input";
    css.inputPasswordField = ".password-input";
    css.rememberMe = "#dwfrm_login_rememberme";
    css.loginButton = "#login-btn";

    css.createAccountButton = "#create-account-btn";
    css.inputEmailField = "#dwfrm_profile_customer_email";
    css.inputPasswordRegisterField = "#dwfrm_profile_login_password";
    css.genderMaleRadio = "#gender-input-male";
    css.confirmPasswordField = "#dwfrm_profile_login_passwordconfirm";
    css.loginNewsletter  = "#dwfrm_profile_login_newsletter";
    css.submitButton = "#register-btn";

    css.ageRadioButton = "#dwfrm_profile_login_ageconfirm"
    css.ageLabel = "dwfrm_profile_login_ageconfirm"

    css.loggedInIcon = ".logout";
    css.createAnAccountButton = "#checkout-create-account-btn"


    return {
        loginToSite : function(account, rememberMe) {
            return browser
                .infoLog('[Login] - Login to Site. User: ', account.getEmail())
                .useCss()
                .waitForElementVisible(css.loginMenu, timeout)
                .click(css.loginMenu)
                .waitForElementVisible(css.loginButton, timeout)
                .click(css.inputUserField)
                .setValue(css.inputUserField, account.getEmail())
                .click(css.inputPasswordField)
                .setValue(css.inputPasswordField, account.getPassword())
                .click(css.rememberMe)
                .click(css.loginButton)
                .waitForElementNotPresent(css.loginMenu, timeout);
        },
        createAccount : function(account) {
            return browser
                .infoLog('[Login] - Creating Account. User: ' + account.getEmail())
                .useCss()
                .waitForElementVisible(css.loginMenu, timeout)
                .click(css.loginMenu)
                .waitForElementVisible(css.createAccountButton, timeout)
                .click(css.createAccountButton)
                .waitForElementVisible(css.inputEmailField, timeout)
                .click(css.inputEmailField)
                .setValue(css.inputEmailField, account.getEmail())
                .click(css.inputPasswordRegisterField)
                .setValue(css.inputPasswordRegisterField, account.getPassword())
                .click(css.confirmPasswordField)
                .setValue(css.confirmPasswordField, account.getPassword())
                .click(css.genderMaleRadio)
                .assert.visible(css.ageRadioButton)
                .click('[for="'+css.ageLabel+'"]')
                .click(css.loginNewsletter)
                .click(css.submitButton)
                .waitForElementVisible(css.loggedInIcon, timeout);
        },
        createAccountFromCheckout : function(account){
            return browser
                //.infoLog('[Login] - Creating Account.)
                .useCss()
                .click(css.createAnAccountButton)
                .waitForElementVisible(css.inputEmailField, timeout)
                .click(css.inputEmailField)
                .waitForElementVisible(css.inputPasswordRegisterField, timeout)
                .click(css.inputPasswordRegisterField)
                .setValue(css.inputPasswordRegisterField, account.getPassword())
                .click(css.confirmPasswordField)
                .setValue(css.confirmPasswordField, account.getPassword())
                .click(css.genderMaleRadio)
                .assert.visible(css.ageRadioButton)
                .click('[for="'+css.ageLabel+'"]')
                .click(css.loginNewsletter)
                .click(css.submitButton)
                .waitForElementVisible(css.loggedInIcon, timeout);
        }
    };
};
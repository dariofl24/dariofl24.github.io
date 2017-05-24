/**
 * Created by vesteban on 4/23/15.
 */

var Account = require('../model/Account');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    css.accountInfoBox = '#account-info-box';
    css.accountSettings = 'li.first > a';
    css.profileView = '#profile-view';

    css.firstName = '#dwfrm_profile_customer_firstname';
    css.lastName = '#dwfrm_profile_customer_lastname';
    css.email = '#profileCustomerEmail';
    css.dateOfBirth = '#profileCustomerDOB';
    css.zipCode = '#dwfrm_profile_customer_regional_zip';
    css.gender = '[name="dwfrm_profile_customer_gender"]';

    var xpath = {};

    xpath.accountSettings = '//*[@id="header"]/header/div[3]/ul/li[1]/a';
    xpath.ordersProducts = "//li[@class='order-history-product']"
    xpath.myOrders = "//ul[@class='account-box visible active']/li[3]"
    xpath.orderNumberAccount = "//div[@class='order-mini-info']/div[2]/span[2]"
    xpath.logOut = "//a[@id='logout-link']"
    xpath.addressInput = "//input[@id='dwfrm_profile_address_addressid']"
    xpath.firstNameInput = "//input[@id='dwfrm_profile_customer_firstname']"

    return {
        goToAccount : function() {
            return browser
                .infoLog('[Account] - Go To Account')
                .useCss()
                .waitForElementVisible(css.accountInfoBox, timeout)
                .pause(500)
                .click(css.accountInfoBox)
                .waitForElementVisible(css.accountSettings, timeout)
                .click(css.accountSettings)
                .waitForElementVisible(css.profileView, timeout);
        },
        goToAccountMyOrders : function() {
            return browser
                .infoLog('[Account] - Go To Account- My Orders')
                //.useXpath()
                //.waitForElementVisible(xpath.addressInput, timeout)
                .useCss()
                .waitForElementVisible(css.accountInfoBox, timeout)
                .click(css.accountInfoBox)
                .useXpath()
                .waitForElementVisible(xpath.myOrders, timeout)
                .click(xpath.myOrders)
                .waitForElementVisible(xpath.ordersProducts, timeout);
        },
        clickOnAddress: function() {
            return browser
                .useXpath()
                .waitForElementVisible(xpath.addressInput, timeout);
        },
        clickOnFirstName: function() {
             return browser
                 .useXpath()
                 .waitForElementVisible(xpath.firstNameInput, timeout);
         },
        getOrderNumberFromMyAccount : function(callback){
            return browser
                .useXpath()
                .waitForElementVisible(xpath.orderNumberAccount, timeout)
                .getText(xpath.orderNumberAccount, function(result){
                    browser.infoLog("Order Number: " + result.value)
                    callback(result.value);
                });
        },
        logOut : function() {
            browser
                .infoLog('[Account] - Log Out')
                .useCss()
                .waitForElementVisible(css.accountInfoBox, timeout, function(){
                    browser.click(css.accountInfoBox)
                    browser.useXpath()
                    browser.waitForElementVisible(xpath.logOut, timeout, function(){
                        browser.click(xpath.logOut)
                    })
                })
        },
        getDisplayedAccount : function() {
            browser.waitForElementPresent(css.firstName, timeout);
            return new Account(
                browser.getValue(css.firstName),
                browser.getValue(css.lastName),
                browser.getValue(css.email),
                browser.getValue(css.dateOfBirth),
                browser.getValue(css.zipCode),
                browser.getValue(css.gender)
            );
        },
        getDisplayedAccountEmea : function() {
            browser.waitForElementPresent(css.firstName, timeout);
            return new Account(
                browser.getValue(css.firstName),
                browser.getValue(css.lastName),
                browser.getValue(css.email),
                browser.getValue(css.gender)
            );
        }
    };
};
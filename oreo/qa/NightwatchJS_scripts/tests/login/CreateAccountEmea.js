/**
 * Created by gledesma on 8/10/16.
 */

var AccountTestData = require('../../lib/testdata/AccountTestData');

module.exports = {
    tags: ['regression', 'register'],
    before : function(browser) {
        // Line below is necessary to construct xpath correctly when selecting category, it let us know if we are in the US site or not
        browser.globals.dw.lang = "";
        browser
            .infoLog('Setting Up...')
            .timeoutsImplicitWait(15000)
            .resizeWindow(1250, 900)
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
            .page.Cookies().acceptCookies();
    },

    after : function(browser) {
        browser
            .infoLog('Closing Down...')
            .end();
    },
    'Register user in UK' : function(browser) {
        var validAccount = AccountTestData.generateAccount(browser.globals.locales.germany.country_code);
        browser
            .page.EmailToggle().closeEmailToggle()
            .page.Login().createAccount(validAccount)
            .page.Account().goToAccount()
            .verify.isAccountDisplayed(validAccount, browser.globals.locales.germany.country_code)
            .page.Account().logOut();
    },
    /*'Register user in UK after Checkout' : function(browser) {
        var validAccount = AccountTestData.generateAccount(browser.globals.locales.germany.country_code);
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
            .page.Checkout().normalCheckoutOnRandomProduct()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.uk.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumberFromCheckout(function(orderNumberCheckout){
                browser
                    .verify.isOrderComplete(browser.globals.locales.uk.english.lang)
                    .page.Login().createAccountFromCheckout(validAccount)
                    .page.Account().clickOnAddress()
                    //.page.Account().goToAccount()
                    //.page.Account().clickOnFirstName()
                    .page.Account().goToAccountMyOrders()
                    .page.Account().getOrderNumberFromMyAccount(function(orderNumberAccount){
                            browser.assert.equal(orderNumberCheckout, orderNumberAccount, "Order was saved to My Account")
                            browser.page.Account().logOut();
                    })
            })
    },*/
    'Register user in Germany' : function(browser) {
        var validAccount = AccountTestData.generateAccount(browser.globals.locales.germany.country_code);
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.germany.english.localized_homepage)
            .page.EmailToggle().closeEmailToggle()
            .page.Login().createAccount(validAccount)
            .page.Account().goToAccount()
            .verify.isAccountDisplayed(validAccount, browser.globals.locales.germany.country_code);
    },
    'Register user in France' : function(browser) {
        var validAccount = AccountTestData.generateAccount(browser.globals.locales.france.country_code);
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.france.english.localized_homepage)
            .page.Login().createAccount(validAccount)
            .page.Account().goToAccount()
            .verify.isAccountDisplayed(validAccount, browser.globals.locales.france.country_code);
    }
};
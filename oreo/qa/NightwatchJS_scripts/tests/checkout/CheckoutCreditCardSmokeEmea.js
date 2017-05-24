/**
 * Created by gledesma on 8/15/16.
 */

var AccountTestData = require('../../lib/testdata/AccountTestData');

module.exports = {
    //tags: ['checkout', 'creditcard', 'regression'],
    tags: ['Smoke'],
    beforeEach : function(browser) {
        // Line below is necessary to construct xpath correctly when selecting category, it let us know if we are in the US site or not
        browser.globals.dw.lang = "";
        browser
            .infoLog('Setting Up...')
            .timeoutsImplicitWait(15000)
            .resizeWindow(1250, 900)
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage);
    },
    'Normal Checkout searching for specific product, pay with a Valid Credit Card' : function(browser) {
        browser
            .page.Cookies().acceptCookies()
            .page.EmailToggle().closeEmailToggle()
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.uk.country_name)
            .assert.shippingMethodMatchesInOrder()
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.uk.english.lang);
    },
    'Normal Checkout searching for specific product, try to pay with an Invalid Credit Card' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().tryToPayWithInvalidCreditCardEmea(browser.globals.locales.uk.country_name)
            .verify.invalidCreditCard();
    },
    'Normal Checkout selecting a random product from PLP, pay with a Valid Credit Card' : function(browser) {
        browser
            .page.Checkout().normalCheckoutOnRandomProduct()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.uk.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.uk.english.lang);
    },
    'Normal Checkout selecting a random product from PLP, provide invalid address for Credit Card' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardAndInvalidBillingAddressEmea(browser.globals.locales.uk.country_name)
            .verify.isInvalidBillingAddress()
            .page.Cart().emptyCart();
    },
    'Register Checkout selecting a specific product, pay with a Valid Credit Card' : function(browser) {
        var validAccount = AccountTestData.generateAccount(browser.globals.locales.germany.country_code);
        browser
            .page.Login().createAccount(validAccount)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.uk.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.uk.english.lang)
            .page.Cart().emptyCart()
            .page.Account().logOut();
    },
    /*'Normal Checkout selecting a random product from PLP, use same Address for Shipping and Billing' : function(browser) {
        browser
            .page.Checkout().normalCheckoutOnRandomProduct()
            .page.Checkout().payWithValidCreditCardSameAddressForShippingAndBillingEmea()
            .verify.shippingAndBillingAddressesMatch()
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.uk.english.lang);
    },*/
    after : function(browser) {
        browser.globals.dw.lang = "";
        browser
            .infoLog('Closing down...')
            .end();
    }
};
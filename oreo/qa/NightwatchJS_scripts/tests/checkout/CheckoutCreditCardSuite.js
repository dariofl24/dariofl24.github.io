/**
 * Created by vesteban on 4/27/15.
 */

module.exports = {
    //tags: ['checkout', 'creditcard', 'regression'],
    tags: ['US'],
    beforeEach : function(browser) {
        browser.globals.dw.lang = "en_US";
        browser
            .infoLog('Setting Up...')
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.usa.english.localized_homepage)
            .page.ConversePage().goToConverse()
            .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.usa.english.lang)
    },
    'Normal Checkout searching for specific product, pay with a Valid Credit Card' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCard()
            .assert.shippingMethodMatchesInOrder()
            .page.OrderPreview().placeOrder()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete();
    },
    'Normal Checkout searching for specific product, try to pay with an Invalid Credit Card' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().tryToPayWithInvalidCreditCard()
            .verify.invalidCreditCard();
    },
    'Normal Checkout selecting a random product from PLP, pay with a Valid Credit Card' : function(browser) {
        browser
            .page.Checkout().normalCheckoutOnRandomProduct()
            .page.Checkout().payWithValidCreditCard()
            .page.OrderPreview().placeOrder()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete();
    },
    'Normal Checkout selecting a random product from PLP, provide invalid address for Credit Card' : function(browser) {
        browser
            .page.Checkout().normalCheckoutOnRandomProduct()
            .page.Checkout().payWithValidCreditCardAndInvalidBillingAddress()
            .verify.isInvalidBillingAddress();
    },
    'Normal Checkout selecting a random product from PLP, use same Address for Shipping and Billing' : function(browser) {
        browser
            .page.Checkout().normalCheckoutOnRandomProduct()
            .page.Checkout().payWithValidCreditCardSameAddressForShippingAndBilling()
            .verify.shippingAndBillingAddressesMatch()
            .page.OrderPreview().placeOrder()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete();
    },
    after : function(browser) {
        browser.globals.dw.lang = "";
        browser
            .infoLog('Closing down...')
            .end();
    }
};
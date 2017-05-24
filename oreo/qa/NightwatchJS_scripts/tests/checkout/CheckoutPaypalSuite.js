/**
 * Created by vesteban on 5/27/15.
 */

module.exports = {
    //tags: ['checkout', 'paypal', 'regression'],
    tags: ['US'],
    before : function(browser) {
        browser.globals.dw.lang = "en_US";
        browser
            .infoLog('Setting Up Suite...')
            .timeoutsImplicitWait(10000)
            .page.ConversePage().goToConverse()
            .page.LanguageSelector().selectCountryLanguage(browser.globals.dw.lang);
    },
    'PayPal Checkout on Random Product' : function(browser) {
        browser
            .page.Checkout().payPalCheckoutOnRandomProduct()
            .page.PayPalSite().loginToPayPalPaymentUS()
            .page.PayPalSite().reviewInformationUS()
            .page.Shipping().saveShippingInformation()
            .page.Payment().savePaymentInformation()
            .page.OrderPreview().placeOrder()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete();
    },
    'Normal Checkout searching for specific product, try to pay with PayPal' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Shipping().fillAndSaveTKSFShippingInformation()
            .page.Payment().selectPayPalMethod()
            .page.Payment().savePaymentInformation()
            .page.PayPalSite().reviewInformationUS()
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
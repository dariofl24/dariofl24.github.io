/**
 * Created by esanchez on 10/12/15.
 */

module.exports = {
    tags: ['checkout', 'invoice', 'regression'],
    before : function(browser) {
        // Line below is necessary to construct xpath correctly when selecting category, it let us know if we are in the US site or not
        browser.globals.dw.lang = "";
        browser
            .infoLog('Setting Up...')
            .timeoutsImplicitWait(15000)
            .resizeWindow(1250, 900)
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.germany.german.localized_homepage)
            .page.Cookies().acceptCookies();
    },
    'Normal Germany Invoice Checkout' : function(browser) {
        browser
            .page.EmailToggle().closeEmailToggle()
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithInvoice("Germany")
            .page.OrderPreview().placeOrderEmea()
            .verify.isOrderComplete("de_DE");
    },
    'Normal Netherlands Invoice Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.netherlands.dutch.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithInvoice("Netherlands")
            .page.OrderPreview().placeOrderEmea()
            .verify.isOrderComplete('nl_NL');
    },
    after : function(browser) {
        browser
            .infoLog('Closing down...')
            .end();
    }
};
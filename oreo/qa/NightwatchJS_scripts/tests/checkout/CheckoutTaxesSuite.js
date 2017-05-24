/**
 * Created by vesteban on 6/3/15.
 */

module.exports = {
    //tags: ['checkout', 'taxes', 'regression'],
    tags: ['US'],
    beforeEach: function (browser) {
        browser
            .infoLog('Setting Up...')
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.usa.english.localized_homepage)
            .page.ConversePage().goToConverse()
            .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.usa.english.lang)
            .page.Cart().viewCart()
            .page.Cart().emptyCart();
    },
    'Verify Taxes for total over 100 dlls in Los Angeles' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Shipping().fillValidLosAngelesShippingInformation()
            .page.Shipping().saveShippingInformation()
            .verify.salesTaxIsCorrect()
    },
    'Verify Taxes for total over 100 dlls in Miami' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Shipping().fillValidMiamiShippingInformation()
            .page.Shipping().saveShippingInformation()
            .verify.salesTaxIsCorrect()
    },
    'Verify Taxes for total over 100 dlls in New York' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Shipping().fillValidNewYorkShippingInformation()
            .page.Shipping().saveShippingInformation()
            .verify.salesTaxIsCorrect()
    },
    'Verify Taxes for total over 100 dlls in Redmond' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Shipping().fillValidRedmondShippingInformation()
            .page.Shipping().saveShippingInformation()
            .verify.salesTaxIsCorrect()
    },
    after: function (browser) {
        browser
            .infoLog('Closing down...')
            .end();
    }
}
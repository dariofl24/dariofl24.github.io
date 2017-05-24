/**
 * Created by gledesma on 8/17/16
 */

module.exports = {
    tags: ['checkout', 'regression'],
    before : function(browser) {
        browser
            .infoLog('Setting Up...')
            .timeoutsImplicitWait(15000)
            .resizeWindow(1250, 900)
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.belgium.english.localized_homepage)
            .page.Cookies().acceptCookies();
    },
    'Belgium Sofort Checkout On Random Product' : function(browser) {
        browser
            .page.EmailToggle().closeEmailToggle()
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithSofort("Belgium")
            .page.OrderPreview().placeOrderEmea()
            .page.SofortSite().bankSelection()
            .page.SofortSite().loginToSofortPayment()
            .page.SofortSite().accountSelection()
            .page.SofortSite().transactionConfirmation()
            .verify.isOrderComplete(browser.globals.locales.belgium.english.lang);
    },
    'Normal German Sofort Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.germany.german.localized_homepage)
            .page.EmailToggle().closeEmailToggle()
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithSofort("Germany")
            .page.OrderPreview().placeOrderEmea()
            .page.SofortSite().bankBic()
            .page.SofortSite().loginToSofortPayment()
            .page.SofortSite().accountSelection()
            .page.SofortSite().transactionConfirmation()
            .verify.isOrderComplete(browser.globals.locales.germany.german.lang);
    },
    after : function(browser) {
        browser
            .infoLog('Closing down...')
            .end();
    }
};
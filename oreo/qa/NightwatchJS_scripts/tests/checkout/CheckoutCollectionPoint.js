/**
 * Created by gledesma on 02/16/17.
 */

module.exports = {
    tags: ['checkout', 'regression'],
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
    'PUP Germany Checkout' : function(browser) {
        browser
            .page.EmailToggle().closeEmailToggle()
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidPUPEmea(browser.globals.locales.germany.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.germany.german.lang);
    },
    'PUP France Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.france.french.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidPUPEmea(browser.globals.locales.france.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.france.french.lang);
    },
    'PUP Netherlands Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.netherlands.dutch.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidPUPEmea(browser.globals.locales.netherlands.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.netherlands.dutch.lang);
    },
    after : function(browser) {
        browser
            .saveScreenshot(browser.globals.staging.dw.screenshot_path + 'screenshot' + Date() + '.png')
            .infoLog('Closing down...')
            .end();
    }
};
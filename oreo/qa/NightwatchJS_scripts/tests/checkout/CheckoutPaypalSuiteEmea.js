/**
 * Created by esanchez on 17/10/15.
 */

module.exports = {
    tags: ['checkout', 'paypal', 'regression'],
    before : function(browser) {
        // Line below is necessary to construct xpath correctly when selecting category, it let us know if we are in the US site or not
        browser.globals.dw.lang = "";
        browser
            .infoLog('Setting Up Suite...')
            .timeoutsImplicitWait(15000)
            .resizeWindow(1250, 900)
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.germany.german.localized_homepage)
            .page.Cookies().acceptCookies();
    },
    'PayPal Checkout on Random Product Germany' : function(browser) {
        browser
            .page.EmailToggle().closeEmailToggle()
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithPaypalEmea(browser.globals.locales.germany.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.PayPalSite().loginToPayPalPayment()
            .page.PayPalSite().reviewInformation()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.germany.german.lang);
    },
    'PayPal Checkout on Random Product France' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.france.french.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithPaypalEmea(browser.globals.locales.france.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.PayPalSite().loginToPayPalPayment()
            .page.PayPalSite().reviewInformation()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.france.french.lang);
    },
    /*'PayPal Checkout on Random Product UK' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
            .page.Checkout().normalCheckoutOnRandomProduct()
            .page.Checkout().payWithPaypalEmea(browser.globals.locales.uk.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.PayPalSite().loginToPayPalPayment()
            .page.PayPalSite().reviewInformation()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.uk.english.lang)
    },*/
    'PayPal Checkout on Random Product Belgium' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.belgium.english.localized_homepage)
            .page.EmailToggle().closeEmailToggle()
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithPaypalEmea(browser.globals.locales.belgium.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.PayPalSite().loginToPayPalPayment()
            .page.PayPalSite().reviewInformation()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.belgium.english.lang);
    },
    'PayPal Checkout on Random Product Spain' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.spain.spanish.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithPaypalEmea(browser.globals.locales.spain.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.PayPalSite().loginToPayPalPayment()
            .page.PayPalSite().reviewInformation()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.spain.spanish.lang);
    },
    'PayPal Checkout on Random Product Netherlands' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.netherlands.dutch.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithPaypalEmea(browser.globals.locales.netherlands.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.PayPalSite().loginToPayPalPayment()
            .page.PayPalSite().reviewInformation()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.netherlands.dutch.lang);
    },
    'PayPal Checkout on Random Product Italy' : function(browser) {
        browser.globals.dw.lang = "en_IT";
        browser.globals.dw.localized_homepage = "/s/converse-it/en/go";
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.italy.italian.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithPaypalEmea(browser.globals.locales.italy.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.PayPalSite().loginToPayPalPayment()
            .page.PayPalSite().reviewInformation()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.italy.italian.lang);
    },
    after : function(browser) {
        browser
            .saveScreenshot(browser.globals.staging.dw.screenshot_path + 'screenshot' + Date() + '.png')
            .infoLog('Closing down...')
            .end();
    }
};
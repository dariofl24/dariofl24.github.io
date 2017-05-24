/**
 * Created by esanchez on 10/12/15.
 */

module.exports = {
    tags: ['checkout', 'creditcard', 'regression'],
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
    'Normal Germany Credit Card Checkout' : function(browser) {
        browser
            .page.EmailToggle().closeEmailToggle()
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.germany.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.germany.german.lang);
    },
    'Normal France Credit Card Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.france.french.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.france.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.france.french.lang);
    },
    'France Carte Bancaire Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.france.french.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCarteBancaire(browser.globals.locales.france.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.france.french.lang);
    },
    'France Carte Blue Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.france.french.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCarteBleue(browser.globals.locales.france.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.france.french.lang);
    },
    'Normal UK Credit Card Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.uk.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.uk.english.lang);
    },
    'UK Visa Debit Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidVisaDebit(browser.globals.locales.uk.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.uk.english.lang);
    },
    'Normal Belgium Credit Card Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.belgium.english.localized_homepage)
            .page.EmailToggle().closeEmailToggle()
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.belgium.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.belgium.english.lang);
    },
    'Normal Spain Credit Card Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.spain.spanish.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.spain.country_name)
            .page.OrderPreview().placeOrderEmea()
            .verify.isOrderComplete(browser.globals.locales.spain.spanish.lang);
    },
    'Normal Netherlands Credit Card Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.netherlands.dutch.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.netherlands.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.netherlands.dutch.lang);
    },
    'Ideal Netherlands Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.netherlands.dutch.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidIdeal(browser.globals.locales.netherlands.country_name)
            .page.OrderPreview().placeOrderEmeaIdeal()
            .page.Payment().saveIdealPayment()
            .page.IdealSite().transactionConfirmation()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.netherlands.dutch.lang);
    },
    'Normal Italy Credit Card Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.italy.italian.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCreditCardEmea(browser.globals.locales.italy.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.italy.italian.lang);
    },
    'Italy CartaSI Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.italy.italian.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidCartaSI(browser.globals.locales.italy.country_name)
            .page.OrderPreview().placeOrderEmea()
            .page.OrderPreview().getOrderNumber()
            .verify.isOrderComplete(browser.globals.locales.italy.italian.lang);
    },
    'Italy PostePay Checkout' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.italy.italian.localized_homepage)
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().payWithValidPostePay(browser.globals.locales.italy.country_name)
            .page.OrderPreview().placeOrderEmea()
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
/**
 * Created by esanchez on 04/11/15.
 */

module.exports = {
     tags: ['navigation', 'smoke'],
     before : function(browser) {
         browser
             .infoLog('Setting Up...')
             .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.germany.german.localized_homepage)
             .page.ConversePage().goToConverse()
             .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.usa.english.lang)
             .page.NewEmailAddressPopup().closePopupIfExists();
             .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
             .page.Cookies().acceptCookies();
     },
     beforeEach : function(browser) {
         browser
             .infoLog('Setting Up Test Case')
             .page.ConversePage().goToHomePage();
     },
     'Verify Categories Have Products US' : function(browser) {
        for (index=0; index<3; index++){
            browser.page.Categories().verifyCategoryHasProducts(index);
        }
     },
     'Verify Categories Have Products Germany' : function(browser) {
        browser
            .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.germany.english.lang)
            //.pause(10000)
            .page.Cookies().acceptCookies();
        for (index=0; index<3; index++){
            browser.page.Categories().verifyCategoryHasProducts(index);
        }
     },
     'Verify Categories Have Products France' : function(browser) {
         browser
             .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.france.english.lang)
             .page.Cookies().acceptCookies();
         for (index=0; index<3; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
     },
    'Verify Categories Have Products UK' : function(browser) {
         browser
             .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.uk.english.lang)
             .page.Cookies().acceptCookies();
         for (index=0; index<3; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
    },
    'Verify Categories Have Products Belgium' : function(browser) {
         browser
             .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.belgium.english.lang)
             .page.Cookies().acceptCookies();
         for (index=0; index<3; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
    },
    'Verify Categories Have Products Netherlands' : function(browser) {
         browser
             .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.netherlands.english.lang)
             .page.Cookies().acceptCookies();
         for (index=0; index<3; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
    },
    'Verify Categories Have Products Spain' : function(browser) {
         browser
             .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.spain.english.lang)
             .page.Cookies().acceptCookies();
         for (index=0; index<3; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
    },
    'Verify Categories Have Products Italy' : function(browser) {
         browser
             .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.italy.english.lang)
             .page.Cookies().acceptCookies();
         for (index=0; index<3; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
    }
 }
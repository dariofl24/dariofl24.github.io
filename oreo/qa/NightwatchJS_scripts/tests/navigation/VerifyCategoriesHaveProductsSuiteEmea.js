/**
 * Created by gledemsa on 08/11/16.
 */

module.exports = {
     tags: ['categories'],
     before : function(browser) {
         browser
             .infoLog('Setting Up...')
             .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
             .page.Cookies().acceptCookies();
     },
     beforeEach : function(browser) {
         browser
             .infoLog('Setting Up Test Case')
             .page.ConversePage().goToHomePage();
     },
     'Verify Categories Have Products UK' : function(browser) {
        browser
             //.pause(10000)
        for (index=0; index<4; index++){
              browser.page.Categories().verifyCategoryHasProducts(index);
        }
     },
     'Verify Categories Have Products Germany' : function(browser) {
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.germany.english.localized_homepage)
            //.pause(10000)
        for (index=0; index<4; index++){
            browser.page.Categories().verifyCategoryHasProducts(index);
        }
     },
     'Verify Categories Have Products France' : function(browser) {
         browser
             .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.france.english.localized_homepage)
             //.pause(10000)
         for (index=0; index<4; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
     },
    'Verify Categories Have Products Belgium' : function(browser) {
         browser
             .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.belgium.english.localized_homepage)
             //.pause(10000)
         for (index=0; index<4; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
    },
    'Verify Categories Have Products Netherlands' : function(browser) {
         browser
             .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.netherlands.english.localized_homepage)
             //.pause(10000)
         for (index=0; index<4; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
    },
    'Verify Categories Have Products Spain' : function(browser) {
         browser
             .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.spain.english.localized_homepage)
             //.pause(10000)
         for (index=0; index<4; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
    },
    'Verify Categories Have Products Italy' : function(browser) {
         browser
             .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.italy.english.localized_homepage)
             //.pause(10000)
         for (index=0; index<4; index++){
             browser.page.Categories().verifyCategoryHasProducts(index);
         }
    },
    after : function(browser) {
         browser.globals.dw.lang = "";
         browser
             .infoLog('Closing down...')
             .end();
    }
 }
/**
 * Created by esanchez on 02/11/15.
 */

var AccountTestData = require('../../lib/testdata/AccountTestData');

module.exports = {
    //tags: ['register'],
    tags: ['US'],
    before : function(browser) {
        browser
            .infoLog('Setting up...')
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.germany.german.localized_homepage)
            .page.ConversePage().goToConverse()
            .page.LanguageSelector().selectCountryLanguage(browser.globals.locales.germany.german.lang)
            .page.Cookies().acceptCookies();
    },

    after : function(browser) {
        browser
            .infoLog('Closing Down...')
            .end();
    },

    'Register user in Germany' : function(browser) {
        var validAccount = AccountTestData.generateAccount(browser.globals.locales.germany.country_code);
        browser
            .page.Login().createAccount(validAccount)
            .page.Account().goToAccount()
            .verify.isAccountDisplayed(validAccount, browser.globals.locales.germany.country_code);
    },
    'Register user in France' : function(browser) {
        var validAccount = AccountTestData.generateAccount(browser.globals.locales.france.country_code);
        browser
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.france.english.localized_homepage)
            .page.LanguageSelector().switchCountryLanguage(browser.globals.locales.france.english.lang)
            .page.Login().createAccount(validAccount)
            .page.Account().goToAccount()
            .verify.isAccountDisplayed(validAccount, browser.globals.locales.france.country_code);
    }
};
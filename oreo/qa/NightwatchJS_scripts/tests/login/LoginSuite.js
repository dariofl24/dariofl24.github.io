/**
 * Created by vesteban on 4/22/15.
 */

var AccountTestData = require('../../lib/testdata/AccountTestData');

module.exports = {
    tags: ['US'],
    before : function(browser) {
        browser
            .infoLog('Setting up...')
            .page.ConversePage().goToConverse()
            .page.LanguageSelector().selectCountryLanguage('en_US')
            .page.Cookies().acceptCookies();
    },

    after : function(browser) {
        browser
            .infoLog('Closing Down...')
            .end();
    },

    'User logs in and go to Account to display personal data' : function(browser) {
        var validAccount = AccountTestData.getValidAccount();
        browser
            .page.Login().loginToSite(validAccount, false)
            .page.Account().goToAccount()
            .verify.isAccountDisplayed(validAccount);
    }
};
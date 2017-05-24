/**
 * Created by gledesma on 8/10/16.
 */

var AccountTestData = require('../../lib/testdata/AccountTestData');

module.exports = {
    tags: ['login'],
    before : function(browser) {
        // Line below is necessary to construct xpath correctly when selecting category, it let us know if we are in the US site or not
        browser.globals.dw.lang = "";
        browser
        .infoLog('Setting Up...')
        .timeoutsImplicitWait(15000)
        .resizeWindow(1250, 900)
        .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
        .page.Cookies().acceptCookies();
    },

    after : function(browser) {
        browser
            .infoLog('Closing Down...')
            .end();
    },

    'User logs in and go to Account to display personal data' : function(browser) {
        var validAccount = AccountTestData.getValidAccountEmea();
        browser
            .page.Login().loginToSite(validAccount, false)
            .page.Account().goToAccount()
            .verify.isAccountDisplayed(validAccount);
    }
};
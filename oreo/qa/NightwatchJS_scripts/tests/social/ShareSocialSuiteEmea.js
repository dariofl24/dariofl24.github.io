/**
 * Created by gledesma on 03/15/17.
 */

module.exports = {
    tags: ['social', 'share', 'regression'],
    before : function(browser) {
        browser
            .infoLog('Setting up...')
            .timeoutsImplicitWait(15000)
            .resizeWindow(1250, 900)
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
    },
    'User Logs In With a Facebook Account, verifies share integration with Facebook for a random PDP page' : function(browser) {
        browser
            .page.Cookies().acceptCookies()
            .page.EmailToggle().closeEmailToggle()
            .page.Search().searchForTerm('M9166C')
            .page.PDP().selectAnotherRandomProductIfNotAvailable()
            .page.PDP().shareOnFacebook()
            .page.Facebook().login()
            .page.Facebook().post()
            .page.ConversePage().switchBackToConverseWindow();
    },
    'User Logs In With a Twitter Account, verifies share integration with Twitter for a random PDP page' : function(browser) {
        browser
            .page.Search().searchForTerm('M9166C')
            .page.PDP().selectAnotherRandomProductIfNotAvailable()
            .page.PDP().shareOnTwitterEmea()
            .page.Twitter().loginAndTweet()
            .page.ConversePage().switchBackToConverseWindow();
    },
    'User Logs In With a Pinterest Account, verifies share integration with Pinterest for a random PDP page' : function(browser) {
        browser
            .page.Search().searchForTerm('M9166C')
            .page.PDP().selectAnotherRandomProductIfNotAvailable()
            .page.PDP().shareOnPinterestEmea()
            .page.Pinterest().login();
    },
    after : function(browser) {
        browser
            .infoLog('Closing Down...')
            .end();
    }
};
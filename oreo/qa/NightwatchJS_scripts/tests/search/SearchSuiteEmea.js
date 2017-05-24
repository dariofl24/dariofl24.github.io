/**
 * Created by gledesma on 8/10/16.
 */

module.exports = {
    tags: ['search', 'regression'],
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
    'User searches for Adidas sneakers and does not find anything' : function(browser) {
        browser
            .page.EmailToggle().closeEmailToggle()
            .page.Search().searchForTerm('adidas')
            .verify.searchResultsFound(false);

    },
    'User searches for Chuck Taylor sneakers and finds lot of sneakers' : function(browser) {
        browser
            .page.Search().searchForTerm('taylor')
            .verify.searchResultsFound(true);
    },
    after : function(browser) {
        browser
            .infoLog('Closing Down...')
            .end();
    }
};
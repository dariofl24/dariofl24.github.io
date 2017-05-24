/**
 * Created by vesteban on 6/9/15.
 */

module.exports = {
    tags: ['US'],
    before : function(browser) {
        browser
            .infoLog('Setting up...')
            .page.ConversePage().goToConverse()
            .page.LanguageSelector().selectCountryLanguage('en_DE')
            .page.Cookies().acceptCookies();
    },
    'User searches for Adidas sneakers and does not find anything' : function(browser) {
        browser
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
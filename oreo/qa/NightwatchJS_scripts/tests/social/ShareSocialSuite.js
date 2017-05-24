/**
 * Created by vesteban on 6/15/15.
 */

module.exports = {
    tags: ['social', 'share'],
    before : function(browser) {
        browser
            .infoLog('Setting up...')
            .page.ConversePage().goToConverse();
    },
    'User Logs In With a Facebook Account, verifies share integration with Facebook for a random PDP page' : function(browser) {
        browser
            .page.Categories().selectRandomSubCategory()
            .page.PLP().selectRandomProduct()
            //.page.PDP().expandShareSocialButtons()
            .page.PDP().shareOnFacebook()
            .page.Facebook().login()
            .page.Facebook().post()
            .page.ConversePage().switchBackToConverseWindow();
    },
    'User Logs In With a Twitter Account, verifies share integration with Twitter for a random PDP page' : function(browser) {
        browser
            .page.Categories().selectRandomSubCategory()
            .page.PLP().selectRandomProduct()
            //.page.PDP().expandShareSocialButtons()
            .page.PDP().shareOnTwitter()
            .page.Twitter().loginAndTweet()
            .page.ConversePage().switchBackToConverseWindow();
    },
    'User Logs In With a Pinterest Account, verifies share integration with Pinterest for a random PDP page' : function(browser) {
        browser
            .page.Categories().selectRandomSubCategory()
            .page.PLP().selectRandomProduct()
            //.page.PDP().expandShareSocialButtons()
            .page.PDP().shareOnPinterest()
            .page.Pinterest().login();
    },
    after : function(browser) {
        browser
            .infoLog('Closing Down...')
            .end();
    }
};
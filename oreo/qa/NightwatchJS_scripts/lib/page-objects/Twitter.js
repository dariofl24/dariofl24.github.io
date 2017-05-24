/**
 * Created by vesteban on 6/15/15.
 */



module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};''

    css.email = '#username_or_email';
    css.password = '#password';
    css.loginAndTweetButton = '#update-form > div.ft > fieldset.submit > input.button.selected.submit';
    css.tweetButton = ".button.selected.submit"

    return {
        loginAndTweet : function() {
            var email = browser.globals.twitter.email;
            var password = browser.globals.twitter.password;

            return browser
                .infoLog('[Twitter] - Login and Tweet')
                .windowHandles(function (windowHandles) {
                    // Assuming that the handles are in the same order as the windows were open
                    browser.switchWindow(windowHandles.value[1], function() {
                        browser
                            .useCss()
                            .waitForElementVisible(css.email, timeout)
                            .setValue(css.email, email)
                            .setValue(css.password, password)
                            .click(css.loginAndTweetButton)
                            .waitForElementVisible(css.tweetButton, timeout)
                            .closeWindow();
                    });
                });
        }
    };
};
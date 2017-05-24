/**
 * Created by vesteban on 5/19/15.
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};
    css.giftCardsLink = 'a[title="Gift Cards"]';

    return {
        goToGiftCardsPage : function() {
            return browser
                .infoLog('[Footer] - Going to Gift Cards Page')
                .useCss()
                .waitForElementVisible(css.giftCardsLink, timeout)
                .click(css.giftCardsLink);
        }
    };
};
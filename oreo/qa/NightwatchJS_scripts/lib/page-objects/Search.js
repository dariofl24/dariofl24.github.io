/**
 * Created by vesteban on 4/27/15.
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    css.searchTextField = '#q';
    css.searchButton = '.action-search';

    return {
        searchForTerm : function(searchTerm) {
            return browser
                .infoLog('[Search] - Searching for: ' + searchTerm)
                .useCss()
                .waitForElementVisible(css.searchTextField, timeout)
                .setValue(css.searchTextField, searchTerm)
                .click(css.searchButton);
        }
    };
};
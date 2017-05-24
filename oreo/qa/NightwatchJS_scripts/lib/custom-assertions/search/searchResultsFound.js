/**
 * Created by vesteban on 6/9/15.
 */

exports.assertion = function(found, msg) {
    var timeout = this.api.globals.elements_timeout;

    var DEFAULT_MSG = found ? "Verifying if search results were found."
                            : "Verifying if search results were not found.";

    var css = {};

    css.noResultsHeading = '.noresults-heading';
    css.resultsProducts = '#results-products > span.content-header-category';

    this.message = msg || DEFAULT_MSG;

    this.expected = found ? "results found for"
                          : "no results for";

    this.pass = function(value) {
        return value.indexOf(this.expected) != -1;
    };

    this.value = function(result) {
        return result.value;
    };

    this.command = function(callback) {
        var cssSelector = found ? css.resultsProducts : css.noResultsHeading;

        return this.api
            .useCss()
            .waitForElementPresent(cssSelector, timeout)
            .getText(cssSelector, callback);
    };
};
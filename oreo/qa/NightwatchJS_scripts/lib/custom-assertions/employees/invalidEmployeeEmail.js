/**
 * Created by vesteban on 6/22/15.
 */

exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = "Validating if employee email is invalid";

    var css = {};
    css.errorMessage = '#email-cell > div > span';

    this.message = msg || DEFAULT_MSG;

    this.expected = 'The email address is invalid.';

    this.pass = function(value) {
        return this.expected == value;
    };

    this.value = function(result) {
        return result.value;
    };

    this.command = function(callback) {
        return this.api
            .useCss()
            .waitForElementPresent(css.errorMessage, timeout)
            .getText(css.errorMessage, callback);
    };
};

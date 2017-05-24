/**
 * Created by vesteban on 5/6/15.
 */

exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = "Verifying that provided Credit Card is not Valid";

    var css = {};
    //css.errorMessage = '.error-message';
    css.errorMessage = '.parsley-error';

    this.message = msg || DEFAULT_MSG;

    //this.expected = 'Invalid Credit Card information';
    this.expected = 'Invalid Credit Card Number'

    this.pass = function(value) {
        return expected.equals(value);
    };

    this.value = function(result) {
        return result.value;
    };

    this.command = function(callback) {
        return this.api
            .useCss()
            .waitForElementVisible(css.errorMessage, timeout)
            .assert.containsText(css.errorMessage, this.expected);
    };
};
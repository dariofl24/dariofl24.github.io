/**
 * Created by vesteban on 5/8/15.
 */

exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = "Verifying that provided Billing Address is not Valid";

    var css = {};
    //css.errorMessage = '.error-message';
    css.errorMessage = '.regexp';

    this.message = msg || DEFAULT_MSG;

    //this.expected = 'The address provided does not match the billing address on file with your credit card company or bank. Please call us at 888-792-3307 if you need any assistance.';
    this.expected = 'Please enter a valid value'

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
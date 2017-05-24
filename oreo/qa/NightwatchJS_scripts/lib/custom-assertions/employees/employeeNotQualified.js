/**
 * Created by vesteban on 6/23/15.
 */



exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = "Validating if employee is not qualified for discount";

    var css = {};
    css.errorMessage = '#mr-taylor-container > span.first-form-group-error';

    this.message = msg || DEFAULT_MSG;

    this.expected = "SOMETHING IS WRONG. Here's the thing. We really want to give you the employee discount, but it looks like you're not qualified. This doesn't mean we don't care about you - because we do. It just means no discount. If you think we've messed up - and, hey, things happen - you can verify your credentials with your local HR department and try the process again.";

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

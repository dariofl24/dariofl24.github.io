/**
 * Created by vesteban on 5/22/15.
 */

exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = "Validating if Cart is Empty";

    var css = {};
    css.cartEmpty = '.cart-empty';

    this.message = msg || DEFAULT_MSG;

    this.expected = 'Your Cart is Empty';

    this.pass = function(value) {
        return this.expected == value;
    };

    this.value = function(result) {
        return result.value.trim();
    };

    this.command = function(callback) {
        return this.api
            .useCss()
            .waitForElementPresent(css.cartEmpty, timeout)
            .getText(css.cartEmpty, callback);
    };
};
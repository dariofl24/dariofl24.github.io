/**
 * Created by vesteban on 5/19/15.
 */

var Util = require('util');

exports.assertion = function(amount, msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = Util.format("Verifying that Balance Due is $%d", amount);

    var css = {};
    css.balanceDueAmount = 'div.order-row.order-balance > span.price';

    this.message = msg || DEFAULT_MSG;

    this.expected = amount;

    this.pass = function(value) {
        return this.expected == value;
    };

    this.value = function(result) {
        return parseFloat(result.value.substr(1));
    };

    this.command = function(callback) {
        return this.api
            .useCss()
            .waitForElementPresent(css.balanceDueAmount, timeout)
            .getText(css.balanceDueAmount, callback);
    };
};

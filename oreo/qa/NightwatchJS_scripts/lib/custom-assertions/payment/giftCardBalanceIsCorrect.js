/**
 * Created by vesteban on 5/19/15.
 */
var Util = require('util');
var PaymentTestData = require('../../testdata/PaymentTestData');

exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = Util.format("Verifying that balance on GiftCard is greater than zero");

    var css = {};
    css.giftCardBalance = '#amount';

    this.message = msg || DEFAULT_MSG;

    this.expected = true;

    this.pass = function(value) {
        PaymentTestData.setGiftCardsBalance(value);
        return value > 0;
    };

    this.value = function(result) {
        return parseFloat(result.value.substr(1));
    };

    this.command = function(callback) {
        return this.api
            .useCss()
            .waitForElementVisible(css.giftCardBalance, timeout)
            .getText(css.giftCardBalance, callback);
    };
};
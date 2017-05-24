/**
 * Created by vesteban on 5/21/15.
 */

var Util = require('util');

exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = Util.format("Verifying that Gift Card was applied correctly");

    var css = {};
    css.orderTotal = 'div.order-row.order-total > span.price';
    css.giftCardTotal = 'div.order-row.gift-card-amount > span.price';
    css.balanceDue = 'div.order-row.order-balance > span.price';

    this.message = msg || DEFAULT_MSG;


    this.setOrderTotal = function(orderTotal) {
        this.orderTotal = orderTotal;
    };

    this.setGiftCardTotal = function(giftCardTotal) {
        this.giftCardTotal = giftCardTotal;
    };

    this.giftCardTotal = 0;

    this.expected = function() {
        return (this.orderTotal - this.giftCardTotal).toFixed(2);
    };

    this.pass = function(value) {
        return this.expected() == value;
    };

    this.value = function(result) {
        return parseFloat(result.value.substr(1));
    };

    this.command = function(callback) {
        var self = this;
        return this.api
            .useCss()
            .waitForElementVisible(css.orderTotal, timeout)
            .getText(css.orderTotal, function(orderTotalText){

                self.setOrderTotal(parseFloat(orderTotalText.value.substr(1)));

                self.api
                    .waitForElementVisible(css.giftCardTotal, timeout)
                    .getText(css.giftCardTotal, function(giftCardTotalText){

                        self.setGiftCardTotal(parseFloat(giftCardTotalText.value.substr(2)));

                        self.api
                            .waitForElementVisible(css.balanceDue, timeout)
                            .getText(css.balanceDue, callback);
                    });
            });
    };
};

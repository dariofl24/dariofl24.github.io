/**
 * Created by vesteban on 5/11/15.
 */

exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = "Validating if selected shipping method matches in the order";

    var css = {};
    css.checkoutShippingMethod = '.method-details > .shipping-info';
    css.cartSummaryShippingMethod = '.value.bold';

    this.message = msg || DEFAULT_MSG;

    this.expected = true;

    this.pass = function(value) {
        return expected.equals(value);
    };

    this.value = function(result) {
        return result.value;
    };

    this.command = function(callback) {
        var selectedShippingMethod = '';

        return this.api
            .useCss()
            .waitForElementPresent(css.checkoutShippingMethod, timeout)
            .getText(css.checkoutShippingMethod, function(result) {
                selectedShippingMethod = result.value;
                this.assert.containsText(css.cartSummaryShippingMethod, selectedShippingMethod);
            });
    };
};
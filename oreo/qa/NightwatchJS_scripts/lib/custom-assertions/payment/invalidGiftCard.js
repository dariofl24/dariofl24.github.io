/**
 * Created by vesteban on 5/19/15.
 */

exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = "Verifying that provided Gift Card is not Valid";

    var css = {};
    css.errorMessage = '#PaymentMethod_CREDIT_CARD > div.giftcard-info.payment-method.payment-method-expanded > div.gift-card-form > div.error-group > span';

    this.message = msg || DEFAULT_MSG;

    this.expected = 'Please provide valid gift card number and pin';

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
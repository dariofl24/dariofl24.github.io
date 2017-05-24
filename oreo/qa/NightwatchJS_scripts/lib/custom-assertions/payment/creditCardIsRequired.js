/**
 * Created by vesteban on 5/19/15.
 */

exports.assertion = function(required) {
    this.message = (required)
        ? 'Verifying that Credit Card is required'
        : 'Verifying that Credit Card is not required';

    var timeout = this.api.globals.elements_timeout;

    var css = {};
    css.creditCardLabel = 'label[for="dwfrm_billing_paymentMethods_creditCard_type"]';

    this.expected = true;

    this.pass = function(value) {

        if(required) {
            return value != undefined;
        } else{
            return value.ELEMENT == undefined;
        }
        return false;
    };

    this.value = function(result) {
        return result.value;
    };

    this.command = function(callback) {
        if(required) {
            return this.api
                .useCss()
                .waitForElementPresent(css.creditCardLabel, timeout, false, callback);
        } else {
            return this.api
                .useCss()
                .waitForElementNotPresent(css.creditCardLabel, timeout, false, callback);
        }
    };
};

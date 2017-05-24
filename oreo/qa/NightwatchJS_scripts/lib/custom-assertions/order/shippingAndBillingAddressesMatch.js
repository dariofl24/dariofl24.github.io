/**
 * Created by vesteban on 5/18/15.
 */


exports.assertion = function(msg) {
    var DEFAULT_MSG = "Validating if Shipping and Billing Addresses matches";

    this.message = msg || DEFAULT_MSG;

    this.expected = true;

    this.pass = function(value) {
        return expected == value;
    };

    this.value = function(result) {
        return result;
    };

    this.command = function(callback) {
        var self = this;
        return this.api
            .page.Shipping().getProvidedShippingAddress(function(providedShippingAddress){
                self.api.assert.billingAddressMatchWith(providedShippingAddress);
;            });
    };
};
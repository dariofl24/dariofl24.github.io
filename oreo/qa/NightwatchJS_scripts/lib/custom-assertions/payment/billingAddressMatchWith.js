/**
 * Created by vesteban on 5/11/15.
 */

var Address = require('../../model/Address');

exports.assertion = function(address, msg) {
    var DEFAULT_MSG = "Validating if Addresses match";

    this.message = msg || DEFAULT_MSG;

    this.expected = address;

    this.pass = function(value) {
        return this.expected.equals(value);
    };

    this.value = function(result) {
        return result;
    };

    this.command = function(callback) {
        return this.api.page.Payment().getProvidedBillingAddress(callback);
    };
};
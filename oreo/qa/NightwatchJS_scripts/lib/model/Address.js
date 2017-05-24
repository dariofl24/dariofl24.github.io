/**
 * Created by vesteban on 4/30/15.
 */

function Address(address1, address2, city, state, zipCode) {
    this.address1 = address1;
    this.address2 = address2;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
}

Address.prototype.getAddress1 = function() {
    return this.address1;
};

Address.prototype.getAddress2 = function() {
    return this.address2;
};

Address.prototype.getCity = function() {
    return this.city;
};

Address.prototype.getState = function() {
    return this.state;
};

Address.prototype.getZipCode = function() {
    return this.zipCode;
};

Address.prototype.equals = function(otherAddress) {
    return this.address1 == otherAddress.getAddress1()
        && this.address2 == otherAddress.getAddress2()
        && this.city == otherAddress.getCity()
        && this.state == otherAddress.getState()
        && this.zipCode == otherAddress.getZipCode();
};

module.exports = Address;
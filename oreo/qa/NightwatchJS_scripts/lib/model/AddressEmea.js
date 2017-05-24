/**
 * Created by esanchez on 09/10/15.
 */

function Address(address1, address2, city, zipCode, country, phone) {
    this.address1 = address1;
    this.address2 = address2;
    this.city = city;
    this.state = country;
    this.zipCode = zipCode;
    this.phone = phone;
}

Address.prototype.getAddress1 = function() {
    return this.address1;
};

Address.prototype.getAddress2 = function() {
    return this.address2;
};

Address.prototype.getZipCode = function() {
    return this.zipCode;
};

Address.prototype.getCity = function() {
    return this.city;
};

Address.prototype.getCountry = function() {
    return this.country;
};

Address.prototype.getPhone = function() {
    return this.phone;
};

Address.prototype.equals = function(otherAddress) {
    return this.address1 == otherAddress.getAddress1()
        && this.address2 == otherAddress.getAddress2()
        && this.city == otherAddress.getCity()
        && this.country == otherAddress.country()
        && this.phone == otherAddress.getPhone()
        && this.zipCode == otherAddress.getZipCode();
};

module.exports = Address;
/**
 * Created by gledesma on 02/16/17.
 */

function PUPEmea(name, lastName, zipCode) {
    this.name = name;
    this.lastName = lastName;
    this.zipCode = zipCode;
}

PUPEmea.prototype.getName = function() {
    return this.name;
};

PUPEmea.prototype.getLastName = function() {
    return this.lastName;
};

PUPEmea.prototype.getPostalCode = function() {
    return this.zipCode;
};

PUPEmea.prototype.equals = function(otherPUP) {
    return this.name == otherPUP.name()
        && this.lastName == otherPUP.lastName()
        && this.zipCode == otherPUP.getPostalCode();
};

module.exports = PUPEmea;
/**
 * Created by vesteban on 5/4/15.
 */

function CreditCard(type, number, expirationMonth, expirationYear, securityCode) {
    this.type = type;
    this.number = number;
    this.expirationMonth = expirationMonth;
    this.expirationYear = expirationYear;
    this.securityCode = securityCode;
}

CreditCard.prototype.getType = function() {
    return this.type;
};

CreditCard.prototype.getNumber = function() {
    return this.number;
};

CreditCard.prototype.getExpirationMonth = function() {
    return this.expirationMonth;
};

CreditCard.prototype.getExpirationYear = function() {
    return this.expirationYear;
};

CreditCard.prototype.getSecurityCode = function() {
    return this.securityCode;
};

module.exports = CreditCard;
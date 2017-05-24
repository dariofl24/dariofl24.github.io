/**
 * Created by vesteban on 5/18/15.
 */

function GiftCard(number, pin) {
    this.number = number;
    this.pin = pin;
    this.balance = 0;
}

GiftCard.prototype.getNumber = function() {
    return this.number;
};

GiftCard.prototype.getPin = function() {
    return this.pin;
};

GiftCard.prototype.setBalance = function(balance) {
    this.balance = balance;
};

GiftCard.prototype.getBalance = function() {
    return this.balance;
};

module.exports = GiftCard;
/**
 * Created by vesteban on 5/4/15.
 */

var CreditCard = require('../model/CreditCard');
var GiftCard = require('../model/GiftCard');
var TKUtil = require('../util/TKUtil');

var PaymentTestData = {
    validCreditCards : [
        new CreditCard('Visa', '4112344112344113', 'January', 2018, '123'),
        new CreditCard('Master', '5111005111051128', 'May', 2020, '432')
       // new CreditCard('Amex', '371144371144376', 'July', 2019, '8451')
        //new CreditCard('Discover', '6011016011016011', 'April', 2021, '745')
    ],
    validCarteBancaire : [
        new CreditCard('CarteBancaire', '4532260698049292', 'January', 2018, '123'),
        new CreditCard('CarteBancaire', '4485742594568563', 'May', 2020, '432'),
        new CreditCard('CarteBancaire', '4716606594522949', 'July', 2019, '845')
    ],
    validCarteBleue : [
        new CreditCard('CarteBleue', '4716885552369622', 'January', 2018, '123'),
        new CreditCard('CarteBleue', '4024007148822199', 'May', 2020, '432'),
        new CreditCard('CarteBleue', '4485993795318304', 'July', 2019, '845')
    ],
    validVisaDebit : [
        new CreditCard('VisaDebit', '4929997534970121', 'January', 2018, '123'),
        new CreditCard('VisaDebit', '4024007198721986', 'May', 2020, '432'),
        new CreditCard('VisaDebit', '4282013673142364', 'July', 2019, '845')
    ],
    validCartaSI : [
        new CreditCard('CartaSI', '4716863438338855', 'January', 2018, '123'),
        new CreditCard('CartaSI', '4532887494003691', 'May', 2020, '432'),
        new CreditCard('CartaSI', '4716863438338855', 'July', 2019, '845')
    ],
    validPostePay : [
        new CreditCard('PostePay', '4929435978403655', 'January', 2018, '123'),
        new CreditCard('PostePay', '4532112388880777', 'May', 2020, '432'),
        new CreditCard('PostePay', '4024007141926500', 'July', 2019, '845')
    ],
    getValidCreditCard : function() {
        return TKUtil.getRandomElementInArray(this.validCreditCards);
    },
    getValidCarteBancaire : function(){
        return TKUtil.getRandomElementInArray(this.validCarteBancaire);
    },
    getValidCarteBleue : function(){
        return TKUtil.getRandomElementInArray(this.validCarteBleue);
    },
    getValidVisaDebit : function(){
        return TKUtil.getRandomElementInArray(this.validVisaDebit);
    },
    getValidCartaSI : function(){
        return TKUtil.getRandomElementInArray(this.validCartaSI);
    },
    getValidPostePay : function(){
        return TKUtil.getRandomElementInArray(this.validPostePay);
    },
    getInvalidCreditCard : function() {
        return new CreditCard(
            'Master',
            '4111111111111112',
            'May',
            2018,
            '828'
        );
    },
    giftCardsBalance : 0,
    setGiftCardsBalance : function(balance) {
        this.giftCardsBalance = balance;
    },
    getGiftCardsBalance : function() {
        return this.giftCardsBalance;
    },
    validGiftCards : [
        new GiftCard('6050516351000000010', '629070'),
        new GiftCard('6050514871000000026', '680149'),
        new GiftCard('6050518191000000032', '954278'),
        new GiftCard('6050515521000000047', '164094'),
        new GiftCard('6050514931000000052', '504066')
    ],
    getAllValidGiftCards : function() {
        return this.validGiftCards;
    },
    getValidGiftCard : function() {
        return TKUtil.getRandomElementInArray(this.validGiftCards);
    },
    getInvalidGiftCard : function() {
        return new GiftCard('9050516351001000020', '123456');
    }
};

module.exports = PaymentTestData;
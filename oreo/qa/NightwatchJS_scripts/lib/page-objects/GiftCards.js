/**
 * Created by vesteban on 5/19/15.
 */

var PaymentTestData = require('../testdata/PaymentTestData');
var GiftCard = require('../model/GiftCard');
var AccountTestData = require('../testdata/AccountTestData');
var TKUtil = require('../util/TKUtil');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    // Check your Balance tab
    css.checkBalance = {};
    css.checkBalance.tabTitle = '#checkgc-view';
    css.checkBalance.giftCardNumber = '#dwfrm_giftcard_balance_cardnumber';
    css.checkBalance.giftCardPin = '#dwfrm_giftcard_balance_pin';
    css.checkBalance.submitButton = '#checkbalancebtn';

    css.emailGiftCard = {};
    css.emailGiftCard.tabTitle = '#electronicgc-view';
    css.emailGiftCard.dontMessWithStamps = '#electronic-giftcard-container > form > fieldset > h2';
    css.emailGiftCard.luckyRecipientName = '#dwfrm_electronicgiftcard_purchase_recipient';
    css.emailGiftCard.luckyRecipientEMail = '#dwfrm_electronicgiftcard_purchase_recipientEmail';
    css.emailGiftCard.luckyRecipientConfirmEMail='#dwfrm_electronicgiftcard_purchase_confirmRecipientEmail';

    css.mailGiftCard = {};
    css.mailGiftCard.tabTitle = '#physicalgc-view';
    css.mailGiftCard.neverGoWrongWithAGiftCard = '#physical-giftcard-container > form > fieldset > h2';
    css.mailGiftCard.purchaseQuantity = '#dwfrm_physicalgiftcard_purchase_quantity';
    css.mailGiftCard.sleeveDesign = 'input[type="radio"][name="sleeve-type"]';

    css.selectAmount = 'span.messaging.step-message.step1';
    css.cardAmount = 'input[type="radio"][name="card-amount"]';
    css.addToCartButton = '#AddToBasketButton';

    return {
        checkGiftCardBalance : function(giftCard) {
            return browser
                .infoLog('[GiftCards] - Check Gift Card Balance. Number: ' + giftCard.getNumber())
                .useCss()
                .waitForElementVisible(css.checkBalance.giftCardNumber, timeout)
                .setValue(css.checkBalance.giftCardNumber, giftCard.getNumber())
                .setValue(css.checkBalance.giftCardPin, giftCard.getPin())
                .click(css.checkBalance.submitButton)
                .pause(1000)
                .assert.giftCardBalanceIsCorrect();
        },
        checkBalanceOfAllValidGiftCards : function() {
            var allValidGiftCards = PaymentTestData.getAllValidGiftCards();

            return browser
                .infoLog('[GiftCards] - Check Balance of All Gift Cards')
                .useCss()
                .waitForElementVisible(css.checkBalance.tabTitle, timeout, function(result){
                    for(var i=0; i<allValidGiftCards.length; i++){
                        browser
                            .page.GiftCards().checkGiftCardBalance(allValidGiftCards[i])
                            .clearValue(css.checkBalance.giftCardNumber)
                            .clearValue(css.checkBalance.giftCardPin);
                    }
                });
        },
        openEmailGiftCardTab : function() {
            return browser
                .infoLog('[GiftCards] - Opening Email Gift Card Tab')
                .useCss()
                .clickOnLink(css.emailGiftCard.tabTitle)
                .waitForElementVisible(css.emailGiftCard.dontMessWithStamps, timeout);
        },
        openMailGiftCardTab : function() {
            return browser
                .infoLog('[GiftCards] - Opening Mail Gift Card Tab')
                .useCss()
                .clickOnLink(css.mailGiftCard.tabTitle)
                .waitForElementVisible(css.mailGiftCard.neverGoWrongWithAGiftCard, timeout);
        },
        selectRandomAmount : function() {
            return browser
                .infoLog('[GiftCards] - Selecting Random amount for Gift Card to Buy')
                .useCss()
                .waitForElementPresent(css.cardAmount, timeout)
                .selectRandomRadioButton(css.cardAmount);
        },
        fillLuckyRecipientInfo : function() {
            var luckyRecipient = AccountTestData.generateAccount();
            return browser
                .infoLog('[GiftCards] - Fill Lucky Recipient Info')
                .useCss()
                .setValue(css.emailGiftCard.luckyRecipientName, luckyRecipient.getFirstName() + ' ' + luckyRecipient.getLastName())
                .setValue(css.emailGiftCard.luckyRecipientEMail, luckyRecipient.getEmail())
                .setValue(css.emailGiftCard.luckyRecipientConfirmEMail, luckyRecipient.getEmail());
        },
        fillRandomPurchaseQuantity : function() {
            var randomQuantity = TKUtil.randomInt(1, 10);
            return browser
                .infoLog('[GiftCards] - Fill Random Purchase Quantity')
                .useCss()
                .waitForElementPresent(css.mailGiftCard.purchaseQuantity, timeout)
                .clearValue(css.mailGiftCard.purchaseQuantity)
                .setValue(css.mailGiftCard.purchaseQuantity, randomQuantity);
        },
        selectRandomSleeveDesign : function() {
            return browser
                .infoLog('[GiftCards] - Selecting Random Sleeve Design')
                .useCss()
                .waitForElementPresent(css.mailGiftCard.sleeveDesign, timeout)
                .selectRandomRadioButton(css.mailGiftCard.sleeveDesign);
        },
        addGiftCardToCart : function () {
            return browser
                .infoLog('[GiftCards] - Add Gift Card to Cart')
                .useCss()
                .click(css.addToCartButton);
        }
    };
};

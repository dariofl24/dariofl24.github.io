/**
 * Created by vesteban on 5/18/15.
 */

module.exports = {
    //tags: ['checkout', 'giftcard'],
    tags: ['US'],
    beforeEach : function(browser) {
        browser
            .infoLog('Setting Up...')
            .page.ConversePage().goToConverse();
    },
    'Check balance of all valid Gift Cards' : function(browser) {
        browser
            .page.Footer().goToGiftCardsPage()
            .page.GiftCards().checkBalanceOfAllValidGiftCards();
    },
    'Normal Checkout searching for specific product, try to apply an Invalid Gift Card' : function(browser) {
        browser
            .page.Checkout().searchAndNormalCheckout()
            .page.Checkout().tryToApplyInvalidGiftCard()
            .verify.invalidGiftCard();
    },
    'Normal Checkout on random product applying valid Gift Card Only, verify that balance due is zero' : function(browser) {
        browser
            .page.Cart().viewCart()
            .page.Cart().emptyCart()
            .verify.isCartEmpty()
            .page.Checkout().normalCheckoutProductPriceLessThanGiftCardBalance()
            .page.Checkout().applyValidGiftCardOnly()
            .verify.balanceDueIs(0)
            .verify.creditCardIsRequired(false)
            .page.Payment().fillBillingInformationUsingSameAddressAsShipping()
            .page.Payment().savePaymentInformation()
            .page.OrderPreview().placeOrder()
            .verify.isOrderComplete();;
    },
    'Normal Checkout when Subtotal is more expensive than Gift Card balance, verify that Credit Card is required' : function(browser) {
        browser
            .page.Checkout().normalCheckoutWhenSubtotalIsMoreExpensiveThanGiftCardBalance()
            .page.Checkout().applyValidGiftCardOnly()
            .verify.giftCardApplied()
            .verify.creditCardIsRequired(true)
            .page.Payment().fillValidCreditCardInformation()
            .page.Payment().fillBillingInformationUsingSameAddressAsShipping()
            .page.Payment().savePaymentInformation()
            .page.OrderPreview().placeOrder()
            .verify.isOrderComplete();
    },
    'Buy Electronic Gift Card' : function(browser) {
        browser
            .page.Footer().goToGiftCardsPage()
            .page.GiftCards().openEmailGiftCardTab()
            .page.GiftCards().selectRandomAmount()
            .page.GiftCards().fillLuckyRecipientInfo()
            .page.GiftCards().addGiftCardToCart()
            .page.MiniCart().viewCart()
            .page.Cart().normalCheckout()
            .page.Checkout().payWithValidCreditCard();
    },
    'Buy Physical Gift Card' : function(browser) {
        browser
            .page.Footer().goToGiftCardsPage()
            .page.GiftCards().openMailGiftCardTab()
            .page.GiftCards().selectRandomAmount()
            .page.GiftCards().fillRandomPurchaseQuantity()
            .page.GiftCards().selectRandomSleeveDesign()
            .page.GiftCards().addGiftCardToCart()
            .page.MiniCart().viewCart()
            .page.Cart().normalCheckout()
            .page.Checkout().payWithValidCreditCard();
    },
    after : function(browser) {
        browser
            .infoLog('Closing down...')
            .end();
    }
};
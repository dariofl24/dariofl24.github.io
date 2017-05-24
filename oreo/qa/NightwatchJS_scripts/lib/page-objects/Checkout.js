/**
 * Created by vesteban on 5/6/15.
 */

module.exports = function(browser) {

    return {
        selectRandomSizeAndGoToNormalCheckout : function() {
            return browser
                .infoLog('[Checkout] - Select Random Size and Go To Normal Checkout')
                .page.PDP().selectRandomSize()
                .page.PDP().addToCart()
                .page.MiniCart().viewCart()
                .page.Cart().normalCheckout();
        },
        selectRandomSizeAndGoToPayPalCheckout : function() {
            return browser
                .infoLog('[Checkout] - Select Random Size and Go To PayPal Checkout')
                .page.PDP().selectRandomSize()
                .page.PDP().addToCart()
                .page.MiniCart().viewCart()
                .page.Cart().paypalCheckout();
        },
        searchAndNormalCheckout : function() {
            return browser
                .infoLog('[Checkout] - Search for Specific Product and go to Normal Checkout')
                .page.Search().searchForTerm('M9166C')
                .page.PDP().selectAnotherRandomProductIfNotAvailable()
                .page.Checkout().selectRandomSizeAndGoToNormalCheckout();
        },
        normalCheckoutOnRandomProduct : function() {
            return browser
                .infoLog('[Checkout] - Normal Checkout on Random Product')
                //.page.Categories().selectRandomSubCategory()
                .page.Search().searchForTerm('camo')
                .page.PLP().selectRandomProduct()
                .page.PDP().selectAnotherRandomProductIfNotAvailable()
                .page.Checkout().selectRandomSizeAndGoToNormalCheckout();
        },
        payPalCheckoutOnRandomProduct : function() {
            return browser
                .infoLog('[Checkout] - PayPal Checkout on Random Product')
                .page.Categories().selectRandomSubCategory()
                .page.PLP().selectRandomProduct()
                .page.PDP().selectAnotherRandomProductIfNotAvailable()
                .page.Checkout().selectRandomSizeAndGoToPayPalCheckout();
        },
        normalCheckoutProductPriceLessThanGiftCardBalance : function() {
            return browser
                .infoLog('[Checkout] - Normal Checkout on Random Product which price is less than Gift Card Balance')
                .page.Categories().selectRandomSubCategory()
                .page.PLP().selectRandomProduct()
                .page.PDP().selectAnotherRandomProductIfNotAvailable()
                .page.PDP().selectAnotherRandomProductIfPriceIsMoreThanGiftCardsBalance()
                .page.Checkout().selectRandomSizeAndGoToNormalCheckout();
        },
        normalCheckoutWhenSubtotalIsMoreExpensiveThanGiftCardBalance : function() {
            return browser
                .infoLog('[Checkout] - Normal Checkout when Subtotal is more expensive than Gift Card Balance')
                .page.Categories().selectRandomSubCategory()
                .page.PLP().selectRandomProduct()
                .page.PDP().addProductsToCartUntilSubtotalIsMoreExpensiveThanGiftCardBalance()
                .page.MiniCart().viewCart()
                .page.Cart().normalCheckout();
        },
        payWithValidCreditCard : function() {
            return browser
                .infoLog('[Checkout] - Pay with Valid Credit Card Only')
                .page.Shipping().fillAndSaveGeneratedShippingInformation()
                .page.Payment().fillValidCreditCardInformation()
                .page.Payment().fillValidBillingInformation()
                .page.Payment().savePaymentInformation();
        },
        payWithValidPUPEmea : function(country) {
            return browser
                .infoLog('[Checkout] - Pay with Valid PUP Credit Card ' + country)
                .page.Shipping().selectCollectionPoint()
                .page.Shipping().getPUPPostalCode(country)
                .page.Shipping().selectPostalCode()
                .page.Shipping().fillValidName(country)
                .page.Shipping().saveShippingInformation()
                .page.Payment().fillValidCreditCardInformation()
                .page.Payment().fillValidBillingInformationPUPEmea(country)
                .page.Payment().savePaymentInformation(country);
        },
        payWithValidCreditCardEmea : function(country) {
            return browser
                .infoLog('[Checkout] - Pay with Valid Credit Card ' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().fillValidCreditCardInformation()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformation(country);
        },
        payWithValidCarteBancaire : function(country) {
            return browser
                .infoLog('[Checkout] - Pay with Valid Carte Bancaire ' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().fillValidCarteBancaireInformation()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformation(country);
        },
        payWithValidCarteBleue : function(country) {
            return browser
                .infoLog('[Checkout] - Pay with Valid Carte Bleue ' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().fillValidCarteBleueInformation()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformation(country);
        },
        payWithValidVisaDebit : function(country) {
            return browser
                .infoLog('[Checkout] - Pay with Valid Visa Debit ' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().fillValidVisaDebitInformation()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformation(country);
        },
        payWithValidCartaSI : function(country) {
            return browser
                .infoLog('[Checkout] - Pay with Valid Carta SI' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().fillValidCartaSIInformation()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformation(country);
        },
        payWithValidPostePay : function(country) {
            return browser
                .infoLog('[Checkout] - Pay with Valid Poste Pay' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().fillValidPostePayInformation()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformation(country);
        },
        payWithValidIdeal : function(country) {
            return browser
                .infoLog('[Checkout] - Pay with Valid Ideal' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().selectIdealMethod()
                .page.Payment().selectIdealBank()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformation(country);
        },
        payWithPaypalEmea : function(country){
            return browser
                .infoLog('[Checkout] - Pay with Paypal ' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().selectPaypalPaymentMethod()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformation()
        },
        payWithInvoice : function(country){
            return browser
                .infoLog('[Checkout] - Pay with Invoice')
                .page.Shipping().fillInvoiceShippingInformation(country)
                .page.Payment().selectInvoiceMethod()
                .page.Payment().fillInvoiceBillingInformation(country)
                //.pause(1000)
                .page.Payment().savePaymentInformation(country);
        },
        payWithSofort : function(country){
            return browser
                .infoLog('[Checkout] - Pay with Sofort')
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().selectSofortMethod()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformation(country);
        },
        tryToPayWithInvalidCreditCard : function() {
            return browser
                .infoLog('[Checkout] - Try to pay with Invalid Credit Card Only')
                .page.Shipping().fillAndSaveGeneratedShippingInformation()
                .page.Payment().fillInValidCreditCardInformation()
                .page.Payment().fillValidBillingInformation()
                .page.Payment().savePaymentInformation();
        },
        tryToPayWithInvalidCreditCardEmea : function(country) {
            return browser
                .infoLog('[Checkout] - Try to pay with Invalid Credit Card Only' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().fillInValidCreditCardInformation()
                .page.Payment().fillValidBillingInformationEmea(country)
                .page.Payment().savePaymentInformationOnce(country);
        },
        payWithValidCreditCardAndInvalidBillingAddress : function() {
            return browser
                .infoLog('[Checkout] - Pay With Valid Credit Card and fill Invalid Billing Address')
                .page.Shipping().fillAndSaveGeneratedShippingInformation()
                .page.Payment().fillValidCreditCardInformation()
                .page.Payment().fillInvalidBillingInformation()
                .page.Payment().savePaymentInformation();
        },
        payWithValidCreditCardAndInvalidBillingAddressEmea : function(country) {
            return browser
                .infoLog('[Checkout] - Pay With Valid Credit Card and fill Invalid Billing Address ' + country)
                .page.Shipping().fillValidShippingInformationEmea(country)
                .page.Payment().fillValidCreditCardInformation()
                .page.Payment().fillInvalidBillingInformationEmea()
                .page.Payment().savePaymentInformation(country);
        },
        payWithValidCreditCardSameAddressForShippingAndBilling : function() {
            return browser
                .infoLog('[Checkout] - Pay with Valid Credit Card and use same Address for Shipping and Billing')
                .page.Shipping().fillAndSaveTKSFShippingInformation()
                .page.Payment().fillValidCreditCardInformation()
                .page.Payment().fillBillingInformationUsingSameAddressAsShipping()
                .page.Payment().savePaymentInformation();
        },
        payWithValidCreditCardSameAddressForShippingAndBillingEmea : function() {
            return browser
                .infoLog('[Checkout] - Pay with Valid Credit Card and use same Address for Shipping and Billing')
                .page.Shipping().fillAndSaveTKUKShippingInformation()
                .page.Payment().fillValidCreditCardInformation()
                .page.Payment().fillBillingInformationUsingSameAddressAsShipping()
                .page.Payment().savePaymentInformation();
        },
        tryToApplyInvalidGiftCard : function() {
            return browser
                .infoLog('[Checkout] - Try to apply Invalid Gift Card')
                .page.Shipping().fillAndSaveGeneratedShippingInformation()
                .page.Payment().fillInValidGiftCardInformation();
        },
        applyValidGiftCardOnly : function() {
            return browser
                .infoLog('[Checkout] - Apply Valid Gift Card Only')
                .page.Shipping().fillAndSaveGeneratedShippingInformation()
                .page.Payment().fillValidGiftCardInformation();
        }
    };
};
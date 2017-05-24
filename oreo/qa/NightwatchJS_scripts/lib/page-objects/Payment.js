/**
 * Created by vesteban on 5/4/15.
 */
var Util = require('util');
var PaymentTestData = require('../../lib/testdata/PaymentTestData');
var AccountTestData = require('../../lib/testdata/AccountTestData');
var AddressTestData = require('../../lib/testdata/AddressTestData');
var Address = require('../model/Address');


module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    css.creditCard = {};
    css.creditCard.type = '#select2-dwfrm_billing_paymentMethods_creditCard_type-container';
    css.creditCard.cardOption = 'li[id$="%s"]';
    css.creditCard.carteBancaire = 'li[id$="CarteBancaire"]';
    css.creditCard.number = '#dwfrm_billing_paymentMethods_creditCard_number';
    css.creditCard.expirationMonth = '#dwfrm_billing_paymentMethods_creditCard_month';
    css.creditCard.expirationYear = '#dwfrm_billing_paymentMethods_creditCard_year';
    css.creditCard.expirationYearOption = 'option[value="%s"]';
    css.creditCard.securityCode = '#dwfrm_billing_paymentMethods_creditCard_cvn';

    css.paypal = {};
    css.paypal.paypalPaymentOptionLabel = "#label-PAY_PAL";

    css.giftCard = {};
    css.giftCard.applyCheckbox = '#dwfrm_billing_giftCardPayment_enable';
    css.giftCard.number = '#dwfrm_billing_giftCardPayment_cardNumber';
    css.giftCard.pin = '#dwfrm_billing_giftCardPayment_pin';
    css.giftCard.applyButton = 'button[name="dwfrm_billing_giftCardPayment_applyGiftCard"]';

    css.paymentMethod = {};
    css.paymentMethod.withCreditCard = '#label-CREDIT_CARD';
    css.paymentMethod.withPayPal = '#label-PAY_PAL';
    css.paymentMethod.withInvoice = '#label-INVOICE';
    css.paymentMethod.withSofort = '#label-SOFORT';
    css.paymentMethod.withIdeal = '#label-IDEAL';
    css.paymentMethod.IdealBank = '#select2-dwfrm_billing_paymentMethods_regionalpaymentfields_idealBankName-container';
    css.paymentMethod.ABN_AMRO = 'li[id$="ABN_AMRO"]';

    css.billingAddress = {};
    css.billingAddress.useSameBillingAddressAsShippingAddress = "label[for='dwfrm_billing_billingAddress_billingSameAsShipping']";
    css.billingAddress.firstName = '#dwfrm_billing_billingAddress_addressFields_common_firstName';
    css.billingAddress.lastName = '#dwfrm_billing_billingAddress_addressFields_common_lastName';
    css.billingAddress.address1 = '#dwfrm_billing_billingAddress_addressFields_common_address1';
    css.billingAddress.address2 = '#dwfrm_billing_billingAddress_addressFields_common_address2';
    css.billingAddress.city = '#dwfrm_billing_billingAddress_addressFields_common_city';
    css.billingAddress.state = '#dwfrm_billing_billingAddress_addressFields_states_stateCode';
    css.billingAddress.zipCode = '#dwfrm_billing_billingAddress_addressFields_regional_zip';
    css.billingAddress.email = '#dwfrm_billing_billingAddress_email_emailAddress';
    css.billingAddress.confirmEmail = '#dwfrm_billing_billingAddress_email_confirmationEmailAddress';
    css.billingAddress.phone = '#dwfrm_billing_billingAddress_addressFields_regional_phone';
    css.billingSameAsDeliveryAdress = '.styled-checkbox.active';

    css.billingAddress.review = '.billing-info > div:nth-child(1) > div:nth-child(3) > ul:nth-child(1)';

    css.paymentSaveBtn = 'button[name="dwfrm_billing_save"]';
    css.idealSaveBtn = '.button-large.continue-idealPayment';


    var xpath = {};

    xpath.paymentSaveBtn = '//*[@id="dwfrm_billing"]/div/div[3]/div/button';

    xpath.creditCardSelector = "//span[@id='select2-dwfrm_billing_paymentMethods_creditCard_type-container']"


    return {
        fillCreditCardInformation : function(creditCard) {
            var expirationYearOptionSelector = Util.format(css.creditCard.expirationYearOption, creditCard.getExpirationYear());
            var cardOption = Util.format(css.creditCard.cardOption, creditCard.getType());
            return browser
            .infoLog(' [Payment] - Fill Credit Card Information')
            .useCss()
            .moveTo(css.creditCard.type)
            .click(css.creditCard.type)
            .waitForElementVisible(cardOption, timeout)
            .click(cardOption)
            .setValue(css.creditCard.number, creditCard.getNumber())
            .setValue(css.creditCard.expirationMonth, creditCard.getExpirationMonth())
            .click(css.creditCard.expirationYear)
            .click(expirationYearOptionSelector)
            .setValue(css.creditCard.securityCode, creditCard.getSecurityCode());
        },
        fillValidCreditCardInformation: function() {
            var validCreditCard = PaymentTestData.getValidCreditCard();
            return browser
                .infoLog('[Payment] - Fill Valid Credit Card Information')
                .page.Payment().fillCreditCardInformation(validCreditCard);
        },
        fillValidCarteBancaireInformation: function() {
            var validCreditCard = PaymentTestData.getValidCarteBancaire();
            return browser
                .infoLog('[Payment] - Fill Valid Credit Bancaire Information')
                .page.Payment().fillCreditCardInformation(validCreditCard);
        },
        fillValidCarteBleueInformation: function() {
            var validCreditCard = PaymentTestData.getValidCarteBleue();
            return browser
                .infoLog('[Payment] - Fill Valid Carte Bleue Information')
                .page.Payment().fillCreditCardInformation(validCreditCard);
        },
        fillValidVisaDebitInformation: function() {
            var validCreditCard = PaymentTestData.getValidVisaDebit();
            return browser
                .infoLog('[Payment] - Fill Valid Visa Debit Information')
                .page.Payment().fillCreditCardInformation(validCreditCard);
        },
        fillValidCartaSIInformation: function() {
            var validCreditCard = PaymentTestData.getValidCartaSI();
            return browser
                .infoLog('[Payment] - Fill Valid Carta SI Information')
                .page.Payment().fillCreditCardInformation(validCreditCard);
        },
        fillValidPostePayInformation: function() {
            var validCreditCard = PaymentTestData.getValidPostePay();
            return browser
                .infoLog('[Payment] - Fill Valid Poste Pay Information')
                .page.Payment().fillCreditCardInformation(validCreditCard);
        },
        fillInValidCreditCardInformation: function() {
            var invalidCreditCard = PaymentTestData.getInvalidCreditCard();
            return browser
                .infoLog('[Payment] - Fill Invalid Credit Card Information')
                .page.Payment().fillCreditCardInformation(invalidCreditCard);
        },
        fillGiftCardInformation : function(giftCard) {
            return browser
                .infoLog('[Payment] - Fill Gift Card Information')
                .useCss()
                .setCheckboxValue(css.giftCard.applyCheckbox, true)
                .waitForElementVisible(css.giftCard.number, timeout)
                .clearValue(css.giftCard.number)
                .setValue(css.giftCard.number, giftCard.getNumber())
                .clearValue(css.giftCard.pin)
                .setValue(css.giftCard.pin, giftCard.getPin())
                .click(css.giftCard.applyButton);
        },
        fillValidGiftCardInformation: function() {
            var validGiftCard = PaymentTestData.getValidGiftCard();
            return browser
                .infoLog('[Payment] - Fill Valid Gift Card Information')
                .page.Payment().fillGiftCardInformation(validGiftCard);
        },
        fillInValidGiftCardInformation: function() {
            var invalidGiftCard = PaymentTestData.getInvalidGiftCard();
            return browser
                .infoLog('[Payment] - Fill Invalid Gift Card Information')
                .page.Payment().fillGiftCardInformation(invalidGiftCard);
        },
        clearBillingInformation : function() {
            return browser
                .infoLog('[Payment] - Clear Billing Information')
                .useCss()
                .clearValue(css.billingAddress.firstName)
                .clearValue(css.billingAddress.lastName)
                .clearValue(css.billingAddress.address1)
                .clearValue(css.billingAddress.address2)
                .clearValue(css.billingAddress.city)
                .clearValue(css.billingAddress.zipCode)
                .clearValue(css.billingAddress.email)
                .clearValue(css.billingAddress.confirmEmail)
                .clearValue(css.billingAddress.phone);
        },
        clearEmailInformation : function() {
             return browser
                 .infoLog('[Payment] - Clear Email Information')
                 .useCss()
                 .clearValue(css.billingAddress.email)
                 .clearValue(css.billingAddress.confirmEmail);
         },
        clickBillingAddressSameAsDeliveryMethodCheckbox : function() {
             return browser
                 .infoLog('[Payment] - Click Billing Address Same As Delivery Method')
                 .useCss()
                 .waitForElementPresent(css.billingSameAsDeliveryAdress, timeout)
                 .click(css.billingSameAsDeliveryAdress);
        },
        fillEmailInformation : function(account) {
            return browser
                .infoLog('[Payment] - Fill e-mail Information')
                .page.Payment().clearEmailInformation()
                .useCss()
                .setValue(css.billingAddress.email, account.getEmail())
                .setValue(css.billingAddress.confirmEmail, account.getEmail());
        },
        fillBillingInformation : function(account, address) {
            return browser
                .infoLog('[Payment] - Fill Billing Information')
                .page.Payment().clearBillingInformation()
                .useCss()
                .setValue(css.billingAddress.firstName, account.getFirstName())
                .setValue(css.billingAddress.lastName, account.getLastName())
                .setValue(css.billingAddress.address1, address.getAddress1())
                .setValue(css.billingAddress.address2, address.getAddress2())
                .setValue(css.billingAddress.city, address.getCity())
                .click(css.billingAddress.state)
                .setValue(css.billingAddress.state, address.getState())
                .setValue(css.billingAddress.zipCode, address.getZipCode())
                .setValue(css.billingAddress.phone, account.getPhone())
                .page.Payment().fillEmailInformation(account);
        },
        fillBillingInformationEmea : function(account, address) {
            return browser
                .infoLog('[Payment] - Fill Billing Information')
                .page.Payment().clickBillingAddressSameAsDeliveryMethodCheckbox()
                .page.Payment().clearBillingInformation()
                .useCss()
                .setValue(css.billingAddress.firstName, account.getFirstName())
                .setValue(css.billingAddress.lastName, account.getLastName())
                .setValue(css.billingAddress.address1, address.getAddress1())
                .setValue(css.billingAddress.address2, address.getAddress2())
                .setValue(css.billingAddress.city, address.getCity())
                .setValue(css.billingAddress.zipCode, address.getZipCode())
                .setValue(css.billingAddress.phone, address.getPhone())
                .page.Payment().fillEmailInformation(account);
        },
        fillBillingInformationPUPEmea : function(account, address) {
            return browser
                .infoLog('[Payment] - Fill Billing Information')
                //.page.Payment().clearBillingInformation()
                .useCss()
                .setValue(css.billingAddress.firstName, account.getFirstName())
                .setValue(css.billingAddress.lastName, account.getLastName())
                .setValue(css.billingAddress.address1, address.getAddress1())
                .setValue(css.billingAddress.address2, address.getAddress2())
                .setValue(css.billingAddress.city, address.getCity())
                .setValue(css.billingAddress.zipCode, address.getZipCode())
                //.setValue(css.billingAddress.phone, address.getPhone())
                .element('css selector', css.billingAddress.phone, function(result){
                    if (result.value && result.value.ELEMENT){
                        browser.setValue(css.billingAddress.phone, address.getPhone())
                    }
                })
                .page.Payment().fillEmailInformation(account);
        },
        fillBillingInformationUsingSameAddressAsShipping : function() {
            var account = AccountTestData.generateAccount("en");
            return browser
                .infoLog('[Payment] - Fill Billing Information Using Same Address As Shipping')
                .page.Payment().clearBillingInformation()
                .useCss()
                .waitForElementVisible(css.billingAddress.useSameBillingAddressAsShippingAddress, timeout)
                .click(css.billingAddress.useSameBillingAddressAsShippingAddress)
                .page.Payment().fillEmailInformation(account)
        },
        fillBillingInformationUsingSameAddressAsShippingEmea : function(account, address) {
            return browser
                .infoLog('[Payment] - Fill Billing Information Using Same Address As Shipping')
                .page.Payment().fillEmailInformation(account);
        },
        fillValidBillingInformation : function () {
            var account = AccountTestData.generateAccount("en");
            var validAddress = AddressTestData.generateAddress();

            return browser
                .infoLog('[Payment] - Fill Valid Billing Information')
                .page.Payment().fillBillingInformation(account, validAddress);
        },
        fillValidBillingInformationEmea : function (country) {
            var account = "";
            var validAddress = "";
            if (country == 'Germany'){
                validAddress = AddressTestData.getValidGermanyAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.germany.country_code);
            } else if (country == 'France') {
                validAddress = AddressTestData.getValidFranceAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.france.country_code);
            } else if (country == 'UK') {
                validAddress = AddressTestData.getValidUkAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.uk.english.lang);
            } else if (country == 'Belgium') {
                validAddress = AddressTestData.getValidBelgiumAddress();
                account = AccountTestData.generateAccount("fr");
            } else if (country == 'Spain') {
                validAddress = AddressTestData.getValidSpainAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.spain.country_code);
            } else if (country == 'Netherlands') {
                validAddress = AddressTestData.getValidNetherlandsAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.netherlands.country_code);
            } else if (country == 'Italy') {
                validAddress = AddressTestData.getValidItalyAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.italy.country_code);
            }
            return browser
                .infoLog('[Payment] - Fill Valid Billing Information')
                .page.Payment().fillBillingInformationUsingSameAddressAsShippingEmea(account, validAddress);
        },
        fillValidBillingInformationPUPEmea : function (country) {
            var account = "";
            var validAddress = "";
            if (country == 'Germany'){
                validAddress = AddressTestData.getValidGermanyAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.germany.country_code);
            } else if (country == 'France') {
                validAddress = AddressTestData.getValidFranceAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.france.country_code);
            } else if (country == 'UK') {
                validAddress = AddressTestData.getValidUkAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.uk.english.lang);
            } else if (country == 'Belgium') {
                validAddress = AddressTestData.getValidBelgiumAddress();
                account = AccountTestData.generateAccount("fr");
            } else if (country == 'Spain') {
                validAddress = AddressTestData.getValidSpainAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.spain.country_code);
            } else if (country == 'Netherlands') {
                validAddress = AddressTestData.getValidNetherlandsAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.netherlands.country_code);
            } else if (country == 'Italy') {
                validAddress = AddressTestData.getValidItalyAddress();
                account = AccountTestData.generateAccount(browser.globals.locales.italy.country_code);
            }
            return browser
                .infoLog('[Payment] - Fill Valid Billing Information')
                .page.Payment().fillBillingInformationPUPEmea(account, validAddress);
        },

        fillInvoiceBillingInformation : function (country) {
            var account = AccountTestData.getValidInvoiceAccount();
            if (country == 'Germany'){
                validAddress = AddressTestData.getValidInvoiceAddressGermany();
            } else if (country == 'Netherlands') {
                validAddress = AddressTestData.getValidInvoiceAddressNetherlands();
            }

            return browser
                .infoLog('[Payment] - Fill Valid Billing Information')
                //.page.Payment().fillBillingInformationEmea(account, validAddress);
                .page.Payment().fillBillingInformationUsingSameAddressAsShippingEmea(account, validAddress);
        },
        selectPaypalPaymentMethod : function(){
            return browser
                .infoLog('[Payment] - Select Paypal As Payment Method')
                .waitForElementVisible(css.paypal.paypalPaymentOptionLabel, timeout)
                .click(css.paypal.paypalPaymentOptionLabel);
        },
        fillInvalidBillingInformation : function() {
            var account = AccountTestData.getValidAccount();
            var invalidAddress = AddressTestData.getInvalidAddress();

            return browser
                .infoLog('[Payment] - Fill Invalid Billing Information')
                .page.Payment().fillBillingInformation(account, invalidAddress);
        },
        fillInvalidBillingInformationEmea : function() {
            var account = AccountTestData.getValidAccount();
            var invalidAddress = AddressTestData.getInvalidAddressEmea();

            return browser
                .infoLog('[Payment] - Fill Invalid Billing Information')
                .page.Payment().fillBillingInformationEmea(account, invalidAddress);
        },
        savePaymentInformation : function() {
            return browser
                .infoLog('[Payment] - Save Payment Information')
                .useCss()
                .waitForElementVisible(css.paymentSaveBtn, timeout)
                .click(css.paymentSaveBtn)
                .element('css selector', css.paymentSaveBtn, function(result) {
                    if(result.value && result.value.ELEMENT) {
                        browser
                            .infoLog('[Payment] - Saving Payment information again')
                            .click(css.paymentSaveBtn);
                    }
                })
        },
        savePaymentInformationOnce : function() {
            return browser
                .infoLog('[Payment] - Save Payment Information')
                .useCss()
                .waitForElementVisible(css.paymentSaveBtn, timeout)
                .click(css.paymentSaveBtn)
        },
        getProvidedBillingAddress : function(callback) {
            return browser
                .useCss()
                .getText(css.billingAddress.review, function(result) {
                    var entireAddressWithName = result.value.split('\n');
                    var cityStateAndZipCode;
                    var stateAndZipCode;

                    if(entireAddressWithName.length > 5) {
                        cityStateAndZipCode = entireAddressWithName[4].split(',');
                    } else {
                        cityStateAndZipCode = entireAddressWithName[3].split(',');
                    }

                    stateAndZipCode  = cityStateAndZipCode[1].split(' ');

                    if (typeof callback == 'function') {
                        callback(new Address(entireAddressWithName[1], ' ', cityStateAndZipCode[0], stateAndZipCode[1], stateAndZipCode[2]));
                    }
                });
        },
        selectCreditCardMethod : function() {
            return browser
                .useCss()
                .waitForElementPresent(css.paymentMethod.withCreditCard, timeout)
                .click(css.paymentMethod.withCreditCard);
        },
        selectPayPalMethod : function() {
            return browser
                .useCss()
                .waitForElementVisible(css.paymentMethod.withPayPal, timeout)
                .click(css.paymentMethod.withPayPal);
        },
        selectSofortMethod : function() {
             return browser
                 .useCss()
                 .assert.visible(css.paymentMethod.withSofort)
                 .click(css.paymentMethod.withSofort);
        },
        selectIdealMethod : function() {
             return browser
                 .useCss()
                 .assert.visible(css.paymentMethod.withIdeal)
                 .click(css.paymentMethod.withIdeal);
        },
        selectIdealBank : function() {
             return browser
                 .useCss()
                 .click(css.paymentMethod.IdealBank)
                 .click(css.paymentMethod.ABN_AMRO );
        },
        saveIdealPayment : function() {
            return browser
                .useCss()
                .click(css.idealSaveBtn);
        },
        selectInvoiceMethod : function() {
            return browser
                .useCss()
                .assert.visible(css.paymentMethod.withInvoice)
                .click(css.paymentMethod.withInvoice);
        }

    };
};




/**
 * Created by vesteban on 4/30/15.
 */

var Util = require('util');
var AccountTestData = require('../../lib/testdata/AccountTestData');
var AddressTestData = require('../../lib/testdata/AddressTestData');
var Address = require('../model/Address');
var PUPTestData = require('../../lib/testdata/PUPTestData');
var PUPEmea = require('../model/PUPEmea');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    css.firstName   = '#dwfrm_singleshipping_shippingAddress_addressFields_common_firstName';
    css.lastName    = '#dwfrm_singleshipping_shippingAddress_addressFields_common_lastName';

    css.address1    = '#dwfrm_singleshipping_shippingAddress_addressFields_common_address1';
    css.address2    = '#dwfrm_singleshipping_shippingAddress_addressFields_common_address2';
    css.city        = '#dwfrm_singleshipping_shippingAddress_addressFields_common_city';
    css.selectState = '#dwfrm_singleshipping_shippingAddress_addressFields_states_stateCode'
    css.zipCode     = '#dwfrm_singleshipping_shippingAddress_addressFields_regional_zip';
    css.phone       = '#dwfrm_singleshipping_shippingAddress_addressFields_regional_phone';

    css.postalcodeError = '#parsley-4829818281944931';

    css.shippingMethod = '.select-shipping-method';

    css.shippingAddressSaveBtn = '.btn-continue';
    css.stepOneBtn = '[name=dwfrm_singleshipping_shippingAddress_save]';
    css.editShippingAddressBtn = '.btn-edit-step';
    css.shippingForm = "#dwfrm_singleshipping_shippingAddress";

    css.reviewAddress = 'div.shipping-info > div:nth-child(1) > div:nth-child(3) > ul:nth-child(1)';

    css.PUP = '#dwfrm_singleshipping_shippingAddress_addressFields_regional_zip';
    css.selectPUPButton = '.btn-search-pup';
    css.pupList = '#pup-list';
    css.selectButton = '.select-button';
    css.PUPName = '#dwfrm_singleshipping_shippingAddress_addressFields_common_firstName';
    css.PUPLastName = '#dwfrm_singleshipping_shippingAddress_addressFields_common_lastName';

    var xpath = {};

    xpath.shippingAddressSaveBtn = '//*[@id="dwfrm_singleshipping_shippingAddress"]/div/div[7]/div/input';
    xpath.postcode = "//div[@class='form-group form-column-right postal-code']/input"

    xpath.checkboxCollectionPoint = "//div[@class='form-row selector']/div[2]/span";

    return {
        clearShippingInformation : function() {
            return browser
                .useCss()
                .infoLog('[Shipping] - Clear Shipping Information')
                .clearValue(css.firstName)
                .clearValue(css.lastName)
                .clearValue(css.address1)
                .clearValue(css.address2)
                .clearValue(css.city)
                .clearValue(css.selectState)
                .useXpath()
                .clearValue(xpath.postcode);
        },
        clearShippingInformationEmea : function() {
            return browser
                .useCss()
                .infoLog('[Shipping] - Clear Shipping Information')
                .clearValue(css.firstName)
                .clearValue(css.lastName)
                .clearValue(css.address1)
                .clearValue(css.address2)
                .clearValue(css.city)
                //.clearValue(css.zipCode)
                .element('css selector', css.phone, function(result){
                    if (result.value && result.value.ELEMENT){
                        browser.clearValue(css.phone);
                    }
                 })
                //.clearValue(css.phone)
                .useXpath()
                .clearValue(xpath.postcode);
        },
        fillShippingInformation : function(account, address) {
            return browser
                .infoLog('[Shipping] - Fill Shipping Information')
                .page.Shipping().clearShippingInformation()
                .useCss()
                .setValue(css.firstName, account.getFirstName())
                .setValue(css.lastName, account.getLastName())
                .setValue(css.address1, address.getAddress1())
                .setValue(css.address2, address.getAddress2())
                .setValue(css.city, address.getCity())
                .click(css.selectState)
                .setValue(css.selectState, address.getState())
                .setValue(css.zipCode, address.getZipCode())
                .setRandomOptionInSelect(css.shippingMethod);
        },
        fillShippingInformationEmea : function(account, address) {
                return browser
                .page.Shipping().clearShippingInformationEmea()
                .infoLog('[Shipping] - Fill Shipping Information EMEA')
                .useXpath()
                .setValue(xpath.postcode, address.getZipCode())
                .useCss()
                .setValue(css.firstName, account.getFirstName())
                .setValue(css.lastName, account.getLastName())
                .setValue(css.address1, address.getAddress1())
                .setValue(css.address2, address.getAddress2())
                .setValue(css.city, address.getCity())
                //.setValue(css.zipCode, address.getZipCode())
                .element('css selector', css.phone, function(result){
                    if (result.value && result.value.ELEMENT){
                        browser.setValue(css.phone, address.getPhone());
                    }
                })
                //.setValue(css.phone, address.getPhone())
                .setRandomOptionInSelect(css.shippingMethod);
        },
        fillGeneratedShippingInformation : function() {
            var account = AccountTestData.generateAccount("en");
            var address = AddressTestData.generateAddress();

            return browser
                .infoLog('[Shipping] - Fill Generated Shipping Information')
                .page.Shipping().fillShippingInformation(account, address);
        },
        fillTKSFShippingInformation : function() {
            var account = AccountTestData.getValidAccount();
            var address = AddressTestData.getTKSFAddress();

            return browser
                .infoLog('[Shipping] - Fill TK SF Shipping Information')
                .page.Shipping().fillShippingInformation(account, address);
        },
        fillTKUKShippingInformation : function() {
            var account = AccountTestData.getValidAccount();
            var address = AddressTestData.getValidUkAddress();

            return browser
                .infoLog('[Shipping] - Fill TK UK Shipping Information')
                .page.Shipping().fillShippingInformationEmea(account, address);
        },
        fillValidLosAngelesShippingInformation : function() {
            var account = AccountTestData.getValidAccount();
            var address = AddressTestData.getValidLosAngelesAddress();

            return browser
                .infoLog('[Shipping] - Fill Valid Los Angeles Shipping Information')
                .page.Shipping().fillShippingInformation(account, address);
        },
        fillValidMiamiShippingInformation : function() {
            var account = AccountTestData.getValidAccount();
            var address = AddressTestData.getValidMiamiAddress();

            return browser
                .infoLog('[Shipping] - Fill Valid Miami Shipping Information')
                .page.Shipping().fillShippingInformation(account, address);
        },
        fillValidNewYorkShippingInformation : function() {
            var account = AccountTestData.getValidAccount();
            var address = AddressTestData.getValidNewYorkAddress();

            return browser
                .infoLog('[Shipping] - Fill Valid New York Shipping Information')
                .page.Shipping().fillShippingInformation(account, address);
        },
        fillValidRedmondShippingInformation : function() {
            var account = AccountTestData.getValidAccount();
            var address = AddressTestData.getValidRedmondAddress();

            return browser
                .infoLog('[Shipping] - Fill Valid Redmond Shipping Information')
                .page.Shipping().fillShippingInformation(account, address);
        },
        fillInvoiceShippingInformation : function(country) {
            var account = "";
            var address = "";

            if (country == 'Germany'){
                account = AccountTestData.getValidInvoiceAccount();
                address = AddressTestData.getValidInvoiceAddressGermany();
            } else if (country == 'Netherlands') {
                account = AccountTestData.generateAccount('nl');
                address = AddressTestData.getValidInvoiceAddressNetherlands();
            }

            return browser
                .infoLog('[Shipping] - Fill Invoice Shipping Information')
                .page.Shipping().fillShippingInformationEmea(account, address)
                .page.Shipping().saveShippingInformation();
        },
        fillValidShippingInformationEmea : function(country){
            var account = AccountTestData.getValidAccount();
            var address = "";
            if (country == 'Germany'){
                address = AddressTestData.getValidGermanyAddress();
            } else if (country == 'France') {
                address = AddressTestData.getValidFranceAddress();
            } else if (country == 'UK') {
                address = AddressTestData.getValidUkAddress();
            } else if (country == 'Belgium') {
                address = AddressTestData.getValidBelgiumAddress();
            } else if (country == 'Spain') {
                address = AddressTestData.getValidSpainAddress();
            } else if (country == 'Netherlands'){
                address = AddressTestData.getValidNetherlandsAddress();
            } else if (country == 'Italy') {
                address = AddressTestData.getValidItalyAddress();
            }
            return browser
                .infoLog('[Shipping] - Fill Valid ' +country+ ' Shipping Information')
                .page.Shipping().fillShippingInformationEmea(account, address)
                .page.Shipping().saveShippingInformation();
        },
        getPUPPostalCode : function(country){
            if (country == 'Germany'){
                var pupEmea = PUPTestData.getValidGermanyPUP();
            } else if (country == 'France') {
                var pupEmea = PUPTestData.getValidFrancePUP();
            } else if (country == 'Netherlands') {
                var pupEmea = PUPTestData.getValidNetherlandsPUP();
            }

            return browser
                .infoLog('[Payment] - Get Postal Code Information')
                .useCss()
                .setValue(css.PUP, pupEmea.getPostalCode())
                .click(css.selectPUPButton);
        },
        selectPostalCode : function(){
            return browser
                .infoLog('[Payment] - Select a collection point')
                .useCss()
                .waitForElementVisible(css.pupList, timeout)
                .click(css.selectButton)
        },
        fillValidName : function(country){
            if (country == 'Germany'){
                var pupEmea = PUPTestData.getValidGermanyPUP();
            } else if (country == 'France') {
                var pupEmea = PUPTestData.getValidFrancePUP();
            } else if (country == 'Netherlands') {
                var pupEmea = PUPTestData.getValidNetherlandsPUP();
            }

            return browser
                .infoLog('[Shipping] - Fill PUP Name and Last Name')
                .useCss()
                .waitForElementVisible(css.PUPName, timeout)
                .setValue(css.PUPName, pupEmea.getName())
                .setValue(css.PUPLastName, pupEmea.getLastName())
        },
        selectCollectionPoint : function(){
            return browser
                .useXpath()
                .waitForElementPresent(xpath.checkboxCollectionPoint, timeout)
                .click(xpath.checkboxCollectionPoint);
        },
        saveShippingInformation : function() {
            return browser
                .infoLog('[Shipping] - Save Shipping Information')
                .useCss()
                .waitForElementVisible(css.shippingAddressSaveBtn, timeout)
                .click(css.shippingAddressSaveBtn)
                //.element('css selector', css.stepOneBtn, function(result){
                //    if (result.value && result.value.ELEMENT){
                //        browser.infoLog('[Shipping] - Saving Shipping Information Again')
                //        browser.click(css.stepOneBtn);
                //    }
                //})
        },
        fillAndSaveGeneratedShippingInformation : function() {
            return browser
                .infoLog('[Shipping] - Fill and Save Generated Shipping Information')
                .page.Shipping().fillGeneratedShippingInformation()
                .page.Shipping().saveShippingInformation();
        },
        fillAndSaveTKSFShippingInformation : function() {
            return browser
                .infoLog('[Shipping] - Fill and Save TK SF Shipping Information')
                .page.Shipping().fillTKSFShippingInformation()
                .page.Shipping().saveShippingInformation();
        },
        fillAndSaveTKUKShippingInformation : function() {
            return browser
                .infoLog('[Shipping] - Fill and Save TK UK Shipping Information')
                .page.Shipping().fillTKUKShippingInformation()
                .page.Shipping().saveShippingInformation();
        },
        fillAndSaveGermanyInvoiceShippingInformation : function() {
            return browser
                .infoLog('[Shipping] - Fill and Save Germany Invoice Shipping Information')
                .page.Shipping().fillInvoiceGermanyShippingInformation()
                .page.Shipping().saveShippingInformation();
        },
        getProvidedShippingAddress : function(callback) {
            return browser
                .useCss()
                .getText(css.reviewAddress, function(result) {
                    var entireAddressWithName = result.value.split('\n');
                    var cityStateAndZipCode;
                    var stateAndZipCode;

                    if(entireAddressWithName.length > 5) {
                        cityStateAndZipCode = entireAddressWithName[4].split(',');
                    } else {
                        cityStateAndZipCode = entireAddressWithName[3].split(',');
                    }
                    stateAndZipCode  = cityStateAndZipCode[1].split(' ');

                    if(typeof callback == 'function') {
                        callback(new Address(entireAddressWithName[1], ' ',cityStateAndZipCode[0],stateAndZipCode[1],stateAndZipCode[2]));
                    }
            });
        }
    };
};

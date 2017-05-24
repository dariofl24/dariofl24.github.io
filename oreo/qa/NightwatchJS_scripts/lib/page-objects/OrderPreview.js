/**
 * Created by vesteban on 5/6/15.
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var xpath = {};
    xpath.placeOrderBtn = "//div[@class='form-column-right place-order']/button";
    //xpath.acceptTermsAndCondsBtn = "//span[@class='styled-checkbox']";
    xpath.acceptTermsAndCondsBtn = "//div[@class='terms']/span[@class='styled-checkbox']";
    xpath.orderConfirmationHeader = "//div[@class='checkout-confirmation-header']/h1";
    xpath.orderNumber = "//div[@class='shipment-item']/h3/span"
    xpath.summaryText = "//div[@class='form-row complete-your-purchase']/p"
    var css = {};
    css.termsAndCondsError = "div.terms-error"
    css.saveShippingInfoBtn = '[name=dwfrm_singleshipping_shippingAddress_save]';
    css.nameField = '#dwfrm_singleshipping_shippingAddress_addressFields_common_firstName';

    return {
        placeOrder : function() {
            return browser
                .infoLog('[OrderPreview] - Place Order')
                .useXpath()
                .waitForElementVisible(xpath.placeOrderBtn, timeout)
                .click(xpath.placeOrderBtn)
        },
        placeOrderEmea : function() {
            return browser
                .infoLog('[OrderPreview] - Place Order EMEA')
                .useXpath()
                .moveTo(xpath.acceptTermsAndCondsBtn)
                .click(xpath.summaryText)
                .assert.visible(xpath.acceptTermsAndCondsBtn)
                .click(xpath.acceptTermsAndCondsBtn)
                .waitForElementVisible(xpath.placeOrderBtn, timeout)
                .moveTo(xpath.placeOrderBtn)
                .click(xpath.placeOrderBtn)
                .useCss()
                .element('css selector', css.termsAndCondsError, function(result) {
                    if (result.value.ELEMENT) {
                        browser
                            .infoLog('[OrderPreview] - Saving transaction again')
                            .useXpath()
                            .click(xpath.acceptTermsAndCondsBtn)
                            .click(xpath.placeOrderBtn)
                    }
                });
        },
        placeOrderEmeaIdeal : function() {
            return browser
                .infoLog('[OrderPreview] - Place Order EMEA')
                .useXpath()
                .moveTo(xpath.acceptTermsAndCondsBtn)
                .click(xpath.summaryText)
                .assert.visible(xpath.acceptTermsAndCondsBtn)
                .click(xpath.acceptTermsAndCondsBtn)
                .waitForElementVisible(xpath.placeOrderBtn, timeout)
                .moveTo(xpath.placeOrderBtn)
                .click(xpath.placeOrderBtn)
        },
        getOrderNumber : function(){
            return browser
                .useXpath()
                .waitForElementVisible(xpath.orderConfirmationHeader, timeout)
                .getText(xpath.orderNumber, function(result){
                    browser.infoLog("Order Number: " + result.value);
                });
        },
        getOrderNumberFromCheckout : function(callback){
            return browser
                .useXpath()
                .waitForElementVisible(xpath.orderConfirmationHeader, timeout)
                .getText(xpath.orderNumber, function(result){
                    browser.infoLog("Order Number: " + result.value)
                    callback(result.value);
                });
        }
    };
};
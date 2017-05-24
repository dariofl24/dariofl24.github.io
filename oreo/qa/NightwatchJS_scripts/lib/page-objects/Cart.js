/**
 * Created by vesteban on 4/30/15.
 */

var Util = require('util');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;
    var sum;
    var total;

    var css = {};

    css.normalCheckoutButton = 'button.checkout-button[name="dwfrm_cart_checkoutCart"]';
    css.paypalCheckoutButton = '.checkout-options>a[title="Checkout with Paypal"]';
    css.viewCart = 'a.mini-cart-link[title="View Cart"]';
    css.removeProductButton = 'button[value="Remove"]';
    css.quantitySelector = '#select2-dwfrm_cart_shipments_i0_items_i0_quantity-container'
    css.quantityCart = 'li[id$="%s"]'

    var xpath = {};
    xpath.subTotal = "//div[@class='order-row order-subtotal']/span[@class='price']";
    xpath.errorMessageCartFull = "//div[@class='error-form cart-is-full warning-form']"
    xpath.errorMoreThanTenItems = "//div[@class='error-form cart-full-error']"

    return {
        pressCheckoutButton : function(selector) {
            return browser
                .infoLog('[Cart] - Press Checkout Button')
                .useCss()
                .waitForElementPresent(selector, timeout, function(){
                    browser.click(selector)
                })
        },
        normalCheckout : function() {
            return browser
                .infoLog('[Cart] - Normal Checkout')
                .useCss()
                .page.Cart().pressCheckoutButton(css.normalCheckoutButton);
        },
        paypalCheckout : function() {
            return browser
                .infoLog('[Cart] - PayPal Checkout')
                .useCss()
                .page.Cart().pressCheckoutButton(css.paypalCheckoutButton);
        },
        viewCart : function() {
            return browser
                .infoLog('[Cart] - View Cart')
                .useCss()
                .waitForElementPresent(css.viewCart, timeout)
                .getAttribute(css.viewCart, 'href', function(result) {
                    browser
                        .infoLog('[Cart] - Going to ' + result.value)
                        .url(result.value);
                })
        },
        getSubTotal : function(callback) {
            browser
                .infoLog('[Cart] - Get Sub Total')
                .useXpath()
                .getText(xpath.subTotal, function(result){
                    var total = result.value.toString();
                    totalMinusSign = total.substring(1);
                    if(typeof callback == 'function') {
                        callback(totalMinusSign);
                    }
                });
        },
        changeQtyOfProductInCart : function(QTY) {
        var qtySelection = Util.format(css.quantityCart, QTY);
            return browser
                .infoLog('[Cart] - Change QTY of product to ' + QTY)
                .useCss()
                .click(css.quantitySelector)
                .click(qtySelection)
        },
        errorFullMessage : function() {
            return browser
                .infoLog('[Cart] - Error Full Cart Should Display ')
                .useXpath()
                .waitForElementVisible(xpath.errorMessageCartFull, timeout, 'Error full bag message displayed');
        },
        errorFullMessageShouldNotDisplay : function() {
            return browser
                .infoLog('[Cart] - Error Full Cart Should Not Display ')
                .useXpath()
                .waitForElementNotPresent(xpath.errorMessageCartFull, timeout, 'Error full bag message not displayed');
        },
        errorMoreThanTenItemsMessagesShouldDisplay : function() {
            return browser
                .infoLog('[Cart] - Error More Than Ten Items Should Display ')
                .useXpath()
                .waitForElementVisible(xpath.errorMoreThanTenItems, timeout, 'Error  More Than Ten Items message displayed');
        },
        errorMoreThanTenItemsMessageShouldNotDisplay : function() {
            return browser
                .infoLog('[Cart] - Error More Than Ten Items Should Not Display ')
                .useXpath()
                .waitForElementNotPresent(xpath.errorMoreThanTenItems, timeout, 'Error  More Than Ten Items message not displayed');
        },
        deleteOneItemFromCart : function() {
            browser
                .infoLog('[Cart] - Delete 1 item from cart')
                .elements('css selector', css.removeProductButton, function(result){
                    if(result.value.length > 0) {
                        browser.elementIdClick(result.value[1].ELEMENT);
                        browser.acceptAlert();
                        browser.pause(2000);
                    } else {
                        browser.infoLog('[Cart] - Cart is already empty');
                    }
                });
            return browser
        },
        emptyCart : function() {
            browser
                .infoLog('[Cart] - Empty Cart')
                .elements('css selector', css.removeProductButton, function(result){
                    if(result.value.length > 0) {
                        for(var i=0; i<result.value.length; i++) {
                            browser.elementIdClick(result.value[i].ELEMENT);
                            browser.acceptAlert();
                        }
                    } else {
                        browser.infoLog('[Cart] - Cart is already empty');
                    }
                });
            return browser
        }
    };
};
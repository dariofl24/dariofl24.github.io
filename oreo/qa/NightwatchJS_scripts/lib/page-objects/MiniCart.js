/**
 * Created by vesteban on 4/30/15.
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    css.viewCartButton = '.button.view-cart-btn';
    css.miniCartDiv = 'div.mini-cart';
    css.subTotal = '#minicart-panel > div > div.product-info > div.cart-info > div.subtotal > strong';

    var xpath = {};

    xpath.viewCartButton = '//*[@id="minicart-panel"]/div/div[2]/div[3]/div[2]/a';

    return {
        viewCart : function() {
            return browser
                .infoLog('[MiniCart] - View Cart')
                .useCss()
                //.waitForElementVisible(css.viewCartButton, timeout)
                .useCss()
                .element('css selector', css.viewCartButton, function(result){
                    if (!result.value.ELEMENT){
                        browser.infoLog('[PDP] - Click Add To Cart Again')
                        browser.page.PDP().addToCart()
                    }
                })
                //.waitForElementVisible(css.miniCartDiv, timeout)
                .clickOnLink(css.miniCartDiv);
                //.clickOnLink(css.viewCartButton);
        },
        getSubTotal : function(callback) {
            return browser
                .infoLog('[MiniCart] - Get Subtotal')
                .useCss()
                .waitForElementVisible(css.subTotal, timeout)
                .getText(css.subTotal, function(result){
                    var subTotal = parseFloat(result.value.trim().substr(1));
                    browser.infoLog('Subtotal: $' + subTotal);
                    if(typeof callback == 'function') {
                        callback(subTotal);
                    }
                });
        }
    };
};

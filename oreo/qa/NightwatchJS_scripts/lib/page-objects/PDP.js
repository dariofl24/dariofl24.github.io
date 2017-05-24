/**
 * Created by vesteban on 4/29/15.
 */

var PaymentTestData = require('../testdata/PaymentTestData');
module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    //css.notAvailable = '.not-available-msg';
    //css.notAvailable = '.out-of-stock';
    css.notAvailable = '.add-to-cart[title=null]';
    css.sizesSelect = '#select2-sizes-container';
    css.addToCartButton = '.add-to-cart';

    css.shareLinksButton = 'a.share-social';
    css.facebookShareButton = '#share-links-pdp-reaction0-facebook_img';
    css.twitterShareButton = '#share-links-pdp-reaction1-twitter_img';
    css.pinterestShareButton = '#share-links-pdp-reaction2-pinterest_img';

    css.facebookShareButtonPDP = 'div.social-icon-facebook';
    css.twitterShareButtonPDP = 'div.social-icon-twitter';
    css.pinterestShareButtonPDP = 'div.social-icon-pinterest';

    var xpath = {};

    xpath.addToCartButton = "//section[@class='product-detail pdp']//button[@id='add-to-cart']";
    xpath.sizesSelect = "//section[@class='product-detail pdp']//select[@id='sizes']"
    xpath.sizesSelectEnabledOption = "//ul[@id='select2-sizes-results']//li[@aria-selected][1]";
    xpath.priceSales = "//section[@class='product-detail pdp']//div[@class='tablet-left']//span[@itemprop='price']";
    xpath.sizeSelector = "//section[@class='product-detail pdp']//span[@id='select2-sizes-container']";

    return {
        selectAnotherRandomProductIfNotAvailable : function() {
            return browser
                .element('css selector', css.notAvailable, function(result) {
                    if(result.value && result.value.ELEMENT) {
                        browser
                            .infoLog('[PDP] - This product is not available... selecting another random product')
                            //.page.Categories().selectRandomSubCategory()
                            .page.Search().searchForTerm('camo')
                            .page.PLP().selectRandomProduct();
                    }else{
                        browser
                            .infoLog('[PDP] - This product has stock');
                    }
                })
        },
        getProductPriceEmeaPDP : function(callback) {
            return browser
                .infoLog('[PDP] - Get Product Price')
                .useXpath()
                .getText(xpath.priceSales, function(result){
                    //var productPriceMinusSign = parseFloat(result.value.trim().substr(1));
                    var productPrice = result.value.toString();
                    productPriceMinusSign = productPrice.substring(1);
                    productPriceFloat = parseFloat(productPriceMinusSign);
                    if(typeof callback == 'function') {
                        callback(productPriceFloat);
                    }
                });
        },
        getProductPrice : function(callback) {
            return browser
                .infoLog('[PDP] - Get Product Price')
                .useXpath()
                .getText(xpath.priceSales, function(result){
                    browser.infoLog('[PDP] - Product Price is: ' + result.value);
                    callback(parseFloat(result.value.substr(0, result.value.length - 2)));
                });
        },
        selectAnotherRandomProductIfPriceIsMoreThanGiftCardsBalance : function() {
            var giftCardBalance = PaymentTestData.getGiftCardsBalance();
            return browser
                .infoLog('[PDP] - Review price on current product.')
                .useCss()
                .infoLog('gift card balance: ' + giftCardBalance)
                .page.PDP().getProductPrice(function(productPrice){
                    if(productPrice > giftCardBalance) {
                        browser
                            .infoLog('[PDP] - You can not afford this product which price is $'+ productPrice + ', you have $'+ giftCardBalance +' in your Gift Card...selecting another one')
                            .page.Checkout().normalCheckoutProductPriceLessThanGiftCardBalance();
                    } else {
                        browser
                            .infoLog('[PDP] - Ok, You can afford this product which price is $'+ productPrice + ', you have $'+ giftCardBalance +' in your Gift Card.');
                    }
                });
        },
        addProductsToCartUntilSubtotalIsMoreExpensiveThanGiftCardBalance : function() {
            var giftCardBalance = PaymentTestData.getGiftCardsBalance();
            return browser
                .infoLog('[PDP] - Add Products to Cart Until Subtotal Is More Expensive Than Gift Card Balance')
                .page.PDP().selectRandomSize()
                .page.PDP().addToCart()
                .page.MiniCart().getSubTotal(function(subTotal){
                    if(subTotal <= giftCardBalance) {
                        browser
                            .infoLog('[PDP] - Keep adding products to Cart')
                            .page.Categories().selectRandomSubCategory()
                            .page.PLP().selectRandomProduct()
                            .page.PDP().addProductsToCartUntilSubtotalIsMoreExpensiveThanGiftCardBalance();
                    }
                });
        },
        selectRandomSize : function() {
            return browser
                .infoLog('[PDP] - Selecting a random size on current product')
                .useXpath()
                .waitForElementVisible(xpath.sizeSelector, timeout, function(){
                    browser.click(xpath.sizeSelector)
                })
                .infoLog('Size to be selected: ' + xpath.sizesSelectEnabledOption.value)
                .click(xpath.sizesSelectEnabledOption)
        },
        addToCart : function() {
            return browser
                .infoLog('[PDP] - Adding to cart')
                .useXpath()
                .waitForElementVisible(xpath.addToCartButton, timeout, function(){
                    browser.click(xpath.addToCartButton);
                })
        },
        expandShareSocialButtons : function() {
            return browser
                .infoLog('[PDP] - Expand Share Social Buttons')
                .useCss()
                .waitForElementVisible(css.shareLinksButton, timeout)
                .click(css.shareLinksButton);
        },
        shareOnFacebook : function () {
            return browser
                .infoLog('[PDP] - Share on Facebook')
                .useCss()
                .waitForElementVisible(css.facebookShareButtonPDP, timeout)
                .click(css.facebookShareButtonPDP);
        },
        shareOnFacebookEmea : function () {
            return browser
                .infoLog('[PDP] - Share on Facebook')
                .useCss()
                .waitForElementVisible(css.facebookShareButton, timeout)
                .click(css.facebookShareButton);
        },
        shareOnTwitter : function() {
            return browser
                .infoLog('[PDP] - Share on Twitter')
                .useCss()
                .waitForElementVisible(css.twitterShareButton, timeout)
                .click(css.twitterShareButton);
        },
        shareOnTwitterEmea : function() {
            return browser
                .infoLog('[PDP] - Share on Twitter')
                .useCss()
                .waitForElementVisible(css.twitterShareButtonPDP, timeout)
                .click(css.twitterShareButtonPDP);
        },
        addItemToCartAndRemainInPDP : function() {
            return browser
                //.page.Categories().selectRandomSubCategory()
                .page.Search().searchForTerm('camo')
                .page.PLP().selectRandomProduct()
                .page.PDP().selectAnotherRandomProductIfNotAvailable()
        },
        shareOnPinterest : function() {
            return browser
                .infoLog('[PDP] - Share on Pinterest')
                .useCss()
                .waitForElementVisible(css.pinterestShareButton, timeout)
                .click(css.pinterestShareButton);
        },
        shareOnPinterestEmea : function() {
            return browser
                .infoLog('[PDP] - Share on Pinterest')
                .useCss()
                .waitForElementVisible(css.pinterestShareButtonPDP, timeout)
                .click(css.pinterestShareButtonPDP);
        }
    };
};

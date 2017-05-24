/**
 * Created by gledesma on 8/15/16.
 */

module.exports = {
    //tags: ['checkout', 'creditcard', 'regression'],
    tags: ['Smoke'],
    beforeEach : function(browser) {
        // Line below is necessary to construct xpath correctly when selecting category, it let us know if we are in the US site or not
        browser.globals.dw.lang = "";
        browser
            .infoLog('Setting Up...')
            .timeoutsImplicitWait(15000)
            .resizeWindow(1250, 900)
            .url(TKUtil.getDemandwareBaseURL(browser.globals) + browser.globals.locales.uk.english.localized_homepage)
    },
    'Update QTY of products in cart verify totals match change' : function(browser) {
        browser
            .page.Cookies().acceptCookies()
            .page.EmailToggle().closeEmailToggle()
            .page.PDP().addItemToCartAndRemainInPDP()
            .page.PDP().getProductPriceEmeaPDP(function(productPrice){
                browser
                    .infoLog('[Cart] - Price Item 1: ' + productPrice)
                    .page.PDP().selectRandomSize()
                    .page.PDP().addToCart()
                    .page.PDP().addItemToCartAndRemainInPDP()
                    .page.PDP().getProductPriceEmeaPDP(function(productPrice2){
                        var sum = parseFloat(productPrice + productPrice2).toFixed(2)
                        browser
                            .infoLog('[Cart] - Price Item 2: ' + productPrice2)
                            .infoLog('[Cart] - SUM: ' + sum)
                            .page.PDP().selectRandomSize()
                            .page.PDP().addToCart()
                            .page.MiniCart().viewCart()
                            .page.Cart().getSubTotal(function(subTotalCart){
                                browser
                                    .infoLog('[Cart] - Cart Total is: ' + subTotalCart)
                                    .infoLog('[Cart] - Does ' + sum + ' Match ' + subTotalCart)
                                    .assert.equal(sum, subTotalCart, "Totals Match")
                                    browser
                                        .page.Cart().deleteOneItemFromCart()
                                        .page.Cart().getSubTotal(function(subTotalCart2){
                                            browser
                                                .infoLog('[Cart] - Does ' + productPrice + ' Match ' + subTotalCart2 + ' After removing an item? ')
                                                .assert.equal(productPrice, subTotalCart2, "Totals Match")
                                                browser.page.Cart().emptyCart();
                                        })
                            })
                    })
            })
    },
    'Update QTY of product in cart verify error message displays' : function(browser) {
        browser
            .page.Cart().emptyCart()
            .page.Search().searchForTerm('M9166C')
            .page.PDP().selectAnotherRandomProductIfNotAvailable()
            .page.PDP().selectRandomSize()
            .page.PDP().addToCart()
            .page.MiniCart().viewCart()
            .page.Cart().changeQtyOfProductInCart(10)
            .page.Cart().errorFullMessage()
            .page.Search().searchForTerm('150154C')
            .page.PDP().selectAnotherRandomProductIfNotAvailable()
            .page.PDP().selectRandomSize()
            .page.PDP().addToCart()
            .page.MiniCart().viewCart()
            .page.Cart().errorMoreThanTenItemsMessagesShouldDisplay()
            .page.Cart().changeQtyOfProductInCart(8)
            .page.Cart().errorMoreThanTenItemsMessageShouldNotDisplay()
            .page.Cart().errorFullMessageShouldNotDisplay()
            .page.Cart().emptyCart();
    },
    after : function(browser) {
        browser.globals.dw.lang = "";
        browser
            .infoLog('Closing down...')
            .end();
    }
};
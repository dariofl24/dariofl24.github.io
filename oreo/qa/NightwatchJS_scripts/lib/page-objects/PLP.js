/**
 * Created by vesteban on 4/27/15.
 */

var TKUtil = require('../util/TKUtil');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};

    css.productLinks = '.thumb-link:not([href*="/dyo/"])';
    css.sortBy = '#sort-by-select-box';
    css.priceHighToLowOption = css.sortBy + ' > option:nth-child(3)';

    return {
        selectRandomProduct : function() {
            return browser
                .infoLog('[PLP] - Selecting Random Product')
                .useCss()
                .element('css selector', css.sortBy, function(result){
                    if(result.value.ELEMENT) {
                        browser
                            .infoLog('[PLP] - Select Random option in Sort By select')
                            .setRandomOptionInSelect(css.sortBy);
                    }
                })
                .waitForElementVisible(css.productLinks, timeout)
                .elements('css selector',css.productLinks, function(result){
                    if(result.value.length > 0) {
                        var randomIndex = TKUtil.randomInt(0, result.value.length);

                        browser.elementIdClick(result.value[randomIndex].ELEMENT);
                    } else {
                        browser
                            .infoLog('[PLP] - There are no products, selecting another Subcategory and product')
                            .page.Subcategories().selectRandomSubCategory()
                            .page.PLP().selectRandomProduct();
                    }
                });
        }
    };
};


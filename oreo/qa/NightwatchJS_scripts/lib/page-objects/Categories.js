/**
 * Created by vesteban on 4/27/15.
 */

var TKUtil = require('../util/TKUtil');
var Util = require('util');

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    //var categories = ['Men', 'Women', 'Kids', 'Explore'];
    var categories = ['Men', 'Women', 'Kids'];
    var subCategories = [
           [//'topnav-men-categories-sneakers','topnav-men-categories-clothing',
            //'topnav-men-shopby-allstar','topnav-men-shopby-cons','topnav-men-shopby-jackpurcell',
            'topnav-men-featured-counterclimate'
            //'topnav-men-collections-classiccolors','topnav-men-collections-freshcolors','topnav-men-collections-leather','topnav-men-collections-rubber', 'topnav-men-more-newarrivals'
            ],
           [//'topnav-women-categories-sneakers','topnav-women-clothing',
            //'topnav-women-shopby-allstar','topnav-women-shopby-jackpurcell',
            'topnav-women-featured-counterclimate'
            //'topnav-women-collections-classiccolors','topnav-women-collections-freshcolors','topnav-women-collections-leather','topnav-women-collections-rubber', 'topnav-women-more-newarrivals'
            ],
           [//'topnav-kids-categories-sneakers',
           //'topnav-kids-featured-counterclimate'
            //'topnav-kids-shopby-allstar',
            //'topnav-kids-collections-classiccolors',
            //'topnav-kids-more-newarrivals'
            ],
           [//'topnav-explore-featured-mens','topnav-explore-featured-womens','topnav-explore-featured-kids','topnav-explore-featured-houseofcolour',
           //'topnav-explore-featured-customhome',
           //'topnav-explore-featured-cons','topnav-explore-featured-jackpurcell',
            //'topnav-explore-collections-modern',
            //'topnav-explore-collections-chucktaylorallstarii'
            //,'topnav-explore-collections-limitededition'
            //,'topnav-explore-more-aboutconverse'
            ]
    ];

    var css = {};

    css.category = 'a[data-category="%s"]';
    css.subCategory = 'a[href$="%s"]';
    css.categoriesBreadcrumb = "#results-products";

    return {
        selectRandomSubCategory : function() {
            //var randomCategoryIndex  = TKUtil.randomInt(0, categories.length);
            var randomCategoryIndex  = TKUtil.randomInt(0, 2);
            var categorySelector = browser.globals.dw.lang == "en_US" ? Util.format(css.category, categories[randomCategoryIndex].toUpperCase()) : Util.format(css.category, categories[randomCategoryIndex]);

            var randomSubcategoryIndex = TKUtil.randomInt(0, subCategories[randomCategoryIndex].length);
            var subCategorySelector = Util.format(css.subCategory, subCategories[randomCategoryIndex][randomSubcategoryIndex]);

            return browser
                .infoLog('[Categories] - Selecting Random Subcategory')
                .useCss()
                .waitForElementVisible(categorySelector, timeout)
                .moveTo(categorySelector)
                .waitForElementPresent(subCategorySelector, timeout)
                .getAttribute(subCategorySelector, 'href', function(result) {
                    browser
                        .infoLog('[Categories] - Going to ' + result.value)
                        .url(result.value)
                        .waitForElementVisible(css.categoriesBreadcrumb, timeout);
                });
        },
        verifyCategoryHasProducts : function(categoryIndex){
            //var categorySelector = Util.format(css.category, categories[categoryIndex].toUpperCase());
            var categorySelector = Util.format(css.category, categories[categoryIndex]);
            var subCategorySelector = "";
            browser.infoLog("[Categories] Verifying Category " + categories[categoryIndex]);
            for(i=0; i < subCategories[categoryIndex].length; i++){
                subCategorySelector = Util.format(css.subCategory, subCategories[categoryIndex][i]);
                browser
                    .waitForElementVisible(categorySelector, timeout)
                    .moveTo(categorySelector)
                    .waitForElementPresent(subCategorySelector, timeout);
            }
        }
    }
};
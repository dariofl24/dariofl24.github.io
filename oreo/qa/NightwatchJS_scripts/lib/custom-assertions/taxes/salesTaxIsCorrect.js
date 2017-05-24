/**
 * Created by vesteban on 6/3/15.
 */

var Util = require('util');

exports.assertion = function(msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = Util.format("Verifying that Sales Tax is correct");

    var css = {};
    css.salesTax = '.order-sales-tax > span.price';
    css.shippingMethod = '#primary > div > div > div.checkout-step-review > ul.method-details > li.shipping-info';
    css.cityStateZipCode = '#primary > div > div > div.checkout-step-review > ul.address-details > li:nth-child(5)';

    this.message = msg || DEFAULT_MSG;

    this.expected = {};


    this.expected["Los Angeles, CA 90045"] = {};
    this.expected["Los Angeles, CA 90045"]["UPS Ground"]           = 11.25;
    this.expected["Los Angeles, CA 90045"]["UPS 2nd Day Delivery"] = 12.42;
    this.expected["Los Angeles, CA 90045"]["UPS Express Delivery"] = 11.25;
    this.expected["Los Angeles, CA 90045"]["UPS Overnight"]        = 12.6;
    this.expected["Los Angeles, CA 90045"]["UPS Next Day Air"]     = 12.6;
    this.expected["Los Angeles, CA 90045"]["APO FPO Shipments"]    = 11.25;

    this.expected["Miami, FL 33153"] = {};
    this.expected["Miami, FL 33153"]["UPS Ground"]           = 4.55;
    this.expected["Miami, FL 33153"]["UPS 2nd Day Delivery"] = 9.66;
    this.expected["Miami, FL 33153"]["UPS Express Delivery"] = 4.55;
    this.expected["Miami, FL 33153"]["UPS Overnight"]        = 9.8;
    this.expected["Miami, FL 33153"]["UPS Next Day Air"]     = 5.60;
    this.expected["Miami, FL 33153"]["APO FPO Shipments"]    = 8.75;

    this.expected["New York, NY 10163"] = {};
    this.expected["New York, NY 10163"]["UPS Ground"]           = 0.00;
    this.expected["New York, NY 10163"]["UPS 2nd Day Delivery"] = 12.24;
    this.expected["New York, NY 10163"]["UPS Express Delivery"] = 0.00;
    this.expected["New York, NY 10163"]["UPS Overnight"]        = 12.42;
    this.expected["New York, NY 10163"]["UPS Next Day Air"]     = 12.42;
    this.expected["New York, NY 10163"]["APO FPO Shipments"]    = 11.62;

    this.expected["Redmond, WA 98052"] = {};
    this.expected["Redmond, WA 98052"]["UPS Ground"]           = 6.18;
    this.expected["Redmond, WA 98052"]["UPS Express Delivery"] = 6.18;
    this.expected["Redmond, WA 98052"]["UPS 2nd Day Delivery"] = 13.11;
    this.expected["Redmond, WA 98052"]["UPS Overnight"]        = 13.3;
    this.expected["Redmond, WA 98052"]["UPS Next Day Air"]     = 13.3;
    this.expected["Redmond, WA 98052"]["APO FPO Shipments"]    = 12.44;


    this.shippingMethod = null;

    this.setShippingMethod =  function(shippingMethod) {
        this.api.infoLog('[salesTaxIsCorrect] - Shipping Method: ' + shippingMethod);
        this.shippingMethod = shippingMethod;
    };

    this.cityStateZipCode = null;

    this.setCityStateZipCode = function(cityStateZipCode) {
        this.api.infoLog('[salesTaxIsCorrect] - City, State and Zip Code: ' + cityStateZipCode);
        this.cityStateZipCode = cityStateZipCode;
    };

    this.pass = function(value) {
        return this.expected[this.cityStateZipCode][this.shippingMethod] == value;
    };

    this.value = function(result) {
        return parseFloat(result.value.trim().substr(1));
    };

    this.command = function(callback) {
        var self = this;

        return this.api
            .useCss()
            .waitForElementPresent(css.shippingMethod, timeout)
            .getText(css.shippingMethod, function(shippingMethodText){
                self.setShippingMethod(shippingMethodText.value.trim().substr(0, shippingMethodText.value.indexOf(":")));

                self.api.useCss()
                    .waitForElementPresent(css.cityStateZipCode, timeout)
                    .getText(css.cityStateZipCode, function(cityStateZipCodeText){
                        self.setCityStateZipCode(cityStateZipCodeText.value.trim());

                        self.api
                            .waitForElementPresent(css.salesTax, timeout)
                            .getText(css.salesTax, callback);
                    });
            })

    };
};

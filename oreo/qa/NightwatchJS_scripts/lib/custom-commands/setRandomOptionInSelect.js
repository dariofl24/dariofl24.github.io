/**
 * Created by vesteban on 5/11/15.
 */

var TKUtil = require('../util/TKUtil');

exports.command = function(selectCssSelector, callback) {
    var self = this;

    var timeout = this.globals.elements_timeout;

    var numberOfOptions = 0;

    var css = {};
    css.allOptionsSelector =  selectCssSelector + ' > option:nth-child(n):enabled';

    try {
        this.elements('css selector', css.allOptionsSelector, function(result) {
            numberOfOptions = result.value.length;
            if(numberOfOptions > 1) {
                var randomOptionNumber = TKUtil.randomInt(1, result.value.length);
                this.elementIdClick(result.value[randomOptionNumber].ELEMENT);
            }
        })
        .pause(timeout);
    } catch(err) {
        console.log(err);
    }

    this.execute(function() {

    }, [], function(result){
        if(typeof(callback) == 'function') {
            callback.call(self, numberOfOptions)
        }
    });

    return this;
};

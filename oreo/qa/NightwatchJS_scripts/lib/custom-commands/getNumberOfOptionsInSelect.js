/**
 * Created by vesteban on 4/29/15.
 */

exports.command = function(selector, callback) {
    var self = this;

    var timeout = this.globals.elements_timeout;

    var numberOfOptions = 0;
    try {
        this.
            useCss()
            .waitForElementVisible(selector, timeout);

        this.elements('css selector', selector, function(result) {
            numberOfOptions = result.value.length;
        });

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

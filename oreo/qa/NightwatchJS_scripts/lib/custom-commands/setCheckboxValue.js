/**
 * Created by vesteban on 5/26/15.
 */

exports.command = function(cssSelector, value, callback) {
    var self = this;

    var timeout = this.globals.elements_timeout;

    try {
        this
            .useCss()
            .waitForElementPresent(cssSelector, timeout)
            .element('css selector', cssSelector, function(checkbox){
                self.elementIdSelected(checkbox.value.ELEMENT, function(selected) {
                    if(selected.value != value) {
                        self.elementIdClick(checkbox.value.ELEMENT);
                    }
                });
            })
            //.pause(timeout);

    } catch(err) {
        console.log(err);
    }

    this.execute(function() {

    }, [], function(result){
        if(typeof(callback) == 'function') {
            callback.call(self);
        }
    });

    return this;
};
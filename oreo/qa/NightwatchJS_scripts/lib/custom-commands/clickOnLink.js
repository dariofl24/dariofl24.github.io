/**
 * Created by vesteban on 5/20/15.
 */

exports.command = function(cssSelector, callback) {
    var self = this;

    try {
        this
            .element('css selector', cssSelector, function(result){
                self.elementIdClick(result.value.ELEMENT);
            });
    } catch(err) {
        console.log(err);
    }

    this.execute(function() {

    }, [], function(result){
        if(typeof(callback) == 'function') {
            callback.call(self)
        }
    });

    return this;
};

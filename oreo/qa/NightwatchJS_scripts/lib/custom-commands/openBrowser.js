/**
 * Created by vesteban on 5/27/15.
 */

exports.command = function(url, name, callback) {
    var self = this;

    this.execute(function(urlToGo, windowName) {

        window.open(urlToGo, windowName);

        return true;

    }, [url, name], function(result){

        if(name) {
            self.switchWindow(name);
        }

        if(callback && typeof(callback) == 'function') {
            callback.call(self, result)
        }
    });

    return this;
};

/**
 * Created by vesteban on 5/15/15.
 */

//var Logger = require('nightwatch/lib/util/logger.js');
var Logger = require('/var/lib/jenkins/workspace/run-automation-tests/qa/NightwatchJS_scripts/lib/util/logger.js');
//var Logger = require('/Users/aledesma/NightConverse/confoo/qa/NightwatchJS_scripts/lib/util/logger.js')

exports.command = function(logMessage) {
    var self = this;

    this.pause(1,function() {
        Logger.info(logMessage);
    });

    this.execute(function() {

    }, [], function(result){
        if(typeof(callback) == 'function') {
            callback.call(self, arguments)
        }
    });

    return this;
};

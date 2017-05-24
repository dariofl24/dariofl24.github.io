/**
 * Created by vesteban on 4/27/15.
 */
var Util = require('util');

TKUtil = {
    randomInt : function(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    },
    arraysAreIdentical : function(array1, array2) {
        if(array1.length != array2.length) {
            return false;
        }
        for(var i=0; i<array1.length; i++) {
            if(!array1[i].equals(array2[i])) {
                return false;
            }
        }
        return true;
    },
    getRandomElementInArray : function(array) {
        var randomIndex = TKUtil.randomInt(0, array.length);

        return array[randomIndex];
    },
    getDemandwareBaseURL : function(globals) {
        var dw_hostname = globals.dw.hostname;
        var dw_user = globals.dw.user;
        var dw_password = globals.dw.password;

        var dwUrl = "";

        if(dw_user && dw_password) {
            dwUrl = Util.format("https://%s:%s@%s", dw_user, dw_password, dw_hostname);
        } else {
            dwUrl = Util.format("http://%s", dw_hostname);
        }
        return dwUrl;
    },
    getConverseStorefrontURL : function(globals) {
        return this.getDemandwareBaseURL(globals) + globals.dw.storefront_path;
    },
    getConverseEmployeeVerifyURL : function(globals) {
        return this.getDemandwareBaseURL(globals) + globals.dw.employee_verify_path;
    }
};

module.exports = TKUtil;
/**
 * Created by vesteban on 4/24/15.
 */

var Util = require('util');
var Account = require('../../model/Account');

exports.assertion = function(account, country, msg) {
    var DEFAULT_MSG = "Verifying if %s's account is being displayed.";
    var css = {};

    this.message = msg || Util.format(DEFAULT_MSG, account.getFirstName());

    this.expected = account;

    this.pass = function(value) {
        return expected.equals(value);
    };

    this.value = function(result) {
        return result;
    };

    this.command = function(callback) {
        if (country == "US"){
            return this.api.page.Account().getDisplayedAccount(callback);
        } else {
            return this.api.page.Account().getDisplayedAccountEmea(callback);
        }
    };

};

/**
 * Created by vesteban on 5/29/15.
 */

exports.command = function() {

    var textToSet = this.globals.ecn.user + '\t' + this.globals.ecn.password;

    this
        .setAlertText(textToSet)
        .acceptAlert();

    return this;
};

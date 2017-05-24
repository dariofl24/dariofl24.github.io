/*global _*/
/*jshint forin:false*/
(function(app, $) {

    _.mixin(_.str.exports());

    $.extend(app.util, {
        trimPrefix: function(str, prefix) {
            return str.substring(prefix.length);
        },

        isBlank: function(str) {
            return _.isBlank(str);
        },

        padLeft: function(str, padChar, len) {
            var digs = len || 10;
            var s = str.toString();
            var dif = digs - s.length;
            while (dif > 0) {
                s = padChar + s;
                dif--;
            }
            return s;
        }
    });

}(window.app = window.app || {}, jQuery));
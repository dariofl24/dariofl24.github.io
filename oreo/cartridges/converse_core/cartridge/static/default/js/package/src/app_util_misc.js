/*global _*/
/*jshint forin:false*/
(function(app, $) {

    $.extend(app.util, {
        firstObjectProperty: function(obj) {
            var key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    return obj[key];
                }
            }
            return null;
        },

        arrayToString: function(arr, separator) {
            return $.grep(arr, function(el) {
                return (el);
            }).join(separator);
        },

        parseIntOrDefault: function(numStr, defaultValue) {
            var num = parseInt(numStr, 10);
            return _.isNaN(num) ? defaultValue : num;
        }
    });

}(window.app = window.app || {}, jQuery));

/*jshint forin:false*/
(function(app, $) {

    $.extend(app.util, {
        loadDynamicCss: function(urls) {
            var i, len = urls.length;
            for (i = 0; i < len; i++) {
                app.util.loadedCssFiles.push(app.util.loadCssFile(urls[i]));
            }
        },

        // dynamically loads a CSS file
        loadCssFile: function(url) {
            return $("<link/>").appendTo($("head")).attr({
                    type: "text/css",
                    rel: "stylesheet"
                }).attr("href", url); // for i.e. <9, href must be added after link has been appended to head
        },
        // array to keep track of the dynamically loaded CSS files
        loadedCssFiles: [],

        // removes all dynamically loaded CSS files
        clearDynamicCss: function() {
            var i = app.util.loadedCssFiles.length;
            while (0 > i--) {
                $(app.util.loadedCssFiles[i]).remove();
            }
            app.util.loadedCssFiles = [];
        }
    });

}(window.app = window.app || {}, jQuery));

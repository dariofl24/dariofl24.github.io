// app.progress
(function(app, $) {
    var loader;
    app.progress = {
        show: function(container) {
            var target = (!container || $(container).length === 0) ? $("body") : $(container);
            loader = loader || $(".loader");

            if (loader.length === 0) {
                loader = $("<div/>").addClass("loader")
                    .append($("<div/>").addClass("loader-indicator"), $("<div/>").addClass("loader-bg"));

            }
            return loader.appendTo(target).show();
        },
        hide: function() {
            if (loader) {
                loader.hide();
            }
        }
    };
}(window.app = window.app || {}, jQuery));

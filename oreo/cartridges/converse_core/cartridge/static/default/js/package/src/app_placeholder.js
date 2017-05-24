// app.placeholder
(function(app, $) {
    app.placeholder = {
        init: function() {
            $("input").placeholder();
        }
    };
}(window.app = window.app || {}, jQuery));

(function(app, $) {

    app.inplaceEdit = {

        create: function(options) {
            var inplaceEdit = {
                target: options.target,
                cancel: function() {
                    if (options.cancelCallback) {
                        options.cancelCallback(inplaceEdit);
                    }
                },
                context: options.context
            };

            if (options.url) {
                app.ajax.load({
                        target: options.target,
                        url: options.url,
                        callback: function() {
                            options.callback(inplaceEdit);
                        }
                    });
            } else {
                options.target.show();
                options.callback(inplaceEdit);
            }
        }
    };

}(window.app = window.app || {}, jQuery));

// app.ajax
(function(app, $) {

    var currentRequests = [];
    // request cache

    function initGlobalAjaxDefaults() {
        $( document ).ajaxError( function( event, request, settings ) {
            if (request.status === 401) {
                location.href = app.urls.logout;
            }
        });
    }

    // sub namespace app.ajax.* contains application specific ajax components
    app.ajax = {
        // ajax request to get json response
        // @param - async - boolean - asynchronous or not
        // @param - url - String - uri for the request
        // @param - data - name/value pair data request
        // @param - callback - function - callback function to be called
        getJson: function(options) {
            options.url = app.util.toAbsoluteUrl(options.url);
            // return if no url exists or url matches a current request
            if (!options.url || currentRequests[options.url]) {
                return;
            }

            currentRequests[options.url] = true;

            // make the server call
            $.ajax({
                    dataType: "json",
                    url: options.url,
                    async: (typeof options.async === "undefined" || options.async === null) ? true : options.async,
                    data: options.data || {}
                })
            // success
            .done(function(response) {
                if (options.callback) {
                    options.callback(response);
                }
            })
            // failed
            .fail(function(xhr, textStatus) {
                if (textStatus === "parsererror") {
                    console.log(app.resources.BAD_RESPONSE);
                }
                if (options.callback) {
                    options.callback(null);
                }
            })
            // executed on success or fail
            .always(function() {
                // remove current request from hash
                if (currentRequests[options.url]) {
                    delete currentRequests[options.url];
                }
            });
        },

        post: function(options) {
            options.url = app.util.toAbsoluteUrl(options.url);

            if (!options.url || currentRequests[options.url]) {
                return;
            }

            currentRequests[options.url] = true;

            $.ajax({
                url: options.url,
                type: 'POST',
                data: options.data
            })
            .done(function(response) {
                if (options.success) {
                    options.success(options, response);
                }
            })
            .fail(function(xhr, textStatus) {
                if (options.fail) {
                    options.fail(options, textStatus);
                }
            })
            .always(function() {
                if (currentRequests[options.url]) {
                    delete currentRequests[options.url];
                }
            });
        },

        // ajax request to load html response in a given container

        // @param - url - String - uri for the request
        // @param - data - name/value pair data request
        // @param - callback - function - callback function to be called
        // @param - target - Object - Selector or element that will receive content
        // @param - content - function - callback function for extracting specific content from response. 
        //                    If not provided the default implementation will provided thefull response as the content.
        load: function(options) {
            options.url = app.util.toAbsoluteUrl(options.url);
            // return if no url exists or url matches a current request
            if (!options.url || currentRequests[options.url]) {
                return;
            }

            currentRequests[options.url] = true;

            // make the server call
            $.ajax({
                    dataType: "html",
                    url: app.util.appendParamToURL(options.url, "format", "ajax"),
                    data: options.data
                })
                .done(function(response) {
                    // success
                    if (options.target) {
                        var content = response;

                        if (options.content) {
                            content = options.content(response);
                        }

                        $(options.target).empty().html(content);
                    }
                    if (options.callback) {
                        options.callback(response);
                    }

                })
                .fail(function(xhr, textStatus) {
                    // failed
                    if (textStatus === "parsererror") {
                        window.alert(app.resources.BAD_RESPONSE);
                    }
                    options.callback(null, textStatus);
                })
                .always(function() {
                    app.progress.hide();
                    // remove current request from hash
                    if (currentRequests[options.url]) {
                        delete currentRequests[options.url];
                    }
                });
        },

        isCrossDomainSupported: function() {
            return ! ($.browser.msie && $.browser.version <= 9);
        },

        init: function() {
            initGlobalAjaxDefaults();
        }
    };
}(window.app = window.app || {}, jQuery));

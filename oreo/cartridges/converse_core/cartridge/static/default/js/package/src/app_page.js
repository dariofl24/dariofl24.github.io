// app.page
(function(app, $) {

    app.page = {
        title: "",
        type: "",
        setContext: function(o) {
            $.extend(this, o);
        },
        params: function() {
            return app.util.getQueryStringParams(window.location.search.substr(1));
        },
        redirect: function(newURL) {
            setTimeout(function() {
                app.page.setLocationHref(newURL);
            }, 0);
        },
        refresh: function() {
            setTimeout(function() {
                app.page.assignLocationHref(window.location.href);
            }, 500);
        },
        setLocationHref: function(url) {
            window.location.href = url;
        },
        assignLocationHref: function(url) {
            window.location.assign(url);
        }
    };
}(window.app = window.app || {}, jQuery));

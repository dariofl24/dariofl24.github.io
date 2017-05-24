/*jshint forin:false*/
(function(app, $) {

    $.extend(app.util, {
        appendParamToURL: function(url, name, value) {
            var c = "?";
            if (url.indexOf(c) !== -1) {
                c = "&";
            }
            return url + c + name + "=" + (app.util.isBlank(value) ? "" : encodeURIComponent(value));
        },

        appendParamsToUrl: function(url, params, hashArg) {
            var uri = app.util.getUri(url),
                includeHash = arguments.length < 3 ? false : hashArg;

            var qsParams = $.extend(uri.queryParams, params);
            var result = uri.path + "?" + $.param(qsParams);
            if (includeHash) {
                result += uri.hash;
            }
            if (result.indexOf("http") < 0 && result.charAt(0) !== "/") {
                result = "/" + result;
            }

            return result;
        },

        removeParamFromURL: function(url, parameter) {
            var urlparts = url.split('?');

            if (urlparts.length >= 2) {
                var urlBase = urlparts.shift();
                var queryString = urlparts.join("?");

                var prefix = encodeURIComponent(parameter) + '=';
                var pars = queryString.split(/[&;]/g);
                var i = pars.length;
                while (0 > i--) {
                    if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                        pars.splice(i, 1);
                    }
                }
                url = urlBase + '?' + pars.join('&');
            }
            return url;
        },

        updateParamFromURL: function(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            } else {
                return uri + separator + key + "=" + value;
            }
        },

        staticUrl: function(path) {
            if (!path || $.trim(path).length === 0) {
                return app.urls.staticPath;
            }

            return app.urls.staticPath + (path.charAt(0) === "/" ? path.substr(1) : path);
        },

        ajaxUrl: function(path) {
            return app.util.appendParamToURL(path, "format", "ajax");
        },

        toAbsoluteUrl: function(url) {
            if (url.indexOf("http") !== 0 && url.charAt(0) !== "/") {
                url = "/" + url;
            }
            return url;
        },

        toProtocolNeutralUrl: function(url) {
            var index = url ? url.indexOf("://") : -1;
            return index >= 0 ? url.substr(index + 1) : url;
        },

        getCurrentUrl: function() {
            return window.location.href;
        },

        getQueryStringParams: function(qs) {
            if (!qs || qs.length === 0) {
                return {};
            }

            var params = {}, unescapedQS = unescape(qs);
            // Use the String::replace method to iterate over each
            // name-value pair in the string.
            unescapedQS.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function($0, $1, $2, $3) {
                params[$1] = $3;
            });
            return params;
        },

        getUri: function(o) {
            var a;
            if (o.tagName && $(o).attr("href")) {
                a = o;
            } else if (typeof o === "string") {
                a = document.createElement("a");
                a.href = o;
            } else {
                return null;
            }

            var path = (a.pathname.charAt(0) === '/' ? '' : '/') + a.pathname;

            return {
                protocol: a.protocol, //http:
                host: a.host, //www.myexample.com
                hostname: a.hostname, //www.myexample.com'
                port: a.port, //:80
                path: path, // /sub1/sub2
                query: a.search, // ?param1=val1&param2=val2
                queryParams: a.search.length > 1 ? app.util.getQueryStringParams(a.search.substr(1)) : {},
                hash: a.hash, // #OU812,5150
                url: a.protocol + "//" + a.hostname + path,
                urlWithQuery: a.protocol + "//" + a.hostname + a.port + path + a.search
            };
        },

        hashExists: function() {
            return (window.location.hash) ? true : false;
        },

        getHashFromUrl: function() {
            return window.location.hash.substring(1);
        }
    });

}(window.app = window.app || {}, jQuery));
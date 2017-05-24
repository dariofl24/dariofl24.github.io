// app.pdpShare
(function(window, app, $) {

    var $cache = {
        sharePdpInfo : "#share-pdp-info",
        domain : window.location.protocol + "//" + window.location.hostname

    };

    var pdpshare = {

        productId: function() {
            return $($cache.sharePdpInfo).data("productid");
        },

        productName: function() {
            return $($cache.sharePdpInfo).data("productname");
        },

        productUrl: function() {
            return $($cache.sharePdpInfo).data("producturl");
        },

        shareOptions: {
            facebook: {
                serviceUrlTemplate: app.pdp.shareOptionFacebookServiceTemplate,
                urlToShareTemplate: app.pdp.shareOptionFacebookUrlToShareTemplate,
                openInNewWindow: true,
                serviceUrlGenerator: function() {
                    return app.pdpshare.generateShareServiceUrlFacebook;
                }
            },
            twitter: {
                serviceUrlTemplate: app.pdp.shareOptionTwitterServiceTemplate,
                urlToShareTemplate: app.pdp.shareOptionTwitterUrlToShareTemplate,
                openInNewWindow: true,
                serviceUrlGenerator: function() {
                    return app.pdpshare.generateShareServiceUrlTwitter;
                }
            },
            pinterest: {
                serviceUrlTemplate: app.pdp.shareOptionPinterestServiceTemplate,
                urlToShareTemplate: app.pdp.shareOptionPinterestUrlToShareTemplate,
                openInNewWindow: true,
                serviceUrlGenerator: function() {
                    return app.pdpshare.generateShareServiceUrlPinterest;
                }
            },
            email: {
                serviceUrlTemplate: app.pdp.shareOptionEmailServiceTemplate,
                urlToShareTemplate: app.pdp.shareOptionEmailUrlToShareTemplate,
                openInNewWindow: false,
                serviceUrlGenerator: function() {
                    return app.pdpshare.generateEmailShareServiceUrl;
                }
            }
        },

        generateShareServiceUrlFacebook: function(serviceUrlTemplate, urlToShareTemplate, data) {
            var productId = app.pdpshare.productId();
            var domain = $cache.domain;

            var urlToShare = String.format(urlToShareTemplate, domain, app.pdpshare.getSiteLocale(), productId);

            var escapedUrlToShare = encodeURIComponent(urlToShare);
            var serviceUrl = String.format(serviceUrlTemplate, escapedUrlToShare);

            return serviceUrl;
        },

        generateShareServiceUrlPinterest: function(serviceUrlTemplate, urlToShareTemplate, data) {
            var productId = app.pdpshare.productId();
            var domain = $cache.domain;
            var imageUrl = app.pdpshare.getPinterestImage();

            var urlToShare = String.format(urlToShareTemplate, domain, app.pdpshare.getSiteLocale(), productId);
            var escapedUrlToShare = encodeURIComponent(urlToShare);
            var imageUrlFormated= encodeURIComponent(imageUrl);
            var serviceUrl = String.format(serviceUrlTemplate, escapedUrlToShare,imageUrlFormated);


            return serviceUrl;
        },

        generateShareServiceUrlTwitter: function(serviceUrlTemplate, urlToShareTemplate, data) {
            var productId = app.pdpshare.productId();
            var domain = $cache.domain;

            var urlToShare = String.format(urlToShareTemplate, domain, app.pdpshare.getSiteLocale(), productId);
            var escapedUrlToShare = encodeURIComponent(urlToShare);
            var serviceUrl = String.format(serviceUrlTemplate, escapedUrlToShare);

            return serviceUrl;
        },

        getPinterestImage: function() {

            var ssimageURL = $("span#socialshareimg:first").text();
            return ssimageURL;

        },

        getSiteLocale: function() {

            return $("span#socialshareLocale:first").text();

        },

        generateEmailShareServiceUrl: function(serviceUrlTemplate, urlToShareTemplate, data) {

            var pdpUrl = app.pdpshare.productUrl();

            var subject = encodeURIComponent(app.resources.mail.PDP_SENDTOFRIEND_SUBJECT);
            var body = encodeURIComponent(String.format(app.resources.mail.PDP_SENDTOFRIEND_TEMPLATE_MOBILE_BODY, pdpUrl));
            var urlToShare = String.format(urlToShareTemplate, subject, body);
            var escapedUrlToShare = "?" + urlToShare;
            var serviceUrl = String.format(serviceUrlTemplate, escapedUrlToShare);

            return serviceUrl;
        },

        share: function( option )
        {
            var optionConfiguration = app.pdpshare.shareOptions[option];
            if( optionConfiguration === undefined )
            {
                return;
            }

            var name = "_self";

            if( optionConfiguration.openInNewWindow )
            {
                name = "_blank";
            }
            var urlGenerator =  optionConfiguration.serviceUrlGenerator();
            var url = urlGenerator(optionConfiguration.serviceUrlTemplate, optionConfiguration.urlToShareTemplate, null);

            window.open(url, name);

            return true;
        },

        init: function()
        {
            $(".product-action-share").on('click', function(event)
                {
                    event.preventDefault();
                    var shareOption = $(this).data("share");
                    app.pdpshare.share(shareOption);
                    return true;
                }
            );
        }

    };

    app.pdpshare = app.pdpshare || {};
    $.extend(app.pdpshare, pdpshare);

}(window, window.app = window.app || {}, jQuery));

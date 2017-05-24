/*global nike*/

// app.htmlBuilder
(function(app, $) {

    // function onError(event) {}

    var htmlBuilder = {
        containerId: "#html-builder-container",

        configuration: {
            cartCount: "0",
            isEU: false,
            functionalAndPerformance: undefined,
            advertising: undefined,
            siteId: 12,
            targetOrigin: null
        },

        initConverseConfiguration: function(configuration) {
            configuration.converse = {
                domain: window.location.protocol + "//" + window.location.hostname,
                productId: function() {
                    return $(app.htmlBuilder.containerId).data("productid");
                },
                shareOptions: {
                    facebook: {
                        serviceUrlTemplate: app.customization.shareOptionFacebookServiceTemplate,
                        urlToShareTemplate: app.customization.shareOptionFacebookUrlToShareTemplate,
                        openInNewWindow: true,
                        serviceUrlGenerator: function() {
                            return app.htmlBuilder.generateShareServiceUrl;
                        }
                    },
                    twitter: {
                        serviceUrlTemplate: app.customization.shareOptionTwitterServiceTemplate,
                        urlToShareTemplate: app.customization.shareOptionTwitterUrlToShareTemplate,
                        openInNewWindow: true,
                        serviceUrlGenerator: function() {
                            return app.htmlBuilder.generateShareServiceUrl;
                        }
                    },
                    pinterest: {
                        serviceUrlTemplate: app.customization.shareOptionPinterestServiceTemplate,
                        urlToShareTemplate: app.customization.shareOptionPinterestUrlToShareTemplate,
                        openInNewWindow: true,
                        serviceUrlGenerator: function() {
                            return app.htmlBuilder.generateShareServiceUrl;
                        }
                    },
                    email: {
                        serviceUrlTemplate: app.customization.shareOptionEmailServiceTemplate,
                        urlToShareTemplate: app.customization.shareOptionEmailUrlToShareTemplate,
                        openInNewWindow: false,
                        serviceUrlGenerator: function() {
                            return app.htmlBuilder.generateEmailShareServiceUrl;
                        }
                    }
                }
            };

            return configuration;
        },

        postConfiguration: function(data) {
            nike.id.frame.PageMessageUtil.postMessage(nike.id.Event.postMessage.CONFIG_RESPONSE, app.htmlBuilder.configuration);
        },

        buildAddToCartXML: function(item) {
            var xml = '<?xml version="1.0" encoding="UTF-8"?><root>\n';
            xml += '<configuration>\n' +
                '<metricId>' + item.metricId + '</metricId>\n' +
                '<quantity>' + item.quantity + '</quantity>\n' +
                '<siteId>' + item.siteId + '</siteId>\n' +
                '<itemReturnUrl><![CDATA[' + (item.itemReturnUrl || '') + ']]></itemReturnUrl>\n' +
                '<siteReturnUrl><![CDATA[' + (item.siteReturnUrl || '') + ']]></siteReturnUrl>\n' +
                '</configuration>\n';
            xml += '</root>';

            return xml;
        },

        buildAddToCartItem: function(metricId) {
            var dataItem = {
                metricId: metricId,
                quantity: 1,
                siteId: app.htmlBuilder.configuration.siteId,
                commerceItemId: null,
                siteReturnUrl: window.location.href,
                itemReturnUrl: window.location.href + "&metricId=" + metricId
            };

            return dataItem;
        },

        addToCartSuccessCallback: function(data) {
            var isSuccessResponse = data.indexOf('status="success"') > -1;

            if (isSuccessResponse) {
                app.htmlBuilder.notifyHtmlBuilder("nike.id.Event.postMessage.ADD_TO_CART_SUCCESS", nike.id.Event.postMessage.ADD_TO_CART_SUCCESS, data);
                app.product.addDYOProductAndUpdateMiniCart();
                return;
            }

            var isDuplicateResponse = data.indexOf('status="duplicate"') > -1;

            if (isDuplicateResponse) {
                // fail silently
                app.htmlBuilder.notifyHtmlBuilder("nike.id.Event.postMessage.ADD_TO_CART_SUCCESS", nike.id.Event.postMessage.ADD_TO_CART_SUCCESS, data);
                return;
            }

            app.htmlBuilder.addToCartErrorCallaback(data, null);
        },

        addToCartErrorCallaback: function(data, status) {
            app.htmlBuilder.notifyHtmlBuilder("nike.id.Event.postMessage.ADD_TO_CART_FAIL", nike.id.Event.postMessage.ADD_TO_CART_FAIL, data);
        },

        notifyHtmlBuilder: function(eventType, eventName, data) {
            var response = {
                type: eventType,
                data: data
            };

            nike.id.frame.PageMessageUtil.postMessage(eventName, response);
            nike.id.frame.PageMessageUtil.dispatch(eventName, response);
        },

        addToCart: function(data) {
            var cartUrl = app.urls.addDYOProduct;
            var metricId = data;

            app.htmlBuilder.reviewPanel.show(metricId).done(function(action) {
                if (action === "confirm") {
                    var dataItem = app.htmlBuilder.buildAddToCartItem(metricId);

                    var postData = {
                        xml: app.htmlBuilder.buildAddToCartXML(dataItem)
                    };

                    $.ajax({
                        type: "POST",
                        dataType: "text",
                        url: cartUrl,
                        data: postData,
                        success: app.htmlBuilder.addToCartSuccessCallback,
                        error: app.htmlBuilder.addToCartErrorCallback
                    });
                }
            });
        },

        addToWishList: function(data) {
            var metricId = data.metricId;
            app.htmlBuilder.savePanel.show(metricId);
        },

        getMetricId: function(data) {
            var persist = data.persist || {
                metricId: ''
            };
            return persist.metricId;
        },

        getImageShotUrl: function(metricId, width, viewType) {
            var nikeIdDomain = app.customization.nikeIdDomain;
            var shotUrl = 'http://{0}/services/imgredirect/fmt-png-alpha/bgc-na/mtr-{1}/wid-{2}/ops-1.9,0.8,0/{3}';

            return String.format(shotUrl, nikeIdDomain, metricId, width, viewType);
        },

        openShareDialog: function(data) {
            var metricId = app.htmlBuilder.getMetricId(data);
            app.htmlBuilder.emailPopup.show(metricId);
        },

        generateShareServiceUrl: function(serviceUrlTemplate, urlToShareTemplate, data) {
            var productId = app.htmlBuilder.configuration.converse.productId();
            var domain = app.htmlBuilder.configuration.converse.domain;
            var metricId = app.htmlBuilder.getMetricId(data);

            var urlToShare = String.format(urlToShareTemplate, domain, productId, metricId);
            var escapedUrlToShare = encodeURIComponent(urlToShare);
            var serviceUrl = String.format(serviceUrlTemplate, escapedUrlToShare);

            return serviceUrl;
        },

        generateEmailShareServiceUrl: function(serviceUrlTemplate, urlToShareTemplate, data) {
            var metricId = app.htmlBuilder.getMetricId(data);

            var pdpUrl = window.location.href;
            pdpUrl = app.util.removeParamFromURL(pdpUrl, "metricId");
            pdpUrl = app.util.appendParamToURL(pdpUrl, "metricId", metricId);

            var subject = encodeURIComponent(app.resources.mail.DYO_SENDTOFRIEND_SUBJECT);
            var body = encodeURIComponent(String.format(app.resources.mail.DYO_SENDTOFRIEND_TEMPLATE_MOBILE_BODY, pdpUrl));
            var urlToShare = String.format(urlToShareTemplate, subject, body);
            var escapedUrlToShare = "?" + urlToShare;
            var serviceUrl = String.format(serviceUrlTemplate, escapedUrlToShare);

            return serviceUrl;
        },

        bindEvents: function() {
            nike.id.frame.PageMessageUtil.listen(nike.id.Event.postMessage.CONFIG_REQUEST, app.htmlBuilder.postConfiguration);
            nike.id.frame.PageMessageUtil.listen(nike.id.Event.postMessage.ADD_TO_CART, app.htmlBuilder.addToCart);
            nike.id.frame.PageMessageUtil.listen(nike.id.Event.postMessage.OPEN_SHARE_DIALOG, app.htmlBuilder.openShareDialog);
            nike.id.frame.PageMessageUtil.listen(nike.id.Event.postMessage.addWishlistItemClickEvent, app.htmlBuilder.addToWishList);
            nike.id.frame.PageMessageUtil.listen(nike.id.Event.BUILDER_START, app.overlay.show);
            nike.id.frame.PageMessageUtil.listen(nike.id.Event.BUILDER_ENABLED, app.overlay.hide);
        },

        openPopup: function(source, content) {
            $.magnificPopup.open({
                fixedContentPos: true,
                items: {
                    src: source,
                    type: 'inline'
                }
            });

            if (arguments.length === 2) {
                $(source).find('> div').html(content);
            }

            $('.mfp-bg').addClass('html-builder-white-overlay');
        },

        closePopup: function() {
            $.magnificPopup.close();
            $('.mfp-bg').removeClass('html-builder-white-overlay');
        },

        preparePage: function() {
            $("#main").css({
                "padding-bottom": "0px"
            });
        },

        replaceBuilderClient: function() {
            var clientParam = "client=converse-desktop";
            if (window.width < 995) {
                clientParam = "client=converse";
            }
            $(app.htmlBuilder.containerId).attr("data-src", $("#url").val().replace(/client=([^&]+)/g, clientParam));
        },

        init: function() {
            app.htmlBuilder.replaceBuilderClient();
            app.htmlBuilder.configuration.targetOrigin = "http://" + app.customization.nikeIdDomain;
            app.htmlBuilder.initConverseConfiguration(app.htmlBuilder.configuration);
            nike.id.frame.ClassUtil.addCallback(app.htmlBuilder, app.htmlBuilder.bindEvents);
            app.htmlBuilder.preparePage();
            app.htmlBuilder.emailPopup.init();
            app.htmlBuilder.savePanel.init();
            app.htmlBuilder.reviewPanel.init();
        }
    };

    app.htmlBuilder = app.htmlBuilder || {};
    $.extend(app.htmlBuilder, htmlBuilder);

}(window.app = window.app || {}, jQuery));
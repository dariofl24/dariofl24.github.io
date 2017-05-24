(function(app, $) {

    var PUBSUB = app.constant.PUBSUB;
    var CUSTOMER_SERVICE = app.constant.CUSTOMER_SERVICE;

    var selector = {
        customer_service: ".pt_customer-service",
        support_tab_content: ".support-tab-content",
        navbar_link: ".support-tab-content > ul > li:not(.content-page)"
    };

    function getContentPageUrl(url) {
        return app.util.appendParamToURL(url, "format", "ajax");
    }

    function contentLoaded() {
        var contentName = $('.converse-tabs:visible').find('#content-marker').text();
        
        if(contentName) {
            $.publish(CUSTOMER_SERVICE.CONTENT_LOADED, contentName);
        }
    }

    function onContentNavigationClick(e) {
        e.preventDefault();

        var anchor = $(this).find("a");
        var contentUrl = getContentPageUrl(anchor.attr("href"));
        var parentTabContent = $(this).closest(selector.support_tab_content);

        app.ajax.load({
            url: contentUrl,
            target: parentTabContent,
            callback: contentLoaded
        });
    }

    function onTabComplete() {
        contentLoaded();
    }

    function initializeEvents() {
        $(selector.customer_service).on("click", selector.navbar_link, onContentNavigationClick);
        $.subscribe(PUBSUB.TABIFY.TAB_COMPLETE, onTabComplete);
    }

    app.customerservice = {
        init: function() {
            initializeEvents();
            app.distributors.init();
            app.checkOrderStatusForm.init();
        }
    };
}(window.app = window.app || {}, jQuery));

/*global RightNow*/
// app.rightnow
(function(app, $) {

    var TABIFY = app.constant.PUBSUB.TABIFY,
        SUPPORT_CONST = app.resources.support,
        selector = {
            converseTabs: '.converse-tabs',
            onlineShoppingTab: '#online-shopping',
            rightNowWidgets: '.converse-tabs .rightnow-widget',
            supportPageSectionTitle: '.support-page-right-content .section-title',
            supportPageLeftNavLi: '.support-page-left-nav > li',
            rightNowInput: '#rn_Queryskw_0',
            rightNowSearchButton: '#rn_SearchButtonskw_0'
        };

    function loadFaqRightNowModule() {
        return RightNow.Client.Controller.addComponent({
                div_id: "rightnow-faq",
                instance_id: "skw_0",
                module: "KnowledgeSyndication",
                label_created: "",
                label_updated: "",
                label_no_results: app.resources.support.RIGHTNOW_NO_RESULTS,
                display_answers_in_overlay: true,
                number_answers: 20,
                description: false,
                navigation: false,
                type: 3
            },
            "https://converse.widget.custhelp.com/ci/ws/get");
    }

    function resetFaqRightNowModule() {
        $(selector.supportPageLeftNavLi).removeClass('active');
        $(selector.supportPageLeftNavLi).eq(0).addClass('active');
        $(selector.rightNowInput).val('');
        $(selector.rightNowSearchButton).trigger('click');
        setSectionTitle(SUPPORT_CONST.ONLINE_SHOPPING_TITLE);
    }

    function getAllNavLinks() {
        var links = [];
        $(selector.supportPageLeftNavLi + ':visible').each(function() {
            links.push($(this).data('url-hash'));
        });
        return links;
    }

    function loadFromHash() {
        if (app.util.hashExists()) {
            var hash = app.util.getHashFromUrl();
            var navLinks = getAllNavLinks();

            if ($.inArray(hash, navLinks)) {
                loadLeftNavItem(hash);
            }
        }
    }

    function initializeWidgets() {
        $(selector.rightNowWidgets).each(function() {
            if ($(this).hasClass('is-widget-enabled')) {
                loadFaqRightNowModule();
                $(this).removeClass('is-widget-enabled');
            } else {
                resetFaqRightNowModule();
            }
        });
    }

    function widgetDataRequestEvent() {
        console.log('Widget data request event fired.');
    }

    function widgetAnswerResponseEvent() {
        console.log('Answer has loaded.');
    }

    function loadLeftNavItem(item) {
        var hash = item || '';
        var element;
        if ($('[data-url-hash="' + hash + '"]').exists()) {
            element = $('[data-url-hash="' + hash + '"]');
        } else {
            element = $(this);
        }
        var contentTab = element.html().trim();
        $(selector.supportPageLeftNavLi).removeClass('active');
        if (contentTab === SUPPORT_CONST.ONLINE_SHOPPING_TITLE) {
            resetFaqRightNowModule();
        } else {
            $(selector.rightNowInput).val(contentTab);
            $(selector.rightNowSearchButton).trigger('click');
            setSectionTitle(contentTab);
            $(selector.rightNowInput).val('');
        }
        element.addClass('active');
    }

    function onClickOnlineShoppingTab() {
        $(selector.onlineShoppingTab).on('click', resetFaqRightNowModule);
    }

    function onClickLeftNavLinks() {
        $(selector.converseTabs).on('click', selector.supportPageLeftNavLi, loadLeftNavItem);
    }

    function setSectionTitle(title) {
        $(selector.supportPageSectionTitle).html(title);
    }

    function onAjaxComplete() {
        $(document).ajaxComplete(function() {
            initializeWidgets();
        });
    }

    function onSubscribe() {
        $.subscribe(TABIFY.TAB_COMPLETE, function(pub, arg) {
            initializeWidgets();
        });
        RightNow.Client.Event.evt_dataRequest.subscribe(widgetDataRequestEvent);
        RightNow.Client.Event.evt_answerResponse.subscribe(widgetAnswerResponseEvent);
    }

    function onWidgetLoad() {
        $(selector.rightNowInput).waitUntilExists(function() {
            setSectionTitle(SUPPORT_CONST.ONLINE_SHOPPING_TITLE);
            onClickLeftNavLinks();
            loadFromHash();
        });
    }

    function bindEvents() {
        onAjaxComplete();
        onSubscribe();
        onWidgetLoad();
        onClickOnlineShoppingTab();
    }

    app.rightnow = {
        init: function() {
            bindEvents();
        }
    };

}(window.app = window.app || {}, jQuery));
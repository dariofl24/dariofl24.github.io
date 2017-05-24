// app.infinite_scroll
(function(app, $) {

    var CONST = app.constant,
        isDelay = false,
        selector = {
            footer: '#footer',
            ajaxLoader: '.ajax-loader',
            moreResultsContainer: '.more-results',
            moreResultsBtn: '#moreresults'
        },
        canAcceptActionsOnReachedBottom = true;

    function publishScrollStatus() {
        $(window).on('scroll', function() {
            var bottomHeight = $('footer').height() + 200;
            if (($(window).scrollTop() >= $(document).height() - $(window).height() - bottomHeight) && (!isDelay)) {
                if (!app.mobilemenu.isMenuExpanded()) {
                    $.publish(CONST.PUBSUB.SCROLL.REACHED_BOTTOM, []);
                }
            }
        });
    }

    function setDelay() {
        return setTimeout(function() {
            isDelay = false;
        }, 2000, isDelay);
    }

    function onReachedBottom() {
        isDelay = true;
        if ($(selector.moreResultsBtn).exists()) {
            $.publish(CONST.PUBSUB.SCROLL.LOAD_MORE_PAGES, []);
            $('.pt_product-search-result #moreresults').trigger('click');
        }
        setDelay();
    }

    function setFixedFooter() {
        $(selector.footer).css({
            'position': 'fixed',
            'z-index': 99
        });
    }
    
    function isFixedFooter() {
        if ($(selector.footer).css("position") === "fixed") {
            return true;
        }
        return false;
    }

    function onSubscribe() {
        $.subscribe(CONST.PUBSUB.SCROLL.REACHED_BOTTOM, function(v, arg) {
            if( canAcceptActionsOnReachedBottom === true )
            {
                onReachedBottom();
            }
        });

        $.subscribe(CONST.PUBSUB.SCROLL.LOAD_MORE_PAGES, function(v, arg) {
            $(selector.ajaxLoader).show();
        });

        $.subscribe(CONST.PUBSUB.SCROLL.DONE_LOADING_PAGES, function(v, arg) {
            $(selector.ajaxLoader).hide();
        });

        $.subscribe(CONST.PUBSUB.SCROLL.ACCEPT_ACTIONS_ON_REACHED_BOTTOM, function(v, arg) {
            canAcceptActionsOnReachedBottom = true;
        });

        $.subscribe(CONST.PUBSUB.SCROLL.DO_NOT_ACCEPT_ACTIONS_ON_REACHED_BOTTOM, function(v, arg) {
            canAcceptActionsOnReachedBottom = false;
        });

    }

    app.infiniteScroll = {
        init: function() {
            publishScrollStatus();
            onSubscribe();
            setFixedFooter();
        },
        isFixedFooter: isFixedFooter
    };

}(window.app = window.app || {}, jQuery));
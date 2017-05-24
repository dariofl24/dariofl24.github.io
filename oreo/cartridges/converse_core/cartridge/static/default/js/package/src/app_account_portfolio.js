// app.accountPortfolio
(function(app, $) {
    var $cache;

    function initializeCache() {
        $cache = {
            lockerItemsList: $('ul#locker-items-list'),
            header: $('div.pt_portfolio h1')
        };
    }

    function removeLockerItemElement(lockerItemId) {
        $cache.lockerItemsList.find('li#locker-item-' + lockerItemId).remove();
    }

    function updateSavedDesignsHeader() {
        var count = $cache.lockerItemsList.find('li').size();
        var message = app.resources.MYDESIGNS_NO_SAVED_DESIGNS;

        if (count > 0) {
            message = app.resources.MYDESIGNS_SAVED_DESIGNS_PATTERN.replace('{0}', count);
        }

        $cache.header.text(message);
    }

    function gotoDyoProductPage(event) {
        var element = $(event.currentTarget);
        var pdpUrl = element.data('pdp-url');
        
        window.location.href = pdpUrl;
    }

    function removeLockerItem(event) {
        var element = $(event.currentTarget);
        var lockerItemId = element.data('id');
        var data = $.param({ lockerItemId: lockerItemId });

        var successHandler = function(data, textStatus, jqXHR) {
            if (data.success) {
                removeLockerItemElement(lockerItemId);
                updateSavedDesignsHeader();
            }
        };

        var errorHandler = function(jqXHR, textStatus, errorThrown) {
            // probably we should handle this somehow
        };

        $.ajax({
            url: app.urls.removeFromMyDesigns,
            type: "POST",
            data: data,
            success: successHandler,
            error: errorHandler
        });
    }

    function bindEvents() {
        $cache.lockerItemsList.find('img').click(gotoDyoProductPage);
        $cache.lockerItemsList.find('.edit-button').click(gotoDyoProductPage);
        $cache.lockerItemsList.find('.remove-button').click(removeLockerItem);
    }

    app.accountPortfolio = {
        init: function() {
            initializeCache();
            bindEvents();
        }
    };
}(window.app = window.app || {}, jQuery));

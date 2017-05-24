/*global nike*/
(function(app, $) {
    var $cache = {};

    var selector = {
        editDesign: ".edit-design",
        confirmDesign: ".confirm-design"
    };

    var dialogAction = {
        edit: "edit",
        confirm: "confirm"
    };

    var deferred = $.Deferred();

    function initializeCache() {
        $cache = {
            reviewContainer: $("#pdp-review-and-confirm-container")
        };
    }

    function fetchReviewAndConfirmPanel(metricId) {
        var url = app.util.appendParamToURL(app.urls.reviewAndConfirmPanel, "metricId", metricId);

        return $.get(url);
    }

    function initializePanel() {
        function resolveAction(action) {
            return function() {
                deferred.resolve(action);
                app.htmlBuilder.closePopup();
            };
        }

        $cache.reviewContainer
            .on("click", selector.editDesign, resolveAction(dialogAction.edit))
            .on("click", selector.confirmDesign, resolveAction(dialogAction.confirm));
    }

    function updateContentAndInitializePanel(imageShotsContent) {
        $cache.reviewContainer.html(imageShotsContent);
        nike.id.frame.PageMessageUtil.postMessage(nike.id.Event.HIDE_PRODUCT_MESSAGE);
        app.htmlBuilder.openPopup($cache.reviewContainer);
        initializePanel();
    }

    function openReviewAndConfirmPanel(metricId) {
        deferred = $.Deferred();

        fetchReviewAndConfirmPanel(metricId).then(updateContentAndInitializePanel);

        return deferred.promise();
    }

    function init() {
        initializeCache();
    }

    var reviewPanel = {
        init: init,
        show: openReviewAndConfirmPanel
    };

    $.extend(app.htmlBuilder = app.htmlBuilder || {}, {
        reviewPanel: reviewPanel
    });

}(window.app = window.app || {}, jQuery));
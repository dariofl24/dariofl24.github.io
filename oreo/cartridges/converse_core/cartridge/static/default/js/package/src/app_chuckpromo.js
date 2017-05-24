// app.chuckpromo
(function(app, $) {
    var $cache = {};

    function initCache() {
        $cache = {
            spProductSelection: $('.sp-product-selection'),
            viewCart: $('.viewCart'),
            jumpToPresale: $('#jumpToPreSale'),
            jumpToPurchase: $('#jumpToPurchase')
        };
    }

    function getSelectedCutElement() {
        return $cache.spProductSelection.find('.active');
    }

    function updateShareData(data) {
        var sharePdpInfo = $(data).find('#share-pdp-info');
        var productId = sharePdpInfo.find('.productId').first().text();
        var productUrl = app.util.getCurrentUrl();
        var productImageUrl = sharePdpInfo.find('.productImageUrl').first().text();
        var productName = sharePdpInfo.find('.productName').first().text();

        var context = {
            productId: productId,
            productUrl: productUrl,
            productImageUrl: productImageUrl,
            productName: productName,
            containerID: 'chuck-promo-social-links',
            layout: 'horizontal'
        };

        app.product.share.init(context);
    }

    function initShare() {
        var activeCut = getSelectedCutElement();
        var url = activeCut.data('sp-product-url');

        if (url) {
            $.ajax({
                type: 'GET',
                url: app.util.appendParamToURL(url, 'format', 'ajax')
            }).done(updateShareData);
        } else {
            $('#chuck-promo-social-links').hide();
        }
    }

    function toggleViewCart(topic, panelName) {
        if(panelName === app.constant.SLIDER.MINICART_PANEL) {
            $cache.jumpToPresale.addClass("inactive").hide();
            $cache.jumpToPurchase.addClass("inactive").hide();
            $cache.viewCart.addClass("active");
        }
    }

    function initEvents() {
        $.subscribe(app.constant.SLIDER.EXPANDED, toggleViewCart);
    }

    function init() {
        initCache();
        initShare();
        app.product.init();
        app.product.initAddToCart();
        initEvents();
    }

    app.chuckpromo = {
        init: init,
        updateShareData: updateShareData,
        toggleViewCart: toggleViewCart
    };

}(window.app = window.app || {}, jQuery));

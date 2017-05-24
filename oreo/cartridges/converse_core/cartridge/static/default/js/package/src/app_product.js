(function(app, $) {
    var CONST = app.constant;
    var $cache;
    var selectors;
    var productImage;
    var productInventory;
    var MAX_SWATCHES = 6;
    var MAX_SWATCHES_LARGE = 12;
    

    function initializeModules() {
        productInventory = app.productInventory;
        productImage = app.productImage.create($cache.pdpMain);
        productImage.setMainImageLink();

        app.product.initAddToCart();
        app.pdpSwipe.init();

        initShareBar();
    }

    function getProductData() {
        var sharePdpInfo = $('#share-pdp-info');
        var productData = {
            productId: sharePdpInfo.find('.productId').first().text(),
            productSKU: sharePdpInfo.find('.productSKU').first().text(),
            productUrl: sharePdpInfo.find('.productUrl').first().text(),
            productImageUrl: sharePdpInfo.find('.productImageUrl').first().text(),
            productName: sharePdpInfo.find('.productName').first().text()
        };

        return productData;
    }

    function initShareBar() {
        if (!app.featuretoggle.isFeatureEnabled('gigya-integration')) {
            return;
        }

        var data = getProductData();

        var context = {
            productId: data['productId'],
            productUrl: data['productUrl'],
            productImageUrl: data['productImageUrl'],
            productName: data['productName'],
            layout: 'horizontal'
        };

        var contextPdp = $.extend({}, context, {containerID: 'share-links-pdp'});
        var contextTablet = $.extend({}, context, {containerID: 'share-links-tablet'});
        var contextMobile = $.extend({}, context, {containerID: 'share-links-mobile'});

        app.product.share.init(contextPdp);
        app.product.share.init(contextTablet);
        app.product.share.init(contextMobile);
    }

    function initializeCache() {
        $cache = {
            productId: $("#pid"),
            pdpMain: $("#pdpMain, #chuckTwo"),
            productContent: $(".product-detail-section, .sp-product-image-container"),
            thumbnailsSelector: "#thumbnails",
            imageContainer: $(".product-primary-image"),
            addToCart: $("#add-to-cart"),
            colorVariationsWrapper: $(".color-variations-wrapper"),
            variationsList: $("ul.swatch-list"),
            variationListWrapper: $(".swatch-list-wrapper"),
            prevvariationbutton: $(".color-variation-prev"),
            nextvariationbutton: $(".color-variation-next")
        };

        selectors = {
            shareLinks: ".share-links",
            productTitleAndPricing: ".product-title:visible",
            updateTitleAndPricing: "#update-titleandpricing .product-title"
        };

        $cache.pdpForm = $cache.pdpMain.find("form.pdpForm");
        $cache.quantity = $cache.pdpForm.find(".quantity:visible");
        $cache.mainImageAnchor = $cache.imageContainer.find("a.main-image");
        $cache.mainImage = $cache.mainImageAnchor.find("img.primary-image:visible");
        $cache.productOptions = $cache.pdpMain.find(".product-options:visible");
        $cache.colorSwatchList = $cache.pdpMain.find(".swatch-list li");
        $cache.productProperties = $cache.pdpMain.find(".product-properties");
        $cache.productTopBar = $cache.pdpMain.find(".product-top-bar");
    }

    function initializeSwatchTooltip() {
        if(!app.util.isTouchDevice()) {
            $('.swatch').tooltip();
        }
    }
    
    function initializeDom(){
    
        var li_length = $cache.variationsList.find("li").length;
    
        if(li_length > MAX_SWATCHES){  
           
           if(li_length > MAX_SWATCHES_LARGE){
               $cache.variationListWrapper.addClass("horizontal-scrollable-list-large");
               $cache.prevvariationbutton.addClass("colorvar-button-visible-large");
               $cache.nextvariationbutton.addClass("colorvar-button-visible-large");
           }else{
               $cache.variationListWrapper.addClass("horizontal-scrollable-list");
               $cache.prevvariationbutton.addClass("colorvar-button-visible");
               $cache.nextvariationbutton.addClass("colorvar-button-visible");   
           }
           
           
        }else{
            $cache.prevvariationbutton.css("display","none");
            $cache.nextvariationbutton.css("display","none");
        }
    }
    
    function initializeEvents() {
        preventDefaultClickOnAnchors();

        $cache.quantity.on("change", onQuantityChanged);

        $cache.pdpMain.on("change", "#sizes", onSizeChanged);
        $cache.pdpMain.on("mouseover", "img.productthumbnail", onProductThumbnailClicked);
        $cache.pdpMain.on("click", "li.swatch.selectable a", onColorChanged);
        $cache.pdpMain.on("click", "a.more_link", onMoreClick);
        $cache.pdpMain.on("click", ".sp-choose-type", onProductTypeChanged);
        $(window).on('scroll', leftRailReDraw);

        onProductZoom();

        fixTabletPricePosition();
        showPersistentTopBar();
        subscribeDeviceTypes();
        initializeSizeChart();
        
        initScrollCar();
    }
    
    function initScrollCar(){
        // unbind previous events
        $(window).off();
        $cache.prevvariationbutton.off();
        $cache.nextvariationbutton.off();
        $cache.colorVariationsWrapper.off();
        
        
        $(window).on('resize load', windowOnResizeLoad);
        $cache.prevvariationbutton.on("click",onPrevClicked);
        $cache.nextvariationbutton.on("click",onNextClicked);
        $(window).on("orientationchange",onMobileOrientationChanged);
    
    }
    
    
    function windowOnResizeLoad(event){
          event.preventDefault();
          resizePixleeFrame();
          messureScroll();
    }
    
    var POSITION = 0;
    var INTERVAL=5;
    var SLW =[];
    var SL =[];
    var scrollList =0;
    var scrollLen=0;
    
    function messureScroll(){
        SLW =[];
        SL =[];
    
        $(".swatch-list").each( function(){
            SL.push($(this).width());
        });
        
        $("div.swatch-list-wrapper").each( function(){
            SLW.push($(this).width());
        });
    
        var len = SLW.length;
        
        for(var i = 0; i < len; i++){
            if( SLW[i]*SL[i] >0){
               scrollLen= SL[i] - SLW[i];
               scrollList= SL[i];
            }
        }
        
        INTERVAL= Math.floor(scrollLen / ($cache.variationsList.find("li").length - MAX_SWATCHES));
        moveToSelectedItem();
        hideShowLRarrows();
    }
    
    function hideShowLRarrows(){
    
        if(POSITION === 0){
            $cache.prevvariationbutton.css("border-color","transparent transparent transparent transparent");
            $cache.nextvariationbutton.css("border-color","transparent transparent transparent black");
        }else if(POSITION === scrollLen){
            $cache.prevvariationbutton.css("border-color","transparent black transparent transparent");
            $cache.nextvariationbutton.css("border-color","transparent transparent transparent transparent");
        }else {
            $cache.prevvariationbutton.css("border-color","transparent black transparent transparent");
            $cache.nextvariationbutton.css("border-color","transparent transparent transparent black");
        }
    
    }
    
    
    function onMobileOrientationChanged (event){
        event.preventDefault();
        messureScroll();
        moveToSelectedItem();
        hideShowLRarrows();
    }
    
    
    function moveToSelectedItem(){
        
        var li_swatch = $cache.variationsList.find("li.swatch").length/2;
        
        var item=0;
        var pxpp=scrollList / li_swatch;
        
        $cache.variationsList.find("li.swatch").each(function(){
        
            item++;
        
            if($(this).hasClass("active")){
               return false;
            }
        
        });
        
        var newPosition = Math.floor(pxpp*(item-1));
        
        if(newPosition >= 0 && newPosition <= scrollLen ){
            POSITION = newPosition;
        }else if(newPosition < 0){
            POSITION =0;
        }else if (newPosition > scrollLen){
            POSITION = scrollLen;
        }
        $cache.variationListWrapper.scrollLeft(POSITION);
    }
    
    function onPrevClicked(event) {
        event.preventDefault();
        
        POSITION=((POSITION-INTERVAL)>0)?(POSITION-INTERVAL):0;
        $cache.variationListWrapper.scrollLeft(POSITION);
        hideShowLRarrows();
    }
    
    function onNextClicked(event) {
        event.preventDefault();
        POSITION=((POSITION+INTERVAL)<scrollLen)?(POSITION+INTERVAL):scrollLen;
        $cache.variationListWrapper.scrollLeft(POSITION);
        hideShowLRarrows();   
    }
    
    function showQuantityErrorMessage(form, message) {
        var elem = form.find('.qty-error-message');

        if (elem.hasClass('visually-hidden')) {
            elem.text(message);
            elem.removeClass('visually-hidden');
            form.find('.select2-container').addClass('error');
        }
    }

    function hideQuantityErrorMessage(form) {
        var elem = form.find('.qty-error-message');

        elem.text('');
        elem.addClass('visually-hidden');
        form.find('.select2-container').removeClass('error');
    }

    function onQuantityChanged(event) {
        event.preventDefault();

        var elem = $(this);
        var form = elem.closest('form');
        var value = elem.val();
        var pid = form.find('#pid').val();

        $cache.productTopBar.find("#quantity:visible").val(value);
        $cache.productTopBar.find("#select2-quantity-container").text(value);
        form.find('.quantity').val(value);
        form.find('#select2-quantity-container').text(value);

        getAvailability(pid, value, function(data) {
            validateQuantity(form, data, value);
        });
    }

    function validateQuantity(form, data, value) {
        if (!data) {
            return;
        }

        if (data.maxOrderQuantityMsg  !== '') {
            showQuantityErrorMessage(form, data.maxOrderQuantityMsg);
        } else {
            hideQuantityErrorMessage(form);
        }

        if (data.ats < value) {
            for (var i = data.ats; i < 11; i++) {
                form.find('.quantity option[value="' + i + '"]').attr('disabled', 'disabled');
            }
        } 
    }

    function onColorChanged(e) {
        e.preventDefault();

        var elem = $(e.currentTarget);
        var url = elem.attr("href");

        onVariationAttributeChange(elem, url, function() {
            productImage.replaceImages();
            onProductZoom();
            if (app.util.isTouchDevice()) {
                app.pdpSwipe.init();
            }
        });
    }

    function onSizeChanged(e) {
        e.preventDefault();

        var elem = $(e.currentTarget);
        var value = elem.val();

        $cache.productTopBar.find("#sizes").val(value);
        $cache.productTopBar.find(".top-bar-content").removeClass('error');
        $cache.productTopBar.find("#quantity .select2-selection").removeClass('qty-error');
        $cache.productTopBar.find(".error-message").addClass("visually-hidden");
        $cache.pdpMain.find(".error-message").addClass("visually-hidden");

        onVariationAttributeChange(elem, value, function () {
            productImage.replaceImages();
            onProductZoom();
        });
    }

    function onVariationAttributeChange(variationElement, url, onResponse) {
        var qty = $cache.quantity.val();
        var qtyVal = isNaN(qty) ? "1" : qty;
        var target = $cache.productContent;
        var finalUrl = app.util.appendParamToURL(url, "Quantity", qtyVal);

        app.progress.show($cache.pdpMain);

        app.ajax.load({
            url: finalUrl,
            callback: function (data) {
                if ($('#chuckTwo').exists()) {
                    app.chuckpromo.updateShareData(data);
                    if ($('#isChuckInStock').val() === 'true') {
                        updateProductSectionChuckII(data);
                    }
                }

                updateProductSection(target, data);

                init();
                updateColorSwatch(data);
                updateTitleAndPricing();

                if (onResponse) {
                    onResponse();
                }
            }
        });
    }

    function onProductThumbnailClicked(e) {
        var elem = $(e.currentTarget);
        var isModelImage = elem.closest('li').hasClass('model-image');
        var lgImg = elem.data("lgimg");

        if (lgImg && (lgImg.url !== $('.primary-image').attr('src'))) {
            $cache.pdpMain.find("section.product-thumbnails li.selected").removeClass("selected");
            elem.closest("li").addClass("selected");
            productImage.setMainImage(lgImg, isModelImage);
        }
    }
    
    function initializeSizeChart() {
        $('.size-chart-popup').magnificPopup({
            type: 'inline',
            preloader: false,
            closeOnContentClick:true,
            showCloseBtn: false
        });
    }

    function onProductZoom() {
        var imageSrc = $('.main-image').find('img').data('url');

        $('.product-image.main-image, .zoomicon').magnificPopup({
            type: 'image',
            tClose: 'x',
            midClick: true,
            mainClass: 'pdp-popup ' + $("#chuck-promo").attr("id"),
            closeOnContentClick: true,
            image: {
              titleSrc: ''
            },
            callbacks: {
                change: function() {
                    if ($('.main-image').attr('href')) {
                        imageSrc = $('.main-image').attr('href');
                    }
                    $(this.content).find("img").attr("src", imageSrc);
                }
            }
        });
    }
    
    function onMoreClick() {
        var headerHeight = $('#header').height()+100;

        if ($cache.productTopBar.is(':visible')) {
            headerHeight = headerHeight + $cache.productTopBar.height();
        }

        $('html, body').animate({
            scrollTop: $( $(this).attr('href') ).offset().top -headerHeight
        }, 500);
        return false;
    }

    function onProductTypeChanged(e) {
        e.preventDefault();

        var elem = $(e.currentTarget);
        var url = elem.data("sp-product-url");

        if (url) {
            var target = $cache.productContent;
            app.progress.show($cache.pdpMain);

            app.ajax.load({
                url: url,
                callback: function (data) {
                    target.html($(data).find(".product-image-container").html());  //Update product images
                    $("#chuck-promo").find(".sp-product-variations .color-attr").html($(data).find(".color-attr").first().html()); //Update variations
                    init();
                    updateColorSwatch(data);
                    $(".sp-choose-type").removeClass("active"); //Update type tag
                    elem.addClass("active");
                    initializeSwatchTooltip(); //Apply tooltips
                    app.chuckpromo.updateShareData(data);
                    if (app.featuretoggle.Features.chuckII.enabled) {
                        var price = $(data).find('.price-sales').eq(0).text();
                        $('.sp-product').find('.price-sales').html(price);
                        $('.sp-product .swatch-list').find('.swatch a').eq(0).trigger('click');
                    }
                }
            });
        }
    }

    function preventDefaultClickOnAnchors() {
        $cache.pdpMain.on("click", ".thumbnail-link", false);
        $cache.pdpMain.on("click", "li.unselectable a", false);
        $cache.pdpMain.on("click", "li.swatch a", false);
        $cache.pdpMain.on("click", ".product-image.main-image", false);
    }

    function updateTitleAndPricing() {
        $cache.pdpMain.find(selectors.productTitleAndPricing).html($(selectors.updateTitleAndPricing).html());
    }

    function updateColorSwatch(data) {
        var sku = $(data).find(".productSKU").first().text();
        var color = $(data).find(".productColor").first().text();
        var imgUrl = $(data).find(".productImageUrl").text();

        $cache.colorSwatchList.removeClass("active");
        $cache.colorSwatchList.addClass("selectable swatch");
        $cache.pdpMain.find(".swatch-list li:[data-sku="+ sku +"]").addClass("active");
        $cache.productProperties.find(".product-manufacturer").text(sku);
        $cache.productProperties.find(".product-color").text(color);
        $cache.productTopBar.find(".product-manufacturer").text(sku);
        $cache.productTopBar.find(".product-color").text(color);
        $cache.productTopBar.find("img").attr("src", imgUrl);
    }

    function updateProductSectionChuckII(data) {
        var html = $(data).find('.pdpForm');
        var isSoldOut = $(data).find('.out-of-stock').exists();
        toggleSoldOutMessage(isSoldOut);
        $('.sp-product').find('.pdpForm').replaceWith(html);
    }

    function toggleSoldOutMessage(isSoldOut) {
        var elem = $('.sp-soldout-message');
        elem.toggle(isSoldOut);
    }

    function updateProductSection(target, data) {
        var options = $(target).find(".product-options:visible");
        var productTopBarStyle = $cache.productTopBar.attr('style');

        target.html(data);

        var html = $(data).find('.pdpForm .product-attributes .attribute');
        if (html) {
            var isSoldOut = $(data).find('.out-of-stock').exists();
            var soldOutMessage = $(data).find('.out-of-stock-message').text();
            if (!isSoldOut) {
                $cache.productTopBar.find('.pdpForm .product-attributes .attribute').remove();
                $cache.productTopBar.find('.pdpForm .product-attributes').prepend(html);
                $cache.productTopBar.find('.pdpForm #pid').replaceWith($(data).find('.pdpForm #pid'));
                $cache.productTopBar.find('.pdpForm #add-to-cart').replaceWith($(data).find('.pdpForm #add-to-cart'));
                $cache.productTopBar.find('.pdpForm').attr('action', $(data).find('.pdpForm').attr('action'));
            }
            $cache.productTopBar.find('.pdpForm').toggle(!isSoldOut);
            $cache.productTopBar.find('.out-of-stock').toggle(isSoldOut);
            $cache.productTopBar.find('.out-of-stock-message').toggle(isSoldOut);
            $cache.productTopBar.find('.out-of-stock-message').text(soldOutMessage);
        }
        $('.add-to-cart').unbind('click');

        $cache.productTopBar.attr('style', productTopBarStyle);

        $(target).find(".tablet-left .tablet, .tablet-right").append(options);
    }

    function fixTabletPricePosition() {
        if ($('.tablet-left').is(':visible')) {
            var tabletLeft = $('.tablet-left:visible');
            var productName = tabletLeft.find('.product-name');
            var productPrice = tabletLeft.find('.product-price');

            if (tabletLeft.width() > (productName.width() + productPrice.width())) {
                productPrice.css('float','right');
            } else {
                productPrice.css('float','none');
            }
        }
    }

    function showPersistentTopBar() {
        if (typeof $cache.productTopBar.attr('style') === "undefined") {
            $cache.productTopBar.css("opacity", "0");
            $cache.productTopBar.css("top", "-223px");
        }
        $(window).scroll(function() {
            var topOfSite = ($(window).scrollTop());
            if (topOfSite > 500) {
                $cache.productTopBar.css("opacity", "100");
                $cache.productTopBar.css("top", "100px");
            } else if (topOfSite < 500) {
                $cache.productTopBar.css("opacity", "0");
                $cache.productTopBar.css("top", "-223px");
                if ($(".product-top-bar:visible").exists() && $(".select2-container--open.select2-container--focus").parent().find("select").exists()) {
                    $(".select2-container--open.select2-container--focus").parent().find("select").select2("close");
                }
            }
        });
    }

    function initializeShippingPopup() {
        $('.shipping-popup-button').magnificPopup({
            type: 'inline',
            midClick: true
        });
    }

    function resetDropdownOnPresale() {
        var options = {
            minimumResultsForSearch: Infinity
        };

        if ($('#chuckTwo').exists()) {
            options['containerCssClass'] = 'chuckpromo';
            options['dropdownCssClass'] = 'chuckpromo';
        }

        $('.size').select2(options);

        options['escapeMarkup'] = escapeMarkup;
        options['templateSelection'] = adjustTemplateSelection;

        $("select.quantity").select2(options);
    }

    function escapeMarkup(m) {
        return m;
    }

    function adjustTemplateSelection(state) {
      if (!state.id) {
           return state.text;
      }
      return '<span class="font-weight-normal">' + app.resources.QTY + ': </span>' + state.text;
    }

    function subscribeDeviceTypes() {
        $.subscribe(CONST.RESPONSIVE_DEVICE_OBSERVER, function(pub, arg) {
            fixTabletPricePosition();
            $("select.size:visible").select2({minimumResultsForSearch: Infinity});
        });
    }

    function resizePixleeFrame() {
        var pixleeFrame = $('#pixlee_container').children().eq(0);
        var contentFrame = $('.pixlee-pdp-wrapper');

        var wrapperWidth = parseInt(contentFrame.css('width'), 10) - parseInt(contentFrame.css('padding-left'), 10);
        pixleeFrame.css('width', wrapperWidth);
    }

    function leftRailReDraw() {
       if(!app.util.isTouchDevice()) {
            var footerTop = $('footer').offset().top - $(window).scrollTop();
            var $wrapper = $('.product-detail.pdp .product-detail-wrapper');
            var $mainOverlay = $('#main-overlay');
            var leftRailHeight = $('.product-detail-wrapper').height();
            var mainOverlayMarginTop = $mainOverlay.outerHeight(true) - $mainOverlay.innerHeight();

            if (footerTop < (leftRailHeight + mainOverlayMarginTop)) {
                $wrapper.css('top', '-' + (leftRailHeight + mainOverlayMarginTop - footerTop) + 'px');
            } else {
                $wrapper.css('top', '25px');
            }
        }
    }

    function init() {
        initializeCache();
        initializeModules();
        initializeDom();
        initializeEvents();
        initializeShippingPopup();
        resetDropdownOnPresale();
        app.designdetails.init();
        app.pdpshare.init();
        
    }

    function getAvailability(pid, quantity, callback) {
        app.ajax.getJson({
            url: app.util.appendParamsToUrl(app.urls.getAvailability, {
                pid: pid,
                Quantity: quantity
            }),
            callback: callback
        });
    }

    $.extend(app.product = app.product || {}, {
        init: init,
        getAvailability: getAvailability,
        getProductData: getProductData
    });

}(window.app = window.app || {}, jQuery));

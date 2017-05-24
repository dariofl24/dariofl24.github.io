/**
 @module app.product.image
 */
(function(app, $) {

    var IMAGE_FADE_TIME = app.constant.PDP_MAIN_IMAGE_FADE_DURATION;

    function createProductImageApi(pdpMain) {
        var api = {};

        /**
         @description Sets the main image attributes and the href for the surrounding <a> tag
         @param {Object} atts Simple object with url, alt, title and hires properties
        */
        api.setMainImage = function(atts, isModelImage) {

            var imgZoom = pdpMain.find("a.main-image");
            if ((imgZoom.length > 0) && (typeof atts.hires !== 'undefined') && (atts.hires)) {
                imgZoom.attr("href", atts.hires);
            }

            var primaryImage = imgZoom.find("img.primary-image");

            primaryImage.fadeOut(IMAGE_FADE_TIME, function() {
                if (primaryImage.attr('src') === atts.url) {
                    $(this).fadeIn(IMAGE_FADE_TIME);
                } 
                else {
                    primaryImage
                        .attr({
                            "src": atts.url || "",
                            "alt": atts.alt || "",
                            "title": atts.title || ""
                        })
                        .load(function() {
                            if (isModelImage) {
                                $(this).closest('.product-content').addClass('is-model-image');
                            }
                            else {
                                $(this).closest('.product-content').removeClass('is-model-image');
                            }
                            $(this).fadeIn(IMAGE_FADE_TIME);
                        });
                }
            });
        };

        /**
         @description helper function for swapping main image on swatch hover
         @param {Element} element DOM element with custom data-lgimg attribute
        */
        api.swapImage = function(element) {
            var lgImg = $(element).data("lgimg");

            var newImg = $.extend({}, lgImg);
            var imgZoom = pdpMain.find("a.main-image");
            var mainImage = imgZoom.find("img.primary-image");
            // store current image info
            lgImg.hires = imgZoom.attr("href");
            lgImg.url = mainImage.attr("src");
            lgImg.alt = mainImage.attr("alt");
            lgImg.title = mainImage.attr("title");
            // reset element's lgimg data attribute
            $(element).data(lgImg);
            // set the main image
            api.setMainImage(newImg);
        };

        api.setMainImageLink = function() {
            if (app.isMobileUserAgent) {
                pdpMain.find("a.main-image").removeAttr("href");
            }
        };

        api.replaceImages = function() {
            var newImages = $("#update-images");

            var imageContainer = pdpMain.find("div.product-image-container, div.sp-product-image-container");

            imageContainer.html(newImages.html());
            newImages.remove();
            api.setMainImageLink();
        };

        return api;
    }

    app.productImage = {
        create: createProductImageApi
    };

}(window.app = window.app || {}, jQuery));

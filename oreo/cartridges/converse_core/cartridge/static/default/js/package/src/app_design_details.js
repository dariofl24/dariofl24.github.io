/*global window, _, Mustache */

(function(app, $) {

    var element = $('.design-details');
    var template = $('#design-details-template').html();
    var cloudFrontBase = 'd24wrs9gkohs0j.cloudfront.net';
    var detailInfoFile = 'detail-info.json';

    function getBaseURL() {
        var protocol = window.location.protocol;
        var productData = app.product.getProductData();
        var productSKU = productData['productSKU'];
        var baseURL = String.format('{0}//{1}/{2}', protocol, cloudFrontBase, productSKU);

        return baseURL;
    }

    function generateURL(path) {
        var baseURL = getBaseURL();
        var url = String.format('{0}/{1}', baseURL, path);

        return url;
    }

    function updateData(data) {
        var siteInfo = app.util.siteInfo();
        var locale = siteInfo['locale'];

        if (!(locale in data)) {
            removeDesignDetails();  
            return;
        }

        if (!('descriptions' in data[locale])) {
            removeDesignDetails();  
            return;
        }

        var newData = _.pick(data[locale], 'descriptions');

        $.each(newData['descriptions'], function(index) {
            if ('image' in newData['descriptions'][index]) {
                var path = newData['descriptions'][index]['image'];
                newData['descriptions'][index]['image'] = generateURL(path);
            }
        });

        return newData;
    }

    function renderDesignDetails(data) {
        var newData = updateData(data);
        var rendered = Mustache.render(template, newData);

        element.html(rendered);
        element.find('.detail-slider-block').pdpSliderBlock({
            slideDuration: 400
        });
    }

    function removeDesignDetails() {
        element.html('');
    }

    function getData(url) {
        var config = {
            url: url,
            type: 'GET',
            dataType: 'json'
        };

        $.ajax(config)
            .done(renderDesignDetails)
            .fail(removeDesignDetails);
    }

    function init() {
        var url = generateURL(detailInfoFile);
        getData(url);
    }

    app.designdetails = {
        init: init
    };

}(window.app = window.app || {}, jQuery));
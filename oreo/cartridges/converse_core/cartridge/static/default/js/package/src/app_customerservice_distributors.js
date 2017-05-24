(function(app, $) {

    var CUSTOMER_SERVICE = app.constant.CUSTOMER_SERVICE;
    var $cache;

    function initializeCache() {
        $cache = {
            distributorsContainer: $(".converse-tabs .distributors-info")
        };

        $cache.distributorsDropDown = $cache.distributorsContainer.find('.input-select');
        $cache.distributorDetailsContent = $cache.distributorsContainer.find('.content');
        $cache.distributorDetailsError = $cache.distributorsContainer.find('.error');
    }

    function clearDistributorDetails() {
        $cache.distributorDetailsContent.find('.id').val('');
        $cache.distributorDetailsContent.find('.name').text('');
        $cache.distributorDetailsContent.find('.email').text('');
        $cache.distributorDetailsContent.find('.phone').text('');
        $cache.distributorDetailsContent.find('.country').text('');
    }

    function showDistributorDetails(store) {
        $cache.distributorDetailsError.hide();
        clearDistributorDetails();

        $cache.distributorDetailsContent.find('.id').val(store.id);
        $cache.distributorDetailsContent.find('.name').text(store.name);
        $cache.distributorDetailsContent.find('.email').text(store.email);
        $cache.distributorDetailsContent.find('.phone').text(store.phone);
        $cache.distributorDetailsContent.find('.country').text(store.country);

        $cache.distributorDetailsContent.show();
    }

    function showErrorMessage() {
        $cache.distributorDetailsContent.hide();
        $cache.distributorDetailsError.show();
    }

    function isAlreadyDisplayed(id) {
        return $cache.distributorDetailsContent.find('.id').val() === id;
    }

    function setupDistributorDropdown() {
        $cache.distributorsDropDown.change(function(e) {
            var elem = $(e.currentTarget);
            var id = elem.val(); 

            if (id === '') {
                $cache.distributorDetailsContent.hide();
                return;
            }

            if (isAlreadyDisplayed(id)) {
                $cache.distributorDetailsContent.show();
                return;
            }

            if (id !== '' && !isAlreadyDisplayed(id)) {
                var promise = $.ajax({
                    type: "GET",
                    url: app.util.appendParamToURL(app.urls.storeLocatorDistributorSearch, "storeId", id)
                });

                promise.done(function(data) {
                    if (data.success && data.result) {
                        showDistributorDetails(data.result);
                    } else {
                        showErrorMessage();
                    }
                });

                promise.fail(function() {
                    showErrorMessage();
                });
            }
        });
    }

    function initializeEvents() {
        setupDistributorDropdown();
    }

    function onContentLoaded(topic, contentName) {
        if(contentName === CUSTOMER_SERVICE.INTERNATIONAL_DISTRIBUTORS) {
            initializeCache();
            initializeEvents();
        }
    }

    app.distributors = {
        init: function() {
            $.subscribe(CUSTOMER_SERVICE.CONTENT_LOADED, onContentLoaded);
        }
    };
}(window.app = window.app || {}, jQuery));

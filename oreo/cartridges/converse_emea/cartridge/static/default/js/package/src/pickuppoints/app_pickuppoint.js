/*global window, Mustache */

(function(app, $) {
    var $cache = {};
    var pickUpPointList = null;
    var pickUpPointMap = null;
    var pickUpPointRoute = null;

    function initializeCache() {
        $cache.pupPopup = $('#pup-popup');
        $cache.shippingAddressForm = $('.checkout-shipping.address');
        $cache.hiddenForPickupPoint = $('.hidden-for-pickuppoint');
        $cache.pupSearchContainer = $('.pup-search-container');
        $cache.postalCode = $cache.hiddenForPickupPoint.find('.postal-code input');
        $cache.shippingType = $('.shipping-type');
        $cache.searchPup = $('.btn-search-pup');

        $cache.pupList = $('#pup-list');
        $cache.pupRoute = $('#pup-route');

        $cache.pupSearchBox = $cache.pupSearchContainer.find('.pup-search-box');
        $cache.pupSearchAnotherBox = $cache.pupSearchContainer.find('.btn-search-another-pup');
        $cache.selectedPupInfo = $cache.pupSearchContainer.find('.selected-pup-info');
        $cache.recipientName = $cache.pupSearchContainer.find('.recipient-name');
        $cache.pupPostalCode = $cache.pupSearchContainer.find('.postal-code input');

        $cache.formShippingType = $('input[name$="shippingType"]');
        $cache.formPupID = $('input[name$="_pickupPointID"]');
        $cache.formPupName = $('input[name$="_pickupPointName"]');
        $cache.formPupCarrier = $('input[name$="_pickupPointCarrier"]');
        $cache.formPupFirstName = $('.pup-first-name input[name$="_common_firstName"]');
        $cache.formPupLastName = $('.pup-last-name input[name$="_common_lastName"]');
        $cache.formPupAddress1 = $('input[name$="_common_address1"]');
        $cache.formPupAddress2 = $('input[name$="_common_address2"]');
        $cache.formPupCity = $('input[name$="_common_city"]');
        $cache.formPupPostal = $('input[name$="_regional_zip"]');
        $cache.formPupPhone = $('input[name$="_regional_phone"]');

        $cache.findPickUpPointsForm = $('.find-pickuppoints-form');
    }

    function getSelectedShippingType() {
        return $cache.shippingType.find(':checked').val();
    }

    function isPickUpPointSelected() {
        var pupIdExists = $cache.formPupID.val() ? true : false;
        var pupNameExists = $cache.formPupName.val() ? true : false;

        return (pupIdExists && pupNameExists);
    }

    function isPickUpPointInitialized() {
        return (pickUpPointList && pickUpPointRoute && pickUpPointMap) ? true : false;
    }

    function showListView() {
        $cache.pupList.show();
        $cache.pupRoute.hide();

        if (isPickUpPointInitialized()) {
            pickUpPointRoute.reset();
            pickUpPointMap.populate();
        }
    }

    function showRouteView() {
        $cache.pupList.hide();
        $cache.pupRoute.show();

        if (isPickUpPointInitialized()) {
            pickUpPointRoute.reset();
            pickUpPointMap.populate();
        }
    }

    function showPickupPointForm() {
        renderRecipientNamePupInput();
        $cache.pupSearchContainer.show();
        $cache.selectedPupInfo.hide();
        $cache.pupSearchContainer.find('.recipient-name').hide();
        $cache.hiddenForPickupPoint.hide();
    }

    function hidePickupPointForm() {
        $cache.pupSearchContainer.hide();
        $cache.hiddenForPickupPoint.show();
        removeRecipientNamePupInput();
    }

    function showSelectedPickUpPointForm() {
        $cache.pupSearchBox.hide();
        $cache.selectedPupInfo.show();
        $cache.pupSearchContainer.find('.recipient-name').show();
        $cache.shippingAddressForm.parsley('addItem', '.pup-first-name input');
        $cache.shippingAddressForm.parsley('addItem', '.pup-last-name input');
    }

    function hideSelectedPickUpPointForm() {
        $cache.pupSearchBox.show();
        $cache.selectedPupInfo.hide();
        $cache.pupSearchContainer.find('.recipient-name').hide();
    }

    function toggleSelectedPickUpPointForm() {
        var isSelected = isPickUpPointSelected();

        if (isSelected) {
            showSelectedPickUpPointForm();
        } else {
            hideSelectedPickUpPointForm();
        }
    }

    function toggleForms() {
        prepareForms();

        app.checkoutShipping.init();
    }

    function prepareForms() {
        var shippingType = getSelectedShippingType();

        if (shippingType === 'pup') {
            showPickupPointForm();
            toggleSelectedPickUpPointForm();
            $('.pup-error-msg').html('');
            $('.postal-code').removeClass('error');
        } else {
            hidePickupPointForm();
            clearShippingAddressForm();
        }
    }
    
    function showPopup() {
        $.magnificPopup.open({
            items: {
                src: '#pup-popup'
            }
        });
    }

    function closePopup() {
        $.magnificPopup.close();
    }

    function displayPickUpPointInfo(pickUpPointID) {
        var pupData = pickUpPointList.getData();
        var pickUpPoint = pupData[pickUpPointID];
        closePopup();
        showSelectedPickUpPointForm();
        showSelectedPickUpPointInfo(pickUpPoint);
        populateFormData(pickUpPoint);
    }

    function clearShippingAddressForm(){
        $cache.formPupID.val('');
        $cache.formPupName.val('');
        $cache.formPupCarrier.val('');
        $cache.formPupAddress1.val('');
        $cache.formPupAddress2.val('');
        $cache.formPupCity.val('');
        $cache.formPupPostal.val('');
        $cache.formPupPhone.val('');
    }
    
    function populateFormData(pickUpPoint) {
        $cache.formPupID.val(pickUpPoint.id);
        $cache.formPupName.val(pickUpPoint.name);
        $cache.formPupCarrier.val(pickUpPoint.carrier);
        $cache.formPupAddress1.val(pickUpPoint.address.street);
        $cache.formPupCity.val(pickUpPoint.address.city);
        $cache.formPupPostal.val(pickUpPoint.address.postalCode);
        $cache.formPupPhone.val('3452523527');
    }

    function showSelectedPickUpPointInfo(pickUpPoint) {
        var template = $('#pup-selected-pup-info-tpl').html();
        var rendered = Mustache.render(template, pickUpPoint);
        $cache.selectedPupInfo.find('.pup-info').html(rendered);
    }

    function requestPickupPoint(postalCode) {
        var list = app.pickUpPoint.getPickUpPointList(); 
        var request = $.ajax({
            method: "GET",
            url: app.urls.findPickupPoints,
            data: {
                postcode: postalCode
            }
        });
        
        function showErrorMessage(message) {
            if (isPopupVisible()) {
                list.displayError(message);
            } else {
                $('.postal-code').addClass('error');
                $('.pup-error-msg').html(message);
            }
        }

        request.done(function(data) {
            if (data.success) {
                var dataExists = Object.keys(data.pickupPoints).length;

                if (dataExists) {
                    $('.pup-error-msg').html('');
                    showPopup();
                    app.pickUpPoint.menu.init();
                    app.pickUpPoint.menu.setListActive();
                    app.pickUpPoint.menu.setPostalCode(postalCode);
                    initializePickUpPoints(data.pickupPoints);
                } else {
                    showErrorMessage(app.resources.INVALID_POSTCODE_ERROR);
                }
            } else {
                showErrorMessage(app.resources.INVALID_POSTCODE_ERROR);
            }
        });

        request.fail(function() {
            showErrorMessage('Unable to make request.');
        });
    }

    function getPostalCode() {
        var popupInput = $cache.findPickUpPointsForm.find('input');
        var pageInput = $cache.pupPostalCode;
        var input = (isPopupVisible()) ? popupInput : pageInput;

        return input.val();
    }

    function onSubmitPupSearch(event) {
        if ($(this).parsley('validate')) {
            event.preventDefault();
            pupSearch();
        }
    }
    
    function isPopupVisible() {
        return $cache.pupPopup.is(':visible');
    }
    
    function removeCurrentPickUpPoints() {
        var map = app.pickUpPoint.getPickUpPointMap();
        var list = app.pickUpPoint.getPickUpPointList();
        
        list.removeData();
        list.removePickUpPointList();
        
        map.removeCurrentRouteToPickUpPoint();
        map.removeLocateMeMarker();
        map.removeAnyMarkers();
    }

    function pupSearch() {
        var postalCode = getPostalCode();
        if (isPopupVisible()) {
            removeCurrentPickUpPoints();
        }
        
        requestPickupPoint(postalCode);
    }

    function renderRecipientNamePupInput() {
        var template = $('#pup-recipient-name-form-tpl').html();
        var rendered = Mustache.render(template);
        $cache.pupSearchContainer.append(rendered);
    }

    function removeRecipientNamePupInput() {
        $cache.pupSearchContainer.find('.recipient-name').remove();
    }

    function clearPupForm() {
        $cache.formPupID.val('');
        $cache.formPupName.val('');
    }

    function preSubmitProcessPupForm() {
        if (getSelectedShippingType() !== 'pup') {
            clearPupForm();
            $cache.formPupPostal.val($cache.postalCode.val());
        }
    }

    function getPickUpPointMap() {
        return pickUpPointMap;
    }
    
    function getPickUpPointList() {
        return pickUpPointList;
    }
    
    function getPickUpPointRoute() {
        return pickUpPointRoute;
    }
    
    function getPickUpPointMenu() {
        return app.pickUpPoint.menu;
    }

    function initializePickUpPoints(data) {
        pickUpPointList = new app.pup.PickUpPointList(data);
        pickUpPointMap = new app.pup.PickUpPointMap(pickUpPointList);
        pickUpPointRoute = new app.pup.PickUpPointRoute(pickUpPointMap);
    }

    function initializeEvents() {
        $cache.shippingType.on('change', toggleForms);
        $cache.searchPup.on('click', pupSearch);
        $cache.findPickUpPointsForm.on('submit', onSubmitPupSearch);
        $cache.pupSearchAnotherBox.on('click', pupSearch);
        $cache.shippingAddressForm.find('.btn-continue').on('click', preSubmitProcessPupForm);
    }

    function init() {
        initializeCache();
        initializeEvents();
        prepareForms();
    }
    
    var LocateMeRequiredMessage = 'Click on "Locate Me" first in order to continue.';

    app.pickUpPoint = {
        init: init,
        showPopup: showPopup,
        closePopup: closePopup,
        showListView: showListView,
        showRouteView: showRouteView,
        displayPickUpPointInfo: displayPickUpPointInfo,
        getPickUpPointMap: getPickUpPointMap,
        getPickUpPointList: getPickUpPointList,
        getPickUpPointRoute: getPickUpPointRoute,
        getPickUpPointMenu: getPickUpPointMenu,
        getPostalCode: getPostalCode,
        LocateMeRequiredMessage: LocateMeRequiredMessage
    };

}(window.app = window.app || {}, jQuery));

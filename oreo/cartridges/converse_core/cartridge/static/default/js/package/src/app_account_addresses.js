(function(app, $) {
    var TABIFY = app.constant.PUBSUB.TABIFY;

    var $cache = {
        addAddress:{
            selector:".account-tab-content #add-address-button",
            click:"click.accountAddressFormAdd"
        },
        deleteAddress:{
            selector:"#address-form .delete-link",
            click:"click.accountAddressFormDelete"
        },
        confirmDeleteAddress:{
            selector:".account-tab-content .delete-address-button",
            click:"click.accountAddressFormConfirmDelete"
        },
        editAddress:{
            selector:".account-tab-content .edit-address-button",
            click:"click.accountAddressFormEdit"
        },
        cancelAddress:{
            selector:"#address-form .cancel-button",
            click:"click.accountAddressFormCancel"
        }
    };

    function cancelEditAddressForm(inplaceEdit) {
        var url = app.urls.addressGet + '?AddressID=' + inplaceEdit.context.AddressID;

        app.ajax.load({
                target: inplaceEdit.target,
                url: url
            });
    }

    function resetAddAddressForm() {
        var form = $("#address-form");
        form[0].reset();
    }

    function cancelAddAddressForm(inplaceEdit) {
        $('#add-address-panel').hide();
    }

    function adjustAddressId(form) {
        var addressId = form.find("input[name$='_addressid']");
        addressId.val(addressId.val().replace(/[^\w+\-]/g, "-"));
    }

    function getAddressID(container) {
        var parent = container.parents('li');
        var target = parent.find('.profile-address');
        var addressID = target.find('.left-section').attr('data-address-id');

        return addressID;
    }

    function refreshCurrentTab() {
        var currentTab = $("#account-settings-tab.tabified a.active").eq(0);
        currentTab.removeClass("active");
        currentTab.closest("li").next().html("");
        currentTab.click();
    }

    function deleteAddress(container) {
        if (!confirm(String.format(app.resources.CONFIRM_DELETE, app.resources.TITLE_ADDRESS))) {
            return;
        }

        var addressid = getAddressID(container);
        var url = app.util.appendParamsToUrl(app.urls.addressDelete, {
                AddressID: addressid
            });
        var options = {
            url: url,
            type: "POST",
            dataType: "json"
        };

        $.ajax(options)
            .done(function(data) {
                if (data.success) {
                    refreshCurrentTab();
                }
            });
    }

    function onDeleteAddressClick(e) {
        e.preventDefault();
        deleteAddress($(this));
    }

    function onCancelAddressClick(e) {
        e.preventDefault();
        refreshCurrentTab();
    }
    
    function displayAddressSaveMessage() {
        window.scrollTo(0,0);
        $('#address-save-message').show();
        setTimeout(function() {
            $('#address-save-message').hide();
        }, 5000);
    }

    function initializeAddressForm(url) {
        var addressForm = $("#address-form");

        addressForm.on("submit", function() {
            adjustAddressId(addressForm);
        });

        var ajaxOptions = {
            url: url,
            type: "POST"
        };

        app.form.bindAjax(addressForm, true, ajaxOptions)
            .success.add(function(form, response, textStatus, jqXHR) {
                if(response.success) {
                    refreshCurrentTab();
                    displayAddressSaveMessage();
                }
            });

        $(document)
            .switchEvent($cache.cancelAddress.click, $cache.cancelAddress.selector, onCancelAddressClick)
            .switchEvent($cache.deleteAddress.click, $cache.deleteAddress.selector, onDeleteAddressClick);

        intitializeNickNameEvents(addressForm);
    }

    function initializeEditAddressForm(inplaceEdit) {
        var url = app.util.appendParamsToUrl(app.urls.addressUpdate, {
                AddressID: inplaceEdit.context.AddressID
            });

        initializeAddressForm(url);
    }

    function initializeAddAddressForm() {
        var url = app.urls.addressAdd;

        initializeAddressForm(url);
    }

    function intitializeNickNameEvents(form) {
        form.find("input[name$='_addressid']").keyup(function() { app.validation.resetFieldErrors('#address-form'); });
    }

    function initEmptyAddressForm() {
        var no_addresses = $("div#add-address-panel.no-addresses");

        if (no_addresses.exists()) {
            var target = $('#add-address-panel');
            var options = {
                target: target,
                callback: initializeAddAddressForm,
                cancelCallback: resetAddAddressForm
            };
            app.inplaceEdit.create(options);
        }
    }

    function onAddAddressClick(e) {
        e.preventDefault();

        var target = $('#add-address-panel');
        var options = {
            target: target,
            callback: initializeAddAddressForm,
            cancelCallback: cancelAddAddressForm
        };

        app.inplaceEdit.create(options);
    }

    function onEditAddressClick(e) {
         e.preventDefault();

        var parent = $(this).parents('li');
        var target = parent.find('.profile-address');

        var addressID = getAddressID($(this));
        var url = app.util.appendParamsToUrl(app.urls.addressEdit, {
                AddressID: addressID
            });

        var options = {
            url: url,
            target: target,
            callback: initializeEditAddressForm,
            cancelCallback: cancelEditAddressForm,
            context: {
                AddressID: addressID
            }
        };

        app.inplaceEdit.create(options);
    }

    function initAddressListEvents() {
        var addresses = $(".account-tab-content");
        
        if (!addresses.exists()) {
            return;
        }

        initEmptyAddressForm();
        initializeAddAddressForm();

        $(document)
            .switchEvent($cache.addAddress.click, $cache.addAddress.selector, onAddAddressClick)
            .switchEvent($cache.confirmDeleteAddress.click, $cache.confirmDeleteAddress.selector, onDeleteAddressClick)
            .switchEvent($cache.editAddress.click, $cache.editAddress.selector, onEditAddressClick);
    }

    app.accountAddresses = {
        init: function() {
            initAddressListEvents();
            $.subscribe(TABIFY.TAB_COMPLETE, initAddressListEvents);
        }
    };
}(window.app = window.app || {}, jQuery));

/*global window, utag, emailDialogShow, utag_data */
(function(app, $) {
    var $cache = {};
    var isRebound = false;

    function initializeCache() {
        initNewEmailPPCache();
        $cache.footerSubscriptionForm = $('#email-form');
        $cache.footerMessageContainer = $('.footer-message-container');
        $cache.footerSuccessMessageContainer = $('.footer-message-container .success'); //$cache.footerSubscriptionForm.find('.success');
        $cache.footerContentAssetContainer = $("#footer-email-content-asset-container");
        $cache.promotionContainer = $cache.newEmailAddressesContainer.find('.promotion-offered');
        $cache.promotionValue = $cache.newEmailAddressesForm.find('.offered-promotion');
        $cache.footerPromotionContainer = $cache.footerContentAssetContainer.find('.promotion-offered');
        $cache.footerPromotionValue = $cache.footerSubscriptionForm.find('.offered-promotion');
        $cache.birddayInput = $("input[name$='_profile_customer_birthday']");
    }
    
    function initNewEmailPPCache() {
        $cache.newEmailAddressesContainerId = "new-email-addresses-container";
        $cache.newEmailAddressesContainer = $("#" + $cache.newEmailAddressesContainerId );
        $cache.newEmailAddressesForm = $cache.newEmailAddressesContainer.find('#new-email-addresses-form');
    }

    function openPopup(source) {
        $.magnificPopup.open({ 
            items: {
                src: source,
                type: 'inline'
            },
            callbacks: {
                close: function() {
                    // Will fire when popup is closed
                    $("#new-email-addresses-container").remove();
                    initNewEmailPPCache();
                    bindForm(true);//re-bind the form
                    utag.link({
                        page_type: utag_data.page_type_original,
                        page_name: utag_data.page_name_original,
                        event: 'view'
                    });
                }
              }

        });

        utag.link({
            page_type: 'popup',
            page_name: 'email_popup',
            event: 'email_popup_view'
        });

        $('.mfp-bg').css('background', 'none');
    }

    function closePopup() {
        $.magnificPopup.close();
        $('.mfp-bg').css('background', '#0B0B0B');
    }

    function populatePromotion() {
        if ($cache.newEmailAddressesForm.exists()){
            $cache.promotionValue.val($cache.promotionContainer.data('promo'));
        }
        $cache.footerPromotionValue.val($cache.footerPromotionContainer.data('promo'));
    }

    function showMessage(content, type) {
    
        if ($cache.newEmailAddressesContainer.exists()){
            $cache.newEmailAddressesForm.find(('.message-form')).show();
            $cache.newEmailAddressesForm.find(('.message-form')).find(('p.'+type)).show();
            $cache.newEmailAddressesForm.find(('.message-form')).find(('p.'+type)).text(content);
        }else{
            if($cache.footerMessageContainer.exists() ){
                $cache.footerMessageContainer.find('span.'+type).show();
                $cache.footerMessageContainer.find('span.'+type).text(content);
            }
        }
        
    }

    function clearMessage() {
        $cache.newEmailAddressesForm.find('.message-form').hide();
    }

    function onSuccess() {
        if ($cache.newEmailAddressesForm.exists() && (!isRebound)) {
            showMessage('You\'ve successfully signed up!', 'success');
            utag.link({
                page_type: 'popup',
                page_name: 'email_popup',
                event: 'email_submit_success'
            });

            setTimeout(function(){
                closePopup();
            }, 5000);
        } else {
            $cache.footerSuccessMessageContainer.show();
        }
    }

    function bindForm(rebind) {
        var request = null;
        if (true===rebind) {
            isRebound = true;
        }
        if ($cache.newEmailAddressesForm.exists() && (!isRebound)) {
            request = app.form.bindAjax($cache.newEmailAddressesForm, true, {
                dataType: 'json'
            });

            request.beforeSubmit.add(function(theForm) {
                clearMessage();
                var emailInForm = $(theForm).find("input[type|=email]")[0].value;

                utag.link({
                    page_type: 'popup',
                    page_name: 'email_popup',
                    event: 'email_submit',
                    signup_email: emailInForm
                });

            });
            
            request.success.add(function(form, response, textStatus, jqXHR) {
                
                if (response.success === true) {
                    onSuccess();
                } else {
                    if(response.formErrors){
                        showErrorMgsPopUp(response);
                        $("#new-email-addresses-container .button-column button").focus();
                        $("#ui-datepicker-div").hide();
                    }
                }
                
            });
            
        } else {
            request = app.form.bindAjax($cache.footerSubscriptionForm, true, {
                dataType: 'json'
            });
            
            request.success.add(function(form, response, textStatus, jqXHR) {
                
                if (response.success === true) {
                    onSuccess();
                } else {
                    if(response.formErrors){
                        showErrorMgs(response);
                        $("#ui-datepicker-div").hide();
                    }
                }
            });
            
        }

        

        request.error.add(function(){
            showMessage('There was an error with the request, please try again later.', 'error');
        });
    }
    
    function showErrorMgsPopUp(response){
        var msgs= "";
        
        if (response.formErrors.formGroups) {
        
            var formGroup;
            for(formGroup in response.formErrors.formGroups){
                if('error' in response.formErrors.formGroups[formGroup]){
                    msgs = msgs.concat(response.formErrors.formGroups[formGroup].error );
                }
            
            }   
        }
        showMessage(msgs, 'error');
    }//
    
    function showErrorMgs(response){
        var msgs= "";
        if(response.formErrors.formFields){
            var formField;
            for(formField in response.formErrors.formFields){
                if('error' in response.formErrors.formFields[formField]){
                    msgs = msgs.concat(response.formErrors.formFields[formField].error );
                }
            }
        }
    
        if (response.formErrors.formGroups) {
        
            var formGroup;
            for(formGroup in response.formErrors.formGroups){
                if('error' in response.formErrors.formGroups[formGroup]){
                    msgs = msgs.concat(response.formErrors.formGroups[formGroup].error );
                }
            
            }   
        }
        showMessage(msgs, 'error');
    }

    function bindEvents() {
        bindForm();   
    }

    function init() {
        initializeCache();
        bindEvents();
        populatePromotion();
        
        if (!$cache.newEmailAddressesContainer.exists() || !emailDialogShow) {
            return;
        }

        $(window).load( function() {
            openPopup('#new-email-addresses-container');
        } );
        
        $(document).click(function(event) { 
            if( !$(event.target).closest('#' + $cache.newEmailAddressesContainerId ).length ) {
                utag.link({
                    page_type: utag_data.page_type_original,
                    page_name: utag_data.page_name_original,
                    event: 'view'
                });
            }        
        });   
    }

    app.emailSignUp = {
        init: init
    };

}(window.app = window.app || {}, jQuery));
(function(app, Social, $) {
    var CONST = app.constant;
    var LOGIN_PANEL = CONST.PUBSUB.LOGIN_PANEL;

    var $cache;
    var $forms;
    var $currentForm;
    var $socialEnabled;
    var $socialData = null;

    function initializeVars() {
        $socialEnabled = app.featuretoggle.isFeatureEnabled('gigya-integration');
    }

    function initializeCache() {
        $cache = {
            accountInfoBox: $("#account-info-box"),
            socialLoginContainer: $("#social-login-container"),
            socialCopyDiv: $("#social-copy-container"),

            loginLI: $("div#account-info-box.login"),
            loginAuth: $("div#account-info-box a.user-account-login"),
            loginOrRegisterContainer: $("#login-or-register-container"),

            loginForm: $("form[name='loginForm']"),
            loginBtn: $("#login-btn"),

            createAccountBtn: $("#create-account-btn"),

            registerForm: $("form[name='registerForm']"),
            registerBtn: $("#register-btn"),
            cancelRegistrationBtn: $("#cancel-registration-btn"),
            body: $('body'),
            mobileLoginLink: $('#mobile-login-link'),
            mobileAccountOptions: $('#mobile-account-options'),
            emailSubscriptionFooter: $(".email-subscription-container"),
            birddayInput: $("input[name$='_profile_customer_birthday']"),
            birddayInputNewEmailPOP: $("input[id$='_newemailaddress_birthday']:first"),
            birddayInputNewEmailFooter: $("footer input[id$='_newemailaddress_birthday']"),
            date_format: $("#date_format").text(),
            separator: $("#date_separator").text(),

            toggleDelay: app.constant.LOGIN_MENU_FORM_FADE_DURATION
        };

        $cache.container = $cache.loginOrRegisterContainer.find(".lc");
        $cache.socialLoginTitle = $cache.socialLoginContainer.find(".title-text");
        $cache.socialLoginGigyaContainer = $cache.socialLoginContainer.find(".gigyaLoginParent");
        $cache.registerBirthDayCell = $cache.registerForm.find("#register-birthday-cell");
        $cache.registerZipCell = $cache.registerForm.find("#register-zip-cell");
        $cache.liveInUSCheck = $cache.registerForm.find("#register-liveinus-cell input[type=checkbox]");
        $cache.minAgeCheck = $cache.registerForm.find("#copy-cell div.ageconfirm input[type=checkbox]");

        $forms = [$cache.loginForm, $cache.registerForm];
        $currentForm = $cache.loginForm;
    }

    function getCurrentForm() {
        return $currentForm;
    }

    function setCurrentForm(form) {
        $currentForm = form;
    }

    function resetErrors() {
        $.each($forms, function(index, value) {
            app.forms.resetAjaxFormErrors(value);
        });
    }

    function resetForm(form) {
        $(form).get(0).reset();
    }

    function resetForms() {
        $.each($forms, function(index, value) {
            resetForm(value);
        });
    }

    function isSocialCopyContainerVisible() {
        return $cache.socialCopyDiv.is(':visible');
    }

    function showSocialCopyContainer() {
        $cache.socialCopyDiv.show();
        $cache.socialLoginGigyaContainer.hide();
        $cache.socialLoginTitle.hide();
    }

    function hideSocialCopyContainer() {
        $cache.socialCopyDiv.hide();
        $cache.socialLoginGigyaContainer.show();
        $cache.socialLoginTitle.show();
    }

    function toggleSocialCopyContainer() {
        if (isSocialCopyContainerVisible()) {
            hideSocialCopyContainer();
        } else {
            showSocialCopyContainer();
        }
    }

    function getResizedSocialPhotolURL(userInfo) {
        var imageWidth = CONST.PROFILE.PROFILE_IMAGE_WIDTH;
        var newURL = app.util.appendParamToURL(userInfo.photoURL, "width", imageWidth);
        newURL = app.util.appendParamToURL(newURL, "height", imageWidth);
        
        return newURL;
    }
    
    function fillInRegistrationForm(userInfo) {
        var setUserField = function(form, fieldQuery, value) {
            if (value) {
                form.find(fieldQuery).val(value);
            }
        };

        var form = $cache.registerForm;

        setUserField(form, ".email-input", userInfo.email);
        setUserField(form, ".firstname-input", userInfo.firstName);
        setUserField(form, ".lastname-input", userInfo.lastName);
        setUserField(form, ".zip-input", userInfo.zip);
        setUserField(form, ".photourl-input", getResizedSocialPhotolURL(userInfo));
        setUserField(form, ".thumbnailurl-input", userInfo.thumbnailURL);
        setUserField(form, ".password-input", "********");

        var year = parseInt(userInfo.birthYear, 10),
            month = parseInt(userInfo.birthMonth, 10),
            day = parseInt(userInfo.birthDay, 10);

        if (year && month && day) {
            app.dateSelectComponent.setDateSelectValue($cache.registerBirthDayCell, new Date(year, month - 1, day));
        }

        if (userInfo.gender) {
            var genderValue = userInfo.gender === "m" ? 1 : (userInfo.gender === "f" ? 2 : 0);
            if (genderValue > 0) {
                form.find(".gender-input[value=" + genderValue + "]").prop("checked", true);
            }
        }
    }

    function getSocialUserName(userInfo, includeLastName) {
        var username = "";
        if (userInfo.firstName) {
            username = userInfo.firstName;
            if (includeLastName && userInfo.lastName) {
                username += " " + userInfo.lastName;
            }
        }
        else if (userInfo.email) {
            username = userInfo.email.split("@")[0];
        }
        else if (userInfo.nickname) {
            username = userInfo.nickname;
        }
        return username;
    }

    function getSocialThumbnailURL(userInfo) {
        return app.util.toProtocolNeutralUrl(userInfo.thumbnailURL);
    }

    function updateSocialAccountBoxAndCopy(userInfo) {
        $cache.socialCopyDiv.find(".social-firstname").html(getSocialUserName(userInfo, false));

        $cache.accountInfoBox.text(getSocialUserName(userInfo, true));

        var thumbnailURL = getSocialThumbnailURL(userInfo);
        if (thumbnailURL) {
            $cache.accountInfoBox.css("background-image", "url(" + thumbnailURL + ")");
            $cache.accountInfoBox.addClass("thumbnail");
        }
    }

    function resetSocialAccountBoxAndCopy() {
        $cache.socialCopyDiv.find(".social-firstname").html("");

        $cache.accountInfoBox.text(app.resources.locale.global.LOGIN_OR_REGISTER);

        $cache.accountInfoBox.css("background-image", "");
        $cache.accountInfoBox.removeClass("thumbnail");
    }

    function updateSocialUI(userInfo) {
        updateSocialAccountBoxAndCopy(userInfo);

        fillInRegistrationForm(userInfo);

        toggleSocialCopyContainer();

        app.accountCommon.getContainer("register").addClass("register-with-social");
        app.accountCommon.showContainers(["register"]);

        setCurrentForm($cache.registerForm);
    }

    function resetSocialUI() {
        hideSocialCopyContainer();

        app.accountCommon.getContainer("register").removeClass("register-with-social");

        resetForm($cache.registerForm);

        resetSocialAccountBoxAndCopy();
    }

    function startSocialRegistration(data) {
        $socialData = data;
        updateSocialUI(data.userInfo);
    }

    function resetSocialRegistration() {
        $socialData = null;
        resetSocialUI();
    }

    function updateLiveInUsWarning() {
        app.zipComponent.updateLiveInUsWarning($cache.liveInUSCheck, app.resources.forms.profile.INTERNATIONAL_WARNING);
    }

    function notifyLoggedIn() {
        $.publish(LOGIN_PANEL.USER.LOGGED_IN);
    }

    function notifyRegistered() {
        $.publish(LOGIN_PANEL.USER.REGISTERED);
    }

    function notifyLoginCanceled() {
        $.publish(LOGIN_PANEL.LOGIN_CANCELED);
    }

    function cleanUpLoginPanelState() {
        resetErrors();
        resetForms();
        resetSocialRegistration();
        updateLiveInUsWarning();

        if (!$cache.loginLI.hasClass("active")) {
            notifyLoginCanceled();
        }
    }

    function onLoginClick() {
        app.accountCommon.showContainers(["login", "createAccount"]);
        return app.slider.toggle(CONST.SLIDER.LOGIN_PANEL);
    }

    function onUserLoggedIn() {
        if (app.mrtaylorstore !== undefined) {
            app.mrtaylorstore.displayFamilyMemberTermsAndConditions(true);
        }
    }

    function updateHeader() {
        return $.get(app.urls.customerInfoHeaderInclude, function(data) {
            $("#menu-utility-user").replaceWith(data);
        });
    }
    function updateMiniCart() {
        return $.get(app.urls.minicartRefresh, function(data) {
            $("#mini-cart").replaceWith(data);
            $("#mobileMiniCart").replaceWith(data);
        });
    }
    function updateMobileUser(){
        if ($cache.mobileLoginLink.size()>0){
            return $.get(app.urls.customerInfoMobileInclude, function(data) {
                $cache.mobileLoginLink.replaceWith(data);
            });
        } else if ($cache.mobileAccountOptions.size()>0) {
            return $.get(app.urls.customerInfoMobileInclude, function(data) {
                $cache.mobileAccountOptions.replaceWith(data);
            });
        }
    }

    function fadeOutAndUpdateHeader() {
        var defer = new $.Deferred();

        $cache.container.fadeOut($cache.toggleDelay, function() {
            $.when(onLoginClick(), updateHeader()).done(updateMobileUser()).done(updateMiniCart()).done(function() {
                defer.resolve();
            });
        });

        return defer.promise();
    }

    function handleFormError(form, response) {
        app.forms.displayAjaxFormErrors(form, response);
    }

    function handleServerError(form, jqXHR, textStatus, errorThrown) {
        app.forms.displayServerError(form, textStatus, errorThrown);
    }

    function completeLogin() {
        if ($socialEnabled) {
            Social.Gigya.completeSiteLogin();
        }
        resetSocialRegistration();
    }

    function completeRegistration() {
        if ($socialEnabled) {
            Social.Gigya.completeSiteRegistration($socialData ? $socialData.UID : null);
        }
        resetSocialRegistration();
    }

    function processSocialLoginResponse(response) {
        var form = getCurrentForm();
        var data = response.data;
        var error = response.errorThrown;

        if (data) {
            switch (data.state) {
                case "success":
                    fadeOutAndUpdateHeader().done(notifyLoggedIn);
                    break;
                case "error":
                    handleServerError(form);
                    break;
                case "register":
                    startSocialRegistration(data);
                    break;
            }
        } else if (error) {
            handleServerError(form);
        }
    }

    function bindLoginForm() {
        var isFormReady = function() {
            return app.forms.isFormReadyForSubmit($cache.loginForm, [".username-input", ".password-input"]);
        };
        var successHandler = function(form, response, textStatus, jqXHR) {
            if (response.success) {
                completeLogin();
                fadeOutAndUpdateHeader().done(notifyLoggedIn);
            } else {
                handleFormError(form, response);
            }
        };

        var errorHandler = function(form, jqXHR, textStatus, errorThrown) {
            handleServerError(form, jqXHR, textStatus, errorThrown);
        };

        app.forms.bindAjaxForm($cache.loginForm, isFormReady, successHandler, errorHandler);
    }

    function bindRegisterForm() {
        var isFormReady = function() {
            var fields;

            var isEMEA = false;
            
            if ($cache.registerForm.find(".isEmeaSite").exists()) {
                isEMEA = true;
                fields = [".email-input", ".password-input"];

            } else {
                fields = [".email-input", ".password-input", ".birthday-input"];
                if ($cache.liveInUSCheck.is(":checked")) {
                    fields.push(".zip-input");
                }
            }
            
            return app.forms.checkFormFieldsNotBlank($cache.registerForm, fields);
        };

        var successHandler = function(form, response, textStatus, jqXHR) {
            if (response.success) {
                completeRegistration();
                fadeOutAndUpdateHeader()
                    .done(notifyRegistered)
                    .done(notifyLoggedIn);
            } else {
                handleFormError(form, response);
            }
        };

        var errorHandler = function(form, jqXHR, textStatus, errorThrown) {
            handleServerError(form, jqXHR, textStatus, errorThrown);
        };

        app.forms.bindAjaxForm($cache.registerForm, isFormReady, successHandler, errorHandler);
    }

    function bindLoginContainer() {
        $cache.loginBtn.on("click", function() {
            $cache.loginForm.submit();
        });

        bindLoginForm();
    }

    function bindCreateAccountContainer() {
        $cache.createAccountBtn.on("click", function() {
            resetErrors();
            app.accountCommon.showContainers(["register"]);
            setCurrentForm($cache.registerForm);
        });
    }

    function bindRegisterContainer() {
        $cache.registerBtn.on("click", function() {
            $cache.registerForm.submit();
        });

        $cache.cancelRegistrationBtn.on("click", function() {
            resetSocialRegistration();
            app.accountCommon.showContainers(["login", "createAccount"]);
            setCurrentForm($cache.loginForm);
        });

        app.dateSelectComponent.registerDateSelectComponent($cache.registerBirthDayCell);
        app.zipComponent.registerZipComponent($cache.registerZipCell, $cache.liveInUSCheck, updateLiveInUsWarning);

        bindRegisterForm();
    }

    function bindSocialLogin() {
        if ($socialEnabled) {
            $(Social.Gigya).on("login", function(evt, evtData) {
                processSocialLoginResponse(evtData);
            });
        }
    }

    function onLoginPanelAction(panelName, callback) {
        if(panelName === CONST.SLIDER.LOGIN_PANEL) {
            callback();
        }
    }

    function onLoginPanelCollapsed(topic, panelName) {
        onLoginPanelAction(panelName, function() {
            app.accountCommon.showContainers(["login", "createAccount"]);
            setCurrentForm($cache.loginForm);
            cleanUpLoginPanelState();

            $cache.loginLI.removeClass("active");
        });
    }

    function onBeforeLoginPanelExpanded(topic, panelName) {
        onLoginPanelAction(panelName, function() {
            $cache.loginLI.addClass("active");
        });
    }

    function onLoginPanelExpanded(topic, panelName) {
        onLoginPanelAction(panelName, function() {
            cleanUpLoginPanelState();
        });
    }
    
    function mobileLogin(event) {
            var body = $('body');
            event.preventDefault();
            app.mobilemenu.hideMenu();
            body.scrollTop(0);
            $cache.loginLI.trigger('click');
            return false;
    }
    
    function hideAllDatePickers(){
        if( $("#ui-datepicker-div select.ui-datepicker-year").exists() ){
            $("#ui-datepicker-div select.ui-datepicker-year").select2("close");
        }
        
        if( $("#ui-datepicker-div select.ui-datepicker-month").exists() ){
            $("#ui-datepicker-div select.ui-datepicker-month").select2("close");
        }
        
        $("input").datepicker( "hide" );
    }
    
    function bindEvents() {
        $.subscribe(LOGIN_PANEL.TOGGLE, onLoginClick);
        $.subscribe(LOGIN_PANEL.USER.LOGGED_IN, onUserLoggedIn);
        $.subscribe(CONST.SLIDER.COLLAPSED, onLoginPanelCollapsed);
        $.subscribe(CONST.SLIDER.BEFORE_EXPANDED, onBeforeLoginPanelExpanded);
        $.subscribe(CONST.SLIDER.EXPANDED, onLoginPanelExpanded);
        $.subscribe(CONST.PUBSUB.CATALOG_NAVIGATION.SHOW, hideAllDatePickers);

        $cache.loginLI.on("click", onLoginClick);
        $cache.loginAuth.on("click", onLoginClick);
        $cache.mobileLoginLink.on('click', mobileLogin);
        
        //
        
        bindLoginContainer();
        bindCreateAccountContainer();
        bindRegisterContainer();
        bindSocialLogin();
    }
    
    function initCalendars(){
    
        // birddayInput
    
        $cache.birddayInput.datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: "-100:+0",
            dateFormat: $cache.date_format,
            
            onSelect: function (dateText, inst){
                this.focus();
            },
            
            onClose: function(dateText, inst ){
                deactivateCalendars();
            },
            
            beforeShowDay:function(){
                return [false,'nonopacity',''];
            }
            
          });
        
        $cache.birddayInput.keypress(function (){ 
            
            $("#ui-datepicker-div select").select2({
                minimumResultsForSearch: Infinity
            });
            
        });
        
        $cache.birddayInput.focus( function (){
            
            $("#ui-datepicker-div select").select2({
                minimumResultsForSearch: Infinity
            });
            
            $("#ui-datepicker-div select.ui-datepicker-month").on("change",function(){
                
                
                $("#ui-datepicker-div select.ui-datepicker-month option:selected").each(function() {
                    
                    $cache.birddayInput.data("month",getMonth( $( this ) ));
                });
                
                updateDate($cache.birddayInput);
            });
            
            $("#ui-datepicker-div select.ui-datepicker-year").on("change",function(){
                
                $("#ui-datepicker-div select.ui-datepicker-year option:selected").each(function() {
                    
                    $cache.birddayInput.data("year",$( this ).val());
                });
                
                updateDate($cache.birddayInput);
            });
            
        });//focus
        
        $cache.birddayInput.on("click",function (){
            
            $cache.birddayInput.data("dateactive",true);
            
            $cache.birddayInput.datepicker("show");
            
            $("#ui-datepicker-div select").select2({
                minimumResultsForSearch: Infinity
            });
            
        });//click
        
        //birddayInputNewEmailPOP
        
        $cache.birddayInputNewEmailPOP.datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: "-100:+0",
            dateFormat: $cache.date_format,
            
            onSelect: function (dateText, inst){
                this.focus();
            },
            
            onClose: function(dateText, inst ){
                deactivateCalendars();
            },
            
            beforeShowDay:function(){
                return [false,'nonopacity',''];
            }
            
          });
        
        
        initBodyEvents();
        
        
        $cache.birddayInputNewEmailPOP.keypress(function (){ 
            
            $("#ui-datepicker-div select").select2({
                minimumResultsForSearch: Infinity
            });
            
        });
        
        
        $cache.birddayInputNewEmailPOP.focus( function (){
            
            $("#ui-datepicker-div select").select2({
                minimumResultsForSearch: Infinity
            });
            
            $("#ui-datepicker-div select.ui-datepicker-month").on("change",function(){
                
                $("#ui-datepicker-div select.ui-datepicker-month option:selected").each(function() {
                    
                    $cache.birddayInputNewEmailPOP.data("month",getMonth( $( this ) ));
                });
                updateDate($cache.birddayInputNewEmailPOP);
            });
            
            $("#ui-datepicker-div select.ui-datepicker-year").on("change",function(){
                
                $("#ui-datepicker-div select.ui-datepicker-year option:selected").each(function() {
                    
                    $cache.birddayInputNewEmailPOP.data("year",$( this ).val());
                });
                updateDate($cache.birddayInputNewEmailPOP);
            });
            
            $cache.birddayInputNewEmailPOP.data("dateactive",true);
        });
        
        $cache.birddayInputNewEmailPOP.on("click",function (){
            
            $cache.birddayInputNewEmailPOP.data("dateactive",true);
            
            $cache.birddayInputNewEmailPOP.datepicker("show");
            
            $("#ui-datepicker-div select").select2({
                minimumResultsForSearch: Infinity
            });
            
        });
        
        //birddayInputNewEmailFooter
        
        $cache.birddayInputNewEmailFooter.datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: "-100:+0",
            dateFormat: $cache.date_format,
            
            onSelect: function (dateText, inst){
                this.focus();
            },
            
            onClose: function(dateText, inst ){
                deactivateCalendars();
            },
            
            beforeShowDay:function(){
                return [false,'nonopacity',''];
            }
            
          });
          
        
        
        $cache.birddayInputNewEmailFooter.on('input',function(e){
            $cache.birddayInputNewEmailFooter.data("typed",true);
        });
        
        $cache.birddayInputNewEmailFooter.focus( function (){
            
            $("#ui-datepicker-div select").select2({
                minimumResultsForSearch: Infinity
            });
            
            $("#ui-datepicker-div select.ui-datepicker-month").on("change",function(){
                
                $("#ui-datepicker-div select.ui-datepicker-month option:selected").each(function() {
                    
                    $cache.birddayInputNewEmailFooter.data("month",getMonth( $( this ) ));
                });
                updateDate($cache.birddayInputNewEmailFooter);
            });
            
            $("#ui-datepicker-div select.ui-datepicker-year").on("change",function(){
                
                $("#ui-datepicker-div select.ui-datepicker-year option:selected").each(function() {
                    
                    $cache.birddayInputNewEmailFooter.data("year",$( this ).val());
                });
                updateDate($cache.birddayInputNewEmailFooter);
            });
            $cache.birddayInputNewEmailFooter.data("dateactive",true);
        });
        
        $cache.birddayInputNewEmailFooter.on("click",function (){
            
            $cache.birddayInputNewEmailFooter.data("dateactive",true);
            
            $cache.birddayInputNewEmailFooter.datepicker("show");
            
            $("#ui-datepicker-div select").select2({
                minimumResultsForSearch: Infinity
            });
            
        });
        
    }//
    
    function initBodyEvents(){
    
        $('body').on('click', '#ui-datepicker-div td.ui-datepicker-unselectable.ui-state-disabled.nonopacity span', function () {
            
        $("#ui-datepicker-div select.ui-datepicker-month option:selected").each(function() {
            var month = getMonth( $( this ) );
            $cache.birddayInputNewEmailFooter.data("month",month);
            $cache.birddayInput.data("month",month);
            $cache.birddayInputNewEmailPOP.data("month",month);
        });
        
        $("#ui-datepicker-div select.ui-datepicker-year option:selected").each(function() {
            var year = $( this ).val();
            $cache.birddayInputNewEmailFooter.data("year",year);
            $cache.birddayInput.data("year",year);
            $cache.birddayInputNewEmailPOP.data("year",year);
         });
        
        var day = ( $(this).text().length < 2?('0'+$(this).text()):$(this).text() );
        
        $cache.birddayInputNewEmailFooter.data("day",day);
        $cache.birddayInput.data("day",day);
        $cache.birddayInputNewEmailPOP.data("day",day);
        
        updateDate($cache.birddayInputNewEmailFooter);
        updateDate($cache.birddayInput);
        updateDate($cache.birddayInputNewEmailPOP);
        
            
        });
    }
    
    function getMonth(obj){
        return (parseInt(obj.val(),10)+1) < 10?('0'+(parseInt(obj.val(),10)+1)):(parseInt(obj.val(),10)+1);
    }
    
    function updateDate(input){
    
        if(input.data("dateactive")){
            
            var day = input.data("day")||'';
            var month = input.data("month")||'';
            var year = input.data("year")||'';
            year = (parseInt(year,10) === (new Date().getFullYear() )) ?'':year;
            input.val(day+$cache.separator+month+$cache.separator+year);
            
        }
    
    }
    
    function deactivateCalendars(){
        $cache.birddayInput.data("dateactive",false);
        $cache.birddayInputNewEmailFooter.data("dateactive",false);
        $cache.birddayInputNewEmailPOP.data("dateactive",false);
        
        $cache.birddayInput.data("day",null);
        $cache.birddayInput.data("month",null);
        $cache.birddayInput.data("year",null);
        
        $cache.birddayInputNewEmailFooter.data("day",null);
        $cache.birddayInputNewEmailFooter.data("month",null);
        $cache.birddayInputNewEmailFooter.data("year",null);
        
        $cache.birddayInputNewEmailPOP.data("day",null);
        $cache.birddayInputNewEmailPOP.data("month",null);
        $cache.birddayInputNewEmailPOP.data("year",null);
        
    }

    app.login = {
        init: function() {
            initializeVars();
            initializeCache();
            bindEvents();
            initCalendars();
        },
        togglePanel: onLoginClick
    };

}(window.app = window.app || {}, window.Social = window.Social || {}, jQuery));

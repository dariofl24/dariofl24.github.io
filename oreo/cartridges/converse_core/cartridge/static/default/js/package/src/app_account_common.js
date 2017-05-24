/*global window*/
(function(app, $) {
    var CONST = app.constant;
    var $cache;
    var $containers;

    function initializeCache() {
        $cache = {
            socialLoginContainer: $("#social-login-container"),
            loginOrRegisterContainer: $("#login-or-register-container"),
            loginContainer: $("#login-container"),
            createAccountContainer: $("#create-account-container"),
            registerContainer: $("#register-container"),
            requestPasswordContainer: $("#request-password-container"),
            resetPasswordContainer: $("#reset-password-container"),

            accountContainerToActivate: $("#account-container-to-activate"),
            requestPasswordForm: $("form[name='requestPasswordForm']"),

            toggleDelay: CONST.LOGIN_MENU_FORM_FADE_DURATION
        };

        $containers = [
            $cache.loginContainer,
            $cache.createAccountContainer,
            $cache.registerContainer,
            $cache.resetPasswordContainer,
            $cache.requestPasswordContainer
        ];
    }

    function hideContainers() {
        $.each($containers, function(index, container) {
            container.fadeOut($cache.toggleDelay, function() {
                container.hide();
            });
        });
    }

    function showContainers(ids) {
        hideContainers();

        setTimeout(function() {
            $.each(ids, function(index, id) {
                var container = $cache[id + "Container"];
                
                if (container) {
                    container.fadeIn($cache.toggleDelay, function() {
                        container.show();
                    });
                }
            });
        }, $cache.toggleDelay + 1);
    }

    function getContainer(id) {
        return $cache[id + "Container"];
    }

    function isVerifyPasswordResetUrl() {
        var url = app.util.getCurrentUrl();
        var pattern = app.urls.verifyPasswordReset;

        return url.indexOf(pattern) === 0;
    }

    function handleActivatedContainer(container) {
        if (isVerifyPasswordResetUrl() && container === "requestPassword") {
            app.forms.displayAjaxFormError($cache.requestPasswordForm, app.resources.PASSWORD_RESET_INVALID_TOKEN);
        }
    }

    function exists(container) {
        return container.length > 0 && app.accountCommon.getContainer(container);
    }

    function activateContainer(container) {
        hideContainers();
        app.slider.hide(CONST.SLIDER.SEARCH_PANEL, CONST.SLIDER.MAINTAIN_OVERLAY);
        app.accountCommon.showContainers([container]);
        app.slider.show(CONST.SLIDER.LOGIN_PANEL);
        handleActivatedContainer(container);
    }

    function deactivateAnyVisibleContainer() {
        hideContainers();
        app.slider.hide(CONST.SLIDER.LOGIN_PANEL);
        app.slider.hide(CONST.SLIDER.SEARCH_PANEL);
    }

    function activateContainerByUrlHash(container) {
        var id = container.replace("#", '');

        if (exists(id)) {
            activateContainer(id);
        } else if (isSearchHash(id)) {
            showSearch();
        } else {
            deactivateAnyVisibleContainer();
        }
    }

    function activateContainerIfExists() {
        var container = $cache.accountContainerToActivate.text();

        if (exists(container)) {
            activateContainer(container);
        } else {
            container = window.location.hash;
            if (container) {
                activateContainerByUrlHash(container);
            }
        }
    }

    function isSearchHash(hash) {
        return hash === 'search' ? true : false;
    }

    function showSearch() {
        hideContainers();
        app.slider.show(CONST.SLIDER.SEARCH_PANEL);
    }

    function listenForUrlHashChanges() {
        $(window).on('hashchange', function() {
            var container = window.location.hash;
            if (container) {
                activateContainerByUrlHash(container);
            } else {
                deactivateAnyVisibleContainer();
            }
        });
    }
    
    app.accountCommon = {
        init: function() {
            initializeCache();
            activateContainerIfExists();
            listenForUrlHashChanges();
        },

        showContainers: showContainers,
        getContainer: getContainer
    };

}(window.app = window.app || {}, jQuery));

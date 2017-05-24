/*global 
ActiveXObject
*/
/*jshint forin:false*/
(function(app, $) {

    var swapImageSrc = function() {
        var img = $(this);
        var altSrc = img.data('alt-src');
        if (altSrc) {
            img.data('alt-src', img.attr('src'));
            img.attr('src', altSrc);
        }
    };

    app.util = {
        showCustomErrors: function(element, message) {
            $(element).closest(".input-container").attr('errorlabel', message);
            $(element).closest(".input-container").addClass('error');
        },

        hideCustomErrors: function(that) {
            $(that.toHide).closest(".input-container").attr('errorlabel', " ");
            $(that.toHide).closest(".input-container").removeClass('error');
        },

        clearFormFields: function($form) {
            $form.find('input:text, input:password, input[type="email"], input:file, select, textarea').val('');
            $form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
        },

        hasValidNumericInput: function(elem) {
            var value = elem.val();

            if (value === '') {
                return false;
            }

            if (!/^\d+$/g.test(value)) {
                return false;
            }

            var max = parseInt(elem.attr('max'), 10);
            var min = parseInt(elem.attr('min'), 10);
            var numericValue = parseInt(value, 10);
            var response = numericValue >= min;
            response = response && numericValue <= max;

            return response;
        },

        limitCharacters: function() {
            $('form').find('textarea[data-character-limit]').each(function() {
                var characterLimit = $(this).data("character-limit");
                var charCountHtml = String.format(app.resources.CHAR_LIMIT_MSG,
                    '<span class="char-remain-count">' + characterLimit + '</span>',
                    '<span class="char-allowed-count">' + characterLimit + '</span>');
                var charCountContainer = $(this).next('div.char-count');
                if (charCountContainer.length === 0) {
                    charCountContainer = $('<div class="char-count"/>').insertAfter($(this));
                }
                charCountContainer.html(charCountHtml);
                // trigger the keydown event so that any existing character data is calculated
                $(this).change();
            });
        },

        setElementVisible: function(elOrId, visible) {
            // DO NOT use hide/show - it kills performance when the number of elements is large
            $(elOrId).css("display", visible ? "block" : "none");
        },

        setElementClassUsingExpression: function(elOrId, className, expression) {
            var addOrRemove = $.isFunction(expression) ? expression() : expression;
            $(elOrId).toggleClass(className, addOrRemove);
        },

        scrollTop: function() {
            $('body').scrollTop(0);
        },

        scrollBrowser: function(xLocation) {
            $('html, body').animate({
                    scrollTop: xLocation
                }, 500);
        },

        hasFlash: function() {
            var hasFlash = false;
            try {
                var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                if (fo) {
                    hasFlash = true;
                }
            } catch (e) {
                if (navigator.mimeTypes["application/x-shockwave-flash"] !== undefined) {
                    hasFlash = true;
                }
            }

            return hasFlash;
        },

        imageSwap: function(imgIdOrEl) {
            $(imgIdOrEl).hover(swapImageSrc, swapImageSrc);
        },

        siteInfo: function() {
            var locale = app.site.locale;
            var arr = locale.split('_');
            var currentLocale = {
                locale: arr[0],
                countryCode: arr[1]
            };

            return currentLocale;
        },

        isUserLoggedInRequest: function() {
            var request = $.ajax({
                url: app.urls.profileServiceCall,
                type: 'POST',
                data: {
                    action: 'isloggedin'
                }
            });

            return request;
        }
    };
}(window.app = window.app || {}, jQuery));

// app.rubberTracks
(function(app, $) {
    var $cache;

    function initializeCache() {
        var form = $("#rt-registration-form");

        $cache = {
            form: form,

            countrySelect: form.find("select[name$='_countryCode']"),

            stateUSContainer: form.find(".state-us-container"),
            stateUSSelect: form.find("select[name$='_stateCode']"),

            stateNonUSContainer: form.find(".state-non-us-container"),
            stateNonUSInput: form.find("input[name$='_stateNonUS']"),

            singupCenterError: form.find(".single-signup-center-allowed"),
            signupCenterValue: form.find("#signupCenterValue"),
            guitarCenterValue: form.find("#guitarCenterValue"),

            genresSelect: form.find("select[name$='_genres']"),
            genresInput: form.find("#otherGenre"),
            otherGenreContainer: form.find("#otherGenreContainer"),

            termsAndConditionsCheckbox: form.find("input[name$='_acceptedtermsandconditions']"),

            termsAndConditionsLink: form.find('a#tc'),

            termsAndConditionsError: form.find(".terms-and-condition-error"),

            bandUrls: form.find("textarea[name$='_bandurls']"),

            faqTitle: $(".faq-title")
        };
    }

    function toggleTermsAndConditionsError() {
        var accepted = $cache.termsAndConditionsCheckbox.is(':checked'); 

        if (accepted) {
            $cache.termsAndConditionsError.hide();
        } else {
            $cache.termsAndConditionsError.show();
        }
    }

    function handleStates() {
        var country = $cache.countrySelect.val();
        var state = $cache.stateUSSelect.val();

        if (country === '' && state === '') {
            $cache.stateUSContainer.find(".styled-select").addClass("error");
            return false;
        }

        if (country === 'US' && state === '') {
            $cache.stateUSContainer.find(".styled-select").addClass("error");
            return false;
        }

        $cache.stateUSContainer.find(".styled-select").removeClass("error");

        return true;
    }

    function handleSingupCenters() {
        var signupCenters = $cache.form.find("input[name='signupcenter']").filter(":checked");
        var guitarCenter = $cache.form.find("input[name='guitarcenter']").filter(":checked");

        if (signupCenters.length > 1) {
            $cache.singupCenterError.show();
            return false;
        }

        if (signupCenters.length === 1) {
            $cache.singupCenterError.hide();
            $cache.signupCenterValue.val(signupCenters.eq(0).attr('data-id'));
        } else {
            $cache.signupCenterValue.val("");
        }

        if (guitarCenter.exists()) {
            $cache.guitarCenterValue.val(guitarCenter.attr('data-id'));
        } else {
            $cache.guitarCenterValue.val("");
        }

        return true;
    }

    function handleGenres() {
        var indexOfLastOption = $cache.genresSelect.find("option").length - 1;
        var selectedIndex = $cache.genresSelect.prop("selectedIndex");
        var otherGenreValue = $cache.genresInput.val();

        if (selectedIndex === indexOfLastOption && otherGenreValue === '') {
            $cache.genresInput.addClass('error');
            return false;
        }

        if (selectedIndex === indexOfLastOption && otherGenreValue !== '') {
            $cache.genresSelect.find("option").eq(indexOfLastOption).val($cache.genresInput.val());
        }

        $cache.genresInput.removeClass('error');

        return true;
    }

    function handleTermsAndConditions() {
        toggleTermsAndConditionsError();

        return $cache.termsAndConditionsCheckbox.is(':checked');
    }

    function toggleStateSelect() {
        $cache.stateNonUSInput.val('');
        $cache.stateUSSelect.val('');
        
        $cache.stateNonUSContainer.hide();
        $cache.stateUSContainer.show();
    }

    function toggleStateInput() {
        $cache.stateNonUSInput.val('');
        $cache.stateUSSelect.val('');
        
        $cache.stateUSContainer.hide();
        $cache.stateNonUSContainer.show();
    }

    function setStateSelectDefaultValue() {
        var country = $cache.countrySelect.val();
            
        if (country !== 'US') {
            $cache.stateUSSelect.find("option").eq(0).val('*');
        }
    }

    function setBandUrlsValue() {
        if ($cache.bandUrls.val() === $cache.bandUrls.data('default')) {
            $cache.bandUrls.val('');
        }
    }

    function displayTermsAndConditionsDialog(fullModal) {
        var dialogDiv = $("#rt-terms-and-conditions-dialog");
        
        app.dialog.create({
            target: dialogDiv,
            options: {
                width: 600,
                height: 430,
                title: this.title,
                show: { effect: "fade", speed: 1000 },
                hide: "fade",
                closeOnEscape: true,
                open: function() {
                    $(".ui-widget-overlay").css('background-color', 'black');
                    $(".ui-widget-overlay").css('opacity', '0.8');
                    $(".ui-widget-overlay").click(function() { dialogDiv.dialog("close"); });
                }
            }
        });

        dialogDiv.dialog("open");
    }

    function bindOnCountryChange() {
        $cache.countrySelect.change(function() {
            var state = $cache.stateUSSelect.val();
            var country = $cache.countrySelect.val();
            
            if (state !== '' && country === 'US') {
                return;
            }

            if (country === '') {
                toggleStateSelect();
                return;
            }

            if (country === 'US') {
                toggleStateSelect();
                return;
            }

            if (country !== 'US') {
                toggleStateInput();
                return;
            }
        });
    }

    function bindOnGenresChange() {
        $cache.genresSelect.change(function() {
            var indexOfLastOption = $cache.genresSelect.find("option").length - 1;
            var selectedIndex = $cache.genresSelect.prop("selectedIndex");

            if (selectedIndex === indexOfLastOption) {
                $cache.otherGenreContainer.show();
            } else {
                $cache.otherGenreContainer.hide();
                $cache.genresInput.val('');
            }
        });
    }

    function bindFormSubmit() {
        $cache.form.submit(function() {
            var isValidState = handleStates();
            var isValidCenter = handleSingupCenters();
            var isValidGenre = handleGenres();
            var isTermsAndConditionsAccepted = handleTermsAndConditions();
            var result = isValidState && isValidCenter && isValidGenre && isTermsAndConditionsAccepted;

            if (result) {
                setStateSelectDefaultValue();
                setBandUrlsValue();
            }

            return result;
        });
    }

    function bindCheckBoxes() {
        var guitarCenter = $cache.guitarCenterValue.val();
        var signupCenter = $cache.signupCenterValue.val();

        if (guitarCenter) {
            $cache.form.find("input[name='guitarcenter']").attr("checked", "checked");
        }

        if (signupCenter) {
            $cache.form.find("input[data-id='" + signupCenter + "']").attr("checked", "checked");
        }
    }

    function bindFaqTitles() {
        $cache.faqTitle.click(function() {
            var faqRecord = $(this).closest('li');
            var faqText = faqRecord.find('.faq-text');

            faqText.toggle();
        });
    }

    function bindTermsAndConditions() {
        $cache.termsAndConditionsCheckbox.click(function() {
            toggleTermsAndConditionsError();
        });

        $cache.termsAndConditionsLink.click(function() {
            displayTermsAndConditionsDialog(true);
        });
    }

    function bindBandUrls() {
        $cache.bandUrls.focus(function() {
            if ($(this).val() === $(this).data('default') && !$(this).data('edited')) {
                $(this).val('');
            }
        }).change(function() {
            $(this).data('edited', this.value.length > 0);
        }).blur(function() {
            if ($(this).val().length === 0) {
                $(this).val($(this).data('default'));
            }
        }).blur();
    }

    function bindEvents() {
        bindOnCountryChange();
        bindOnGenresChange();
        bindFormSubmit();
        bindCheckBoxes();
        bindFaqTitles();
        bindTermsAndConditions();
        bindBandUrls();
    }

    app.rubberTracks = {
        init: function() {
            initializeCache();
            bindEvents();
        }
    };
}(window.app = window.app || {}, jQuery));

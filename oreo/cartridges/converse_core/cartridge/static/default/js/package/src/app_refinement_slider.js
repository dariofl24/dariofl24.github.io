(function(app, $) {
    var refinementSliders = [];

    var setState = function(element, state) {
        element.data('state', state);
    };

    var getState = function(element) {
        return $(element).data('state');
    };

    var resetState = function(element) {
        setState(element, null);
    };

    var getOrCreateState = function(element) {
        var state = getState(element);

        if (!state) {
            state = { page: 0 };
            setState(element, state);
        } else if (state.page < 0) {
            state.page = 0;
            setState(element, state);
        } 

        return state;
    };

    var moveToPrevious = function(options) {
        var container = options.container;
        var ulElement = $(container).find('ul');
        var state = getOrCreateState(ulElement);

        state.page = state.page - 1;

        app.refinementSlider.create(options);
    };

    var moveToNext = function(options) {
        var container = options.container;
        var ulElement = $(container).find('ul');
        var state = getOrCreateState(ulElement);

        state.page = state.page + 1;

        app.refinementSlider.create(options);
    };

    var createInternal = function(options) {
        var container = options.container;

        var ulElement = $(container).find('ul');
        var optionElements = $(ulElement).find('li');
        var nextContainer = $(container).find('.next-container');
        var prevContainer = $(container).find('.prev-container');

        var prevButton = prevContainer.find('.next-button');
        var nextButton = nextContainer.find('.next-button');

        container.addClass('paginated');

        var totalOptionsCount = $(optionElements).length;
        var optionsDisplayLimit = Math.floor($(ulElement).width() / options.optionWidth);
        var totalNumberOfPages = Math.ceil(totalOptionsCount / optionsDisplayLimit);

        prevButton.off("click");
        nextButton.off("click");

        if (totalOptionsCount > optionsDisplayLimit) {
            optionElements.hide();

            var state = getOrCreateState(ulElement);
            if (state.page > (totalNumberOfPages - 1)) {
                state.page = (totalNumberOfPages - 1);
                setState(ulElement, state);
            }

            var from = state.page * optionsDisplayLimit;
            var to = from + optionsDisplayLimit;

            $(optionElements).slice(from, to).show();

            prevButton.on("click", function() {
                moveToPrevious(options);
            });

            nextButton.on("click", function() {
                moveToNext(options);
            });
        } else {
            optionElements.show();
            container.removeClass('paginated');
            resetState(ulElement);
        }
    };

    app.refinementSlider = {
        create: function(options) {
            createInternal(options);
            refinementSliders.push(options);
        },

        resizeSliders: function() {
            for (var idx = 0; idx < refinementSliders.length; idx++) {
                var slider = refinementSliders[idx];

                createInternal(slider);
            }
        },

        destroy: function(options) {
            var newSliders = [];

            for (var idx = 0; idx < refinementSliders.length; idx++) {
                var slider = refinementSliders[idx];
                if (slider.id !== options.id) {
                    newSliders.push(slider);
                }
            }

            refinementSliders = newSliders;
        }
    };
}(window.app = window.app || {}, jQuery));

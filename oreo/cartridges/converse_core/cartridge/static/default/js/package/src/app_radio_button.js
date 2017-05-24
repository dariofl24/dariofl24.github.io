// app.radio_button
(function(app, $) {

    app.radio_button = {
        init: function(context) {
            app.radio_button.resetRadioButtons(context);
        },
        resetRadioButtons: function(context, event) {
            var $radio = $(context + ' input[type="radio"]');
            if (!$radio.prev().hasClass('styled-radio-button')) {
                $radio.before('<span class="styled-radio-button"></span>');
                $radio.hide();
            }

            $(context + ' .styled-radio-button').on('click', function() {
                $('.styled-radio-button').removeClass('active');
                $(this).addClass('active');
                $(this).next().click();
            });

            $(context + ' .styled-radio-button').siblings('label').on('click', function(event) {
                event.stopImmediatePropagation();
                var radio = $(this).siblings('.styled-radio-button');
                $(context + ' .styled-radio-button').removeClass('active');
                $(radio).addClass('active');
            });

            $radio.each(function() {
                if($(this).is(':checked')) {
                    $(this).prev().removeClass('active').addClass('active');
                }
            });
        }
    };
}(window.app = window.app || {}, jQuery));

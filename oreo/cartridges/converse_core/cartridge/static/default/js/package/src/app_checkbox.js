// app.checkbox
(function(app, $) {

    app.checkbox = {
        init: function(context) {
            app.checkbox.resetCheckboxes(context);
        },
        resetCheckboxes: function(context, event) {
            var $checkbox = $(context + ' input[type="checkbox"]');
            if (!$checkbox.prev().hasClass('styled-checkbox')) {
                $checkbox.before('<span class="styled-checkbox"></span>');
                $checkbox.hide();
            }
            $(context + ' .styled-checkbox').on('click', function(event) {
                event.stopImmediatePropagation();
                $(this).toggleClass('active');
                $(this).next().attr('checked', !$(this).next().prop('checked'));
                $(this).next().click();
                $(this).next().attr('checked', !$(this).next().prop('checked'));
            });

            $(context + ' .styled-checkbox').siblings('label').on('click', function(event) {
                event.stopImmediatePropagation();
                var checkbox = $(this).siblings('.styled-checkbox');
                $(checkbox).toggleClass('active');
            });

            $checkbox.each(function() {
                if($(this).is(':checked')) {
                    $(this).prev().removeClass('active').addClass('active');
                }

                if($(this).is(':disabled')) {
                    $(this).prev().removeClass('disabled').addClass('disabled');
                }
            });
        }
    };
}(window.app = window.app || {}, jQuery));

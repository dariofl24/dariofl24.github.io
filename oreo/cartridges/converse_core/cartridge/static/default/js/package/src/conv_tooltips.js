// Converse Tooltips
(function(converseTooltip, app, $) {
    var $conversePopover = $('.converse-popover');

    function destroyPopover() {
        $conversePopover.popover('destroy');
        $conversePopover.removeClass('popover-active');
    }

    function initializePopover(placement) {
        destroyPopover();
        $conversePopover.popover({
            placement: placement,
            trigger: 'click'
        });
    }

    function popoverToggle() {
        $conversePopover.on('show.bs.popover', function() {
            $(this).addClass('popover-active');
        });

        $conversePopover.on('hide.bs.popover', function() {
            $(this).removeClass('popover-active');
        });
    }

    function offClickRemovePopover(event) {
        if (typeof $(event.target).data('original-title') === 'undefined' && !$(event.target).parents().is('.popover.in')) {
            $('[data-original-title]').popover('hide');
        }
    }

    function initializeSubscribe() {
        $.subscribe(app.constant.RESPONSIVE_DEVICE_OBSERVER, function(pub, arg) {
            switch (arg[0]) {
                case app.constant.DEVICE_TYPE.SMALL:
                    destroyPopover();
                    initializePopover('bottom');
                    break;
                case app.constant.DEVICE_TYPE.MEDIUM:
                    destroyPopover();
                    initializePopover('right');
                    break;
                case app.constant.DEVICE_TYPE.LARGE:
                    destroyPopover();
                    initializePopover('right');
                    break;
            }
        });
    }

    converseTooltip.init = function() {
        if (app.util.isSmallDevice()) {
            initializePopover('bottom');
        } else {
            initializePopover('right');
        }

        popoverToggle();
        initializeSubscribe();
        $('body').on('click', offClickRemovePopover);
    };

}(window.converseTooltip = window.converseTooltip || {}, window.app, jQuery));
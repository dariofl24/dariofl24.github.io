/*global _*/
/*jshint forin:false*/
(function(app, $) {

    var previousDeviceType = "";

    function cleanCssContent(c) {
        return _.isUndefined(c) ? c : c.replace(/"/g,"");        
    }

    function isTouchDevice() {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    }

    /* 
    - this is a hacky cross browser bugfix and requires a comment -
    you can not grab the content value in ie.
    however you can grab the value of any other invalid css attribute.
    In every other browser the functionality is reversed. 
    you can grab the content attribute value, but you can not grab any 
    other invalid css attribute's value.
    */
    function getContentUsingIEHack() {
        var content = $(document.body).css('content');

        if ( _.isUndefined(content) ) {
            content = $(document.body).css('ie8');
        }
        return content;
    }

    function getDeviceProfile() {
        return cleanCssContent(getContentUsingIEHack());
    }

    function isSmallDevice() {
        return getDeviceProfile() === app.constant.DEVICE_TYPE.SMALL;
    }

    function isMediumDevice() {
        return getDeviceProfile() === app.constant.DEVICE_TYPE.MEDIUM;
    }

    function isLargeDevice() {
        return getDeviceProfile() === app.constant.DEVICE_TYPE.LARGE;
    }

    function isTransitioningToSmall() {
        return isSmallDevice() && ( app.constant.DEVICE_TYPE.SMALL !== previousDeviceType );
    }

    function isTransitioningToMedium() {
        return isMediumDevice() && ( app.constant.DEVICE_TYPE.MEDIUM !== previousDeviceType );
    }

    function isTransitioningToLarge() {
        return isLargeDevice() && ( app.constant.DEVICE_TYPE.LARGE !== previousDeviceType );
    }

    function publishResponsiveDeviceStatus() {
        $(window).on("resize", function() {
            if (isTransitioningToSmall()) {
                previousDeviceType = app.constant.DEVICE_TYPE.SMALL;
                $.publish(app.constant.RESPONSIVE_DEVICE_OBSERVER,[app.constant.DEVICE_TYPE.SMALL]);

            } else if (isTransitioningToMedium() ) {
                previousDeviceType = app.constant.DEVICE_TYPE.MEDIUM;
                $.publish(app.constant.RESPONSIVE_DEVICE_OBSERVER,[app.constant.DEVICE_TYPE.MEDIUM]);

            } else if (isTransitioningToLarge()) {
                previousDeviceType = app.constant.DEVICE_TYPE.LARGE;
                $.publish(app.constant.RESPONSIVE_DEVICE_OBSERVER,[app.constant.DEVICE_TYPE.LARGE]);
            }          
        });
    }

    $.extend(app.util, {
        isTouchDevice: isTouchDevice,
        getDeviceProfile: getDeviceProfile,
        isSmallDevice: isSmallDevice,
        isMediumDevice: isMediumDevice,
        isLargeDevice: isLargeDevice,
        publishResponsiveDeviceStatus: publishResponsiveDeviceStatus
    });
}(window.app = window.app || {}, jQuery));

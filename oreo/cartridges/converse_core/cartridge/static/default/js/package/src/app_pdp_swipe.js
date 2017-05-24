(function(app, $){

    var IMAGE_FADE_TIME = app.constant.PDP_MAIN_IMAGE_FADE_DURATION;
    var $cache;

    function initializeCache() {
        $cache = {
            pdpMain: $("#pdpMain, #chuckTwo"),
            thumbnails: $("#thumbnails")
        };

        $cache.primaryImage = $cache.pdpMain.find(".primary-image");
    }

    function addSelectedClassTo(index) {
        $cache.thumbnails.find("li").eq(index).addClass("selected");
    }

    function removeSelectedClassFrom(index) {
        $cache.thumbnails.find("li").eq(index).removeClass("selected");
    }

    function addRemoveSelectedClass(addIndex, RemoveIndex) {
        addSelectedClassTo(addIndex);
        removeSelectedClassFrom(RemoveIndex);
    }

    function setPrimaryImage(imageUrl) {
        $cache.primaryImage.fadeOut(IMAGE_FADE_TIME, function() {
            $(this).attr({
                    "src": imageUrl
                })
                .load(function() {
                    $(this).fadeIn(IMAGE_FADE_TIME);
                });
        });
    }

    function getPrimaryImageFromThumbnail(index) {
        var element = $cache.thumbnails.find("li").eq(index);
        return element.find("a").attr("href");
    }

    function getImage(direction) {
        var currentImageIndex = getCurrentImageIndex(),
            imageCount = getImageCount(),
            newImageIndex,
            newPrimaryImageUrl;
        if (direction === "left") {
            newImageIndex = (currentImageIndex === imageCount) ? 0 : currentImageIndex + 1;
        }
        else {
            newImageIndex = (currentImageIndex === 0) ? imageCount : currentImageIndex - 1;
        }
        newPrimaryImageUrl = getPrimaryImageFromThumbnail(newImageIndex);
        addRemoveSelectedClass(newImageIndex, currentImageIndex);
        setPrimaryImage(newPrimaryImageUrl);
    }

    function getImageCount() {
        return $cache.thumbnails.find("li").length - 1;
    }

    function getCurrentImageIndex() {
        return $cache.thumbnails.find(".selected").index();
    }

    function initializeTouchWipe() {
        $cache.primaryImage.touchwipe({
            preventDefaultEvents: function() {return false;},
            wipeLeft: function() {
                getImage("left");
            },
            wipeRight: function() {
                getImage("right");
            }
        });
    }

    function initializeEvents() {
        initializeTouchWipe();
    }

    app.pdpSwipe = {
        init: function() {
            initializeCache();
            initializeEvents();
        }
    };

})(window.app = window.app || {}, jQuery);

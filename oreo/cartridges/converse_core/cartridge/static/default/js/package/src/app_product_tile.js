(function(app, $) {
    var $cache = {};
    var MAX_SWATCHES = 4;

    function createSwatchData(ulElement, max_page_index) {
        var data = $(ulElement).data('swatch');
        if (!data) {
            data = { page: 0, max_page: (max_page_index - 1) };
            $(ulElement).data('swatch', data);
        } else if (data.page < 0) {
            data.page = data.max_page;
            $(ulElement).data('swatch', data);
        }

        return data;
    }

    function showSwatchNextPrevButtons(parent, data, max_page_index) {
        var prev = $(parent).find(".prev-swatch-group");
        var next = $(parent).find(".next-swatch-group");

        prev.css('display', 'inline-block');
        next.css('display', 'inline-block');
    }

    function updateSwatch(element, updateFunction) {
        var swatches = $(element).closest(".grid-tile").find(".swatch-list");
        if (swatches.length === 0) {
            return;
        }

        var swatch = swatches[0];
        var data = $(swatch).data('swatch');
        
        if (data) {
            data = updateFunction(data);
            $(swatch).data('swatch', data);
        }

        initializeSwatch(swatch);
    }

    function initializeSwatch(ulElement) {
        var liElements = $(ulElement).find("li");
        var parent = $(ulElement).parent();
        var max_page_index = Math.ceil($(liElements).length / MAX_SWATCHES);
        
        var data = createSwatchData(ulElement, max_page_index);

        if (data.page > (max_page_index - 1)) {
            data.page = 0;
            $(ulElement).data('swatch', data);
        }

        if (liElements.length > MAX_SWATCHES) {
            showSwatchNextPrevButtons(parent, data, max_page_index);
        }

        var from = data.page * MAX_SWATCHES;
        var to = from + MAX_SWATCHES;

        $(liElements).hide();
        $(liElements).slice(from, to).show();
    }

    function initializeDom() {
        $cache.container.find(".product-tile").each(function(idx) {
            $(this).data("idx", idx);
            var swatch = $(this).find(".swatch-list");
            var data = $(swatch).data('swatch');
            if (data) {
                data.page = 0;
                swatch.data("swatch", data);
            }

            initializeSwatch(swatch);
        });
    }

    function addMobileSpecificClasses() {
        if (app.isMobileUserAgent) {
            $cache.container.find('.product-tile').addClass('touch');
        } else {
            $cache.container.find('.product-tile').addClass('notouch');
        }
    }

    function setSwatchData(productTile) {
        var swatch = $(productTile).find(".swatch-list");
        var data = $(swatch).data('swatch');
        if (data) {
            data.page = 0;
            swatch.data("swatch", data);
        }
        return swatch;
    }

    function initializeEvents() {
        addMobileSpecificClasses();

        $cache.container.on("mouseleave", ".product-tile", function(e) { 
            setSwatchData(this);
        });

        $cache.container.on("mouseenter", ".product-tile", function(e) {
            initializeSwatch(setSwatchData(this));
        });

        $cache.container.on("mouseleave", ".swatch-list", function(e) {
            var tile = $(this).closest(".grid-tile");
            var thumb = tile.find(".product-image a.thumb-link img").filter(":first");
            var data = thumb.data("current");
            
            if (data) {
                thumb.attr({
                    src: data.src,
                    alt: data.alt,
                    title: data.title
                });
                
                hideShowComingSoonMsg(data,tile);
                
            }
        });

        $cache.container.on("mouseenter", ".swatch-list a.swatch", function(e) {
            var tile = $(this).closest(".grid-tile");
            var thumb = tile.find(".product-image a.thumb-link img").filter(":first");
            var data = $(this).data("thumb");
            var current = thumb.data('current');
            
            if (!current) {
                thumb.data('current', {
                        src: thumb[0].src,
                        alt: thumb[0].alt,
                        title: thumb[0].title,
                        iscomingsoon: thumb.data("comingsoon").iscommingsoon
                    });
            }

            thumb.attr({
                    src: data.src,
                    alt: data.alt,
                    title: data.title
                });
            
            thumb.data("comingsoon",{iscommingsoon:data.iscomingsoon});
            
            hideShowComingSoonMsg(data,tile);
            
        });

        $cache.container.on("click", ".prev-swatch-group", function(e) {
            updateSwatch($(this), function(data) {
                data.page = data.page - 1;
                return data;
            });
        });

        $cache.container.on("click", ".next-swatch-group", function(e) {
            updateSwatch($(this), function(data) {
                data.page = data.page + 1;
                return data;
            });
        });
    }

    function hideShowComingSoonMsg(data,tile){
    
        var comingSoonCont = tile.find(".product-comingsoon").filter(":first");
        var priceCont = tile.find(".product-pricing").filter(":first");
        
        if(data.iscomingsoon==='true'){
            comingSoonCont.show();
            priceCont.hide();
        }else{
            comingSoonCont.hide();
            priceCont.show();
        }
    }
    
    function initializeFeaturedCategories() {
        $(".site-featured-items").each(function(index) {
            var searchContentPlaceholder = $(".site-featured-items").eq(index).find(".search-content");
            var searchShowUrl = searchContentPlaceholder.attr("href");

            $.get(searchShowUrl).done(function(result) {
                var element = $(result).find(".search-result-content");
                element.find("#refinements").remove();
                var html = String.format('<div class="search-result-content">{0}</div>', element.html());
                searchContentPlaceholder.replaceWith(html);
                app.product.tile.init();
            });
        });
    }

    function siteFeaturedCategoryInit() {
        if (app.product.tile.siteFeaturedCategoryCounter === 0) {
            initializeFeaturedCategories();
        }
        app.product.tile.siteFeaturedCategoryCounter++;
    }

    app.product.tile = {
        init: function() {
            $cache = {
                container: $(".tiles-container")
            };
            initializeDom();
            initializeEvents();
        },
        siteFeaturedCategoryCounter: 0,
        siteFeaturedCategoryInit: siteFeaturedCategoryInit
    };

}(window.app = window.app || {}, jQuery));

/*global  
jQuery,
MakeSingleton
*/
/*exported HomepageSlideshow*/
// Homepage Hero Slideshow

function HomepageSlideshow(app) {
    var $ = jQuery;
    var $cache_objs={};
    var $cache = {
        selector: {
            allSlideshows:".hero-slideshow",
            slideshowLiElements:".image-li",
            largeSlideshow: {
                outer:".hero-slideshow.large",
                image:"#large-hero img",
                imageHover:"#large-hero-hover img",
                content:".large-slide",
                showNav:true
            },
            smallSlideshow: {
                outer:".hero-slideshow.small",
                image:"#small-hero img",
                imageHover:"#small-hero-hover img",
                content:".mobile-slide",
                navParent:".hero-slideshow-small-container .control-container",
                showNav:true
            }
        },
        moveToLargeSlide:".move-to-large-slide",
        moveToSmallSlide:".move-to-small-slide"
    };

    function getLargeSliderOptions(slideshowSelector) {
        return {
            auto: true,                     // Boolean: Animate automatically, true or false
            speed: 500,                     // Integer: Speed of the transition, in milliseconds
            timeout: 4000,                  // Integer: Time between slide transitions, in milliseconds
            pager: true,                    // Boolean: Show pager, true or false
            nav: slideshowSelector.showNav, // Boolean: Show navigation, true or false
            random: false,                  // Boolean: Randomize the order of the slides, true or false
            pause: true,                    // Boolean: Pause on hover, true or false
            pauseControls: true,            // Boolean: Pause when hovering controls, true or false
            prevText: "",                   // String: Text for the "previous" button
            nextText: "",                   // String: Text for the "next" button
            maxwidth: "",                   // Integer: Max-width of the slideshow, in pixels
            navContainer: slideshowSelector.navParent_selector, // Selector: Where controls should be appended to, default is after the 'ul'
            manualControls: "",             // Selector: Declare custom pager navigation
            namespace: "rslides",           // String: Change the default namespace used
            before: function(){},           // Function: Before callback
            after: function(){}             // Function: After callback
        };
    }

    function getSmallSliderOptions() {
        return {
            auto: true,
            autoHover: true,
            pager: true,
            mode: "horizontal",
            useCSS: false,
            touchEnabled: true,
            controls:false,
            captions:true
        };
    }

    function getMainImage(elOrId, imageSelector) {
        var images = $(elOrId).find(imageSelector);
        return (images.length > 1 ? images.filter(".hero") : images).eq(0);
    }

    function getLargeMainImage(elOrId) {
        return getMainImage(elOrId, $cache.selector.largeSlideshow.image);
    }

    function getLargeHooverImage(elOrId) {
        return getMainImage(elOrId, $cache.selector.largeSlideshow.imageHover);
    }

    function getLargeHooverContent(elOrId) {
        return $(elOrId).find($cache.selector.largeSlideshow.content).eq(1);
    }

    function getSmallMainImage(elOrId) {
        return getMainImage(elOrId, $cache.selector.smallSlideshow.image);
    }

    function removeEmptySlides(slideshowSelector) {
        slideshowSelector.outer.find($cache.selector.slideshowLiElements).each(function() {
            if (!getLargeMainImage(this).exists() && !getSmallMainImage(this).exists()) {
                $(this).remove();
            }
        });
    }

    function adjustLargeSliderImages(slideshowSelector) {
        var setDimensions = function(image) {
            image.attr("width", "100%");
            image.attr("height", "");
        };

        slideshowSelector.outer.find($cache.selector.slideshowLiElements).each(function(e) {
            setDimensions(getLargeMainImage(this));
            setDimensions(getLargeHooverImage(this));
        });
    }

    function buildLargeSlider(slideshowSelector) {
        removeEmptySlides(slideshowSelector);
        slideshowSelector.outer.responsiveSlides(getLargeSliderOptions(slideshowSelector));
        adjustLargeSliderImages(slideshowSelector);
    }

    function buildSmallSlider(slideshowSelector) {
        removeEmptySlides(slideshowSelector);

        if (slideshowSelector.outer.find('.image-li').size() === 1) {
            return;
        }

        slideshowSelector.outer.bxSlider(getSmallSliderOptions());
    }

    function buildSliders() {
        buildLargeSlider($cache_objs.selector.largeSlideshow);
        buildSmallSlider($cache_objs.selector.smallSlideshow);
    }
   
    function setupHoverInteraction() {
        var opacity = 1.0;
        $cache_objs.selector.slideshowLiElements.hover(
            function() {
                var hooverImage = getLargeHooverImage(this);
                if (hooverImage.exists()) {
                    getLargeHooverContent(this).fadeTo(app.constant.HERO_HOVER_TRANSITION_DURATION, opacity);
                }
            },
            function() {
                var hooverImage = getLargeHooverImage(this);
                if (hooverImage.exists()) {
                    getLargeHooverContent(this).fadeTo(app.constant.HERO_UNHOVER_TRANSITION_DURATION, 0);
                }
            }
        );
    }
        
    function setupTouchWipe() {
        $cache_objs.selector.largeSlideshow.outer.touchwipe({
            wipeLeft: function() { 
                $("a.prev").click();
            },
            wipeRight: function() { 
                $("a.next").click();
            },        
            min_move_x: 20,
            min_move_y: 20,
            preventDefaultEvents: function() {return false;}
        });
    }
    
    function initEvents() {
        
        $cache_objs.moveToLargeSlide.on("click", function() {
        
            var slideToMove = $(this).data("movetoslide");      
            var parentCont = $(this).parents(".hero-slideshow-large-container:first");
            parentCont.find("div.control-container a:contains("+slideToMove+"):first").trigger('click');
            
        });
        
        $cache_objs.moveToSmallSlide.on("click", function() {
            
            var slideToMove = $(this).data("movetoslide");
            var parentCont = $(this).parents(".hero-slideshow-small-container:first");
            parentCont.find("div.bx-controls a:contains("+slideToMove+"):first").trigger('click');
            
        });
        
    }

    function initAllSliders(){
    
        $("#hero-slot, .hero-slot").each(function( index ) {
              
              var $cache2= {
                      selector: {
                          allSlideshows: $(this).find(".hero-slideshow"),
                          slideshowLiElements: $(this).find(".image-li"),
                          largeSlideshow: {
                              outer: $(this).find(".hero-slideshow.large"),
                              image: $(this).find("#large-hero img"),
                              imageHover: $(this).find("#large-hero-hover img"),
                              content: $(this).find(".large-slide"),
                              navParent: $(this).find("#"+this.id+" .hero-slideshow-large-container .control-container"),
                              navParent_selector:"#"+this.id+" .hero-slideshow-large-container .control-container",
                              showNav:true
                          },
                          smallSlideshow: {
                              outer: $(this).find(".hero-slideshow.small"),
                              image: $(this).find("#small-hero img"),
                              imageHover: $(this).find("#small-hero-hover img"),
                              content: $(this).find(".mobile-slide"),
                              navParent: $(this).find(".hero-slideshow-small-container .control-container"),
                              navParent_selector:".hero-slideshow-small-container .control-container",
                              showNav:true
                          }
                      },
                      moveToLargeSlide: $(this).find(".move-to-large-slide"),
                      moveToSmallSlide: $(this).find(".move-to-small-slide")
              };
             
             $cache_objs= $cache2;
             
             buildSliders();
             setupHoverInteraction();
             setupTouchWipe();
             initEvents();
             
        });
    }
    
    this.init = function() {
        initAllSliders();
    };

    return new MakeSingleton(this);
}

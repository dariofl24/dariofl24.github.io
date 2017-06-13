
var mySlickInit = {

    init: function() {
        console.log("mySlickInit !!!!");
        $("section.regular").slick({
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        fade: true,
        arrows: true,
        autoplaySpeed: 4000,
        cssEase: 'linear'
      });

        $("section.featureshow").slick({
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        fade: true,
        arrows: false,
        autoplaySpeed: 3000,
        cssEase: 'linear'
      });

    }

};

var dyo_colors_feature= (function() {

    var $cache = {};

    var init = function(){
        initCache();
        bindEvents();

        console.log("DYO - Feature LOADED !!!!");
    };

    var initCache = function(){

        $cache.colorChips = $(".colorchip");
        
    };

    var bindEvents = function(){

        $cache.colorChips.click(function() {
            $cache.colorChips.removeClass("active");
            $( this ).addClass("active");
        });

    };

    return {
        init: init
    };

})();


var allFeatures = (function() { 

    var init = function(){

        mySlickInit.init();
        dyo_colors_feature.init();

    };
    
    return {
        allinit: init
    };

})();


 
$(document).on('ready',allFeatures.allinit);

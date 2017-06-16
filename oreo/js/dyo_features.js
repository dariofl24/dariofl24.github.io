
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
        initColorChips();
        bindEvents();

        console.log("DYO - Feature LOADED !!!!");
    };

    var initCache = function(){

        $cache.colorChips = $(".colorchip");
        $cache.tshirtArea = $("#dragarea");
        $cache.frontlocation = "../oreo/tshirts/front/";
    };

    var initColorChips = function(){


        $cache.colorChips.each(function( index ) {
            var me= $( this );
            console.log( index + ": " + me.data("red") );
            console.log( index + ": " + me.data("green") );
            console.log( index + ": " + me.data("blue") );
            me.css( "background-color","rgb("+me.data("red")+","+me.data("green")+","+me.data("blue")+")" );
        });



    }

    var bindEvents = function(){ 

        $cache.colorChips.click(function() {
            var me= $( this );
            $cache.colorChips.removeClass("active");
            me.addClass("active");
            $cache.tshirtArea.css("background","url("+$cache.frontlocation+"R"+me.data("red")+"G"+me.data("green")+"B"+me.data("blue")+".png) no-repeat center");
            
            $cache.tshirtArea.css("background-size","contain");

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

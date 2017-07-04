
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
        initImages();

        console.log("DYO - Feature LOADED !!!!");
    };

    var initCache = function(){

        $cache.colorChips = $(".colorchip");
        $cache.tshirtArea = $("#dragarea");
        $cache.frontlocation = "../oreo/tshirts/front/";
        $cache.location = "../oreo/tshirts/";
        $cache.currentColor = "R255G255B255";
        $cache.front = "front";
        $cache.back = "back";
        $cache.currentSide = $cache.front;
        $cache.colorName = $("#colorName");
        $cache.switch = $(".switchContainer");
        $cache.textinput = $("#text_line");
        $cache.textpreview = $("#text_line_preview");
        $cache.fontsSelect = $("#fonts_select");
        $cache.prevFontSelect ="";
        $cache.fontSizeSelect = $("#fonts_size_select");
        $cache.textLinePreviewContainer = $(".text_line_preview_cont");
        $cache.fontColorSelect = $("#fonts_color_select");
        $cache.camera = $(".shootLink");
        $cache.textlineOKBtn = $("#textline_ok");
        $cache.textlineSetings= {
            text: "",
            font: "",
            size: $cache.fontSizeSelect.val(),
            color: $cache.fontColorSelect.val(),
            li_id: 0,
            width: 0
        };
    };

    var initColorChips = function(){


        $cache.colorChips.each(function( index ) {
            var me= $( this );
            me.css( "background-color","rgb("+me.data("red")+","+me.data("green")+","+me.data("blue")+")" );
        });
    }

    var initImages = function(){

        var notside = ( $cache.currentSide === $cache.front )? $cache.back : $cache.front;;

        $(".mysection " + "."+$cache.currentSide).show();
        $(".mysection."+$cache.currentSide).show();

        $(".mysection " + "."+notside).hide();
        $(".mysection."+notside).hide();        
    };


    var bindEvents = function(){

        $cache.colorChips.click(function() {
            var me= $( this );
            $cache.colorChips.removeClass("active");
            me.addClass("active");

            $cache.currentColor= "R"+me.data("red")+"G"+me.data("green")+"B"+me.data("blue");
            changeColorSide();

            $cache.colorName.text(me.data("name"));

            $cache.textLinePreviewContainer.css( "background-color","rgb("+me.data("red")+","+me.data("green")+","+me.data("blue")+")" );

        });

        $cache.switch.click(function(){

            $(".mysection " + "."+$cache.currentSide).hide();
            $(".mysection."+$cache.currentSide).hide();

            $cache.currentSide = ( $cache.currentSide === $cache.front )? $cache.back : $cache.front;

            $(".mysection " + "."+$cache.currentSide).show();
            $(".mysection."+$cache.currentSide).show();

            changeColorSide();
        });

        $cache.camera.click( function(evt){

            console.log("Camera !!");

            html2canvas($cache.tshirtArea,{

                onrendered: function (canvas) {

                    var imgageData = canvas.toDataURL("image/png");

                    var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
                    $cache.camera.attr("download", "your_pic_name.png").attr("href", newData);

                }
            });


        });

        $cache.textinput.keyup( function(){

            var str = $cache.textinput.val().trim();

            $cache.textlineSetings.text = str;

            if( str ){
                $cache.textpreview.text( str );
            }else {
                $cache.textpreview.text( "Add some text" );
            }
            
        });
        
        $cache.fontsSelect.on('change', function (evt) {
            var font = $cache.fontsSelect.val();

            $cache.textlineSetings.font = font;
            
            $cache.textpreview.removeClass( $cache.prevFontSelect );
            $cache.textpreview.addClass(font);

            $cache.prevFontSelect = font;

        });

        $cache.fontSizeSelect.on('change', function (evt) {
            var sz = $cache.fontSizeSelect.val();

            $cache.textlineSetings.size = sz;

            $cache.textpreview.css("font-size",sz);

        });

        $cache.fontColorSelect.on('change', function (evt) {

            var fcolor = $cache.fontColorSelect.val();

            $cache.textlineSetings.color = fcolor;

            $cache.textLinePreviewContainer.css("color",fcolor);

        });

        $cache.textlineOKBtn.click( function(){
            console.log("OK:: "+ $cache.textlineSetings.text);

            var str = $cache.textlineSetings.text;
            var settings = $cache.textlineSetings;

            if(str){
                console.log( settings );

            }

        });

    };

    var changeColorSide = function() {

        $cache.tshirtArea.css("background","url("+$cache.location+$cache.currentSide+"/"+ $cache.currentColor +".png) no-repeat center");
        $cache.tshirtArea.css("background-size","contain");

    };

    return {
        init: init
    };

})();


var allFeatures = (function() { 

    var init = function(){

        mySlickInit.init();
        dyo_colors_feature.init();

        initDomEnhacements();
    };

    var initDomEnhacements = function() {

        $( "#accordion" ).accordion({
              collapsible: true,
              heightStyle: "content"
            });

        $("#fonts_select").select2({
            minimumResultsForSearch: Infinity,
            placeholder: "Tipo de fuente",
            allowClear: true,
            templateResult: formatFontsSelector,
            templateSelection: templateFontSelect
        });

        $("#fonts_size_select").select2({
            minimumResultsForSearch: Infinity,
            allowClear: false
        });

        $("#fonts_color_select").select2({
            minimumResultsForSearch: Infinity,
            allowClear: true,
            templateResult: formatColorFontsSelector,
            templateSelection: templateColorFontSelect
        });

    };

    var formatColorFontsSelector = function( color ){

        if (!color.id) { return color.text; }

        var $color = getFontColorTemplate(color.element.value,color.text); 
        //$('<div class="fontColorSelectChip" style="background-color: '+ color.element.value +';" ></div> <span>' + color.text + '</span>');

        return $color;
    };

    var templateColorFontSelect = function(data,container){
        if (!data.id) { return data.text; }

        var $color = getFontColorTemplate(data.element.value,data.text); 
        //$('<span class="'+ data.element.value +'" >' + data.text + '</span>');

        return $color;
    };

    var getFontColorTemplate = function(value,text){

        var $color = $('<div class="fontColorSelectChip" style="background-color: '+ value +';" ></div> <span>' + text + '</span>');

        return $color;
    };

    var formatFontsSelector = function( font ){

        if (!font.id) { return font.text; }

        var $font = getFontSpanTemplate(font.element.value,font.text); // $('<span class="'+ font.element.value +'" >' + font.text + '</span>');

        return $font;
    };

    var templateFontSelect = function(data, container) {

        if (!data.id) { return data.text; }

        var $font = getFontSpanTemplate(data.element.value,data.text); //$('<span class="'+ data.element.value +'" >' + data.text + '</span>');

        return $font;
    };

    var getFontSpanTemplate = function (value,text){

        var $font = $(' <div></div> <span class="'+ value +'" >' + text + '</span>');

        return $font;
    };
    
    return {
        allinit: init
    };

})();


 
$(document).on('ready',allFeatures.allinit);

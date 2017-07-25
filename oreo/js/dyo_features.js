
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
        bindBodyEvents();
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
        $cache.textLinePreview_LI = ".text_line_preview_listItem";
        $cache.fontColorSelect = $("#fonts_color_select");
        $cache.camera = $(".shootLink");
        $cache.textlineOKBtn = $("#textline_ok");
        $cache.textlineSetings = {
            text: "",
            font: "",
            size: $cache.fontSizeSelect.val(),
            color: $cache.fontColorSelect.val(),
            li_id: 0,
            width: 0,
            height: 0,
            heightouter: 0,
            backgroundColor: "rgb(255,255,255);",
            side: $cache.currentSide
        };
        $cache.linetextList = $("#linetext_list");
        $cache.lineTextNextID = 0;
        $cache.dragareaContainer = $("#dragarea .mycontainer");
        
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

    var bindBodyEvents = function(){

        $("body").on("click","#linetext_list .li_button_trash",function(){
            console.log("Trash ... "+ $( this ).data("fromline") );
            $( "li.line_li_"+$( this ).data("fromline") ).remove();
            $( "#draggable_"+$( this ).data("fromline") ).remove();
        });

        $("body").on("click",".lock_edit .li_button_lock",function(){
            console.log("Lock ... "+ $( this ).data("fromline") );

            $( this ).hide();
            var fromline = $( this ).data("fromline")
            $(".line_li_"+ fromline + " .lock_edit .li_button_unlock" ).show();

            $( "#draggable_"+ fromline ).draggable( "option", "disabled", false );
            $( "#draggable_"+ fromline ).toggleClass("active");
            $(".li_fonts_size_select_" + fromline).prop("disabled", false);

        });

        $("body").on("click",".lock_edit .li_button_unlock",function(){
            console.log("Unlock ... "+ $( this ).data("fromline") );

            $( this ).hide();
            var fromline = $( this ).data("fromline");

            $(".line_li_" + fromline + " .lock_edit .li_button_lock" ).show();

            $( "#draggable_"+ fromline ).draggable( "option", "disabled", true );
            $( "#draggable_"+ fromline ).toggleClass("active");
            $(".li_fonts_size_select_" + fromline).prop("disabled", true);

        });

        $("body").on("change","#list_text_container .li_fz_container select",function(){ 

            console.log( $(this).val() );
            console.log( $(this).data("fromline") );
            var fromline = $(this).data("fromline");
            var sz = $(this).val();

            $("li.line_li_"+ fromline + " .text_line_preview_listItem span").css("font-size",sz);
            $("#draggable_"+ fromline  + " .text_line_dragitem span").css("font-size",sz);

        });

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
            $( $cache.textLinePreview_LI ).css( "background-color","rgb("+me.data("red")+","+me.data("green")+","+me.data("blue")+")" );
            //background-color: rgb(63, 63, 191);
            $cache.textlineSetings.backgroundColor = "rgb("+me.data("red")+","+me.data("green")+","+me.data("blue")+")";

        });

        $cache.switch.click(function(){

            $(".mysection " + "."+$cache.currentSide).hide();
            $(".mysection."+$cache.currentSide).hide();
            $("li."+$cache.currentSide).hide();

            $cache.currentSide = ( $cache.currentSide === $cache.front )? $cache.back : $cache.front;

            $(".mysection " + "."+$cache.currentSide).show();
            $(".mysection."+$cache.currentSide).show();
            $("li."+$cache.currentSide).show();

            changeColorSide();

            $cache.textlineSetings.side = $cache.currentSide;
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

            if(str){
                $cache.textlineSetings.li_id = $cache.lineTextNextID;
                $cache.lineTextNextID += 1;

                $cache.textlineSetings.width = $cache.textLinePreviewContainer.width()+2;
                $cache.textlineSetings.height = $cache.textLinePreviewContainer.height()+2;

                var data = $cache.textlineSetings;

                console.log( data );

                var template = $('#text_line_template').html();
                
                var result = Mustache.to_html(template, data);
                //console.log(result);

                $cache.linetextList.prepend(result);
                //

                data.width = $cache.textpreview.width()+2;
                data.heightouter = $cache.textLinePreviewContainer.outerHeight()+2;

                template = $('#drag_text_line_template').html();
                result = Mustache.to_html(template, data);
                console.log(result);
                $cache.dragareaContainer.append(result);

                //
                $cache.textinput.val("");
                $cache.textlineSetings.text = "";
                $cache.textpreview.text("Add some text");
                //

                $("#draggable_"+data.li_id).draggable({
                    containment : "#dragarea",
                    zIndex: 100
                });

                $(".li_fonts_size_select_"+data.li_id).val(data.size);

                $(".li_fonts_size_select_"+data.li_id).select2({
                    minimumResultsForSearch: Infinity,
                    allowClear: false
                });

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
